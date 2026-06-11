/**
 * stories/auto/ is gitignored — sau clone hoặc storybook:clean:gen thì Storybook chỉ còn story tay.
 * Nếu chưa có file *.stories.js trong stories/auto, chạy generate-stories.mjs một lần.
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const autoDir = join(root, 'stories', 'auto')

async function hasAnyAutoStory() {
  if (!existsSync(autoDir)) return false
  const files = await readdir(autoDir)
  return files.some((f) => f.endsWith('.stories.js'))
}

const ok = await hasAnyAutoStory()
if (!ok) {
  // eslint-disable-next-line no-console
  console.log('[storybook] stories/auto/ trống hoặc chưa có — chạy generate-stories.mjs …')
  const r = spawnSync(process.execPath, [join(root, 'scripts', 'generate-stories.mjs')], {
    cwd: root,
    stdio: 'inherit'
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
