import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parse, stringify } from 'yaml'

const docsDir = path.resolve('docs')
const featuresDir = path.join(docsDir, 'features')

async function main() {
  const specs = await listSpecFiles(featuresDir)

  await cleanGeneratedDirs(featuresDir)

  for (const specFile of specs) {
    await renderFeature(specFile)
  }

  await renderFeatureIndex(specs)
}

async function renderFeature(specFile) {
  const featureDir = path.dirname(specFile)
  const slug = featureSlug(specFile)
  const output = featureOutputPaths(specFile, slug)
  const spec = await readYaml(specFile)
  const generatedDir = path.join(featureDir, 'generated')
  const generatedTestcasesDir = path.join(generatedDir, output.testcasesDir)
  const testcaseFiles = await listTestcaseFiles(featureDir, slug)
  const testcases = []

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

  await writeFile(path.join(generatedDir, output.specFile), renderSpecMarkdown(spec), 'utf8')
  await writeFile(path.join(generatedDir, output.readmeFile), renderFeatureReadme(spec, testcases, output), 'utf8')
}

async function renderFeatureIndex(specs) {
  const rows = []

  for (const specFile of specs) {
    const spec = await readYaml(specFile)
    const relativeDir = path.relative(docsDir, path.dirname(specFile))
    const output = featureOutputPaths(specFile, featureSlug(specFile))
    rows.push(`- [${spec.title ?? featureSlug(specFile)}](../${relativeDir}/generated/${output.readmeFile})`)
  }

  await writeFile(
    path.join(docsDir, 'common-ui', 'generated.md'),
    `# Tài liệu tính năng đã render\n\n${rows.join('\n') || '_Chưa có tài liệu tính năng._'}\n`,
    'utf8'
  )
}

function renderSpecMarkdown(spec) {
  return `# ${spec.title ?? spec.id}\n\n${spec.summary ?? ''}\n\n## Yêu cầu\n\n${renderList(spec.requirements, renderRequirement)}\n\n## Giao diện\n\n${renderRoutes(spec.ui?.routes)}\n\n## API\n\n${renderEndpoints(spec.api?.endpoints)}\n\n## Tiêu chí nghiệm thu\n\n${renderBullets(spec.acceptance)}\n\n## Ghi chú\n\n${renderBullets(spec.notes)}\n`
}

function renderTestcaseMarkdown(testcase, spec) {
  return `# ${testcase.title ?? testcase.id}\n\nTính năng: ${spec.title ?? testcase.feature}\n\n## Mã yêu cầu\n\n${renderBullets(testcase.requirementIds)}\n\n## Route\n\n- Path: \`${testcase.route?.path ?? ''}\`\n- Auth: \`${testcase.route?.auth ?? 'unknown'}\`\n\n## Test ID\n\n${renderBullets(testcase.testIds?.required)}\n\n## Thiết lập\n\n${renderCode(testcase.setup)}\n\n## Dữ liệu\n\n${renderCode(testcase.data)}\n\n## Kịch bản mock\n\n${renderMockCases(testcase.mockCases)}\n\n## Các bước\n\n${renderList(testcase.steps, renderStep)}\n\n## Assertion\n\n${renderCode(testcase.assertions)}\n\n## Kết quả mong đợi\n\n${renderBullets(testcase.expected)}\n`
}

function renderFeatureReadme(spec, testcases, output) {
  const links = testcases
    .map(({ file, data }) => `- [${data.title ?? data.id}](./${output.testcasesDir}/${testcaseMarkdownName(file)})`)
    .join('\n')

  return `# ${spec.title ?? spec.id}\n\n${spec.summary ?? ''}\n\n## Đặc tả\n\n- [Đặc tả](./${output.specFile})\n\n## Testcase\n\n${links || '_Chưa có testcase._'}\n`
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
  return items.length ? items.map((item) => `- ${formatInline(item)}`).join('\n') : '_Không có._'
}

function renderMockCases(cases = []) {
  return cases.length
    ? cases.map((item) => `- **${item.id}** — ${item.title}: ${item.expected}`).join('\n')
    : '_Không có._'
}

function renderList(items = [], renderer) {
  return items.length ? items.map(renderer).join('\n') : '_Không có._'
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

    if (entry.isFile() && (entry.name === 'spec.yaml' || entry.name === 'spec.yml' || /\.spec\.ya?ml$/.test(entry.name))) {
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

function featureSlug(specFile) {
  const basename = path.basename(specFile)
  if (basename === 'spec.yaml' || basename === 'spec.yml') return path.basename(path.dirname(specFile))
  return basename.replace(/\.spec\.ya?ml$/, '')
}

function featureOutputPaths(specFile, slug) {
  const basename = path.basename(specFile)
  if (basename === 'spec.yaml' || basename === 'spec.yml') {
    return {
      readmeFile: 'README.md',
      specFile: 'spec.md',
      testcasesDir: 'testcases'
    }
  }

  return {
    readmeFile: `${slug}.README.md`,
    specFile: `${slug}.spec.md`,
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

async function cleanGeneratedDirs(dir) {
  for (const entry of await listEntries(dir)) {
    const entryPath = path.join(dir, entry.name)

    if (!entry.isDirectory()) continue
    if (entry.name === 'generated') {
      await rm(entryPath, { recursive: true, force: true })
      continue
    }

    await cleanGeneratedDirs(entryPath)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
