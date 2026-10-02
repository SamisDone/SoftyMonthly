import type { FileRouteTypes } from '@/routeTree.gen'

/**
 * The magazine's page order, defined once. Prev/next, swipe, keyboard
 * navigation, the page indicator and the contents page all derive from it.
 * `satisfies` makes TypeScript reject any path that isn't a real route.
 */
export const PAGE_ORDER = [
  '/',
  '/contents',
  '/letter',
  '/story',
  '/photos',
  '/interview',
  '/top-10',
  '/ads',
  '/quiz',
  '/back',
] as const satisfies readonly FileRouteTypes['to'][]

export type PagePath = (typeof PAGE_ORDER)[number]

export const PAGE_COUNT = PAGE_ORDER.length

/** Index of a path in the magazine, or -1 for pages outside it (the 404). */
export function pageIndex(pathname: string): number {
  return PAGE_ORDER.indexOf(pathname as PagePath)
}

export function getNeighbors(pathname: string): { prev?: PagePath; next?: PagePath } {
  const index = pageIndex(pathname)
  if (index === -1) return {}
  return { prev: PAGE_ORDER[index - 1], next: PAGE_ORDER[index + 1] }
}

/** "03" style page numbers, like a printed magazine. */
export function pageNumber(index: number): string {
  return String(index + 1).padStart(2, '0')
}
