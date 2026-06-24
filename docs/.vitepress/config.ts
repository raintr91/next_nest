import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Portal Docs',
  description: 'Portal feature specs, testcases, and team workflow',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Features', link: '/generated' },
      { text: 'Workflow', link: '/TEAM-AI-WORKFLOW' }
    ],
    sidebar: [
      {
        text: 'Global',
        items: [
          { text: 'Team AI Workflow', link: '/TEAM-AI-WORKFLOW' },
          { text: 'Architecture', link: '/ARCHITECTURE' },
          { text: 'E2E Test IDs', link: '/E2E-TESTIDS' },
          { text: 'Semantic UI Assertions', link: '/E2E-SEMANTIC-UI-ASSERTIONS' },
          { text: 'Rapi Recorder QA', link: '/RAPI-RECORDER-QA' }
        ]
      },
      {
        text: 'Generated',
        items: [
          { text: 'Feature Index', link: '/generated' },
          { text: 'Hotel Example', link: '/features/hotel/generated/' }
        ]
      },
      {
        text: 'Presentations',
        items: [
          { text: 'Team AI Workflow Slides', link: '/presentations/team-ai-workflow-slides' },
          { text: 'YAML/Markdown AI Workflow', link: '/presentations/yaml-markdown-ai-workflow' },
          { text: 'E2E Automation Playwright', link: '/presentations/e2e-automation-playwright' },
          { text: 'Portal Base Overview', link: '/presentations/portal-base-overview' }
        ]
      }
    ],
    search: {
      provider: 'local'
    }
  }
})
