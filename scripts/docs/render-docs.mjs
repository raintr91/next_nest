import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parse, stringify } from 'yaml'

const docsDir = path.resolve('docs')
const featuresDir = path.join(docsDir, 'features')

async function main() {
  const features = await listDirs(featuresDir)

  for (const feature of features) {
    await renderFeature(path.join(featuresDir, feature), feature)
  }

  await renderFeatureIndex(features)
}

async function renderFeature(featureDir, slug) {
  const spec = await readYaml(path.join(featureDir, 'spec.yaml'))
  const testcasesDir = path.join(featureDir, 'testcases')
  const generatedDir = path.join(featureDir, 'generated')
  const generatedTestcasesDir = path.join(generatedDir, 'testcases')
  const testcaseFiles = await listYamlFiles(testcasesDir)
  const testcases = []

  await mkdir(generatedTestcasesDir, { recursive: true })

  for (const file of testcaseFiles) {
    const testcase = await readYaml(path.join(testcasesDir, file))
    testcases.push({ file, data: testcase })
    await writeFile(
      path.join(generatedTestcasesDir, file.replace(/\.ya?ml$/, '.md')),
      renderTestcaseMarkdown(testcase, spec),
      'utf8'
    )
  }

  await writeFile(path.join(generatedDir, 'spec.md'), renderSpecMarkdown(spec), 'utf8')
  await writeFile(path.join(generatedDir, 'README.md'), renderFeatureReadme(slug, spec, testcases), 'utf8')
}

async function renderFeatureIndex(features) {
  const rows = []

  for (const slug of features) {
    const spec = await readYaml(path.join(featuresDir, slug, 'spec.yaml'))
    rows.push(`- [${spec.title ?? slug}](./features/${slug}/generated/README.md)`)
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
  return `# ${testcase.title ?? testcase.id}\n\nFeature: [${spec.title ?? testcase.feature}](../spec.md)\n\n## Requirement IDs\n\n${renderBullets(testcase.requirementIds)}\n\n## Route\n\n- Path: \`${testcase.route?.path ?? ''}\`\n- Auth: \`${testcase.route?.auth ?? 'unknown'}\`\n\n## Test IDs\n\n${renderBullets(testcase.testIds?.required)}\n\n## Setup\n\n${renderCode(testcase.setup)}\n\n## Data\n\n${renderCode(testcase.data)}\n\n## Steps\n\n${renderList(testcase.steps, renderStep)}\n\n## Assertions\n\n${renderCode(testcase.assertions)}\n\n## Expected\n\n${renderBullets(testcase.expected)}\n`
}

function renderFeatureReadme(slug, spec, testcases) {
  const links = testcases
    .map(({ file, data }) => `- [${data.title ?? data.id}](./testcases/${file.replace(/\.ya?ml$/, '.md')})`)
    .join('\n')

  return `# ${spec.title ?? slug}\n\n${spec.summary ?? ''}\n\n## Spec\n\n- [Spec](./spec.md)\n\n## Testcases\n\n${links || '_No testcases yet._'}\n`
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

async function listDirs(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  } catch {
    return []
  }
}

async function listYamlFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
      .map((entry) => entry.name)
      .sort()
  } catch {
    return []
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
