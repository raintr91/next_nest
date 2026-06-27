import { stringify } from 'yaml'
import { MD_NONE } from './markdown-table.mjs'
import { renderScreenLink } from './route-page-probe.mjs'

const SKIP_BODY_KEYS = new Set(['id', 'title', 'summary', 'acceptance'])

/**
 * @param {Record<string, unknown>} spec
 * @param {{
 *   testcases: Array<{ file: string, data: Record<string, unknown> }>,
 *   output: { testcasesDir: string, specFile: string },
 *   devAppBaseUrl: string,
 *   projectRoot: string
 * }} context
 */
export function renderSpecMarkdown(spec, context) {
  const header = renderHeader(spec, context)
  const body = renderBody(spec)

  return body ? `${header}\n\n${body}\n` : `${header}\n`
}

function renderHeader(spec, { testcases, output, devAppBaseUrl, projectRoot }) {
  const title = spec.title ?? spec.id
  const lines = [`# ${title}`, '', renderTestcaseLine(testcases, output), renderScreenLine(spec, devAppBaseUrl, projectRoot)]

  if (spec.summary) {
    lines.push('', String(spec.summary))
  }

  return lines.join('\n')
}

function renderTestcaseLine(testcases, output) {
  if (!testcases?.length) {
    return `- **Testcase:** ${MD_NONE}`
  }

  const links = testcases.map(({ file, data }) => {
    const mdName = file
      .split('/')
      .pop()
      .replace(/\.test\.ya?ml$/, '.md')
      .replace(/\.ya?ml$/, '.md')
    const label = data.title ?? data.id
    return `[${label}](./${output.testcasesDir}/${mdName})`
  })

  return `- **Testcase:** ${links.join(' · ')}`
}

function renderScreenLine(spec, devAppBaseUrl, projectRoot) {
  const route = spec.ui?.routes?.[0]
  const path = route?.path ?? ''
  const testId = route?.pageTestId ?? ''

  if (!path) {
    return `- **Screen:** ${MD_NONE}`
  }

  const screen = renderScreenLink(path, devAppBaseUrl, projectRoot)
  const suffix = testId ? ` · \`${testId}\`` : ''

  return `- **Screen:** ${screen}${suffix}`
}

function renderBody(spec) {
  return Object.entries(spec)
    .filter(([key, value]) => !SKIP_BODY_KEYS.has(key) && value != null)
    .map(([key, value]) => renderSection(key, value))
    .join('\n\n')
}

function renderSection(key, value) {
  const title = `## ${key}`

  if (isEmpty(value)) {
    return `${title}\n\n${MD_NONE}`
  }

  if (typeof value === 'string') {
    return `${title}\n\n${value}`
  }

  return `${title}\n\n\`\`\`yaml\n${stringify(value).trim()}\n\`\`\``
}

function isEmpty(value) {
  if (value == null) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
