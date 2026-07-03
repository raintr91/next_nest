import { readdir } from 'node:fs/promises'
import path from 'node:path'

/**
 * @param {string} root workspace root
 * @param {string} featureSlug e.g. chain/hotel
 */
export async function listFeatureTestcases(root, featureSlug) {
  const testcasesDir = path.join(root, 'docs/features', featureSlug, 'testcases')
  const entries = await readdir(testcasesDir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.yaml'))
    .map((entry) => path.join(testcasesDir, entry.name))
}
