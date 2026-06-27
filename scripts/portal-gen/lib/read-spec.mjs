import { parse } from 'yaml'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * @param {string} specPath absolute or relative to cwd
 */
export async function readSpecFile(specPath) {
  const absolute = path.resolve(specPath)
  const raw = await readFile(absolute, 'utf8')
  const spec = parse(raw) ?? {}

  if (!spec.codegen?.profile) {
    throw new Error(
      `Missing codegen.profile in ${specPath}. Spec chưa portal-gen-ready — chạy /grill-with-docs trước /prototype. ` +
        'Xem .cursor/extracts/portal-codegen-readiness.md và docs/templates/spec.yaml'
    )
  }

  return { spec, specFile: path.relative(process.cwd(), absolute), featureDir: path.dirname(absolute) }
}
