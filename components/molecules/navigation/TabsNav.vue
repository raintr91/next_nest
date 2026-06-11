<script setup lang="ts">
const props = defineProps<{ modelValue?: string; tabs: { value: string; label: string }[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <Tabs :model-value="props.modelValue" @update:model-value="(v) => emit('update:modelValue', v ?? '')">
    <TabsList>
      <TabsTrigger v-for="t in props.tabs" :key="t.value" :value="t.value">{{ t.label }}</TabsTrigger>
    </TabsList>
    <TabsContent v-for="t in props.tabs" :key="'c-' + t.value" :value="t.value">
      <slot :name="t.value" :tab="t" />
    </TabsContent>
  </Tabs>
</template>
