/**
 * Analyzes Vue SFC and sibling components to auto-generate Storybook example
 * (args/slot or compound template). Used when no manual example in storybook-examples.mjs.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Extract props from script: look for defineProps<{ ... }> and pull prop names + optional type hint.
 * @param {string} script
 * @returns {{ name: string, optional: boolean, typeHint: string }[]}
 */
function extractPropsFromScript(script) {
  const props = []
  // Match defineProps<{ ... }> - allow nested braces one level (e.g. class?: HTMLAttributes['class'])
  const defineMatch = script.match(/defineProps\s*<\s*\{([\s\S]*?)\}\s*>/)
  if (!defineMatch) return props
  const block = defineMatch[1]
  // Match prop name (identifier or quoted) and optional ? and type (identifier or union)
  const re = /(\w+)\s*(\?)?\s*:\s*([^,}\n]+)/g
  let m
  while ((m = re.exec(block)) !== null) {
    const typeHint = m[3].trim().replace(/\s+/g, ' ')
    props.push({ name: m[1], optional: m[2] === '?', typeHint })
  }
  return props
}

/**
 * Heuristic default value for a prop for storybook.
 * @param {{ name: string, optional: boolean, typeHint: string }} prop
 * @param {string} componentName
 * @returns {unknown}
 */
function defaultForProp(prop, componentName) {
  const name = prop.name
  const t = prop.typeHint.toLowerCase()
  if (name === 'class') return undefined
  if (name === 'placeholder') return 'Placeholder...'
  if (name === 'variant' && (t.includes('variant') || t.includes('string'))) return 'default'
  if (name === 'size' && (t.includes('size') || t.includes('string'))) return 'default'
  if (name === 'type') return t.includes('button') ? 'button' : 'text'
  if (name === 'disabled') return false
  if (name === 'modelValue') {
    if (t.includes('number')) return 50
    return ''
  }
  if (name === 'value') return undefined
  if (t.includes('string')) return name === 'placeholder' ? '...' : ''
  if (t.includes('number')) return 0
  if (t.includes('boolean')) return false
  return undefined
}

/**
 * Build args object from extracted props (only include props we can set sensibly).
 */
function buildDefaultArgs(propList, componentName) {
  const args = {}
  for (const prop of propList) {
    const val = defaultForProp(prop, componentName)
    if (val !== undefined) args[prop.name] = val
  }
  if (componentName === 'Skeleton' && !('class' in args)) args.class = 'h-12 w-48'
  if (componentName === 'Progress' && !('modelValue' in args)) args.modelValue = 60
  return args
}

/**
 * Check if SFC template has default slot.
 * @param {string} content - full SFC content
 */
function hasDefaultSlot(content) {
  const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/)
  if (!templateMatch) return false
  return /<slot(\s|>|\/)/.test(templateMatch[1])
}

/**
 * Get display name for slot (e.g. "Button" from "Button.vue").
 */
function slotDisplayName(componentBasename) {
  if (!componentBasename) return 'Content'
  return componentBasename
}

/**
 * Known compound roots: root component basename -> list of sibling basenames (children that need root context).
 * Used to skip generating standalone stories for child-only components (they would throw "inject RootContext" at runtime).
 */
const COMPOUND_CHILDREN = {
  Accordion: ['AccordionItem', 'AccordionTrigger', 'AccordionContent'],
  Alert: ['AlertDescription', 'AlertTitle'],
  AlertDialog: ['AlertDialogTrigger', 'AlertDialogContent', 'AlertDialogHeader', 'AlertDialogTitle', 'AlertDialogDescription', 'AlertDialogFooter', 'AlertDialogAction', 'AlertDialogCancel'],
  Avatar: ['AvatarImage', 'AvatarFallback'],
  Breadcrumb: ['BreadcrumbList', 'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbSeparator', 'BreadcrumbPage'],
  Card: ['CardHeader', 'CardTitle', 'CardContent', 'CardDescription', 'CardFooter'],
  Carousel: ['CarouselContent', 'CarouselItem', 'CarouselNext', 'CarouselPrevious'],
  Calendar: ['CalendarCell', 'CalendarCellTrigger', 'CalendarGrid', 'CalendarGridBody', 'CalendarGridHead', 'CalendarGridRow', 'CalendarHeadCell', 'CalendarHeader', 'CalendarHeading', 'CalendarNextButton', 'CalendarPrevButton'],
  Collapsible: ['CollapsibleTrigger', 'CollapsibleContent'],
  Command: ['CommandDialog', 'CommandEmpty', 'CommandGroup', 'CommandInput', 'CommandItem', 'CommandList', 'CommandSeparator', 'CommandShortcut'],
  ContextMenu: ['ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuItem', 'ContextMenuCheckboxItem', 'ContextMenuGroup', 'ContextMenuLabel', 'ContextMenuPortal', 'ContextMenuRadioGroup', 'ContextMenuRadioItem', 'ContextMenuSeparator', 'ContextMenuShortcut', 'ContextMenuSub', 'ContextMenuSubContent', 'ContextMenuSubTrigger'],
  Dialog: ['DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogDescription', 'DialogFooter', 'DialogClose', 'DialogScrollContent'],
  Drawer: ['DrawerContent', 'DrawerDescription', 'DrawerFooter', 'DrawerHeader', 'DrawerOverlay', 'DrawerTitle'],
  DropdownMenu: ['DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuCheckboxItem', 'DropdownMenuGroup', 'DropdownMenuLabel', 'DropdownMenuRadioGroup', 'DropdownMenuRadioItem', 'DropdownMenuSeparator', 'DropdownMenuShortcut', 'DropdownMenuSub', 'DropdownMenuSubContent', 'DropdownMenuSubTrigger'],
  FormItem: ['FormLabel', 'FormControl', 'FormDescription', 'FormMessage'],
  HoverCard: ['HoverCardTrigger', 'HoverCardContent'],
  Menubar: ['MenubarMenu', 'MenubarTrigger', 'MenubarContent', 'MenubarItem', 'MenubarCheckboxItem', 'MenubarGroup', 'MenubarLabel', 'MenubarRadioGroup', 'MenubarRadioItem', 'MenubarSeparator', 'MenubarShortcut', 'MenubarSub', 'MenubarSubContent', 'MenubarSubTrigger'],
  NavigationMenu: ['NavigationMenuList', 'NavigationMenuItem', 'NavigationMenuLink', 'NavigationMenuTrigger', 'NavigationMenuContent', 'NavigationMenuIndicator', 'NavigationMenuViewport'],
  NumberField: ['NumberFieldContent', 'NumberFieldDecrement', 'NumberFieldIncrement', 'NumberFieldInput'],
  Pagination: ['PaginationFirst', 'PaginationPrev', 'PaginationNext', 'PaginationLast', 'PaginationEllipsis'],
  PinInput: ['PinInputGroup', 'PinInputInput', 'PinInputSeparator'],
  Popover: ['PopoverTrigger', 'PopoverContent'],
  RadioGroup: ['RadioGroupItem'],
  RangeCalendar: ['RangeCalendarCell', 'RangeCalendarCellTrigger', 'RangeCalendarGrid', 'RangeCalendarGridBody', 'RangeCalendarGridHead', 'RangeCalendarGridRow', 'RangeCalendarHeadCell', 'RangeCalendarHeader', 'RangeCalendarHeading', 'RangeCalendarNextButton', 'RangeCalendarPrevButton'],
  ResizablePanelGroup: ['ResizableHandle'],
  ScrollArea: ['ScrollBar'],
  Select: ['SelectTrigger', 'SelectContent', 'SelectItem', 'SelectValue', 'SelectSeparator', 'SelectScrollUpButton', 'SelectScrollDownButton', 'SelectLabel', 'SelectItemText', 'SelectGroup'],
  Sheet: ['SheetTrigger', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription', 'SheetFooter', 'SheetClose'],
  SidebarProvider: ['Sidebar', 'SidebarContent', 'SidebarFooter', 'SidebarGroup', 'SidebarGroupAction', 'SidebarGroupContent', 'SidebarGroupLabel', 'SidebarHeader', 'SidebarInput', 'SidebarInset', 'SidebarMenu', 'SidebarMenuAction', 'SidebarMenuBadge', 'SidebarMenuButton', 'SidebarMenuButtonChild', 'SidebarMenuItem', 'SidebarMenuSkeleton', 'SidebarMenuSub', 'SidebarMenuSubButton', 'SidebarMenuSubItem', 'SidebarRail', 'SidebarSeparator', 'SidebarTrigger'],
  Stepper: ['StepperItem', 'StepperTrigger', 'StepperTitle', 'StepperDescription', 'StepperSeparator', 'StepperIndicator'],
  Table: ['TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell', 'TableCaption', 'TableEmpty', 'TableFooter'],
  Tabs: ['TabsList', 'TabsTrigger', 'TabsContent'],
  TagsInput: ['TagsInputInput', 'TagsInputItem', 'TagsInputItemDelete', 'TagsInputItemText'],
  ToastProvider: ['Toast', 'ToastViewport', 'ToastTitle', 'ToastDescription', 'ToastClose', 'ToastAction'],
  ToggleGroup: ['ToggleGroupItem'],
  Tooltip: ['TooltipTrigger', 'TooltipContent']
}

/**
 * Minimal template for compound components (one item / one tab / one row).
 */
const COMPOUND_TEMPLATES = {
  Accordion: (Component, AccordionItem, AccordionTrigger, AccordionContent) =>
    `<Component type="single" collapsible>
  <AccordionItem value="1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content for section 2.</AccordionContent>
  </AccordionItem>
</Component>`,
  Tabs: (Component, TabsList, TabsTrigger, TabsContent) =>
    `<Component default-value="tab1">
  <TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger><TabsTrigger value="tab2">Tab 2</TabsTrigger></TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Component>`,
  Card: (Component, CardHeader, CardTitle, CardContent, CardFooter) =>
    `<Component>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent><p>Card content</p></CardContent>
  <CardFooter>Footer</CardFooter>
</Component>`,
  Select: (Component, SelectTrigger, SelectContent, SelectItem) =>
    `<Component>
  <SelectTrigger><span>Select...</span></SelectTrigger>
  <SelectContent><SelectItem value="a">A</SelectItem><SelectItem value="b">B</SelectItem></SelectContent>
</Component>`,
  Collapsible: (Component, CollapsibleTrigger, CollapsibleContent) =>
    `<Component>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Component>`,
  Table: (Component, TableHeader, TableBody, TableRow, TableHead, TableCell) =>
    `<Component>
  <TableHeader><TableRow><TableHead>Col 1</TableHead><TableHead>Col 2</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>A</TableCell><TableCell>B</TableCell></TableRow></TableBody>
</Component>`,
  ToggleGroup: (Component, ToggleGroupItem) =>
    `<Component type="single"><ToggleGroupItem value="a">A</ToggleGroupItem><ToggleGroupItem value="b">B</ToggleGroupItem></Component>`,
  RadioGroup: (Component, RadioGroupItem) =>
    `<Component><RadioGroupItem value="one">One</RadioGroupItem><RadioGroupItem value="two">Two</RadioGroupItem></Component>`,
  Breadcrumb: (Component, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage) =>
    `<Component><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator/><BreadcrumbItem><BreadcrumbPage>Page</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Component>`,
  Avatar: (Component, AvatarImage, AvatarFallback) =>
    `<Component><AvatarImage src="https://github.com/shadcn.png" alt="Avatar" /><AvatarFallback>CN</AvatarFallback></Component>`
}

/**
 * Build compound example if this component is a known root and all children exist in siblingBasenames.
 * @param {string} componentBasename - e.g. "Accordion"
 * @param {string[]} siblingBasenames - e.g. ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"]
 * @returns {{ extraImports: string[], template: string } | null}
 */
function buildCompoundExample(componentBasename, siblingBasenames) {
  const children = COMPOUND_CHILDREN[componentBasename]
  if (!children) return null
  const set = new Set(siblingBasenames)
  const have = children.filter((c) => set.has(c))
  if (have.length === 0) return null
  const templateFn = COMPOUND_TEMPLATES[componentBasename]
  if (typeof templateFn !== 'function') return null
  const placeholders = ['Component', ...have]
  try {
    const template = templateFn(...placeholders)
    return { extraImports: have, template }
  } catch {
    return null
  }
}

/**
 * Analyze Vue file and sibling list to produce an example.
 * @param {object} opts
 * @param {string} opts.filePath - absolute path to the .vue file
 * @param {string} opts.content - file content (to avoid re-read)
 * @param {string} opts.relNoExt - e.g. "accordion/Accordion"
 * @param {string[]} opts.siblingVueBasenames - e.g. ["Accordion", "AccordionItem", ...]
 * @returns {{ args?: object, slot?: string } | { extraImports: string[], template: string } | null}
 */
export function buildAutoExample({ filePath, content, relNoExt, siblingVueBasenames }) {
  const componentBasename = path.basename(relNoExt.replace(/\\/g, '/'))
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  const script = scriptMatch ? scriptMatch[1] : ''
  const propList = extractPropsFromScript(script)
  const hasSlot = hasDefaultSlot(content)

  // 1) Compound: same folder has known root + children
  const compound = buildCompoundExample(componentBasename, siblingVueBasenames)
  if (compound) return compound

  // 2) Simple: args from props + slot if present
  const args = buildDefaultArgs(propList, componentBasename)
  const slot = hasSlot ? slotDisplayName(componentBasename) : ''
  // Always return at least something so story has "shape"
  return { args, slot }
}

/**
 * Read sibling .vue basenames (no extension) in the same directory.
 * @param {string} dirPath - absolute path to directory
 * @returns {Promise<string[]>}
 */
export async function getSiblingVueBasenames(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.vue') && e.name !== 'index.vue')
    .map((e) => e.name.replace(/\.vue$/i, ''))
}

/**
 * True if this component is a "child only" of a compound (needs root context); standalone story would throw at runtime.
 * @param {string} componentBasename - e.g. "AccordionTrigger"
 * @param {string[]} siblingVueBasenames - e.g. ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"]
 * @returns {boolean}
 */
export function isCompoundChildOnly(componentBasename, siblingVueBasenames) {
  const set = new Set(siblingVueBasenames)
  for (const [root, children] of Object.entries(COMPOUND_CHILDREN)) {
    if (!set.has(root) || root === componentBasename) continue
    if (children.includes(componentBasename)) return true
  }
  return false
}
