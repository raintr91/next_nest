<script setup lang="ts">
/**
 * ExpansionPanelList – accordion from items array. Ref: Vuetify Expansion panels.
 */
const props = defineProps<{
  items: { value: string; title: string; content?: string }[]
  type?: 'single' | 'multiple'
}>()
</script>

<template>
  <AtAccordion :type="props.type ?? 'single'" class="w-full">
    <AtAccordionItem v-for="item in props.items" :key="item.value" :value="item.value">
      <AtAccordionTrigger>{{ item.title }}</AtAccordionTrigger>
      <AtAccordionContent>
        <template v-if="item.content">{{ item.content }}</template>
        <slot v-else :name="item.value" :item="item" />
      </AtAccordionContent>
    </AtAccordionItem>
  </AtAccordion>
</template>
