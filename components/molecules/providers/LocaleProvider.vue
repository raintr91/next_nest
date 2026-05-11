<script setup lang="ts">
/**
 * LocaleProvider – wrap content for locale context (e.g. i18n). Ref: Vuetify Locale provider.
 * Use Nuxt i18n or provide(localeKey, locale) as needed.
 */
const props = defineProps<{ locale?: string }>()
</script>

<template>
  <div class="contents" :lang="props.locale">
    <slot />
  </div>
</template>
