import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const autoDir = join(process.cwd(), 'stories', 'auto')

await rm(autoDir, { recursive: true, force: true })
console.log('Cleaned stories/auto.')
