<script setup lang="ts">
/**
 * AuthCard – card for login/register: title, form slot, submit button.
 */
const props = defineProps<{
  title?: string
  submitLabel?: string
  loading?: boolean
}>()
const emit = defineEmits<{ (e: 'submit'): void }>()
</script>

<template>
  <div class="flex min-h-[50vh] items-center justify-center p-4">
    <MoCardWithActions :title="props.title ?? 'Sign in'" class="w-full max-w-md">
      <slot />
      <template #footer>
        <Button class="w-full" :disabled="props.loading" @click="emit('submit')">
          {{ props.submitLabel ?? 'Submit' }}
        </Button>
      </template>
    </MoCardWithActions>
  </div>
</template>
