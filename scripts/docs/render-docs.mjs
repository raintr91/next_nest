import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parse, stringify } from 'yaml'
import { resolveDevAppBaseUrl } from './lib/load-dev-base-url.mjs'
import { MD_NONE } from './lib/markdown-table.mjs'
import { renderSpecMarkdown } from './lib/render-spec-markdown.mjs'
import {
  bundleMarkdownOutputPath,
  bundleSlug,
  bundleTestcaseDir,
  renderBundleMarkdown
} from './lib/render-bundle-markdown.mjs'

const projectRoot = process.cwd()
const docsDir = path.resolve('docs')
const featuresDir = path.join(docsDir, 'features')

function cliFlag(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}
function cliBool(name) {
  return process.argv.includes(`--${name}`)
}

const yamlRoot = cliFlag('yaml-root') ? path.resolve(cliFlag('yaml-root')) : path.join(featuresDir, 'yaml')
const mdRoot = cliFlag('md-root') ? path.resolve(cliFlag('md-root')) : path.join(featuresDir, 'md')
const legacyRoot = cliFlag('legacy-root') ? path.resolve(cliFlag('legacy-root')) : featuresDir
const writeIndex = !cliBool('no-index')
const devAppBaseUrl = resolveDevAppBaseUrl(projectRoot)

async function main() {
  const started = Date.now()
  const specs = await listSpecFiles(legacyRoot)
  const bundles = await listBundleFiles(yamlRoot)

  let testcaseCount = 0
  let failed = 0

  for (const specFile of specs) {
    try {
      testcaseCount += await renderLegacySpec(specFile)
    } catch (error) {
      failed++
      console.error(`docs:render: FAIL ${path.relative(projectRoot, specFile)}: ${error.message ?? error}`)
    }
  }

  const bundleMdLinks = []
  for (const bundleFile of bundles) {
    try {
      testcaseCount += await renderBundleFeature(bundleFile)
      const mdPath = bundleMarkdownOutputPath(bundleFile, docsDir, yamlRoot, mdRoot)
      const rel = path.relative(docsDir, mdPath).split(path.sep).join('/')
      const bundle = await readYaml(bundleFile)
      bundleMdLinks.push(`- [${bundle.title ?? bundleSlug(bundleFile)}](/${rel.replace(/\.md$/, '')})`)
    } catch (error) {
      failed++
      console.error(`docs:render: FAIL ${path.relative(projectRoot, bundleFile)}: ${error.message ?? error}`)
    }
  }

  if (failed > 0) {
    console.error(`docs:render: aborted index — ${failed} file(s) failed`)
    process.exit(1)
  }

  if (writeIndex) await renderFeatureIndex(specs, bundleMdLinks)

  const elapsed = ((Date.now() - started) / 1000).toFixed(1)
  console.log(
    `docs:render: ${specs.length} legacy spec(s), ${bundles.length} bundle(s) → ${testcaseCount} testcase(s) [${elapsed}s]`
  )
}

async function renderLegacySpec(specFile) {
  const featureDir = path.dirname(specFile)
  const slug = featureSlug(specFile)
  const output = featureOutputPaths(specFile, slug)
  const spec = await readYaml(specFile)
  const generatedDir = path.join(featureDir, 'generated')
  const generatedTestcasesDir = path.join(generatedDir, output.testcasesDir)
  const testcaseFiles = await listTestcaseFiles(featureDir, slug)
  const testcases = []

  await rm(path.join(generatedDir, output.specFile), { force: true })
  await rm(path.join(generatedDir, `${slug}.spec.md`), { force: true })
  await rm(path.join(generatedDir, `${slug}.README.md`), { force: true })
  await rm(generatedTestcasesDir, { recursive: true, force: true })
  await mkdir(generatedTestcasesDir, { recursive: true })

  for (const file of testcaseFiles) {
    const testcase = await readYaml(file)
    testcases.push({ file, data: testcase })
    await writeFile(
      path.join(generatedTestcasesDir, testcaseMarkdownName(file)),
      renderTestcaseMarkdown(testcase, spec),
      'utf8'
    )
  }

  await writeFile(
    path.join(generatedDir, output.specFile),
    renderSpecMarkdown(spec, { testcases, output, devAppBaseUrl, projectRoot }),
    'utf8'
  )

  return testcaseFiles.length
}

async function renderBundleFeature(bundleFile) {
  const featureDir = bundleTestcaseDir(bundleFile)
  const slug = bundleSlug(bundleFile)
  const bundle = await readYaml(bundleFile)
  const specShape = { ...bundleToSpecShape(bundle) }
  const mdOut = bundleMarkdownOutputPath(bundleFile, docsDir, yamlRoot, mdRoot)
  const mdDir = path.dirname(mdOut)
  const mdTestcasesDir = path.join(mdDir, 'testcases')
  const testcaseFiles = await listTestcaseFiles(featureDir, slug)
  const testcases = []

  await mkdir(mdTestcasesDir, { recursive: true })

  for (const file of testcaseFiles) {
    const testcase = await readYaml(file)
    testcases.push({ file, data: testcase })
    await writeFile(
      path.join(mdTestcasesDir, testcaseMarkdownName(file)),
      renderTestcaseMarkdown(testcase, specShape),
      'utf8'
    )
  }

  const output = { specFile: path.basename(mdOut), testcasesDir: 'testcases' }
  await mkdir(mdDir, { recursive: true })
  await writeFile(
    mdOut,
    renderBundleMarkdown(bundle, { testcases, output, devAppBaseUrl, projectRoot }),
    'utf8'
  )

  return testcaseFiles.length
}

function bundleToSpecShape(bundle) {
  return {
    id: bundle.id,
    title: bundle.title,
    status: bundle.status,
    owner: bundle.owner,
    summary: bundle.summary ?? bundle.review?.summary,
    ...(bundle.spec ?? {}),
    openQuestions: bundle.openQuestions ?? []
  }
}

async function renderFeatureIndex(specs, bundleMdLinks = []) {
  const rows = []

  for (const specFile of specs) {
    const spec = await readYaml(specFile)
    const output = featureOutputPaths(specFile, featureSlug(specFile))
    rows.push(`- [${spec.title ?? featureSlug(specFile)}](${vitepressDocLink(specFile, output)})`)
  }

  rows.push(...bundleMdLinks)

  await writeFile(
    path.join(docsDir, 'common-ui', 'generated.md'),
    `# Tài liệu tính năng đã render\n\n${rows.join('\n') || MD_NONE}\n`,
    'utf8'
  )
}

function renderTestcaseMarkdown(testcase, spec) {
  return `# ${testcase.title ?? testcase.id}\n\nTính năng: ${spec.title ?? testcase.feature}\n\n## Mã yêu cầu\n\n${renderBullets(testcase.requirementIds)}\n\n## Route\n\n- Path: \`${testcase.route?.path ?? ''}\`\n- Auth: \`${testcase.route?.auth ?? 'unknown'}\`\n\n## Test ID\n\n${renderBullets(testcase.testIds?.required)}\n\n## Thiết lập\n\n${renderCode(testcase.setup)}\n\n## Dữ liệu\n\n${renderCode(testcase.data)}\n\n## Kịch bản mock\n\n${renderMockCases(testcase.mockCases)}\n\n## Các bước\n\n${renderList(testcase.steps, renderStep)}\n\n## Assertion\n\n${renderCode(testcase.assertions)}\n\n## Kết quả mong đợi\n\n${renderBullets(testcase.expected)}\n`
}

function renderStep(step, index) {
  const parts = Object.entries(step)
    .map(([key, value]) => `${key}: ${formatInline(value)}`)
    .join(', ')
  return `${index + 1}. ${parts}`
}

function renderBullets(items = []) {
  return items.length ? items.map((item) => `- ${formatInline(item)}`).join('\n') : MD_NONE
}

function renderMockCases(cases = []) {
  return cases.length
    ? cases.map((item) => `- **${item.id}** — ${item.title}: ${item.expected}`).join('\n')
    : MD_NONE
}

function renderList(items = [], renderer) {
  return items.length ? items.map(renderer).join('\n') : MD_NONE
}

function renderCode(value) {
  return `\`\`\`yaml\n${stringify(value ?? {}).trim()}\n\`\`\``
}

function formatInline(value) {
  if (typeof value === 'string') return value
  return `\`${JSON.stringify(value)}\``
}

async function readYaml(file) {
  return parse(await readFile(file, 'utf8')) ?? {}
}

async function listSpecFiles(dir) {
  const files = []

  for (const entry of await listEntries(dir)) {
    const entryPath = path.join(dir, entry.name)

    if (entry.name === 'yaml' || entry.name === 'md') continue

    if (entry.isDirectory()) {
      files.push(...await listSpecFiles(entryPath))
      continue
    }

    if (entry.isFile() && (entry.name === 'spec.yaml' || entry.name === 'spec.yml' || /\.spec\.ya?ml$/.test(entry.name))) {
      files.push(entryPath)
    }
  }

  return files.sort()
}

async function listBundleFiles(dir) {
  const files = []

  for (const entry of await listEntries(dir)) {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...await listBundleFiles(entryPath))
      continue
    }

    if (entry.isFile() && /\.bundle\.ya?ml$/.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files.sort()
}

async function listTestcaseFiles(dir, slug) {
  const rootEntries = await listEntries(dir)
  const testcaseDir = path.join(dir, 'testcases')
  const testcaseEntries = await listEntries(testcaseDir)
  const isIndexSpec = slug === path.basename(dir)
  const rootFiles = rootEntries
    .filter((entry) => entry.isFile() && entry.name.startsWith(`${slug}.`) && /\.test\.ya?ml$/.test(entry.name))
    .map((entry) => path.join(dir, entry.name))
  const testcaseFiles = testcaseEntries
    .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name) && (isIndexSpec || entry.name.startsWith(`${slug}.`)))
    .map((entry) => path.join(testcaseDir, entry.name))

  return [...rootFiles, ...testcaseFiles].sort()
}

function vitepressDocLink(specFile, output) {
  const relativeDir = path.relative(docsDir, path.dirname(specFile)).split(path.sep).join('/')
  const pagePath = output.specFile.replace(/\.md$/, '')
  return `/${relativeDir}/generated/${pagePath}`
}

function featureSlug(specFile) {
  const basename = path.basename(specFile)
  if (basename === 'spec.yaml' || basename === 'spec.yml') return path.basename(path.dirname(specFile))
  return basename.replace(/\.spec\.ya?ml$/, '')
}

function featureOutputPaths(specFile, slug) {
  const basename = path.basename(specFile)
  if (basename === 'spec.yaml' || basename === 'spec.yml') {
    return {
      specFile: 'spec.md',
      testcasesDir: 'testcases'
    }
  }

  return {
    specFile: `${slug}.md`,
    testcasesDir: `${slug}/testcases`
  }
}

function testcaseMarkdownName(file) {
  return path.basename(file).replace(/\.test\.ya?ml$/, '.md').replace(/\.ya?ml$/, '.md')
}

async function listEntries(dir) {
  try {
    return await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
