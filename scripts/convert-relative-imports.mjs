import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const rootDir = process.cwd()

const allowedExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue'])
const ignoredDirNames = new Set([
  'node_modules',
  '.nuxt',
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
    if (entry.name.startsWith('.')) {
      if (ignoredDirNames.has(entry.name)) continue
    }

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (ignoredDirNames.has(entry.name)) continue
      out.push(...(await walk(fullPath)))
      continue
    }

    if (entry.isFile()) out.push(fullPath)
  }

  return out
}

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function normalizeSpecifierToAlias({ fileDir, spec }) {
  // Preserve query/hash suffixes (e.g. ?raw, ?url)
  const [beforeHash, hash = ''] = spec.split('#')
  const [beforeQuery, query = ''] = beforeHash.split('?')
  const bare = beforeQuery

  // Only rewrite relative specifiers
  if (!(bare === '.' || bare === '..' || bare.startsWith('./') || bare.startsWith('../'))) {
    return null
  }

  const resolved = path.resolve(fileDir, bare)
  const relFromRoot = path.relative(rootDir, resolved)

  // If it points outside the repo, skip
  if (relFromRoot.startsWith('..' + path.sep) || relFromRoot === '..') return null

  const aliased = `~/${toPosix(relFromRoot)}`
  const rebuilt = aliased + (query ? `?${query}` : '') + (hash ? `#${hash}` : '')
  return rebuilt
}

function rewriteModuleSpecifiers(filePath, content) {
  const fileDir = path.dirname(filePath)

  // Matches:
  //   import ... from '...'
  //   export ... from '...'
  //   import '...'
  // Keeps quote type.
  const reFrom = /\b(from\s+)(['"])(\.{1,2}(?:\/[^'"\n\r]*)?)(\2)/g
  const reSideEffect = /(^|\n)(\s*import\s+)(['"])(\.{1,2}(?:\/[^'"\n\r]*)?)(\3)(\s*;?)/g

  let didChange = false

  const next1 = content.replace(reFrom, (full, fromKw, quote, spec, endQuote) => {
    const replaced = normalizeSpecifierToAlias({ fileDir, spec })
    if (!replaced) return full
    didChange = true
    return `${fromKw}${quote}${replaced}${endQuote}`
  })

  const next2 = next1.replace(reSideEffect, (full, nl, importKw, quote, spec, endQuote, tail) => {
    const replaced = normalizeSpecifierToAlias({ fileDir, spec })
    if (!replaced) return full
    didChange = true
    return `${nl}${importKw}${quote}${replaced}${endQuote}${tail}`
  })

  return { content: next2, didChange }
}

async function main() {
  const files = await walk(rootDir)

  let changedFiles = 0
  let changedStatements = 0

  for (const filePath of files) {
    const ext = path.extname(filePath)
    if (!allowedExts.has(ext)) continue

    const before = await readFile(filePath, 'utf8')
    const { content: after, didChange } = rewriteModuleSpecifiers(filePath, before)
    if (!didChange) continue

    // Cheap heuristic count (for reporting only)
    const count =
      (before.match(/\bfrom\s+['"]\.{1,2}\//g) ?? []).length
      + (before.match(/\bfrom\s+['"]\.{1,2}['"]/g) ?? []).length
      + (before.match(/\bimport\s+['"]\.{1,2}\//g) ?? []).length
      + (before.match(/\bimport\s+['"]\.{1,2}['"]/g) ?? []).length

    await writeFile(filePath, after, 'utf8')
    changedFiles += 1
    changedStatements += count
  }

  // eslint-disable-next-line no-console
  console.log(`Rewrote relative imports in ${changedFiles} files (~${changedStatements} statements).`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
