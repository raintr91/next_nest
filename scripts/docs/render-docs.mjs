import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parse, stringify } from 'yaml'

const docsDir = path.resolve('docs')
const featuresDir = path.join(docsDir, 'features')

async function main() {
  const specs = await listSpecFiles(featuresDir)

  for (const specFile of specs) {
    await renderFeature(specFile)
  }

  await renderFeatureIndex(specs)
}

async function renderFeature(specFile) {
  const featureDir = path.dirname(specFile)
  const slug = path.basename(specFile).replace(/\.spec\.ya?ml$/, '')
  const spec = await readYaml(specFile)
  const generatedDir = path.join(featureDir, 'generated')
  const generatedTestcasesDir = path.join(generatedDir, slug, 'testcases')
  const testcaseFiles = await listTestcaseFiles(featureDir, slug)
  const testcases = []

  await mkdir(generatedTestcasesDir, { recursive: true })

  for (const file of testcaseFiles) {
    const testcase = await readYaml(path.join(featureDir, file))
    testcases.push({ file, data: testcase })
    await writeFile(
      path.join(generatedTestcasesDir, file.replace(/\.test\.ya?ml$/, '.test.md')),
      renderTestcaseMarkdown(testcase, spec),
      'utf8'
    )
  }

  await writeFile(path.join(generatedDir, `${slug}.spec.md`), renderSpecMarkdown(spec), 'utf8')
  await writeFile(path.join(generatedDir, `${slug}.README.md`), renderFeatureReadme(slug, spec, testcases), 'utf8')
}

async function renderFeatureIndex(specs) {
  const rows = []

  for (const specFile of specs) {
    const slug = path.basename(specFile).replace(/\.spec\.ya?ml$/, '')
    const spec = await readYaml(specFile)
    const relativeDir = path.relative(docsDir, path.dirname(specFile))
    rows.push(`- [${spec.title ?? slug}](./${relativeDir}/generated/${slug}.README.md)`)
  }

  await writeFile(
    path.join(docsDir, 'generated.md'),
    `# Generated Feature Docs\n\n${rows.join('\n') || '_No generated feature docs yet._'}\n`,
    'utf8'
  )
}

function renderSpecMarkdown(spec) {
  return `# ${spec.title ?? spec.id}\n\n${spec.summary ?? ''}\n\n## Requirements\n\n${renderList(spec.requirements, renderRequirement)}\n\n## UI\n\n${renderRoutes(spec.ui?.routes)}\n\n## API\n\n${renderEndpoints(spec.api?.endpoints)}\n\n## Acceptance\n\n${renderBullets(spec.acceptance)}\n\n## Notes\n\n${renderBullets(spec.notes)}\n`
}

function renderTestcaseMarkdown(testcase, spec) {
  return `# ${testcase.title ?? testcase.id}\n\nFeature: ${spec.title ?? testcase.feature}\n\n## Requirement IDs\n\n${renderBullets(testcase.requirementIds)}\n\n## Route\n\n- Path: \`${testcase.route?.path ?? ''}\`\n- Auth: \`${testcase.route?.auth ?? 'unknown'}\`\n\n## Test IDs\n\n${renderBullets(testcase.testIds?.required)}\n\n## Setup\n\n${renderCode(testcase.setup)}\n\n## Data\n\n${renderCode(testcase.data)}\n\n## Mock Cases\n\n${renderMockCases(testcase.mockCases)}\n\n## Steps\n\n${renderList(testcase.steps, renderStep)}\n\n## Assertions\n\n${renderCode(testcase.assertions)}\n\n## Expected\n\n${renderBullets(testcase.expected)}\n`
}

function renderFeatureReadme(slug, spec, testcases) {
  const links = testcases
    .map(({ file, data }) => `- [${data.title ?? data.id}](./${slug}/testcases/${file.replace(/\.test\.ya?ml$/, '.test.md')})`)
    .join('\n')

  return `# ${spec.title ?? slug}\n\n${spec.summary ?? ''}\n\n## Spec\n\n- [Spec](./${slug}.spec.md)\n\n## Testcases\n\n${links || '_No testcases yet._'}\n`
}

function renderRequirement(req) {
  return `- **${req.id}** — ${req.title}\n  ${req.description ?? ''}`
}

function renderStep(step, index) {
  const parts = Object.entries(step)
    .map(([key, value]) => `${key}: ${formatInline(value)}`)
    .join(', ')
  return `${index + 1}. ${parts}`
}

function renderRoutes(routes = []) {
  return renderList(routes, (route) => `- \`${route.path}\` — \`${route.pageTestId ?? ''}\``)
}

function renderEndpoints(endpoints = []) {
  return renderList(endpoints, (endpoint) => `- \`${endpoint.method} ${endpoint.path}\``)
}

function renderBullets(items = []) {
  return items.length ? items.map((item) => `- ${formatInline(item)}`).join('\n') : '_None_'
}

function renderMockCases(cases = []) {
  return cases.length
    ? cases.map((item) => `- **${item.id}** — ${item.title}: ${item.expected}`).join('\n')
    : '_None_'
}

function renderList(items = [], renderer) {
  return items.length ? items.map(renderer).join('\n') : '_None_'
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

    if (entry.isDirectory()) {
      files.push(...await listSpecFiles(entryPath))
      continue
    }

    if (entry.isFile() && /\.spec\.ya?ml$/.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files.sort()
}

async function listTestcaseFiles(dir, slug) {
  const entries = await listEntries(dir)
  return entries
    .filter((entry) => entry.isFile() && entry.name.startsWith(`${slug}.`) && /\.test\.ya?ml$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()
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
