<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '~/stores/toastStore'
import type { ToastType } from '~/stores/toastStore'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

function variantFor(type: ToastType): 'default' | 'destructive' {
  return type === 'error' ? 'destructive' : 'default'
}

function typeIcon(type: ToastType): string {
  switch (type) {
    case 'info':
      return 'ℹ'
    case 'warning':
      return '⚠'
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    default:
      return 'ℹ'
  }
}
</script>

<template>
  <ToastProvider>
    <Toast
      v-for="t in toasts"
      :key="t.id"
      :open="t.open"
      :variant="variantFor(t.type)"
      data-testid="app-toast"
      @update:open="(open) => !open && toastStore.hide(t.id)"
    >
      <div class="grid gap-1">
        <div class="flex items-start gap-3">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
            data-testid="app-toast-icon"
            :class="{
              'bg-info/10 text-info': t.type === 'info',
              'bg-danger/10 text-danger': t.type === 'error',
              'bg-warning/10 text-warning': t.type === 'warning',
              'bg-success/10 text-success': t.type === 'success'
            }"
          >
            {{ typeIcon(t.type) }}
          </span>
          <div class="flex-1 space-y-1">
            <ToastTitle v-if="t.title" data-testid="app-toast-title">
              {{ t.title }}
            </ToastTitle>
            <ToastDescription data-testid="app-toast-message">
              {{ t.message }}
            </ToastDescription>
          </div>
          <ToastClose data-testid="app-toast-close" />
        </div>
      </div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
