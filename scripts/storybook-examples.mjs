/**
 * Optional override: example args/slots/templates per component.
 * Key = rel path without extension (e.g. "accordion/Accordion").
 * If no entry here, generate-stories uses analyze-vue-example.mjs to auto-build an example.
 *
 * - args + slot: simple default story with slot text
 * - extraImports + template: compound component; generator adds imports and uses template
 */

/**
 * @param {string} relNoExt - e.g. "accordion/Accordion"
 * @returns {{ args?: object, slot?: string } | { extraImports: string[], template: string } | undefined}
 */
export function getExample(relNoExt) {
  const key = relNoExt.replace(/\\/g, '/')
  const entry = EXAMPLES[key]
  if (!entry) return undefined
  if (entry.slot !== undefined || entry.args !== undefined) {
    return {
      args: entry.args ?? {},
      slot: entry.slot ?? ''
    }
  }
  if (entry.extraImports && entry.template) {
    return {
      extraImports: entry.extraImports,
      template: entry.template
    }
  }
  if (entry.layoutStory) {
    return { layoutStory: true }
  }
  return undefined
}

const EXAMPLES = {
  'accordion/Accordion': {
    extraImports: ['AccordionItem', 'AccordionTrigger', 'AccordionContent'],
    template: `<Component type="single" collapsible>
  <AccordionItem value="1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content for section 2.</AccordionContent>
  </AccordionItem>
</Component>`
  },
  'alert/Alert': {
    args: { variant: 'default' },
    slot: 'This is an alert message.'
  },
  'badge/Badge': {
    args: { variant: 'default' },
    slot: 'Badge'
  },
  'button/Button': {
    args: { variant: 'default', size: 'default' },
    slot: 'Button'
  },
  'card/Card': {
    args: {},
    slot: '<p class="p-4">Card content</p>'
  },
  'input/Input': {
    args: { placeholder: 'Placeholder text', type: 'text' },
    slot: ''
  },
  'label/Label': {
    args: {},
    slot: 'Label text'
  },
  'progress/Progress': {
    args: { modelValue: 60 },
    slot: ''
  },
  'separator/Separator': {
    args: {},
    slot: ''
  },
  'skeleton/Skeleton': {
    args: { class: 'h-12 w-48' },
    slot: ''
  },
  'switch/Switch': {
    args: {},
    slot: ''
  },
  'textarea/Textarea': {
    args: { placeholder: 'Type here...' },
    slot: ''
  },

  // Molecules – containment
  'containment/ConfirmDialog': {
    args: { open: true, title: 'Confirm', description: 'Do you want to continue?', confirmLabel: 'OK', cancelLabel: 'Cancel' },
    slot: ''
  },
  'containment/CardWithActions': {
    args: { title: 'Card title' },
    slot: '<p>Card body content.</p>'
  },
  'containment/Sheet': {
    args: { elevation: 1 },
    slot: '<p class="p-4">Sheet content</p>'
  },
  'containment/ListItem': {
    args: { title: 'Item title', subtitle: 'Optional subtitle' },
    slot: ''
  },

  // Molecules – data-display
  'data-display/EmptyState': {
    args: { title: 'No items', description: 'Nothing to show here.' },
    slot: ''
  },
  'data-display/DataIterator': {
    args: { page: 1, pageSize: 10, total: 25, items: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] },
    slot: '<p>Items list (use slot props in app)</p>'
  },
  'data-display/SimpleTable': {
    args: {
      columns: [{ key: 'name', label: 'Name' }, { key: 'score', label: 'Score' }],
      items: [{ name: 'Alice', score: 100 }, { name: 'Bob', score: 90 }]
    },
    slot: ''
  },
  'data-display/SparklineBars': {
    args: { data: [10, 40, 30, 60, 20], height: 32 },
    slot: ''
  },
  'data-display/ConfirmEdit': {
    args: { modelValue: 'Editable text', placeholder: 'Edit...' },
    slot: ''
  },

  // Molecules – selection
  'selection/ButtonGroupSelect': {
    args: {
      modelValue: 'a',
      options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]
    },
    slot: ''
  },
  'selection/ChipGroupSelect': {
    args: {
      modelValue: 'a',
      options: [{ value: 'a', label: 'Chip A' }, { value: 'b', label: 'Chip B' }]
    },
    slot: ''
  },
  'selection/Window': {
    args: { modelValue: 'one', panels: ['one', 'two'] },
    slot: ''
  },
  'selection/StepperNav': {
    args: {
      modelValue: 0,
      steps: [{ id: '1', label: 'Step 1' }, { id: '2', label: 'Step 2' }]
    },
    slot: ''
  },

  // Molecules – pickers
  'pickers/DatePickerField': {
    args: {},
    slot: ''
  },
  'pickers/TimePickerField': {
    args: { label: 'Time', modelValue: '14:30' },
    slot: ''
  },

  // Molecules – feedback
  'feedback/AlertDismissible': {
    args: { variant: 'default' },
    slot: 'Dismissible alert message.'
  },
  'feedback/ProgressBar': {
    args: { modelValue: 0.6, label: 'Progress', showValue: true },
    slot: ''
  },
  'feedback/Banner': {
    args: { title: 'Banner message', visible: true },
    slot: ''
  },
  'feedback/SkeletonCard': {
    args: {},
    slot: ''
  },

  // Molecules – navigation
  'navigation/AppBar': {
    args: { title: 'App title' },
    slot: ''
  },
  'navigation/PaginationBar': {
    args: { page: 2, totalPages: 5 },
    slot: ''
  },
  'navigation/BottomNav': {
    args: {
      modelValue: 'home',
      items: [{ value: 'home', label: 'Home' }, { value: 'settings', label: 'Settings' }]
    },
    slot: ''
  },
  'navigation/TabsNav': {
    args: {
      modelValue: 'tab1',
      tabs: [{ value: 'tab1', label: 'Tab 1' }, { value: 'tab2', label: 'Tab 2' }]
    },
    slot: ''
  },

  // Molecules – form
  'form/FormField': {
    args: { label: 'Field label', name: 'field1' },
    slot: '<input type="text" class="flex h-10 w-full rounded-md border px-3" placeholder="Control" />'
  },
  'form/SearchInput': {
    args: { placeholder: 'Search...' },
    slot: ''
  },
  'form/NumberInputField': {
    args: { label: 'Number', modelValue: 42 },
    slot: ''
  },
  'form/AutocompleteField': {
    args: {
      modelValue: 'a',
      placeholder: 'Search...',
      options: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]
    },
    slot: ''
  },
  'form/ComboboxField': {
    args: {
      modelValue: '',
      placeholder: 'Type or select...',
      options: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]
    },
    slot: ''
  },
  'form/FileInputField': {
    args: { label: 'Upload file', accept: 'image/*' },
    slot: ''
  },
  'form/OtpInputField': {
    args: { label: 'Code', digits: 6 },
    slot: ''
  },
  'form/SliderField': {
    args: { label: 'Amount', modelValue: 50, min: 0, max: 100 },
    slot: ''
  },
  'form/RangeSliderField': {
    args: { label: 'Range', modelValue: [20, 80], min: 0, max: 100 },
    slot: ''
  },
  'form/TimeRangeField': {
    args: { label: 'Khoảng giờ', modelValue: { start: '09:00', end: '17:00' }, format: 'h:m' },
    slot: ''
  },
  'form/DateTimeRangeField': {
    args: {
      modelValue: { start: '2025-01-01T09:00:00', end: '2025-01-02T17:30:00' },
      labelStart: 'Từ',
      labelEnd: 'Đến',
      timeFormat: 'h:m'
    },
    slot: ''
  },
  'form/SwitchField': {
    args: { label: 'Enable', modelValue: false },
    slot: ''
  },
  'form/SearchForm': {
    args: {
      filters: [
        { name: 'q', label: 'Keyword', type: 'text_field', placeholder: 'Search...' },
        { name: 'status', label: 'Status', type: 'select', data: [{ id: '1', name: 'Active' }, { id: '0', name: 'Inactive' }] }
      ]
    },
    slot: ''
  },
  'form/MultipleSelectField': {
    args: {
      modelValue: [],
      placeholder: 'Select...',
      options: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]
    },
    slot: ''
  },

  // Organisms – layout (need navigation + isActive in setup, not JSON args)
  'layout/OrJustboilSidebar': { layoutStory: true },
  'layout/OrJustboilNavbar': { layoutStory: true },
  'layout/OrMinimalSidebar': { layoutStory: true },
  'layout/OrMinimalNavbar': { layoutStory: true },
  'layout/OrShadcnSidebar': { layoutStory: true },
  'layout/OrShadcnNavbar': { layoutStory: true },
  'layout/windster/OrWindsterSidebar': { layoutStory: true },
  'layout/windster/OrWindsterNavbar': { layoutStory: true },
  // Organisms
  'AppShell': {
    args: { title: 'App', showSystemBar: false, showFooter: true },
    slot: '<p class="p-4">Main content</p>'
  },
  'FormCard': {
    args: { title: 'Edit', submitLabel: 'Save', cancelLabel: 'Cancel' },
    slot: '<p class="text-sm text-muted-foreground">Form fields go here.</p>'
  },
  'DataTablePage': {
    args: {
      title: 'Users',
      columns: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }],
      items: [{ name: 'Alice', email: 'a@x.com' }, { name: 'Bob', email: 'b@x.com' }]
    },
    slot: ''
  },
  'ListPage': {
    args: { title: 'Items' },
    slot: '<p class="px-4 py-2">List items slot</p>'
  },
  'EmptyPage': {
    args: { title: 'No data', description: 'Nothing here yet.' },
    slot: ''
  },
  'AuthCard': {
    args: { title: 'Sign in', submitLabel: 'Login' },
    slot: '<MoFormField label="Email" /><MoFormField label="Password" />'
  },
  'SidebarLayout': {
    args: { sidebarWidth: '16rem' },
    slot: '<p class="p-4">Main</p>'
  },
  'DataListPage': {
    args: {
      title: 'Users',
      filters: [
        { name: 'q', label: 'Keyword', type: 'text_field' },
        { name: 'status', label: 'Status', type: 'select', data: [{ value: 'active', name: 'Active' }, { value: 'inactive', name: 'Inactive' }] }
      ],
      columns: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }],
      items: [{ name: 'Alice', email: 'a@x.com' }, { name: 'Bob', email: 'b@x.com' }]
    },
    slot: ''
  },

  // Molecules – layout
  'layout/Container': {
    args: {},
    slot: '<p class="p-4">Container content</p>'
  },
  'layout/Row': {
    args: {},
    slot: '<div class="col-span-12">Row content</div>'
  }
}

export { EXAMPLES }
