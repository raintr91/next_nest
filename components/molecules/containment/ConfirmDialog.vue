<script setup lang="ts">
/**
 * ConfirmDialog – dialog with title, description, confirm/cancel actions.
 * Reference: Vuetify Dialog (containment). Built from AtDialog, AtButton.
 */
const props = withDefaults(
  defineProps<{
    open?: boolean
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'default' | 'destructive'
    loading?: boolean
  }>(),
  {
    title: 'Confirm',
    description: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'default',
    loading: false
  }
)

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:open', v: boolean): void
}>()

function onOpenChange(v: boolean) {
  emit('update:open', v)
}

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('update:open', false)
  emit('cancel')
}
</script>

<template>
  <AtDialog :open="props.open" @update:open="onOpenChange">
    <AtDialogContent class="sm:max-w-md">
      <AtDialogHeader>
        <AtDialogTitle>{{ title }}</AtDialogTitle>
        <AtDialogDescription v-if="description">
          {{ description }}
        </AtDialogDescription>
      </AtDialogHeader>
      <slot />
      <AtDialogFooter class="gap-2 sm:gap-0">
        <AtButton variant="outline" :disabled="loading" @click="onCancel">
          {{ cancelLabel }}
        </AtButton>
        <AtButton
          :variant="variant === 'destructive' ? 'destructive' : 'default'"
          :disabled="loading"
          @click="onConfirm"
        >
          {{ confirmLabel }}
        </AtButton>
      </AtDialogFooter>
    </AtDialogContent>
  </AtDialog>
</template>
