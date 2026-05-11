<script setup lang="ts">
/**
 * PaginationBar – pagination with first/prev/next/last. Ref: Vuetify Pagination.
 * Built from AtPagination (radix), AtButton.
 */
const props = defineProps<{
  page: number
  totalPages: number
}>()
const emit = defineEmits<{ (e: 'update:page', v: number): void }>()

function go(n: number) {
  const p = Math.max(1, Math.min(props.totalPages, n))
  emit('update:page', p)
}
</script>

<template>
  <nav class="flex items-center gap-2" role="navigation" aria-label="Pagination">
    <AtButton variant="outline" size="icon" :disabled="props.page <= 1" @click="go(1)">«</AtButton>
    <AtButton variant="outline" size="icon" :disabled="props.page <= 1" @click="go(props.page - 1)">‹</AtButton>
    <span class="px-2 text-sm text-muted-foreground">{{ props.page }} / {{ props.totalPages }}</span>
    <AtButton variant="outline" size="icon" :disabled="props.page >= props.totalPages" @click="go(props.page + 1)">›</AtButton>
    <AtButton variant="outline" size="icon" :disabled="props.page >= props.totalPages" @click="go(props.totalPages)">»</AtButton>
  </nav>
</template>
