<script setup lang="ts">
/**
 * SnackbarTrigger – trigger that shows a toast/snackbar. Ref: Vuetify Snackbar.
 * Uses useToast() from ui/toast; wrap app with ToastProvider + Toaster.
 */
const props = defineProps<{
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}>()
const { toast } = useToast()
function show() {
  toast({ title: props.title, description: props.description, variant: props.variant })
}
</script>

<template>
  <div @click="show">
    <slot />
  </div>
</template>
