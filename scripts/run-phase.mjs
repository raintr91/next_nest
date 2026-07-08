#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const PHASES = {
  spec: [
    { run: 'spec:split' },
    { run: 'spec:split:check' },
    { run: 'docs:render', forward: false },
  ],
  gen: [
    { run: 'portal:gen:dry' },
    { run: 'portal:gen' },
    { run: 'docs:render', forward: false },
  ],
  common: [
    { run: 'spec:split:common' },
    { run: 'docs:render:common', forward: false },
  ],
  unit: [{ run: 'portal:unit-gen:dry' }, { run: 'portal:unit-gen' }],
  e2e: [
    { run: 'testcase:gen:dry' },
    { run: 'testcase:gen' },
    { run: 'test:e2e', forward: false },
  ],
}

function main() {
  const [phase, ...rest] = process.argv.slice(2)
  let steps = PHASES[phase]
  if (!steps) {
    console.error(`Unknown phase: ${phase ?? '(none)'}`)
    console.error(`Available phases: ${Object.keys(PHASES).join(', ')}`)
    process.exit(1)
  }

  if (phase === 'spec' && rest.length === 0) {
    steps = [{ run: 'spec:split:all' }, { run: 'docs:render', forward: false }]
  }

  for (const step of steps) {
    const args = step.forward === false ? [] : rest
    const echo = args.length ? ` ${args.join(' ')}` : ''
    console.log(`\n▶ phase:${phase} → pnpm ${step.run}${echo}`)
    const result = spawnSync('pnpm', ['run', step.run, ...(args.length ? ['--', ...args] : [])], {
      stdio: 'inherit',
      shell: true,
    })
    if (result.status !== 0) {
      console.error(`\n✖ ${step.run} failed (exit ${result.status}). Stopped phase:${phase}.`)
      process.exit(result.status ?? 1)
    }
  }

  console.log(`\n✔ phase:${phase} completed (${steps.length} steps)`)
}

main()
