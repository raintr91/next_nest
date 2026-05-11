<script setup lang="ts">
import { computed } from 'vue'
import { getTotalPages } from '~/components/molecules/data-display/dataIteratorLogic'
/**
 * DataIterator – list with pagination. Ref: Vuetify Data iterator.
 */
const props = defineProps<{
  page?: number
  pageSize?: number
  total?: number
  items?: unknown[]
}>()
const emit = defineEmits<{ (e: 'update:page', v: number): void }>()
const pageSize = computed(() => props.pageSize ?? 10)
const totalPages = computed(() => getTotalPages(props.total, pageSize.value))
</script>

<template>
  <div class="space-y-4">
    <slot :items="props.items ?? []" :page="props.page ?? 1" :pageSize="props.pageSize ?? 10" />
    <MoPaginationBar
      v-if="totalPages > 1"
      :page="props.page ?? 1"
      :total-pages="totalPages"
      @update:page="emit('update:page', $event)"
    />
  </div>
</template>
