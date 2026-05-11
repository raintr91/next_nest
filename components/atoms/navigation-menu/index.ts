import { cva } from 'class-variance-authority'

export { default as NavigationMenu } from '~/components/atoms/navigation-menu/NavigationMenu.vue'
export { default as NavigationMenuContent } from '~/components/atoms/navigation-menu/NavigationMenuContent.vue'
export { default as NavigationMenuIndicator } from '~/components/atoms/navigation-menu/NavigationMenuIndicator.vue'
export { default as NavigationMenuItem } from '~/components/atoms/navigation-menu/NavigationMenuItem.vue'
export { default as NavigationMenuLink } from '~/components/atoms/navigation-menu/NavigationMenuLink.vue'
export { default as NavigationMenuList } from '~/components/atoms/navigation-menu/NavigationMenuList.vue'
export { default as NavigationMenuTrigger } from '~/components/atoms/navigation-menu/NavigationMenuTrigger.vue'
export { default as NavigationMenuViewport } from '~/components/atoms/navigation-menu/NavigationMenuViewport.vue'

export const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
)
