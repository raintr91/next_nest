import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join, relative, sep } from 'node:path'
import process from 'node:process'

const root = process.cwd()
const componentsDir = join(root, 'components')
const storyRoots = ['ui', 'molecules', 'organisms'].map((dir) => join(componentsDir, dir))
const outputDir = join(root, 'stories', 'auto')
const force = process.argv.includes('--force')

const ignoredDirNames = new Set(['node_modules', '.nuxt', '.output', 'dist', '.data', '.nitro', '.cache', '.git'])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

    for (const entry of entries) {
      if (entry.isDirectory()) {
      if (ignoredDirNames.has(entry.name)) continue
      files.push(...await walk(join(dir, entry.name)))
      continue
    }

    if (entry.isFile() && extname(entry.name) === '.vue') {
      files.push(join(dir, entry.name))
    }
  }

  return files
}

function storyName(filePath) {
  return relative(componentsDir, filePath)
    .replace(/\.vue$/, '')
    .split(sep)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('__')
}

function componentAlias(filePath) {
  return `@/${relative(root, filePath).split(sep).join('/')}`
}

function storyTitle(filePath) {
  return relative(componentsDir, filePath).replace(/\.vue$/, '').split(sep).join('/')
}

function sampleForProp(name) {
  const samples = {
    title: 'Portal component',
    description: 'Generated Storybook preview',
    label: 'Label',
    name: 'fieldName',
    placeholder: 'Type here...',
    error: '',
    testId: 'storybook-component',
    endpoint: '/api/work-orders',
    requestPath: undefined,
    method: 'GET',
    value: 'sample',
    defaultValue: 'sample',
    src: 'https://placehold.co/64x64',
    alt: 'Avatar',
    ratio: 16 / 9,
    index: 0,
    type: 'button',
    variant: 'default',
    size: 'default',
    side: 'bottom',
    align: 'center',
    searchPlaceholder: 'Search...',
    submitLabel: 'Save',
    cancelLabel: 'Cancel',
    loading: false,
    pending: false,
    visible: true,
    open: true,
    disabled: false,
    required: false,
    page: 1,
    defaultPage: 1,
    totalPages: 3,
    pageSize: 10,
    itemsPerPage: 10,
    total: 24,
    totalRecords: 24,
    columns: [
      { key: 'name', title: 'Name', label: 'Name', sortable: true },
      { key: 'status', title: 'Status', label: 'Status', sortable: true }
    ],
    items: [
      { name: 'Portal Base', status: 'Active' },
      { name: 'Auth Flow', status: 'Ready' }
    ],
    searchKeys: ['name', 'status'],
    filters: [
      { name: 'keyword', label: 'Keyword', type: 'text_field', placeholder: 'Search...' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        placeholder: 'Select status',
        data: [
          { value: 'active', label: 'Active' },
          { value: 'ready', label: 'Ready' }
        ]
      }
    ],
    options: [
      { value: 'active', label: 'Active' },
      { value: 'ready', label: 'Ready' }
    ],
    modelValue: 'Sample value'
  }

  return Object.prototype.hasOwnProperty.call(samples, name) ? samples[name] : undefined
}

function storyParts(filePath) {
  const parts = relative(componentsDir, filePath).split(sep)
  return {
    section: parts[0],
    group: parts[1],
    componentName: parts.at(-1).replace(/\.vue$/, '')
  }
}

function extractPropNames(source) {
  const propNames = new Set()
  const propBlocks = source.matchAll(/defineProps\s*<\s*\{([\s\S]*?)\}\s*>\s*\(/g)
  for (const block of propBlocks) {
    for (const prop of block[1].matchAll(/^\s*([A-Za-z_$][\w$]*)\??\s*:/gm)) {
      propNames.add(prop[1])
    }
  }

  return [...propNames]
}

function componentArgNames(filePath) {
  const { group, componentName } = storyParts(filePath)
  const names = []

  if (/Item|Trigger|Content/.test(componentName) && ['select', 'tabs', 'accordion', 'radio-group', 'toggle-group'].includes(group)) {
    names.push('value')
  }
  if (componentName === 'Pagination') names.push('total', 'itemsPerPage', 'defaultPage')
  if (componentName === 'AspectRatio') names.push('ratio')
  if (componentName === 'AvatarImage') names.push('src', 'alt')
  if (componentName === 'PinInputSlot') names.push('index')
  if (componentName === 'Button') names.push('type', 'variant', 'size')
  if (componentName === 'Badge') names.push('variant')

  return names
}

function buildArgs(source, filePath) {
  const { componentName } = storyParts(filePath)
  const args = {}
  for (const name of [...extractPropNames(source), ...componentArgNames(filePath)]) {
    const sample = sampleForProp(name)
    if (sample !== undefined) args[name] = sample
  }

  if (componentName === 'ActionsMenu') {
    args.items = [
      { label: 'Edit' },
      { label: 'Archive' },
      { label: 'Delete', disabled: true }
    ]
  }
  if (componentName === 'ChartCrosshair') {
    args.colors = ['hsl(var(--primary))']
    args.index = 'date'
    args.items = [{ name: 'value', color: 'hsl(var(--primary))' }]
  }
  if (componentName === 'ChartSingleTooltip') {
    args.selector = '.story-line'
    args.index = 'date'
    args.items = [{ name: 'value', color: 'hsl(var(--primary))' }]
  }

  return args
}

function storyImports(filePath) {
  const { group } = storyParts(filePath)
  const imports = []

  if (group === 'sidebar') imports.push("import { SidebarProvider } from '@/components/ui/sidebar/index'")
  if (group === 'form') imports.push("import { FormItem } from '@/components/ui/form/index'")
  if (group === 'alert-dialog') imports.push("import { AlertDialog } from '@/components/ui/alert-dialog/index'")
  if (group === 'calendar') imports.push("import { Calendar } from '@/components/ui/calendar/index'")
  if (group === 'chart') imports.push("import { VisLine, VisXYContainer } from '@unovis/vue'")
  if (group === 'context-menu') imports.push("import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu/index'")
  if (group === 'dialog') imports.push("import { Dialog } from '@/components/ui/dialog/index'")
  if (group === 'drawer') imports.push("import { Drawer } from '@/components/ui/drawer/index'")
  if (group === 'menubar') imports.push("import { Menubar, MenubarContent, MenubarMenu, MenubarSub, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar/index'")
  if (group === 'navigation-menu') imports.push("import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu/index'")
  if (group === 'sheet') imports.push("import { Sheet } from '@/components/ui/sheet/index'")
  if (group === 'popover') imports.push("import { Popover } from '@/components/ui/popover/index'")
  if (group === 'hover-card') imports.push("import { HoverCard } from '@/components/ui/hover-card/index'")
  if (group === 'select') imports.push("import { Select, SelectContent, SelectItem } from '@/components/ui/select/index'")
  if (group === 'dropdown-menu') imports.push("import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu/index'")
  if (group === 'tabs') imports.push("import { Tabs } from '@/components/ui/tabs/index'")
  if (group === 'tooltip') imports.push("import { TooltipProvider, Tooltip } from '@/components/ui/tooltip/index'")

  return imports.length ? `\n${imports.join('\n')}` : ''
}

function storyComponents(filePath) {
  const { group } = storyParts(filePath)
  const components = ['StoryComponent']

  if (group === 'sidebar') components.push('SidebarProvider')
  if (group === 'form') components.push('FormItem')
  if (group === 'alert-dialog') components.push('AlertDialog')
  if (group === 'calendar') components.push('Calendar')
  if (group === 'chart') components.push('VisLine', 'VisXYContainer')
  if (group === 'context-menu') components.push('ContextMenu', 'ContextMenuTrigger')
  if (group === 'dialog') components.push('Dialog')
  if (group === 'drawer') components.push('Drawer')
  if (group === 'menubar') components.push('Menubar', 'MenubarContent', 'MenubarMenu', 'MenubarSub', 'MenubarSubTrigger', 'MenubarTrigger')
  if (group === 'navigation-menu') components.push('NavigationMenu', 'NavigationMenuItem', 'NavigationMenuList')
  if (group === 'sheet') components.push('Sheet')
  if (group === 'popover') components.push('Popover')
  if (group === 'hover-card') components.push('HoverCard')
  if (group === 'select') components.push('Select', 'SelectContent', 'SelectItem')
  if (group === 'dropdown-menu') components.push('DropdownMenu', 'DropdownMenuContent', 'DropdownMenuTrigger')
  if (group === 'tabs') components.push('Tabs')
  if (group === 'tooltip') components.push('TooltipProvider', 'Tooltip')

  return components.join(', ')
}

function storySetupBindings(filePath) {
  const { group } = storyParts(filePath)
  if (group !== 'chart') return 'args'

  return `args,
        chartData: [
          { date: 'Jan', value: 10 },
          { date: 'Feb', value: 18 },
          { date: 'Mar', value: 14 }
        ],
        chartX: (d) => d.date,
        chartY: (d) => d.value`
}

function storyTemplate(filePath) {
  const { group, componentName } = storyParts(filePath)
  const slot = '<span class="text-sm text-muted-foreground">Generated preview content</span>'

  if (componentName === 'ActionsMenu') return `<StoryComponent v-bind="args"><template #trigger><button class="rounded-md border px-3 py-2 text-sm">Open actions</button></template></StoryComponent>`
  if (componentName === 'CalendarHeader') return '<Calendar />'
  if (componentName === 'MenubarSubContent') return `<Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarSub default-open><MenubarSubTrigger>More</MenubarSubTrigger><StoryComponent v-bind="args">${slot}</StoryComponent></MenubarSub></MenubarContent></MenubarMenu></Menubar>`
  if (group === 'sidebar') return `<SidebarProvider><StoryComponent v-bind="args">${slot}</StoryComponent></SidebarProvider>`
  if (group === 'form') return `<FormItem><StoryComponent v-bind="args">${slot}</StoryComponent></FormItem>`
  if (group === 'alert-dialog') return `<AlertDialog default-open><StoryComponent v-bind="args">${slot}</StoryComponent></AlertDialog>`
  if (group === 'calendar') return `<Calendar><StoryComponent v-bind="args">${slot}</StoryComponent></Calendar>`
  if (group === 'chart') return `<VisXYContainer :data="chartData" class="h-40 w-full"><VisLine class="story-line" :x="chartX" :y="chartY" /><StoryComponent v-bind="args" /></VisXYContainer>`
  if (group === 'context-menu') return `<ContextMenu><ContextMenuTrigger><div class="rounded-md border p-4 text-sm">Right click area</div></ContextMenuTrigger><StoryComponent v-bind="args">${slot}</StoryComponent></ContextMenu>`
  if (group === 'dialog') return `<Dialog default-open><StoryComponent v-bind="args">${slot}</StoryComponent></Dialog>`
  if (group === 'drawer') return `<Drawer default-open><StoryComponent v-bind="args">${slot}</StoryComponent></Drawer>`
  if (group === 'menubar') return `<Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><StoryComponent v-bind="args">${slot}</StoryComponent></MenubarMenu></Menubar>`
  if (group === 'navigation-menu') return `<NavigationMenu><NavigationMenuList><NavigationMenuItem><StoryComponent v-bind="args">${slot}</StoryComponent></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
  if (group === 'sheet') return `<Sheet default-open><StoryComponent v-bind="args">${slot}</StoryComponent></Sheet>`
  if (group === 'popover') return `<Popover default-open><StoryComponent v-bind="args">${slot}</StoryComponent></Popover>`
  if (group === 'hover-card') return `<HoverCard default-open><StoryComponent v-bind="args">${slot}</StoryComponent></HoverCard>`
  if (componentName === 'SelectItemText') return `<Select default-value="sample"><SelectContent><SelectItem value="sample"><StoryComponent v-bind="args">${slot}</StoryComponent></SelectItem></SelectContent></Select>`
  if (group === 'select') return `<Select default-value="sample"><SelectContent><StoryComponent v-bind="args">${slot}</StoryComponent></SelectContent></Select>`
  if (group === 'dropdown-menu') return `<DropdownMenu><DropdownMenuTrigger>Open menu</DropdownMenuTrigger><DropdownMenuContent><StoryComponent v-bind="args">${slot}</StoryComponent></DropdownMenuContent></DropdownMenu>`
  if (group === 'tabs') return `<Tabs default-value="sample"><StoryComponent v-bind="args">${slot}</StoryComponent></Tabs>`
  if (group === 'tooltip') return `<TooltipProvider><Tooltip><StoryComponent v-bind="args">${slot}</StoryComponent></Tooltip></TooltipProvider>`

  return `<StoryComponent v-bind="args">${slot}</StoryComponent>`
}

async function buildStory(filePath) {
  const title = storyTitle(filePath)
  const source = await readFile(filePath, 'utf8')
  const args = buildArgs(source, filePath)

  return `import StoryComponent from '${componentAlias(filePath)}'${storyImports(filePath)}

const meta = {
  title: '${title}',
  component: StoryComponent
}

export default meta

export const Default = {
  render: (args) => ({
    components: { ${storyComponents(filePath)} },
    setup() {
      return { ${storySetupBindings(filePath)} }
    },
    template: '${storyTemplate(filePath)}'
  }),
  args: ${JSON.stringify(args, null, 2)}
}
`
}

await mkdir(outputDir, { recursive: true })

const files = (await Promise.all(storyRoots.map((dir) => walk(dir)))).flat()
let written = 0

    for (const filePath of files) {
  const outPath = join(outputDir, `${storyName(filePath)}.stories.js`)
  if (!force) {
    const exists = await access(outPath).then(() => true, () => false)
    if (exists) continue
  }

  await writeFile(outPath, await buildStory(filePath))
  written++
}

console.log(`Generated ${written} Storybook stories.`)
