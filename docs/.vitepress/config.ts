import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const featureSidebarItems = buildFeatureSidebar()

export default defineConfig({
  title: 'Portal Docs',
  description: 'Portal feature specs, testcases, and team workflow',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Features', link: '/common-ui/generated' },
      { text: 'Workflow', link: '/operational/TEAM-AI-WORKFLOW' }
    ],
    sidebar: [
      {
        text: 'Operational',
        collapsed: false,
        items: [
          { text: 'Team AI Workflow', link: '/operational/TEAM-AI-WORKFLOW' },
          { text: 'Architecture', link: '/operational/ARCHITECTURE' },
          { text: 'E2E Test IDs', link: '/operational/E2E-TESTIDS' },
          { text: 'Semantic UI Assertions', link: '/operational/E2E-SEMANTIC-UI-ASSERTIONS' },
          { text: 'Rapi Recorder QA', link: '/operational/RAPI-RECORDER-QA' }
        ]
      },
      {
        text: 'Onboarding',
        collapsed: true,
        items: [
          { text: 'Team AI Workflow Slides', link: '/onboarding/team-ai-workflow-slides' },
          { text: 'YAML/Markdown AI Workflow', link: '/onboarding/yaml-markdown-ai-workflow' },
          { text: 'Portal Base Overview', link: '/onboarding/portal-base-overview' },
          { text: 'E2E Automation Playwright', link: '/onboarding/e2e-automation-playwright' }
        ]
      },
      {
        text: 'Common UI',
        collapsed: true,
        items: [
          { text: 'Common UI patterns', link: '/common-ui/' },
          { text: 'Generated feature docs', link: '/common-ui/generated' }
        ]
      },
      {
        text: 'Dev environment',
        collapsed: true,
        items: [
          { text: 'Docker dev nhẹ', link: '/dev-environment/DOCKER-DEV-LIGHT' },
          { text: 'WSL + Cursor perf', link: '/dev-environment/WSL-CURSOR-PERF' },
          { text: 'Monorepo strategy', link: '/dev-environment/MONOREPO-STRATEGY' }
        ]
      },
      {
        text: 'Features',
        collapsed: false,
        items: [
          { text: 'Feature index', link: '/common-ui/generated' },
          ...featureSidebarItems
        ]
      }
    ],
    search: {
      provider: 'local'
    }
  }
})

function buildFeatureSidebar() {
  const featuresRoot = join(docsRoot, 'features')
  if (!existsSync(featuresRoot)) return []

  return listFeatureGroups(featuresRoot)
}

function listFeatureGroups(dir: string): DefaultTheme.SidebarItem[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const entryPath = join(dir, entry.name)
      const readmeItems = listDirectGeneratedReadmes(entryPath).map((file) => ({
        text: readTitle(file),
        link: readmeLink(file)
      }))
      const childGroups = listFeatureGroups(entryPath)

      return {
        text: titleCase(entry.name),
        collapsed: true,
        items: [...readmeItems, ...childGroups]
      }
    })
    .filter((group) => group.items.length > 0)
    .sort((a, b) => a.text.localeCompare(b.text))
}

function listDirectGeneratedReadmes(dir: string): string[] {
  const generatedDir = join(dir, 'generated')
  if (!existsSync(generatedDir)) return []

  return readdirSync(generatedDir, { withFileTypes: true })
    .filter((item) => item.isFile() && (item.name === 'README.md' || item.name.endsWith('.README.md')))
    .map((item) => join(generatedDir, item.name))
    .sort()
}

function readTitle(file: string) {
  const firstHeading = readFileSync(file, 'utf8').match(/^#\s+(.+)$/m)?.[1]
  return firstHeading ?? relative(docsRoot, dirname(file))
}

function readmeLink(file: string) {
  const relativePath = relative(docsRoot, file).split('/').join('/')
  if (relativePath.endsWith('/README.md')) {
    return `/${relativePath.replace(/\/README\.md$/, '/')}`
  }

  return `/${relativePath.replace(/\.md$/, '')}`
}

function titleCase(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
