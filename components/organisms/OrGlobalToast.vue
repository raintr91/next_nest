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
      @update:open="(open) => !open && toastStore.hide(t.id)"
    >
      <div class="grid gap-1">
        <div class="flex items-start gap-3">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
            :class="{
              'bg-primary/10 text-primary': t.type === 'info',
              'bg-destructive/10 text-destructive': t.type === 'error',
              'bg-amber-500/10 text-amber-600': t.type === 'warning',
              'bg-green-500/10 text-green-600': t.type === 'success'
            }"
          >
            {{ typeIcon(t.type) }}
          </span>
          <div class="flex-1 space-y-1">
            <ToastTitle v-if="t.title">
              {{ t.title }}
            </ToastTitle>
            <ToastDescription>
              {{ t.message }}
            </ToastDescription>
          </div>
          <ToastClose />
        </div>
      </div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
