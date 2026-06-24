import { chromium } from '@playwright/test'

const baseUrl = process.env.STORYBOOK_URL || 'http://localhost:6006'
const limit = Number.parseInt(process.argv.find((arg) => arg.startsWith('--limit='))?.split('=')[1] ?? '', 10)
const start = Number.parseInt(process.argv.find((arg) => arg.startsWith('--start='))?.split('=')[1] ?? '0', 10)

function storySortValue(story) {
  return `${story.title}/${story.name}`.toLowerCase()
}

async function fetchStories() {
  const response = await fetch(`${baseUrl}/index.json`)
  if (!response.ok) throw new Error(`Cannot fetch Storybook index: ${response.status}`)

  const index = await response.json()
  return Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .sort((a, b) => storySortValue(a).localeCompare(storySortValue(b)))
}

async function auditStory(page, story) {
  const runtimeErrors = []
  page.removeAllListeners('pageerror')
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto(`${baseUrl}/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root')
    const visibleError = [...document.querySelectorAll('.sb-errordisplay')]
      .some((node) => {
        const style = window.getComputedStyle(node)
        return style.display !== 'none' && style.visibility !== 'hidden' && node.textContent?.trim()
      })

    return visibleError || (root?.innerHTML.trim().length ?? 0) > 0
  }, undefined, { timeout: 1000 }).catch(() => undefined)

  const result = await page.evaluate(() => {
    const root = document.querySelector('#storybook-root')
    const visibleError = [...document.querySelectorAll('.sb-errordisplay')]
      .find((node) => {
        const style = window.getComputedStyle(node)
        return style.display !== 'none' && style.visibility !== 'hidden' && node.textContent?.trim()
      })

    return {
      htmlLength: root?.innerHTML.trim().length ?? 0,
      text: root?.innerText.trim().slice(0, 120) ?? '',
      visibleError: visibleError?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 220) ?? ''
    }
  })

  const problems = []
  if (result.visibleError) problems.push(`visible error: ${result.visibleError}`)
  if (result.htmlLength === 0) problems.push('empty root')
  if (runtimeErrors.length) problems.push(`runtime: ${runtimeErrors.slice(0, 2).join(' | ')}`)

  return {
    id: story.id,
    title: story.title,
    name: story.name,
    preview: result.text,
    problems
  }
}

const stories = await fetchStories()
const selectedStories = Number.isFinite(limit) ? stories.slice(start, start + limit) : stories.slice(start)
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const failures = []

for (const [index, story] of selectedStories.entries()) {
  const result = await auditStory(page, story)
  if (result.problems.length) failures.push({ index: start + index + 1, ...result })
}

await browser.close()

console.log(`Audited ${selectedStories.length}/${stories.length} stories from #${start + 1}.`)

if (failures.length) {
  console.log(`Failures: ${failures.length}`)
  for (const failure of failures.slice(0, 50)) {
    console.log(`- #${failure.index} ${failure.title} / ${failure.name} (${failure.id})`)
    console.log(`  ${failure.problems.join('\n  ')}`)
  }
  process.exit(1)
}

console.log('No blank/error stories found.')
