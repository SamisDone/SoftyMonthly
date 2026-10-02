import type { ReactNode } from 'react'
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
  className?: string
  children: ReactNode
}

/** One magazine page: fills the stage, scrolls on its own, has its own paper color. */
export function Page({ tone = 'paper', dotted = false, className, children }: PageProps) {
  return (
    <div
      data-page-scroll
      className={cn(
        'h-full overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-color:var(--ink)_transparent] [scrollbar-width:thin]',
        TONES[tone],
        dotted && 'pattern-dots',
      )}
    >
      <div className={cn('relative mx-auto min-h-full max-w-md px-5 pt-6 pb-12', className)}>{children}</div>
    </div>
  )
}

/** The little "No. 03 · Editor's letter" label at the top of each page. */
export function PageKicker({ number, children, className }: { number?: string; children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'flex items-center gap-2 font-sans text-[0.72rem] font-extrabold tracking-[0.18em] text-ink uppercase',
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
