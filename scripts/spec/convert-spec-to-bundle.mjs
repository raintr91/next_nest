#!/usr/bin/env node
/**
 * Convert legacy *.spec.yaml → yaml/{role}/{domain}/{function}/*.bundle.yaml
 * Usage: pnpm spec:convert -- docs/features/admin/hotel/hotel-create.spec.yaml [more...]
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'
import { hasGenContent, partitionSpecSection } from './lib/bundle-schema.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const META = ['id', 'title', 'status', 'owner', 'summary', 'openQuestions', 'notes']

function inferRoleDomain(specPath) {
  const rel = path.relative(path.join(root, 'docs/features'), specPath)
  const parts = rel.split(path.sep)
  if (parts[0] === 'yaml' || parts[0] === 'md') {
    throw new Error(`Already yaml layout: ${specPath}`)
  }
  const role = parts[0]
  const domain = parts.length >= 3 ? parts[1] : role
  if (!role) {
    throw new Error(`Cannot infer role/domain from ${specPath}`)
  }
  return { role, domain }
}

function functionFolder(id, domain) {
  const chainPrefix = `chain-${domain}-`
  if (id.startsWith(chainPrefix)) return id.slice(chainPrefix.length)
  const prefix = `${domain}-`
  if (id.startsWith(prefix)) return id.slice(prefix.length)
  return id
}

function inferShellTag(raw) {
  const tags = raw.tags ?? []
  const shell = tags.find((t) => String(t).includes('#shell:'))
  if (shell) return { tag: shell, overrideCommonPattern: raw.ui?.composition?.overrideCommonPattern ?? false }
  const profile = raw.codegen?.profile
  if (profile === 'list') return { tag: '#shell: DataListPage', overrideCommonPattern: true }
  if (profile === 'create' || profile === 'update') return { tag: '#shell: DataFormPage', overrideCommonPattern: true }
  return { tag: '#shell: DataPage', overrideCommonPattern: false }
}

function inferBehavior(raw) {
  const profile = raw.codegen?.profile
  if (profile === 'list') {
    return {
      create: { enabled: true, surface: 'page' },
      update: { enabled: true, surface: 'page' },
      delete: { enabled: true, mode: 'confirm_dialog' }
    }
  }
  if (profile === 'create') return { create: { enabled: true, surface: 'page' } }
  if (profile === 'update') return { update: { enabled: true, surface: 'page' } }
  return {}
}

function buildDesign(raw) {
  const screen = raw.ui?.screens?.[0]
  const layout = screen?.layout?.length ? screen.layout : deriveLayoutLabels(raw.ui)
  const zones = layout.length
    ? layout.map((label, i) => ({ id: `zone-${i + 1}`, label: String(label) }))
    : [{ id: 'main', label: 'Nội dung chính' }]

  return {
    inherits: 'admin-crud',
    shell: inferShellTag(raw),
    patterns: ['#pattern: CRUD'],
    zones,
    behavior: inferBehavior(raw),
    actions: screen?.actions ?? raw.ui?.list?.rowActions ?? raw.ui?.list?.bulkActions ?? raw.ui?.detail?.actions ?? []
  }
}

function deriveLayoutLabels(ui = {}) {
  const labels = []

  if (ui.list) {
    labels.push('Search', 'Toolbar', 'Table')
  }

  if (ui.form) {
    labels.push('Form', 'Submit')
  }

  if (ui.detail) {
    labels.push('Header', 'Sections', 'Actions')
  }

  return [...new Set(labels)]
}

function buildLegacy(raw, role, domain) {
  const notes = raw.notes ?? []
  return {
    legacyRef: {
      module: `${role}/${domain}`,
      function: raw.id,
      slice: `slices.${raw.id}`
    },
    behaviors: [],
    fields: [],
    ui: [],
    evidence: notes
      .flatMap((n) => n.evidence ?? [])
      .map((f) => (typeof f === 'string' ? { file: f } : f)),
    refs: {}
  }
}

function buildBundle(raw, role, domain) {
  const spec = { ...raw }
  for (const k of META) delete spec[k]

  const screen = raw.ui?.screens?.[0]
  const hasCodegen = Boolean(raw.codegen?.profile)

  const bundle = {
    schema: 'portal-feature-bundle/v1',
    id: raw.id,
    title: raw.title,
    status: raw.status,
    owner: raw.owner,
    summary: raw.summary,
    specOrigin: 'legacy',
    grillStatus: hasCodegen
      ? { bqaFacts: 'done', bqaOpen: 'done', dev: 'done', full: 'not_required' }
      : { bqaFacts: 'draft', bqaOpen: 'draft', dev: 'draft', full: 'not_required' },
    spec,
    legacy: buildLegacy(raw, role, domain),
    design: buildDesign(raw),
    review: {
      summary: raw.summary,
      layoutNotes: screen?.layout ?? []
    },
    openQuestions: raw.openQuestions ?? [],
    _meta: {
      generatedBy: 'scripts/spec/convert-spec-to-bundle.mjs',
      sourceRevision: null
    }
  }

  const { designSpec, gen } = partitionSpecSection(bundle.spec, {})
  bundle.spec = designSpec
  if (screen?.actions?.length) bundle.design.actions = screen.actions
  if (hasGenContent(gen)) bundle.gen = gen

  return bundle
}

async function convertSpec(specPath) {
  const absolute = path.resolve(specPath)
  const raw = parse(await readFile(absolute, 'utf8'))
  if (!raw?.id) throw new Error(`Missing id in ${specPath}`)

  const { role, domain } = inferRoleDomain(absolute)
  const fn = functionFolder(raw.id, domain)
  const outDir =
    role === domain
      ? path.join(root, 'docs/features/yaml', role, fn)
      : path.join(root, 'docs/features/yaml', role, domain, fn)
  const out = path.join(outDir, `${raw.id}.bundle.yaml`)

  await mkdir(outDir, { recursive: true })
  await writeFile(out, stringify(buildBundle(raw, role, domain), { lineWidth: 0 }), 'utf8')

  const testSrc = absolute.replace(/\.spec\.ya?ml$/, '.test.yaml')
  const testDst = path.join(outDir, `${raw.id}.test.yaml`)
  try {
    await copyFile(testSrc, testDst)
  } catch {
    /* no paired test file */
  }

  const legacyTestcases = path.join(path.dirname(absolute), 'testcases')
  const outTestcases = path.join(outDir, 'testcases')
  try {
    const { readdir } = await import('node:fs/promises')
    const entries = await readdir(legacyTestcases, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.startsWith(`${raw.id}`)) continue
      await mkdir(outTestcases, { recursive: true })
      await copyFile(path.join(legacyTestcases, entry.name), path.join(outTestcases, entry.name))
    }
  } catch {
    /* no testcases dir */
  }

  return { specPath: absolute, bundlePath: out, outDir }
}

async function main() {
  const paths = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  if (!paths.length) {
    console.error('Usage: pnpm spec:convert -- <*.spec.yaml> [more...]')
    process.exit(1)
  }

  let failed = 0
  for (const p of paths) {
    try {
      const { bundlePath } = await convertSpec(p)
      console.log(`spec:convert: ${path.relative(root, bundlePath)}`)
    } catch (error) {
      failed++
      console.error(`spec:convert: FAIL ${p}: ${error.message ?? error}`)
    }
  }
  process.exit(failed > 0 ? 1 : 0)
}

main()
