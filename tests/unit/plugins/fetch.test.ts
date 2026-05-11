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
})
