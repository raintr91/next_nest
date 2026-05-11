import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { getExample } from '#scripts/storybook-examples.mjs'
import { buildAutoExample, getSiblingVueBasenames, isCompoundChildOnly } from '#scripts/analyze-vue-example.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..')

const argv = new Set(process.argv.slice(2))
const force = argv.has('--force')
const includeRootComponents = argv.has('--include-components')

const COMPONENT_DIRS = [
  { dir: path.join(rootDir, 'components', 'atoms'), group: 'Atoms' },
  { dir: path.join(rootDir, 'components', 'molecules'), group: 'Molecules' },
  { dir: path.join(rootDir, 'components', 'organisms'), group: 'Organisms' },
  ...(includeRootComponents ? [{ dir: path.join(rootDir, 'components'), group: 'App' }] : [])
]

const outDir = path.join(rootDir, 'stories', 'auto')

const isVueFile = (name) => name.endsWith('.vue')

const toTitle = (group, relPathNoExt) => {
  // e.g. group=UI, relPathNoExt=button/Button -> UI/Button/Button
  const parts = relPathNoExt.split(path.sep).filter(Boolean)
  return [group, ...parts].join('/')
}

const safeStoryFilename = (group, relPathNoExt) => {
  const flat = `${group}__${relPathNoExt.replaceAll(path.sep, '__')}`
  return `${flat}.stories.js`
}

async function walkVueFiles(dir) {
  const results = []

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      if (entry.name === 'node_modules') continue
      if (entry.name === '.nuxt') continue

      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && isVueFile(entry.name)) {
        results.push(fullPath)
      }
    }
  }

  await walk(dir)
  return results
}

function escapeSingleQuoted(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function escapeBackticks(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`')
}

/** Story for Or layout components that need navigation (array) and isActive (function). */
function renderLayoutStoryJs({ title, importPath, componentName }) {
  const needsOpen = componentName === 'OrJustboilSidebar'
  const isNavbar = componentName.endsWith('Navbar')
  const baseSpread = '{ ...args, navigation: defaultNav, isActive'
  const argsSpread = needsOpen
    ? baseSpread + ', open: true }'
    : baseSpread + ' }'
  const defaultArgs = isNavbar ? ',\n  args: { title: \'Dashboard\' }' : ''
  return `import Component from '${importPath}'
import { LayoutDashboard, Users, Settings } from 'lucide-vue-next'

const defaultNav = [
  { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
  { name: 'Robots', path: '/workspace/robots', icon: Users },
  { name: 'Settings', path: '/workspace/settings', icon: Settings }
]
const isActive = (path) => path === '/workspace'

const meta = {
  title: '${title}',
  component: Component,
  tags: ['autodocs']${defaultArgs}
}

export default meta

export const Default = {
  render: (args) => ({
    components: { Component },
    setup: () => ({ args: ${argsSpread} }),
    template: '<Component v-bind="args" />'
  })
}
`
}

function renderStoryJs({ title, importPath, componentName, dirPath, example }) {
  const hasCompound = example?.extraImports && example?.template
  const hasSimple = example && (example.args !== undefined || example.slot !== undefined) && !hasCompound

  const dirPathSlash = dirPath.split(path.sep).join('/')
  const argsInit = hasSimple ? JSON.stringify(example.args ?? {}) : '{}'

  let importLines = `import Component from '${importPath}'`
  const componentNames = ['Component']

  if (hasCompound) {
    for (const name of example.extraImports) {
      const abs = `~/${dirPathSlash}/${name}.vue`
      importLines += `\nimport ${name} from '${abs}'`
      componentNames.push(name)
    }
  }

  let templateLine
  if (hasCompound) {
    const templateEscaped = escapeBackticks(example.template)
    templateLine = `template: \`${templateEscaped}\``
  } else if (hasSimple && (example.slot ?? '') !== '') {
    templateLine = `template: '<Component v-bind="args">${escapeSingleQuoted(example.slot)}</Component>'`
  } else if (hasSimple) {
    templateLine = "template: '<Component v-bind=\"args\" />'"
  } else {
    templateLine = "template: '<Component v-bind=\"args\" />'"
  }

  // Plain JavaScript so Storybook's Acorn indexer can parse (no TS syntax)
  return `${importLines}

const meta = {
  title: '${title}',
  component: Component,
  tags: ['autodocs'],
  args: ${argsInit}
}

export default meta

export const Default = {
  render: (args) => ({
    components: { ${componentNames.join(', ')} },
    setup: () => ({ args }),
    ${templateLine}
  })
}
`
}

async function main() {
  await fs.mkdir(outDir, { recursive: true })

  let generated = 0
  let skipped = 0
  let skippedChildOnly = 0

  for (const { dir, group } of COMPONENT_DIRS) {
    const exists = await fs
      .stat(dir)
      .then((s) => s.isDirectory())
      .catch(() => false)

    if (!exists) continue

    const files = await walkVueFiles(dir)

    for (const filePath of files) {
      // Skip barrel index files
      if (path.basename(filePath, '.vue') === 'index') continue

      const relFromDir = path.relative(dir, filePath)
      const relNoExt = relFromDir.replace(/\.vue$/i, '')

      const title = toTitle(group, relNoExt)
      const outFile = path.join(outDir, safeStoryFilename(group, relNoExt))

      // Import path absolute (Nuxt alias) so stories never use ../ or ./
      const importPath = `~/${path.relative(rootDir, filePath).split(path.sep).join('/')}`
      const dirPath = path.relative(rootDir, path.dirname(filePath)).split(path.sep).join('/')

      const componentName = path.basename(relNoExt)
      const siblingVueBasenames = await getSiblingVueBasenames(path.dirname(filePath))

      // Skip Windster layout theme components — story is written manually (DashboardThemePreviews / Windster theme)
      if (relNoExt.replace(/\\/g, '/').toLowerCase().includes('windster')) {
        skipped++
        continue
      }

      // Skip compound child-only components (DialogContent, SelectTrigger, etc.) — they need root context or throw at runtime
      if (isCompoundChildOnly(componentName, siblingVueBasenames)) {
        try {
          await fs.unlink(outFile)
        } catch {
          // no existing file
        }
        try {
          await fs.unlink(outFile.replace(/\.stories\.js$/, '.stories.ts'))
        } catch {
          // no .ts counterpart
        }
        skippedChildOnly++
        continue
      }

      let example = getExample(relNoExt.replace(/\\/g, '/'))
      if (!example) {
        const content = await fs.readFile(filePath, 'utf8')
        example = buildAutoExample({
          filePath,
          content,
          relNoExt: relNoExt.replace(/\\/g, '/'),
          siblingVueBasenames
        })
      }

      const already = await fs
        .stat(outFile)
        .then(() => true)
        .catch(() => false)

      if (already && !force) {
        skipped++
        continue
      }

      const content =
        example.layoutStory === true
          ? renderLayoutStoryJs({ title, importPath, componentName })
          : renderStoryJs({ title, importPath, componentName, dirPath, example })
      const tsCounterpart = outFile.replace(/\.stories\.js$/, '.stories.ts')
      try {
        await fs.unlink(tsCounterpart)
      } catch {
        // ignore if no .ts file
      }
      await fs.writeFile(outFile, content, 'utf8')
      generated++
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Generated: ${generated}, skipped: ${skipped}, child-only (no story): ${skippedChildOnly} (${force ? 'force' : 'no force'})`)
  // eslint-disable-next-line no-console
  console.log(`Output: ${path.relative(rootDir, outDir)}`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
