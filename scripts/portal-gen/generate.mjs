import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildCodegenContext, buildFilePlan, enrichCodegenContext, applyRegistryToContext } from './lib/plan.mjs'
import { loadDesignRegistry } from './lib/design-registry.mjs'
import { upsertPageLifecycle, syncPageLifecycleFromManifests } from './lib/page-lifecycle.mjs'
import { readSpecFile } from './lib/read-spec.mjs'
import { renderTemplate } from './lib/render.mjs'
import { renderHandoffMarkdown, writeGeneratedMeta, writeOutputs } from './lib/write-files.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

function parseArgs(argv) {
  const options = { dryRun: false, force: false, spec: null }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run' || arg === '--dry') options.dryRun = true
    else if (arg === '--force') options.force = true
    else if (arg === '--spec') options.spec = argv[++i]
    else if (!arg.startsWith('-') && !options.spec) options.spec = arg
  }

  if (!options.spec) {
    throw new Error('Usage: pnpm portal:gen --spec docs/features/.../feature.spec.yaml [--dry-run] [--force]')
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const registry = await loadDesignRegistry(root)
  const { spec, specFile, featureDir } = await readSpecFile(options.spec)
  let ctx = buildCodegenContext(spec, specFile)
  ctx = applyRegistryToContext(ctx, registry, { validate: true })
  ctx = await enrichCodegenContext(ctx, root)
  const plan = buildFilePlan(ctx)

  const outputs = []
  for (const file of plan) {
    const templateContext =
      file.layer === 'component'
        ? { ...ctx, moName: file.moName, componentName: file.moName }
        : ctx
    const content = await renderTemplate(file.template, templateContext)
    outputs.push({ layer: file.layer, relativePath: file.relativePath, content })
  }

  const { written, skipped } = await writeOutputs(root, outputs, {
    dryRun: options.dryRun,
    force: options.force
  })

  const manifest = {
    generatedAt: new Date().toISOString(),
    specFile,
    profile: ctx.profile,
    entity: ctx.entity,
    module: ctx.module,
    shell: ctx.shell,
    shellVariant: ctx.shellVariant,
    commonSpecRef: ctx.commonSpecRef,
    designRegistry: registry.registryPath,
    slotBindings: ctx.slotBindings,
    componentFiles: ctx.componentFiles,
    files: plan.map((f) => ({ layer: f.layer, path: f.relativePath, template: f.template })),
    tags: ctx.parsedTags.raw,
    skipped: skipped.map((s) => s.relativePath)
  }

  const handoff = renderHandoffMarkdown(ctx, written, skipped)
  const meta = await writeGeneratedMeta(featureDir, manifest, handoff, { dryRun: options.dryRun })

  console.log(`portal-gen: profile=${ctx.profile} entity=${ctx.entity} shell=${ctx.shell} (${ctx.shellVariant})`)
  console.log(`  spec: ${specFile}`)
  if (options.dryRun) console.log('  mode: dry-run')

  for (const warning of ctx.designValidation?.warnings ?? []) {
    console.log(`  design warn: ${warning}`)
  }

  for (const binding of ctx.slotBindings) {
    if (binding.wired) {
      console.log(`  slot: #${binding.slot} → <${binding.component} :${binding.valueProp}>`)
    }
  }

  for (const w of written) {
    console.log(`  ${options.dryRun ? '[dry]' : 'write'}: ${w.relativePath}`)
  }
  for (const s of skipped) {
    console.log(`  skip: ${s.relativePath} (${s.reason})`)
  }
  if (!options.dryRun) {
    const pageWritten = written.find((w) => w.relativePath?.startsWith('pages/') && w.relativePath.endsWith('.vue'))
    if (pageWritten) {
      const lifecycle = await upsertPageLifecycle(root, {
        routePath: ctx.route.path,
        specFile: specFile,
        title: ctx.title,
        stage: 'prototype'
      })
      console.log(`  lifecycle: ${lifecycle.routePath} → stage=${lifecycle.stage} (${lifecycle.registryPath})`)
    }

    await syncPageLifecycleFromManifests(root)

    console.log(`  handoff: ${path.relative(root, meta.handoffPath)}`)
    runDocsRender()
  }
}

/** Cập nhật spec.md (hashtags, Screen link). Script local — không tốn AI token. */
function runDocsRender() {
  const script = path.join(root, 'scripts/docs/render-docs.mjs')
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'pipe', encoding: 'utf8' })

  if (result.status === 0) {
    console.log('  docs:render: đã cập nhật markdown (hashtags, Screen link)')
    return
  }

  console.warn('  ⚠ docs:render thất bại — member chạy: pnpm docs:render')
  if (result.stderr?.trim()) console.warn(result.stderr.trim())
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
