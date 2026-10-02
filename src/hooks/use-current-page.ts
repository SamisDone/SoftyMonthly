import { rootRouteId, useMatches } from '@tanstack/react-router'
import { getNeighbors, pageIndex, type PagePath } from '@/lib/pages'

/**
 * The magazine page currently on screen, derived from the deepest route match
 * (so it updates in the same commit as the rendered route, never ahead of it).
 * `path` is null on the 404 page.
 */
export function useCurrentPage() {
  const routeId = useMatches({ select: (matches) => matches[matches.length - 1].routeId })
  const isNotFound = routeId === rootRouteId
  const index = isNotFound ? -1 : pageIndex(routeId)
  const path = index === -1 ? null : (routeId as PagePath)

  const { prev, next } = path ? getNeighbors(path) : {}

  return { routeId, path, index, prev, next }
}
