import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const featureSidebarItems = buildFeatureSidebar()

export default withMermaid(defineConfig({
  title: 'Portal Docs',
  description: 'Portal feature specs, testcases, and team workflow',
  cleanUrls: true,
  ignoreDeadLinks: [/^https?:\/\/localhost(:\d+)?/],
  vite: {
    optimizeDeps: {
      include: ['dayjs', 'mermaid'],
    },
    resolve: {
      alias: {
        dayjs: 'dayjs/',
      },
    },
    build: {
      commonjsOptions: {
        include: [/dayjs/, /node_modules/],
      },
    },
  },
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
      {
        text: 'Diagrams & flows',
        collapsed: false,
        items: [
          { text: 'Full cycle (overview)', link: '/operational/FULL-CYCLE-PIPELINE-DIAGRAM' },
          { text: 'Design phase (detail)', link: '/operational/DESIGN-PHASE-DIAGRAM' },
          { text: 'Test phase (E2E)', link: '/operational/TEST-PHASE-DIAGRAM' },
          { text: 'E2E semantic bundles', link: '/operational/TEST-PHASE-DIAGRAM#semantic-bundles' },
          { text: 'Unit registry promotion', link: '/operational/UNIT-REGISTRY-PROMOTION' },
          { text: 'API phase (detail)', link: '/operational/BACKEND-PHASE-DIAGRAM' },
          { text: 'Wire phase (TBD)', link: '/operational/WIRE-PHASE-DIAGRAM' },
          { text: 'Update spec flow', link: '/operational/UPDATE-SPEC-FLOW' },
          { text: 'Tech debt flow', link: '/operational/TECH-DEBT-FLOW' },
          { text: 'Needs component flow', link: '/operational/NEEDS-COMPONENT-FLOW' },
        ],
      },
          { text: 'Team AI Workflow', link: '/operational/TEAM-AI-WORKFLOW' },
          { text: 'Portal codegen (gen + unit)', link: '/operational/PORTAL-CODEGEN' },
          { text: 'Unit phase — dev lane', link: '/operational/UNIT-PHASE-DIAGRAM' },
          { text: 'Portal unit-gen roadmap', link: '/operational/PORTAL-UNIT-GEN-ROADMAP' },
          { text: 'Architecture', link: '/operational/ARCHITECTURE' },
          { text: 'Design Registry Promotion', link: '/operational/DESIGN-REGISTRY-PROMOTION' },
          { text: 'Page Lifecycle', link: '/operational/PAGE-LIFECYCLE' },
          { text: 'E2E Test IDs', link: '/operational/E2E-TESTIDS' },
          { text: 'Semantic UI Assertions', link: '/operational/E2E-SEMANTIC-UI-ASSERTIONS' }
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
}))

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
      const specItems = listDirectGeneratedSpecs(entryPath).map((file) => ({
        text: readTitle(file),
        link: specLink(file)
      }))
      const childGroups = listFeatureGroups(entryPath)

      return {
        text: titleCase(entry.name),
        collapsed: true,
        items: [...specItems, ...childGroups]
      }
    })
    .filter((group) => group.items.length > 0)
    .sort((a, b) => a.text.localeCompare(b.text))
}

function listDirectGeneratedSpecs(dir: string): string[] {
  const generatedDir = join(dir, 'generated')
  if (!existsSync(generatedDir)) return []

  return readdirSync(generatedDir, { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.endsWith('.md'))
    .map((item) => join(generatedDir, item.name))
    .sort()
}

function readTitle(file: string) {
  const firstHeading = readFileSync(file, 'utf8').match(/^#\s+(.+)$/m)?.[1]
  return firstHeading ?? relative(docsRoot, dirname(file))
}

function specLink(file: string) {
  const relativePath = relative(docsRoot, file).split('/').join('/')
  return `/${relativePath.replace(/\.md$/, '')}`
}

function titleCase(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
