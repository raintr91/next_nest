import {
  createEndpoint,
  listEndpoint,
  pluralize,
  routeToPagePath,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  zodFieldForColumn,
  zodFieldForFormField
} from './naming.mjs'
import { resolveComponentFiles } from './component-resolve.mjs'
import { buildSlotBindings, collectUniqueComponents } from './slots.mjs'

const TAG_PREFIX = {
  needsComponent: '#needs-component:',
  customSlot: '#custom-slot:',
  manualComposable: '#manual-composable:',
  skipCodegen: '#skip-codegen:',
  wireOnly: '#wire-only:'
}

/** @param {string[]} tags */
export function parseTags(tags = []) {
  const parsed = {
    needsComponents: [],
    customSlots: [],
    manualComposables: [],
    skipCodegen: [],
    wireOnly: [],
    raw: tags
  }

  for (const tag of tags) {
    const text = String(tag).trim()
    if (text.startsWith(TAG_PREFIX.needsComponent)) {
      parsed.needsComponents.push(text.slice(TAG_PREFIX.needsComponent.length).trim())
    } else if (text.startsWith(TAG_PREFIX.customSlot)) {
      parsed.customSlots.push(text.slice(TAG_PREFIX.customSlot.length).trim())
    } else if (text.startsWith(TAG_PREFIX.manualComposable)) {
      parsed.manualComposables.push(text.slice(TAG_PREFIX.manualComposable.length).trim())
    } else if (text.startsWith(TAG_PREFIX.skipCodegen)) {
      parsed.skipCodegen.push(text.slice(TAG_PREFIX.skipCodegen.length).trim())
    } else if (text.startsWith(TAG_PREFIX.wireOnly)) {
      parsed.wireOnly.push(text.slice(TAG_PREFIX.wireOnly.length).trim())
    }
  }

  return parsed
}

/** Auto-add custom slot tags from columns with render: custom */
function mergeCustomSlots(columns, parsedTags) {
  const slots = new Set(parsedTags.customSlots)
  for (const col of columns) {
    if (col.render === 'custom') {
      slots.add(`cell-${col.key}`)
    }
  }
  return [...slots]
}

/**
 * @param {import('yaml').Document.Parsed | Record<string, unknown>} spec
 * @param {string} specFile
 */
export function buildCodegenContext(spec, specFile) {
  const codegen = spec.codegen ?? {}
  const entity = codegen.entity ?? spec.id?.split('-').pop() ?? 'entity'
  const module = codegen.module ?? pluralize(entity)
  const profile = codegen.profile ?? 'list'
  const entityPascal = toPascalCase(entity)
  const entityCamel = toCamelCase(entity)
  const moduleKebab = toKebabCase(module)

  const route = spec.ui?.routes?.[0] ?? { path: `/${moduleKebab}`, pageTestId: `${moduleKebab}-page` }
  const testIdModule = spec.ui?.testIds?.module ?? moduleKebab
  const columns = spec.ui?.columns ?? []
  const filters = spec.ui?.filters ?? []
  const formFields = spec.ui?.form?.fields ?? []

  const parsedTags = parseTags(spec.tags ?? [])
  parsedTags.customSlots = mergeCustomSlots(columns, parsedTags)

  const skip = new Set([
    ...(codegen.skip ?? []),
    ...parsedTags.skipCodegen.map((s) => s.toLowerCase())
  ])

  const listEp = listEndpoint(spec)
  const createEp = createEndpoint(spec)

  const columnSchemas = columns.map((col) => ({
    ...col,
    zodField: zodFieldForColumn(col)
  }))

  const formFieldSchemas = formFields.map((field) => ({
    ...field,
    zodField: zodFieldForFormField(field)
  }))

  const useCustomShell =
    spec.ui?.composition?.pattern === 'custom' || spec.ui?.composition?.overrideCommonPattern === true

  const customSlots = mergeCustomSlots(columns, parsedTags)
  const slotBindings = buildSlotBindings(customSlots, parsedTags.needsComponents, columns)

  return {
    spec,
    specFile,
    profile,
    entity,
    module,
    entityPascal,
    entityCamel,
    moduleKebab,
    testIdModule,
    title: spec.title ?? entityPascal,
    summary: spec.summary ?? '',
    route,
    pagePath: routeToPagePath(route.path),
    columns,
    columnSchemas,
    filters,
    formFields,
    formFieldSchemas,
    listEndpoint: listEp,
    createEndpoint: createEp,
    parsedTags,
    skip,
    useCustomShell,
    customSlots,
    slotBindings,
    componentFiles: {},
    componentStubs: [],
    handoffItems: buildHandoffItems(spec, parsedTags, useCustomShell, slotBindings, {})
  }
}

/**
 * Resolve component paths and refresh handoff + stub list.
 * @param {ReturnType<typeof buildCodegenContext>} ctx
 * @param {string} root
 */
export async function enrichCodegenContext(ctx, root) {
  const components = collectUniqueComponents(ctx.slotBindings)
  const componentFiles = await resolveComponentFiles(root, components)

  const componentStubs = components
    .filter((name) => !componentFiles[name]?.exists)
    .map((name) => ({
      moName: name,
      relativePath: componentFiles[name].stubPath
    }))

  ctx.componentFiles = componentFiles
  ctx.componentStubs = componentStubs
  ctx.handoffItems = buildHandoffItems(
    ctx.spec,
    ctx.parsedTags,
    ctx.useCustomShell,
    ctx.slotBindings,
    componentFiles
  )

  return ctx
}

function buildHandoffItems(spec, parsedTags, useCustomShell, slotBindings, componentFiles) {
  const items = []

  if (useCustomShell) {
    items.push({
      type: 'override-shell',
      detail: 'ui.composition.overrideCommonPattern or pattern: custom — implement organism shell manually.'
    })
  }

  for (const binding of slotBindings) {
    if (!binding.wired) {
      items.push({
        type: 'custom-slot',
        name: binding.slot,
        detail: `Add #needs-component: ${binding.slot}:MoYourComponent in spec tags, then re-run portal:gen.`
      })
      continue
    }

    const file = componentFiles[binding.component]
    if (file && !file.exists) {
      items.push({
        type: 'needs-component',
        name: binding.component,
        detail: `Review generated stub ${file.stubPath} and adjust props for :${binding.valueProp}.`
      })
    }
  }

  for (const fn of parsedTags.manualComposables) {
    items.push({ type: 'manual-composable', name: fn, detail: `Implement composable function: ${fn}` })
  }

  for (const topic of parsedTags.wireOnly) {
    items.push({ type: 'wire-only', name: topic, detail: `Defer until /wire: ${topic}` })
  }

  for (const q of spec.openQuestions ?? []) {
    items.push({ type: 'open-question', detail: String(q) })
  }

  return items
}

/**
 * @param {ReturnType<typeof buildCodegenContext>} ctx
 */
export function buildFilePlan(ctx) {
  const { entity, entityPascal, profile, skip } = ctx
  const files = []

  const add = (layer, relativePath, template) => {
    if (skip.has(layer)) return
    files.push({ layer, relativePath, template })
  }

  if (profile === 'list') {
    add('models', `models/${entity}/${entity}.schema.ts`, 'list/model.schema.ts.hbs')
    add('models', `models/${entity}/${entity}.types.ts`, 'list/model.types.ts.hbs')
    add('models', `models/${entity}/index.ts`, 'list/model.index.ts.hbs')
    add('service', `services/${entity}.service.ts`, 'list/service.ts.hbs')
    add('composable', `composables/${entity}/use${entityPascal}List.ts`, 'list/useList.ts.hbs')
    add('page', ctx.pagePath, ctx.useCustomShell ? 'list/page.custom.vue.hbs' : 'list/page.vue.hbs')
    add('mock', `mocks/${entity}.mock.ts`, 'list/mock.ts.hbs')

    for (const stub of ctx.componentStubs ?? []) {
      if (skip.has('component')) continue
      files.push({
        layer: 'component',
        relativePath: stub.relativePath,
        template: 'partials/component-stub.vue.hbs',
        moName: stub.moName
      })
    }
  }

  if (profile === 'create') {
    add('models', `models/${entity}/${entity}.schema.ts`, 'create/model.schema.ts.hbs')
    add('models', `models/${entity}/${entity}.types.ts`, 'create/model.types.ts.hbs')
    add('models', `models/${entity}/index.ts`, 'list/model.index.ts.hbs')
    add('service', `services/${entity}.service.ts`, 'create/service.ts.hbs')
    add('composable', `composables/${entity}/use${entityPascal}Form.ts`, 'create/useForm.ts.hbs')
    add('validation', `validations/${entity}/schemas.ts`, 'create/validation.ts.hbs')
    add('page', ctx.pagePath, 'create/page.vue.hbs')
    add('mock', `mocks/${entity}.mock.ts`, 'create/mock.ts.hbs')
  }

  return files
}
