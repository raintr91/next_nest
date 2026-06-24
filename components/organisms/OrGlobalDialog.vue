<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDialogStore } from '~/stores/dialogStore'
import type { DialogType } from '~/stores/dialogStore'

const dialogStore = useDialogStore()
const {
  visible,
  title,
  text,
  type,
  btnConfirmTitle,
  btnCancelTitle,
  hideBtn,
  hideBtnConfirm,
  hideBtnCancel
} = storeToRefs(dialogStore)

const dialogColor = computed(() => {
  const map: Record<DialogType, string> = {
    info: 'info',
    warning: 'warning',
    confirm: 'primary',
    error: 'danger'
  }
  return map[type.value] ?? 'primary'
})

function onOpenChange(open: boolean) {
  if (!open) dialogStore.hide()
}
</script>

<template>
  <AlertDialog :open="visible" data-testid="app-dialog" @update:open="onOpenChange">
    <AlertDialogContent
      test-id="app-dialog-content"
      :class="{
        'border-l-4 border-info': type === 'info',
        'border-l-4 border-warning': type === 'warning',
        'border-l-4 border-danger': type === 'error',
        'border-l-4 border-primary': type === 'confirm'
      }"
    >
      <AlertDialogHeader>
        <div class="flex items-center gap-3">
          <span
            v-if="type === 'info'"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info/10 text-lg text-info"
          >
            ℹ
          </span>
          <span
            v-else-if="type === 'warning'"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/10 text-lg text-warning"
          >
            ⚠
          </span>
          <span
            v-else-if="type === 'confirm'"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg text-primary"
          >
            ?
          </span>
          <span
            v-else-if="type === 'error'"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-lg text-danger"
          >
            ✕
          </span>
          <div class="flex-1">
            <AlertDialogTitle data-testid="app-dialog-title">{{ title }}</AlertDialogTitle>
            <AlertDialogDescription class="mt-2 whitespace-pre-line" data-testid="app-dialog-message">
              {{ text }}
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogHeader>
      <div v-if="!hideBtn" class="mt-4 flex justify-end gap-2">
        <AlertDialogCancel v-if="!hideBtnCancel" data-testid="app-dialog-cancel-btn">
          {{ btnCancelTitle }}
        </AlertDialogCancel>
        <AlertDialogAction
          v-if="!hideBtnConfirm"
          data-testid="app-dialog-confirm-btn"
          :class="{
            'bg-primary text-primary-foreground hover:bg-primary/90': dialogColor === 'primary',
            'bg-info text-info-foreground hover:bg-info/90': dialogColor === 'info',
            'bg-warning text-warning-foreground hover:bg-warning/90': dialogColor === 'warning',
            'bg-danger text-danger-foreground hover:bg-danger/90': dialogColor === 'danger'
          }"
          @click="dialogStore.confirm()"
        >
          {{ btnConfirmTitle }}
        </AlertDialogAction>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>
