import type { StorybookConfig } from '@storybook/vue3-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-docs', 'storybook/viewport'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  viteFinal: async (config) => {
    config.resolve ||= {}
    config.resolve.alias ||= {}
    config.plugins = config.plugins || []
    if (!config.plugins.some((p: any) => p && p.name === 'vite:vue')) {
      config.plugins.push(vue())
    }

    const rootDir = path.resolve(__dirname, '..')

    // Auto-import Vue APIs (giống Nuxt) — ref, computed, watch, useSlots, onMounted, ...
    config.plugins.push(
      AutoImport({
        imports: ['vue'],
        dts: path.join(__dirname, 'auto-imports.d.ts'),
        dirs: [],
        vueTemplate: true
      })
    )

    Object.assign(config.resolve.alias, {
      '~': rootDir,
      '@': rootDir
    })

    config.optimizeDeps = config.optimizeDeps || {}
    config.optimizeDeps.include = [
      ...(Array.isArray(config.optimizeDeps.include) ? config.optimizeDeps.include : []),
      'radix-vue',
      '@radix-icons/vue',
      '@vueuse/core',
      '@unovis/vue',
      '@unovis/ts'
    ]

    return config
  }
}

export default config
