import { mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'

const root = process.cwd()
const autoDir = join(root, 'stories', 'auto')

async function hasStories() {
  try {
    const files = await readdir(autoDir)
    return files.some((file) => file.endsWith('.stories.js'))
  } catch {
    return false
  }
}

await mkdir(autoDir, { recursive: true })

if (!(await hasStories())) {
  console.log('[storybook] stories/auto is empty; generating stories...')
  const result = spawnSync(process.execPath, [join(root, 'scripts', 'generate-stories.mjs')], {
    stdio: 'inherit',
    env: process.env
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
