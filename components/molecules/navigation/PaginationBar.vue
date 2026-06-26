<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

/**
 * PaginationBar – flat admin pagination with prev/next, page numbers and ellipsis.
 */
const props = defineProps<{
  page: number
  totalPages: number
  testId?: string
}>()
const emit = defineEmits<{ (e: 'update:page', v: number): void }>()

const pageItems = computed(() => {
  const total = Math.max(1, props.totalPages)
  const current = Math.max(1, Math.min(total, props.page))
  const windowStart = Math.max(1, current - 2)
  const windowEnd = Math.min(total, current + 2)
  const items: Array<number | 'ellipsis-start' | 'ellipsis-end'> = []

  if (windowStart > 1) {
    items.push(1)
    if (windowStart > 2) items.push('ellipsis-start')
  }

  for (let page = windowStart; page <= windowEnd; page++) {
    items.push(page)
  }

  if (windowEnd < total) {
    if (windowEnd < total - 1) items.push('ellipsis-end')
    items.push(total)
  }

  return items
})

function go(n: number) {
  const p = Math.max(1, Math.min(props.totalPages, n))
  emit('update:page', p)
}
</script>

<template>
  <nav
    class="flex flex-wrap items-center justify-center gap-3 py-2"
    role="navigation"
    aria-label="Pagination"
    :data-testid="props.testId"
  >
    <Button
      variant="outline"
      size="sm"
      class="min-w-16 rounded border bg-white text-xs shadow-none"
      :disabled="props.page <= 1"
      aria-label="前のページ"
      title="前のページ"
      :data-testid="props.testId ? `${props.testId}-prev-btn` : undefined"
      @click="go(props.page - 1)"
    >
      <ChevronLeft class="size-4" aria-hidden="true" />
      <span>前へ</span>
    </Button>

    <template v-for="item in pageItems" :key="item">
      <span
        v-if="typeof item === 'string'"
        class="px-1 text-sm text-muted-foreground"
        aria-hidden="true"
      >
        ...
      </span>
      <Button
        v-else
        variant="outline"
        size="icon"
        class="h-8 min-w-8 rounded border bg-white text-sm shadow-none"
        :class="item === props.page ? 'border-[#4EAAFF] bg-[#4EAAFF]/10 text-[#4EAAFF]' : 'text-foreground'"
        :aria-current="item === props.page ? 'page' : undefined"
        :data-testid="props.testId ? `${props.testId}-page-${item}` : undefined"
        @click="go(item)"
      >
        {{ item }}
      </Button>
    </template>

    <Button
      variant="outline"
      size="sm"
      class="min-w-16 rounded border bg-white text-xs shadow-none"
      :disabled="props.page >= props.totalPages"
      aria-label="次のページ"
      title="次のページ"
      :data-testid="props.testId ? `${props.testId}-next-btn` : undefined"
      @click="go(props.page + 1)"
    >
      <span>次へ</span>
      <ChevronRight class="size-4" aria-hidden="true" />
    </Button>
  </nav>
</template>
