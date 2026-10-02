import { useNavigate, useRouter } from '@tanstack/react-router'
import { AnimatePresence, m, useIsPresent, type PanInfo, type Variants } from 'motion/react'
import { Suspense, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { magazine, pageTitles, ui } from '@/content'
import { useCurrentPage } from '@/hooks/use-current-page'
import { PAGE_COUNT, type PagePath } from '@/lib/pages'
import { NotFoundPage } from './not-found-page'

/** px of horizontal travel (plus a bit of flick velocity) that counts as a page turn */
const SWIPE_THRESHOLD = 80
const VELOCITY_WEIGHT = 0.2

/**
 * Page-turn transition. The incoming page slides over the outgoing one with a
 * slight tilt (pivoting at the spine/bottom); the old page sinks away. Under
 * reduced motion, MotionConfig drops the transforms and leaves a soft crossfade.
 */
const pageVariants: Variants = {
  enter: (direction: number) => ({
    x: `${direction * 100}%`,
    rotate: direction * 5,
    scale: 0.97,
    opacity: 0,
    zIndex: 2,
  }),
  center: {
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    zIndex: 2,
    transition: { type: 'spring', stiffness: 260, damping: 29, mass: 0.9, opacity: { duration: 0.18 } },
  },
  exit: (direction: number) => ({
    x: `${direction * -30}%`,
    rotate: direction * -4,
    scale: 0.9,
    opacity: 0,
    zIndex: 1,
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
  }),
}

function pageLabel(path: PagePath | null, index: number) {
  if (!path) return 'Missing page'
  return `Page ${index + 1} of ${PAGE_COUNT}: ${pageTitles[path].title}`
}

/**
 * Renders the current page and animates between pages.
 *
 * Why not just `<AnimatePresence><Outlet key=… /></AnimatePresence>`? Outlet
 * reads the *live* router state, so the exiting copy would instantly swap to
 * the new page's content mid-animation. Instead we render the leaf route's
 * component ourselves: AnimatePresence keeps the old element (and therefore
 * the old component) mounted until its exit finishes. This works because the
 * magazine routes are flat and don't use loaders or params.
 */
export function PageStage() {
  const router = useRouter()
  const { routeId, path, index, prev, next } = useCurrentPage()

  // Direction of travel, derived when the page changes (React's "adjust state on prop change" pattern)
  const [shownRouteId, setShownRouteId] = useState(routeId)
  const [shownIndex, setShownIndex] = useState(index)
  const [direction, setDirection] = useState(1)
  const [hasNavigated, setHasNavigated] = useState(false)
  if (routeId !== shownRouteId) {
    setShownRouteId(routeId)
    setShownIndex(index)
    setDirection(index === -1 || index >= shownIndex ? 1 : -1)
    setHasNavigated(true)
  }

  const PageComponent: ComponentType =
    (path && router.routesById[path].options.component) || NotFoundPage

  // Browser tab title
  useEffect(() => {
    const masthead = `${magazine.name} ${magazine.nameSuffix}`
    if (!path) document.title = `Page torn out · ${masthead}`
    else document.title = path === '/' ? masthead : `${pageTitles[path].title} · ${masthead}`
  }, [path])

  // Preload neighbouring pages so swipes feel instant on slow connections
  useEffect(() => {
    const id = window.setTimeout(() => {
      for (const to of [next, prev]) if (to) router.preloadRoute({ to }).catch(() => {})
    }, 400)
    return () => window.clearTimeout(id)
  }, [router, next, prev])

  return (
    <AnimatePresence initial={false} custom={direction}>
      <SwipeablePage
        key={routeId}
        direction={direction}
        label={pageLabel(path, index)}
        prev={prev}
        next={next}
        focusOnEnter={hasNavigated}
      >
        <Suspense fallback={<PageFallback />}>
          <PageComponent />
        </Suspense>
      </SwipeablePage>
    </AnimatePresence>
  )
}

type SwipeablePageProps = {
  direction: number
  label: string
  prev?: PagePath
  next?: PagePath
  focusOnEnter: boolean
  children: ReactNode
}

function SwipeablePage({ direction, label, prev, next, focusOnEnter, children }: SwipeablePageProps) {
  const navigate = useNavigate()
  const isPresent = useIsPresent()
  const ref = useRef<HTMLDivElement>(null)
  const didDragRef = useRef(false)

  // Move focus to the new page so keyboard and screen-reader users land on it
  useEffect(() => {
    if (focusOnEnter) ref.current?.focus({ preventScroll: true })
  }, [focusOnEnter])

  // Links and images are natively draggable; a native drag steals the pointer
  // and cancels our swipe. (Motion reserves the onDragStart prop, so listen directly.)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const preventNativeDrag = (event: DragEvent) => event.preventDefault()
    element.addEventListener('dragstart', preventNativeDrag)
    return () => element.removeEventListener('dragstart', preventNativeDrag)
  }, [])

  function handleDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const swipe = info.offset.x + info.velocity.x * VELOCITY_WEIGHT
    if (swipe < -SWIPE_THRESHOLD && next) void navigate({ to: next })
    else if (swipe > SWIPE_THRESHOLD && prev) void navigate({ to: prev })
  }

  return (
    <m.div
      ref={ref}
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag={isPresent ? 'x' : false}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      // Stretchy toward a real neighbour, stiff at the first/last page
      dragElastic={{ left: next ? 0.5 : 0.08, right: prev ? 0.5 : 0.08 }}
      dragMomentum={false}
      onDragStart={() => {
        didDragRef.current = true
      }}
      onDragEnd={handleDragEnd}
      onPointerDownCapture={() => {
        didDragRef.current = false
      }}
      // A swipe that ends over a link/button must not also count as a tap on it
      onClickCapture={(event) => {
        if (!didDragRef.current) return
        didDragRef.current = false
        event.preventDefault()
        event.stopPropagation()
      }}
      tabIndex={-1}
      role="region"
      aria-roledescription="page"
      aria-label={label}
      inert={!isPresent}
      className="absolute inset-0 origin-bottom outline-none"
      // Let the browser keep vertical scrolling; we only claim horizontal swipes
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </m.div>
  )
}

function PageFallback() {
  return (
    <div className="grid h-full place-items-center bg-paper">
      <p className="animate-pulse font-hand text-2xl">{ui.loading}</p>
    </div>
  )
}
