<script setup lang="ts">
const route = useRoute()
const navigation = useDashboardNav()
const mobileMenuOpen = ref(false)

const pageTitle = computed(() => {
  const name = route.meta.title as string
  if (name) return name
  if (route.path === '/' || route.path === '/workspace' || route.path === '/workspace/') return 'Dashboard'
  const segment = route.path.split('/').filter(Boolean).pop()
  return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Page'
})

const auth = useAuth()

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path)
}

async function onLogout() {
  await auth.apiLogout()
  await navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-svh bg-muted/30 text-foreground">
    <OrWindsterNavbar
      :title="pageTitle"
      search-placeholder="Search"
      @toggle-sidebar="mobileMenuOpen = true"
    >
      <template #actions>
        <slot name="navbar-actions" />
      </template>
    </OrWindsterNavbar>

    <div class="flex overflow-hidden bg-background pt-16">
      <OrWindsterSidebar
        :navigation="navigation"
        :is-active="isActive"
        :open="mobileMenuOpen"
        @update:open="mobileMenuOpen = $event"
      />

      <div
        id="main-content"
        class="h-full w-full flex-1 overflow-y-auto bg-muted/30 lg:ml-64"
      >
        <main class="pt-6 px-4 pb-10">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
