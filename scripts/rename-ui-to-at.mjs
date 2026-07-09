import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { cwd } from 'node:process'

const ROOT = cwd()
const exts = new Set(['.vue', '.ts', '.js', '.mjs'])

const ignoredDirNames = new Set([
  'node_modules',
  '.next',
  '.output',
  'dist',
  'storybook-static',
  '.data',
  '.nitro',
  '.cache',
  '.git'
])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const out = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirNames.has(entry.name)) continue
      out.push(...(await walk(join(dir, entry.name))))
      continue
    }

    if (entry.isFile()) {
      out.push(join(dir, entry.name))
    }
  }

  return out
}

const files = await walk(ROOT)

const rx = /\bUi([A-Z][A-Za-z0-9_]*)\b/g

let changedFiles = 0
let changedTotal = 0

for (const full of files) {
  const ext = extname(full)
  if (!exts.has(ext)) continue

  const before = await readFile(full, 'utf8')
  if (!rx.test(before)) {
    rx.lastIndex = 0
    continue
  }

  rx.lastIndex = 0
  const after = before.replace(rx, 'At$1')
  if (after === before) continue

  rx.lastIndex = 0
  const changes = (before.match(rx) ?? []).length
  await writeFile(full, after, 'utf8')

  changedFiles += 1
  changedTotal += changes
}

console.log(`Replaced Ui* -> At* in ${changedFiles} files (${changedTotal} replacements).`)
