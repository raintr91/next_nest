/**
 * Chỉ xóa stories auto-generate (stories/auto/*).
 * Không đụng vào stories viết tay (stories/*.stories.ts).
 * Chạy: pnpm storybook:clean:gen
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const GENERATED_DIR = path.join(rootDir, 'stories', 'auto')

async function main() {
  const exists = await fs.stat(GENERATED_DIR).then((s) => s.isDirectory()).catch(() => false)
  if (!exists) {
    console.log('stories/auto not found, nothing to clean.')
    return
  }
  await fs.rm(GENERATED_DIR, { recursive: true })
  await fs.mkdir(GENERATED_DIR, { recursive: true })
  console.log('Cleaned stories/auto only. Manual stories (stories/*.stories.ts) are preserved.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
