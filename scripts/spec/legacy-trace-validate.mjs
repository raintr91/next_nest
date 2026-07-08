#!/usr/bin/env node
/**
 * Validate _legacy.trace.yaml structure (pointer-only archaeology).
 * Usage: pnpm legacy-trace:validate -- docs/features/yaml/admin/hotel/_legacy.trace.yaml
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'

const REQUIRED_TOP = ['schema', 'module', 'legacy', 'tracedAt', 'index', 'slices']

function validateTrace(trace, filePath) {
  const errors = []
  const rel = path.relative(process.cwd(), filePath)

  if (trace.schema !== 'portal-legacy-trace/v1') {
    errors.push(`${rel}: schema must be portal-legacy-trace/v1`)
  }
  for (const key of REQUIRED_TOP) {
    if (trace[key] == null) errors.push(`${rel}: missing ${key}`)
  }
  if (!trace.legacy?.repo) errors.push(`${rel}: legacy.repo required`)

  const index = trace.index ?? {}
  const slices = trace.slices ?? {}
  for (const [fnId, entry] of Object.entries(index)) {
    const sliceKey = entry?.slice?.replace(/^slices\./, '')
    if (!sliceKey || !slices[sliceKey]) {
      errors.push(`${rel}: index.${fnId} slice ${entry?.slice} not in slices`)
    }
  }

  for (const [refId, ref] of Object.entries(trace.refs ?? {})) {
    if (!refId.startsWith('legacy://')) errors.push(`${rel}: ref key must be legacy:// — got ${refId}`)
    if (!ref?.file) errors.push(`${rel}: refs.${refId} missing file pointer`)
  }

  return errors
}

async function main() {
  const paths = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  if (!paths.length) {
    console.error('Usage: pnpm legacy-trace:validate -- <_legacy.trace.yaml> [more...]')
    process.exit(1)
  }

  let allErrors = []
  for (const p of paths) {
    const absolute = path.resolve(p)
    const trace = parse(await readFile(absolute, 'utf8')) ?? {}
    allErrors.push(...validateTrace(trace, absolute))
  }

  if (allErrors.length) {
    for (const e of allErrors) console.error(`legacy-trace:validate: ${e}`)
    process.exit(1)
  }

  console.log(`legacy-trace:validate: OK (${paths.length} file(s))`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
