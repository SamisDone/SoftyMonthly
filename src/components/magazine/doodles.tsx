import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Hand-drawn doodles. Paths are intentionally a little uneven so they read
 * as drawn with a marker, not as icon-set geometry. All are decorative.
 */
type DoodleProps = {
  className?: string
  style?: CSSProperties
  /** Fill color, any CSS color. Defaults differ per doodle. */
  color?: string
}

const INK = 'var(--ink)'

export function Heart({ className, style, color = 'var(--cherry)' }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 46" className={cn('size-8', className)} style={style} aria-hidden fill="none">
      <path
        d="M24.4 41.5C13.1 34.2 4.6 27.3 4.9 17.6 5.1 10.9 9.8 6.3 15.6 6.4c3.9.1 6.8 2.3 8.6 5.4 1.9-3.3 5.1-5.6 9.1-5.5 6 .2 10.1 5 9.9 11.6-.4 9.6-8.4 16.6-18.8 23.6z"
        fill={color}
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M11.6 15.2c.6-2.6 2.3-4 4.4-4.1" stroke="var(--paper)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Star({ className, style, color = 'var(--butter)' }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={cn('size-8', className)} style={style} aria-hidden fill="none">
      <path
        d="M24.6 4.5l5.6 12.1 13 1.6-9.7 9 2.7 13-11.8-6.6-11.5 6.9 2.4-13.2-9.9-8.6 13.1-1.9z"
        fill={color}
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({ className, style, color = 'var(--periwinkle)' }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-6', className)} style={style} aria-hidden fill="none">
      <path
        d="M20.3 3.5c1.2 8.6 4.6 13 15.9 16.6-10.9 3.1-14.4 7.2-16.4 16.4-1.6-9.5-5.4-13.4-16.3-16.6 10.6-3 14.9-7.4 16.8-16.4z"
        fill={color}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Squiggle({ className, style, color = 'var(--cherry)' }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 20" className={cn('h-4 w-24', className)} style={style} aria-hidden fill="none">
      <path
        d="M3 11c6-7 11-7 15 0s10 7.5 15 0 10-7.4 15 .2 9.6 7 15-.4 10.3-7 15 .3 10 7.2 15-.2 9.6-6.8 14 .1"
        stroke={color}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Underline({ className, style, color = 'var(--cherry)' }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 14" preserveAspectRatio="none" className={cn('h-3 w-full', className)} style={style} aria-hidden fill="none">
      <path d="M3 9.5c38-5 92-7.5 194-3.2M18 12c40-3 90-3.6 150-1.4" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Blob({ className, style, color = 'var(--butter)' }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 200" className={cn('size-40', className)} style={style} aria-hidden>
      <path
        d="M151.6 38.9c19.5 16.1 31.3 42.4 28.4 67.3-2.9 24.9-20.6 48.4-43.5 60.6-22.9 12.1-51.1 12.9-73.3 1.8C40.9 157.5 24.6 134.5 20.9 110c-3.8-24.5 5.1-50.5 22.6-67.2C61 26.1 87 18.6 109.8 20.4c22.8 1.9 22.3 2.4 41.8 18.5z"
        fill={color}
      />
    </svg>
  )
}

export function Arrow({ className, style, color = INK }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 50" className={cn('h-10 w-16', className)} style={style} aria-hidden fill="none">
      <path d="M4 8c14 30 38 36 66 26" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M58 26.5l12.6 7.3-10.5 9.4" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Fake barcode for the cover. */
export function Barcode({ className }: { className?: string }) {
  const bars = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2]
  let x = 0
  return (
    <svg viewBox="0 0 64 30" className={cn('h-8 w-16', className)} aria-hidden>
      <rect width="64" height="30" rx="3" fill="var(--paper)" />
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={4 + x} y="4" width={w} height="22" fill={INK} /> : null
        x += w + 0.6
        return rect
      })}
    </svg>
  )
}

const TAPE_COLORS = {
  butter: 'color-mix(in oklab, var(--butter) 80%, transparent)',
  periwinkle: 'color-mix(in oklab, var(--periwinkle) 75%, transparent)',
  sage: 'color-mix(in oklab, var(--sage) 85%, transparent)',
  blush: 'color-mix(in oklab, var(--blush) 85%, transparent)',
} as const

export type TapeColor = keyof typeof TAPE_COLORS

/** A strip of washi tape with torn zig-zag ends. */
export function Tape({
  className,
  color = 'butter',
  rotate = -4,
}: {
  className?: string
  color?: TapeColor
  rotate?: number
}) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute block h-6 w-20', className)}
      style={{
        background: TAPE_COLORS[color],
        rotate: `${rotate}deg`,
        clipPath:
          'polygon(0 6%, 4% 0, 8% 8%, 12% 0, 88% 0, 92% 8%, 96% 0, 100% 6%, 100% 94%, 96% 100%, 92% 92%, 88% 100%, 12% 100%, 8% 92%, 4% 100%, 0 94%)',
      }}
    />
  )
}
