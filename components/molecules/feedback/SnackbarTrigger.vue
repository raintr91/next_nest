<script setup lang="ts">
/**
 * SnackbarTrigger – trigger that shows a toast/snackbar. Ref: Vuetify Snackbar.
 * Uses useToast() from atoms; wrap app with AtToastProvider + AtToaster.
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
