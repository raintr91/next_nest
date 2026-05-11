<script setup lang="ts">
const route = useRoute()
const navigation = useDashboardNav()

const pageTitle = computed(() => {
  const name = route.meta.title as string
  if (name) return name
  const path = route.path
  if (path === '/' || path === '/workspace' || path === '/workspace/') return 'Dashboard'
  const segment = path.split('/').filter(Boolean).pop()
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
  <AtSidebarProvider :default-open="true" class="min-h-svh w-full">
    <OrShadcnSidebar :navigation="navigation" :is-active="isActive" brand-label="Shadcn Portal" />
    <AtSidebarInset>
      <OrShadcnNavbar :title="pageTitle" @logout="onLogout">
        <template #actions>
          <slot name="navbar-actions" />
        </template>
      </OrShadcnNavbar>
      <div class="flex-1 p-4 md:p-6">
        <slot />
      </div>
    </AtSidebarInset>
  </AtSidebarProvider>
</template>
