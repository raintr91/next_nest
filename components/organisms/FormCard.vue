<script setup lang="ts">
/**
 * FormCard – card with title, form slot, submit/cancel footer.
 */
const props = defineProps<{
  title?: string
  submitLabel?: string
  cancelLabel?: string | false
  submitClass?: string
  cancelClass?: string
  loading?: boolean
}>()
const emit = defineEmits<{ (e: 'submit'): void; (e: 'cancel'): void }>()
</script>

<template>
  <MoCardWithActions :title="props.title">
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <slot />
    <template #footer>
      <div class="flex justify-end gap-2">
        <slot name="footer-before" />
        <AtButton
          v-if="props.cancelLabel !== false"
          variant="outline"
          :class="props.cancelClass"
          :disabled="props.loading"
          @click="emit('cancel')"
        >
          {{ props.cancelLabel ?? 'Cancel' }}
        </AtButton>
        <AtButton :class="props.submitClass" :disabled="props.loading" @click="emit('submit')">
          {{ props.submitLabel ?? 'Save' }}
        </AtButton>
      </div>
    </template>
  </MoCardWithActions>
</template>
