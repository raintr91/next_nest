import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import type { StorybookConfig } from '@storybook/vue3-vite'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  viteFinal(baseConfig) {
    baseConfig.plugins = [...(baseConfig.plugins ?? []), vue()]
    baseConfig.resolve = baseConfig.resolve ?? {}
    baseConfig.resolve.alias = {
      ...(baseConfig.resolve.alias ?? {}),
      '~': rootDir,
      '@': rootDir
    }
    return baseConfig
  }
}

export default config
