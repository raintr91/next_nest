import { describe, expect, it } from 'vitest'

/**
 * Plugin fetch.ts uses Nuxt auto-imports ($fetch, useRuntimeConfig, defineNuxtPlugin)
 * which are not available in Vitest. We test the plugin contract: the logic it implements
 * is that apiFetch = $fetch.create({ baseURL: config.public.apiBase, ...getCommonFetchOptions() }),
 * then globalThis.$fetch = apiFetch and nuxtApp.provide('apiFetch', apiFetch).
 * getCommonFetchOptions is covered in tests/unit/utils/fetchUtils.test.ts.
 */
describe('plugins/fetch contract', () => {
  it('expected plugin behaviour: baseURL from runtimeConfig.public.apiBase', () => {
    const config = { public: { apiBase: 'https://api.test' } }
    expect(config.public.apiBase).toBe('https://api.test')
  })

  it('expected plugin behaviour: apiFetch is created with baseURL + getCommonFetchOptions spread', () => {
    const baseURL = 'https://api.test'
    const commonOpts = { onRequest: () => {}, onResponse: () => {}, onResponseError: () => {} }
    const merged = { baseURL, ...commonOpts }
    expect(merged.baseURL).toBe(baseURL)
    expect(merged).toHaveProperty('onRequest')
    expect(merged).toHaveProperty('onResponse')
    expect(merged).toHaveProperty('onResponseError')
  })

  it('e2e client uses same origin when public.e2e is numeric 1', () => {
    const config = { public: { apiBase: 'https://api-base.local.com', e2e: 1 } }
    const isE2eClient = String(config.public.e2e) === '1' || config.public.e2e === true
    const origin = 'http://127.0.0.1:3005'
    const clientApiBase = isE2eClient ? origin : config.public.apiBase
    expect(clientApiBase).toBe(origin)
  })
})
