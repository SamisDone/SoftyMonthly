import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ui } from '@/content'
import { cn } from '@/lib/utils'

const TONES = {
  paper: 'bg-paper',
  butter: 'bg-butter',
  sage: 'bg-sage',
  periwinkle: 'bg-periwinkle',
  blush: 'bg-blush',
  cherry: 'bg-cherry',
} as const

export type PageTone = keyof typeof TONES

type PageProps = {
  tone?: PageTone
  /** Polka-dot print texture on top of the tone. */
  dotted?: boolean
  /**
   * One-screen page: lays out as a full-height column that never needs scrolling.
   * Size children with `cqh` units (the stage is a size container) and give one
   * flexible child `flex-1 min-h-0` to absorb the leftover space.
   */
  fit?: boolean
  className?: string
  children: ReactNode
}

/** One magazine page: fills the stage, has its own paper color, and scrolls only if it must. */
export function Page({ tone = 'paper', dotted = false, fit = false, className, children }: PageProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const showCue = useScrollCue(scrollRef, !fit)

  return (
    <div
      ref={scrollRef}
      data-page-scroll
      className={cn(
        'h-full overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-color:var(--ink)_transparent] [scrollbar-width:thin]',
        TONES[tone],
        dotted && 'pattern-dots',
      )}
    >
      <div
        className={cn(
          'relative mx-auto max-w-md px-5',
          fit ? 'flex h-full min-h-0 flex-col py-[clamp(0.75rem,3.2cqh,1.5rem)]' : 'min-h-full pt-6 pb-12',
          className,
        )}
      >
        {children}
      </div>

      {!fit && (
        <div aria-hidden className="pointer-events-none sticky bottom-0 h-0">
          <span
            className={cn(
              'absolute inset-x-0 bottom-4 mx-auto flex w-fit items-center gap-1 rounded-full border-2 border-ink bg-paper px-3 py-0.5 font-hand text-lg font-bold text-ink shadow-hard-sm transition-opacity duration-300',
              showCue ? 'animate-float opacity-100' : 'opacity-0',
            )}
          >
            {ui.scrollHint}
            <ChevronDown className="size-4" strokeWidth={3} />
          </span>
        </div>
      )}
    </div>
  )
}

/** "Scroll for more" hint: shown while there's more page below, gone once the reader scrolls. */
function useScrollCue(scrollRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const element = scrollRef.current
    if (!enabled || !element) return
    let dismissed = false
    const update = () => {
      if (element.scrollTop > 40) dismissed = true
      setShow(!dismissed && element.scrollHeight - element.clientHeight > 40)
    }
    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    return () => {
      element.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [scrollRef, enabled])

  return show
}

/** The little "No. 03 · Editor's letter" label at the top of each page. */
export function PageKicker({ number, children, className }: { number?: string; children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'flex shrink-0 items-center gap-2 font-sans text-[0.72rem] font-extrabold tracking-[0.18em] text-ink uppercase',
        className,
      )}
    >
      {number && (
        <span className="shrink-0 rounded-full border-2 border-ink bg-paper px-2 py-0.5 font-display tracking-normal whitespace-nowrap tabular-nums">
          No. {number}
        </span>
      )}
      <span>{children}</span>
    </p>
  )
}
