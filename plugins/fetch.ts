import { getCommonFetchOptions } from '~/utils/fetchUtils'
import { useToastStore } from '~/stores/toastStore'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  // Client + SSR: cùng origin API (https://… qua gateway) — runtimeConfig.public.apiBase / NUXT_PUBLIC_API_BASE.
  const clientApiBase = (config.public.e2e as string) === '1'
    ? window.location.origin
    : (config.public.apiBase as string)
  const baseUrl = import.meta.client
    ? clientApiBase
    : (config.public.apiBase as string)
  const portalKey = (config.public.portalKey as string) || 'portal'
  const serviceKey = (config.public.serviceKey as string) || 'PORTAL'

  const showToast = (params: { message: string; title?: string; type?: 'info' | 'warning' | 'success' | 'error' }) => {
    if (import.meta.client) {
      useToastStore().show({ ...params, type: params.type ?? 'error' })
    }
  }

  const apiFetch = $fetch.create({
    baseURL: baseUrl,
    ...getCommonFetchOptions(undefined, showToast, { portalKey, serviceKey })
  })

  nuxtApp.provide('apiFetch', apiFetch)
})
