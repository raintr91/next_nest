import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'info' | 'warning' | 'success' | 'error'

export interface ToastItem {
  id: string
  title?: string
  message: string
  type: ToastType
  duration?: number
  open: boolean
}

export interface ToastParams {
  title?: string
  message: string
  type?: ToastType
  duration?: number
}

let toastId = 0

function nextId() {
  toastId += 1
  return `toast-${toastId}`
}

export const useToastStore = defineStore('global-toast', () => {
  const toasts = ref<ToastItem[]>([])
  const timeouts = new Map<string, ReturnType<typeof setTimeout>>()

  function show(params: ToastParams) {
    const id = nextId()
    const duration = params.duration ?? 5000
    const item: ToastItem = {
      id,
      title: params.title,
      message: params.message,
      type: params.type ?? 'info',
      duration,
      open: true
    }
    toasts.value = [...toasts.value, item]

    if (duration > 0) {
      const t = setTimeout(() => {
        hide(id)
        timeouts.delete(id)
      }, duration)
      timeouts.set(id, t)
    }

    return id
  }

  function hide(id: string) {
    const t = timeouts.get(id)
    if (t) {
      clearTimeout(t)
      timeouts.delete(id)
    }
    toasts.value = toasts.value.filter((x) => x.id !== id)
  }

  function clear() {
    timeouts.forEach((t) => clearTimeout(t))
    timeouts.clear()
    toasts.value = []
  }

  return {
    toasts,
    show,
    hide,
    clear
  }
})
