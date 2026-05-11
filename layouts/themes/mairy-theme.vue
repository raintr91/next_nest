<script setup lang="ts">
import type { BreadcrumbItem } from '~/components/molecules/navigation/BreadcrumbNav.vue'
import { ChevronDown, ChevronRight, LogOut } from 'lucide-vue-next'
import BreadcrumbNav from '~/components/molecules/navigation/BreadcrumbNav.vue'
import type { DashboardNavItem } from '~/composables/useDashboardNav'
import { useCommonBreadcrumbState } from '~/composables/useCommonBreadcrumbs'

const route = useRoute()
const { t } = useI18n()
const auth = useAuth()
const navigation = useDashboardNav()
const breadcrumbExtras = useCommonBreadcrumbState()
const mobileMenuOpen = ref(false)
const expandedParents = ref<Record<string, boolean>>({})
const dashboardTitle = computed(() => {
  const raw = t('dashboard.title')
  return raw === 'dashboard.title' ? 'ホーム' : raw
})

const pageTitle = computed(() => {
  const name = route.meta.title as string
  if (name) return name
  if (route.path === '/') return dashboardTitle.value
  const segment = route.path.split('/').filter(Boolean).pop()
  return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Page'
})

const hotelRouteExtras = computed<BreadcrumbItem[]>(() => {
  if (route.path === '/hotels/create') return [{ label: 'ホテル新規登録' }]
  if (/^\/hotels\/\d+\/edit$/.test(route.path)) return [{ label: 'ホテル編集' }]
  if (/^\/hotels\/\d+$/.test(route.path)) return [{ label: 'ホテル詳細' }]
  if (route.path === '/review-performances/import') return [{ label: '口コミ実績データインポート' }]
  if (/^\/review-performances\/import-preview\/[^/]+$/.test(route.path)) {
    return [
      { label: '口コミ実績データインポート', href: '/review-performances/import' },
      { label: 'プレビュー' },
    ]
  }
  return []
})

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path)
}

function hasChildren(item: { children?: unknown[] }) {
  return Boolean(item.children?.length)
}

function isAnyChildActive(item: { children?: Array<{ path: string }> }) {
  return Boolean(item.children?.some((child) => isActive(child.path)))
}

function isParentExpanded(path: string) {
  return Boolean(expandedParents.value[path])
}

function toggleParent(path: string) {
  expandedParents.value[path] = !isParentExpanded(path)
}

watchEffect(() => {
  for (const item of navigation) {
    if (!item.children?.length) continue
    if (isAnyChildActive(item)) expandedParents.value[item.path] = true
  }
})

function normalizePath(path: string) {
  return path.replace(/\/+$/, '') || '/'
}

function getPathScore(candidatePath: string, currentPath: string) {
  const normalizedCandidate = normalizePath(candidatePath)
  const normalizedCurrent = normalizePath(currentPath)

  if (normalizedCandidate === normalizedCurrent) return 10_000 + normalizedCandidate.length
  if (normalizedCandidate !== '/' && normalizedCurrent.startsWith(`${normalizedCandidate}/`)) {
    return normalizedCandidate.length
  }
  return -1
}

function findBreadcrumbTrail(items: DashboardNavItem[], currentPath: string, parents: DashboardNavItem[] = []): DashboardNavItem[] {
  let bestTrail: DashboardNavItem[] = []
  let bestScore = -1

  for (const item of items) {
    const trail = [...parents, item]
    const itemScore = getPathScore(item.path, currentPath)
    if (itemScore > bestScore) {
      bestScore = itemScore
      bestTrail = trail
    }

    if (item.children?.length) {
      const childTrail = findBreadcrumbTrail(item.children, currentPath, trail)
      const childLast = childTrail[childTrail.length - 1]
      if (!childLast) continue

      const childScore = getPathScore(childLast.path, currentPath)
      if (childScore > bestScore || (childScore === bestScore && childTrail.length > bestTrail.length)) {
        bestScore = childScore
        bestTrail = childTrail
      }
    }
  }

  return bestTrail
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const currentPath = normalizePath(route.path)
  if (currentPath === '/dashboard' || currentPath === '/') {
    return [{ label: dashboardTitle.value }]
  }

  const trail = findBreadcrumbTrail(navigation, currentPath)
  const extras = breadcrumbExtras.value.length ? breadcrumbExtras.value : hotelRouteExtras.value

  if (!trail.length) {
    if (!extras.length) return [{ label: pageTitle.value }]
    return extras.map((item, index) => ({
      label: item.label,
      href: index < extras.length - 1 ? item.href : undefined,
    }))
  }

  const baseItems = trail.map((item, index) => ({
    label: item.name,
    href: index < trail.length - 1 || extras.length > 0 ? item.path : undefined,
  }))

  if (!extras.length) return baseItems

  return [
    ...baseItems,
    ...extras.map((item, index) => ({
      label: item.label,
      href: index < extras.length - 1 ? item.href : undefined,
    }))
  ]
})

async function onLogout() {
  await auth.apiLogout()
  await navigateTo('/auth/login')
}

const currentUserName = computed(() => auth.user?.full_name || auth.user?.name || 'User')
</script>

<template>
  <div class="min-h-svh bg-[#f3f5f9] text-[#2c2c2c]">
    <header class="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#dfe3ea] bg-white px-4 lg:px-6">
      <div class="flex items-center gap-3">
        <AtButton
          variant="ghost"
          size="icon"
          class="h-9 w-9 lg:hidden"
          aria-label="Toggle menu"
          @click="mobileMenuOpen = true"
        >
          <ChevronRight class="size-5" />
        </AtButton>
        <img src="/img/logo.svg" alt="Portal" class="h-6 w-auto" />
      </div>

      <div class="header-user-right">
        <slot name="navbar-actions" />
        <div class="header-user-name hidden md:block">
          <span class="semi-bold">{{ currentUserName }}</span>
        </div>
        <AtDropdownMenu>
          <AtDropdownMenuTrigger class="profile-dropdown-toggle" aria-label="Open user menu">
            <span class="thumbnail-wrapper d32 circular inline">
              <img src="/img/avatar-default.svg" alt="Avatar" width="32" height="32" />
            </span>
          </AtDropdownMenuTrigger>
          <AtDropdownMenuContent align="end" class="w-48">
            <AtDropdownMenuItem class="cursor-pointer text-red-600" @click="onLogout">
              <LogOut class="mr-2 size-4" />
              {{ t('common.logout') }}
            </AtDropdownMenuItem>
          </AtDropdownMenuContent>
        </AtDropdownMenu>
      </div>
    </header>

    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-20 bg-black/40 lg:hidden"
      @click="mobileMenuOpen = false"
    />

    <aside
      class="fixed left-0 top-0 z-30 h-full w-60 bg-[#2f3542] pt-14 text-[#c7ceda] transition-transform duration-200 max-lg:-translate-x-full lg:translate-x-0"
      :class="mobileMenuOpen ? 'max-lg:translate-x-0' : ''"
      aria-label="Sidebar"
    >
      <div class="flex h-14 items-center border-b border-[#232a37] bg-[#272e3b] px-5 pl-8">
        <img src="/img/logo_white.svg" alt="Portal" class="h-[22px] w-auto" />
      </div>

      <nav class="sidebar-menu h-[calc(100%-3.5rem)] overflow-y-auto">
        <ul class="menu-items">
          <li v-for="(item, index) in navigation" :key="item.path" :class="index === 0 ? 'm-t-30' : ''">
            <div
              v-if="hasChildren(item)"
              class="menu-parent"
              :class="isActive(item.path) || isAnyChildActive(item) ? 'open active' : ''"
            >
              <NuxtLink
                :to="item.path"
                class="menu-link"
                @click="mobileMenuOpen = false"
              >
                <span class="title">{{ item.name }}</span>
              </NuxtLink>
              <span class="icon-thumbnail">
                <component :is="item.icon" class="size-3.5" />
              </span>
              <button
                type="button"
                class="arrow-button"
                :aria-label="isParentExpanded(item.path) ? 'Collapse menu' : 'Expand menu'"
                @click="toggleParent(item.path)"
              >
                <ChevronDown v-if="isParentExpanded(item.path)" class="size-4" />
                <ChevronRight v-else class="size-4" />
              </button>
            </div>

            <NuxtLink
              v-else
              :to="item.path"
              class="menu-link"
              :class="isActive(item.path) ? 'active' : ''"
              @click="mobileMenuOpen = false"
            >
              <span class="title">{{ item.name }}</span>
              <span class="icon-thumbnail">
                <component :is="item.icon" class="size-3.5" />
              </span>
            </NuxtLink>

            <ul v-if="item.children?.length && isParentExpanded(item.path)" class="sub-menu">
              <li v-for="child in item.children" :key="child.path">
                <NuxtLink
                  :to="child.path"
                  class="sub-link"
                  :class="isActive(child.path) ? 'active' : ''"
                  @click="mobileMenuOpen = false"
                >
                  <span class="title">{{ child.name }}</span>
                  <span class="icon-thumbnail sub-icon">
                    <component :is="child.icon" class="size-3" />
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex overflow-hidden pt-14">
      <div class="flex min-h-[calc(100svh-3.5rem)] w-full flex-1 flex-col bg-[#f3f5f9] lg:ml-60">
        <main class="flex-1">
          <div class="border-b border-[#e6e9ef] bg-white/80 px-4 py-3 md:px-6">
            <BreadcrumbNav :items="breadcrumbs" class="text-xs text-slate-500" />
          </div>

          <div class="px-4 py-4 md:px-6 md:py-6">
            <slot />
          </div>
        </main>

        <footer class="border-t border-[#e5e8ef] bg-white px-4 py-3 md:px-6">
          <div class="flex items-center justify-center gap-2">
            <img src="/img/logo.svg" alt="Portal" class="h-4 w-auto" />
            <span>Mairy Portal</span>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-menu {
  height: calc(100% - 10px);
}

.menu-items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-items > li {
  display: block;
  clear: right;
}

.m-t-30 {
  margin-top: 30px;
}

.menu-link {
  display: inline-block;
  width: 100%;
  min-height: 40px;
  line-height: 40px;
  padding-left: 32px;
  font-size: 14px;
  color: #c7ceda;
}

.menu-link .title {
  float: left;
  width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-link:hover,
.menu-parent:hover .menu-link,
.menu-link.active,
.menu-parent.active .menu-link {
  color: #ffffff;
}

.menu-parent.open,
.menu-parent.active,
.menu-link.active {
  background: #3a4254;
}

.icon-thumbnail {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  line-height: 40px;
  float: right;
  margin-right: 14px;
  color: #aab4c5;
}

.menu-parent:hover .icon-thumbnail,
.menu-parent.active .icon-thumbnail,
.menu-link.active .icon-thumbnail {
  color: #ffffff;
}

.arrow-button {
  margin-right: 8px;
  display: inline-flex;
  height: 40px;
  width: 24px;
  align-items: center;
  justify-content: center;
  color: #aab4c5;
}

.sub-menu {
  list-style: none;
  margin: 0 0 10px 0;
  padding: 18px 0 10px 0;
  background: #272e3b;
}

.sub-menu > li {
  margin-top: 1px;
  padding: 0 20px 0 40px;
}

.sub-link {
  display: inline-block;
  width: 100%;
  padding: 5px 0;
  font-size: 13px;
  color: #c7ceda;
}

.sub-link .title {
  float: left;
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sub-link:hover,
.sub-link.active {
  color: #ffffff;
}

.sub-icon {
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin-right: 0;
}

.header-user-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-user-name {
  padding-right: 10px;
  font-size: 14px;
  color: #626262;
  line-height: 12px;
}

.semi-bold {
  font-weight: 600;
}

.profile-dropdown-toggle {
  background: transparent;
  border: 0;
  padding: 0;
}

.thumbnail-wrapper {
  display: inline-block;
  overflow: hidden;
  width: 32px;
  height: 32px;
}

.thumbnail-wrapper.circular {
  border-radius: 9999px;
}

.thumbnail-wrapper > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>