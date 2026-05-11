<script setup lang="ts">
/**
 * AppShell – full app layout: optional system bar, app bar, main, optional nav drawer, optional footer.
 */
const props = defineProps<{
  title?: string
  showSystemBar?: boolean
  showFooter?: boolean
  drawerOpen?: boolean
}>()
const emit = defineEmits<{ (e: 'update:drawerOpen', v: boolean): void }>()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MoSystemBar v-if="props.showSystemBar">
      <slot name="systemBar" />
    </MoSystemBar>
    <MoAppBar :title="props.title">
      <template v-if="$slots['leading']" #leading>
        <slot name="leading" />
      </template>
      <template v-if="$slots['actions']" #actions>
        <slot name="actions" />
      </template>
    </MoAppBar>
    <div class="flex flex-1">
      <MoNavDrawer
        v-if="$slots.drawer"
        :open="props.drawerOpen"
        @update:open="emit('update:drawerOpen', $event)"
      >
        <slot name="drawer" />
      </MoNavDrawer>
      <main class="flex-1 overflow-auto p-4">
        <slot />
      </main>
    </div>
    <MoFooter v-if="props.showFooter || $slots.footer">
      <slot name="footer" />
    </MoFooter>
  </div>
</template>
