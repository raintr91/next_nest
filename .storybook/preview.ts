import { h } from 'vue'
import { setup } from '@storybook/vue3'
import type { Preview } from '@storybook/vue3'
import '@/assets/css/main.css'

const uiComponents = import.meta.glob('../components/ui/**/*.vue', { eager: true })
const moleculeComponents = import.meta.glob('../components/molecules/**/*.vue', { eager: true })

function componentName(path: string) {
  return path.split('/').pop()?.replace(/\.vue$/, '') ?? ''
}

function registerComponents(app: Parameters<Parameters<typeof setup>[0]>[0], modules: Record<string, unknown>, prefix = '') {
  for (const [path, module] of Object.entries(modules)) {
    const name = componentName(path)
    const component = (module as { default?: unknown }).default
    if (!name || !component) continue
    app.component(`${prefix}${name}`, component)
  }
}

setup((app) => {
  registerComponents(app, uiComponents)
  registerComponents(app, moleculeComponents, 'Mo')

  app.component('NuxtLink', {
    props: {
      to: {
        type: [String, Object],
        default: '#'
      }
    },
    setup(props, { slots }) {
      return () => h('a', { href: typeof props.to === 'string' ? props.to : '#' }, slots.default?.())
    }
  })
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
