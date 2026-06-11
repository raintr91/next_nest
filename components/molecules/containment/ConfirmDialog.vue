<script setup lang="ts">
/**
 * ConfirmDialog – dialog with title, description, confirm/cancel actions.
 * Reference: Vuetify Dialog (containment). Built from Dialog, Button.
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
  <Dialog :open="props.open" @update:open="onOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>
      <slot />
      <DialogFooter class="gap-2 sm:gap-0">
        <Button variant="outline" :disabled="loading" @click="onCancel">
          {{ cancelLabel }}
        </Button>
        <Button
          :variant="variant === 'destructive' ? 'destructive' : 'default'"
          :disabled="loading"
          @click="onConfirm"
        >
          {{ confirmLabel }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
