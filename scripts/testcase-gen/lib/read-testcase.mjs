import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'

/**
 * @param {string} testcasePath
 */
export async function readTestcaseFile(testcasePath) {
  const absolute = path.resolve(testcasePath)
  const raw = await readFile(absolute, 'utf8')
  const testcase = parse(raw) ?? {}

  if (!testcase.id) {
    throw new Error(`Missing id in ${testcasePath}`)
  }
  if (testcase.type && testcase.type !== 'e2e') {
    throw new Error(`testcase:gen only supports type e2e — got "${testcase.type}" in ${testcasePath}`)
  }

  const featureDir = path.dirname(path.dirname(absolute))
  const specPath = path.join(featureDir, `${testcase.id}.spec.yaml`)
  let spec = null

  try {
    const specRaw = await readFile(specPath, 'utf8')
    spec = parse(specRaw) ?? {}
  } catch {
  }

  return {
    testcase,
    testcaseFile: path.relative(process.cwd(), absolute),
    featureDir,
    specFile: spec ? path.relative(process.cwd(), specPath) : null,
    spec
  }
}
