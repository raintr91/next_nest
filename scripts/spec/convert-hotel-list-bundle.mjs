#!/usr/bin/env node
/**
 * One-off: convert legacy hotel-list.spec.yaml → hotel-list.bundle.yaml
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const src = path.join(root, 'docs/features/admin/hotel/hotel-list.spec.yaml')
const outDir = path.join(root, 'docs/features/yaml/admin/hotel/list')
const out = path.join(outDir, 'hotel-list.bundle.yaml')

const raw = parse(await readFile(src, 'utf8'))

const META = ['id', 'title', 'status', 'owner', 'summary', 'openQuestions', 'notes']
const spec = { ...raw }
for (const k of META) delete spec[k]

const legacyNotes = raw.notes ?? []
const legacy = {
  legacyRef: { module: 'admin/hotel', function: 'hotel-list', slice: 'slices.hotel-list' },
  behaviors: [
    {
      id: 'hotel-list-default-sort',
      fact: { order_by: 'created_at', sorted_by: 'desc', per_page: 100 },
      source: [{ file: 'app/Http/Controllers/Admin/HotelController.php', symbol: 'index' }],
      confidence: 0.95
    },
    {
      id: 'hotel-list-can-delete',
      fact: { rule: 'bookingExists() === false' },
      source: [{ file: 'app/Services/HotelService.php', symbol: 'bookingExists' }],
      confidence: 0.9
    }
  ],
  fields: [
    { name: 'chain_name', via: 'chain.name', source: [{ file: 'HotelService.php', symbol: 'paginate' }], confidence: 0.95 }
  ],
  ui: [{ pattern: 'admin-list-table', source: [{ file: 'resources/views/admin/hotel/index.blade.php' }], confidence: 0.9 }],
  evidence: legacyNotes.flatMap((n) => n.evidence ?? []).map((f) => (typeof f === 'string' ? { file: f } : f)),
  refs: {
    'legacy://hotel/index': {
      file: 'app/Http/Controllers/Admin/HotelController.php',
      symbol: 'index',
      summary: ['parse query', 'paginate', 'load chain and manager', 'render search/table/actions']
    }
  }
}

const screen = raw.ui?.screens?.[0]
const design = {
  inherits: 'admin-crud',
  shell: { tag: '#shell: DataListPage', overrideCommonPattern: true },
  patterns: ['#pattern: CRUD'],
  zones: [
    { id: 'search', label: 'Khu vực tìm kiếm' },
    { id: 'toolbar', label: 'Thanh thao tác', position: { after: 'search' }, container: { bordered: false } },
    { id: 'table', label: 'Bảng dữ liệu' }
  ],
  behavior: {
    create: { enabled: true, surface: 'page' },
    update: { enabled: true, surface: 'page' },
    delete: { enabled: true, mode: 'confirm_dialog' }
  },
  deviations: [
    {
      tag: '#legacy-global-ui-violation',
      legacy: 'table action text 詳細/設定/削除する',
      portal: 'icon-only per common-table-action-column'
    }
  ],
  actions: screen?.actions ?? []
}

const bundle = {
  schema: 'portal-feature-bundle/v1',
  id: raw.id,
  title: raw.title,
  status: raw.status,
  owner: raw.owner,
  summary: raw.summary,
  specOrigin: 'legacy',
  grillStatus: { bqaFacts: 'done', bqaOpen: 'done', dev: 'done', full: 'not_required' },
  spec,
  legacy,
  design,
  review: {
    summary: raw.summary,
    layoutNotes: screen?.layout ?? []
  },
  openQuestions: raw.openQuestions ?? [],
  _meta: { generatedBy: 'scripts/spec/convert-hotel-list-bundle.mjs', sourceRevision: null }
}

await mkdir(outDir, { recursive: true })
await writeFile(out, stringify(bundle, { lineWidth: 0 }), 'utf8')
console.log('wrote', path.relative(root, out))
