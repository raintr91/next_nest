<script setup lang="ts">
const { locale, setLocale, t } = useI18n()

const options = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' }
]

const selected = computed({
  get: () => locale.value,
  set: async (value: string) => {
    if (!value || value === locale.value) return
    await setLocale(value)
  }
})
</script>

<template>
  <label class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
    <span class="hidden sm:inline">{{ t('lang.label') }}</span>
    <select
      v-model="selected"
      class="h-8 rounded-md border bg-background px-2 text-xs text-foreground"
      aria-label="language-switcher"
    >
      <option v-for="opt in options" :key="opt.code" :value="opt.code">
        {{ opt.label }}
      </option>
    </select>
  </label>
</template>
