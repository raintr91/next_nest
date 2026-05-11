import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

export type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

const SPAN_CLASSES: Record<number, string> = {
  1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
  5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
  9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12'
}
const START_CLASSES: Record<number, string> = {
  1: 'col-start-1', 2: 'col-start-2', 3: 'col-start-3', 4: 'col-start-4',
  5: 'col-start-5', 6: 'col-start-6', 7: 'col-start-7', 8: 'col-start-8',
  9: 'col-start-9', 10: 'col-start-10', 11: 'col-start-11', 12: 'col-start-12'
}
const SM_SPAN: Record<number, string> = {
  1: 'sm:col-span-1', 2: 'sm:col-span-2', 3: 'sm:col-span-3', 4: 'sm:col-span-4',
  5: 'sm:col-span-5', 6: 'sm:col-span-6', 7: 'sm:col-span-7', 8: 'sm:col-span-8',
  9: 'sm:col-span-9', 10: 'sm:col-span-10', 11: 'sm:col-span-11', 12: 'sm:col-span-12'
}
const MD_SPAN: Record<number, string> = {
  1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4',
  5: 'md:col-span-5', 6: 'md:col-span-6', 7: 'md:col-span-7', 8: 'md:col-span-8',
  9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12'
}
const LG_SPAN: Record<number, string> = {
  1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4',
  5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7', 8: 'lg:col-span-8',
  9: 'lg:col-span-9', 10: 'lg:col-span-10', 11: 'lg:col-span-11', 12: 'lg:col-span-12'
}
const XL_SPAN: Record<number, string> = {
  1: 'xl:col-span-1', 2: 'xl:col-span-2', 3: 'xl:col-span-3', 4: 'xl:col-span-4',
  5: 'xl:col-span-5', 6: 'xl:col-span-6', 7: 'xl:col-span-7', 8: 'xl:col-span-8',
  9: 'xl:col-span-9', 10: 'xl:col-span-10', 11: 'xl:col-span-11', 12: 'xl:col-span-12'
}

export interface ColLayoutProps {
  cols?: Span
  sm?: Span
  md?: Span
  lg?: Span
  xl?: Span
  offset?: number
  class?: HTMLAttributes['class']
}

/**
 * Pure logic: compute Col class string from props. Used by Col.vue and unit tests.
 */
export function getColClasses(props: ColLayoutProps): string {
  const c: string[] = [SPAN_CLASSES[props.cols ?? 12] ?? 'col-span-12']
  if (props.sm != null) c.push(SM_SPAN[props.sm] ?? '')
  if (props.md != null) c.push(MD_SPAN[props.md] ?? '')
  if (props.lg != null) c.push(LG_SPAN[props.lg] ?? '')
  if (props.xl != null) c.push(XL_SPAN[props.xl] ?? '')
  if (props.offset != null && props.offset >= 1 && props.offset <= 12) {
    c.push(/* v8 ignore next */ START_CLASSES[props.offset] ?? '')
  }
  return cn(c.filter(Boolean), props.class)
}
