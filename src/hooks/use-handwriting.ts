import { useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Extra pause after a character, as a multiple of the per-character speed, so
 * the writing breathes like a real hand (and slowing the speed slows the pauses too).
 */
const PAUSE_AFTER: Record<string, number> = {
  '.': 8,
  '!': 8,
  '?': 8,
  ',': 3.5,
  ':': 5,
  ';': 5,
}
/** Pause between paragraphs (lifting the pen), as a multiple of the per-character speed. */
const SEGMENT_PAUSE = 14

type Options = {
  /** Base time per character in ms. Lower is faster. */
  msPerChar?: number
  /** Pause before the first character, so the page-turn can land. */
  startDelay?: number
  /** Show everything immediately (e.g. already read once). */
  instant?: boolean
}

/**
 * Reveals text segments character by character on a precomputed schedule
 * (driven by requestAnimationFrame, so it stays smooth and pauses in
 * background tabs). Reduced-motion users get the full text immediately.
 */
export function useHandwriting(segments: readonly string[], options: Options = {}) {
  const { msPerChar = 65, startDelay = 700, instant = false } = options
  const prefersReducedMotion = useReducedMotion()

  // Split by code point (not UTF-16 units) so emoji never get cut in half
  const chars = useMemo(() => segments.map((segment) => Array.from(segment)), [segments])

  const schedule = useMemo(() => {
    const times: number[] = []
    let time = startDelay
    chars.forEach((segment, index) => {
      if (index > 0) time += SEGMENT_PAUSE * msPerChar
      for (const char of segment) {
        time += msPerChar
        times.push(time)
        time += (PAUSE_AFTER[char] ?? 0) * msPerChar
      }
    })
    return times
  }, [chars, msPerChar, startDelay])

  const total = schedule.length
  const [count, setCount] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const showAll = instant || skipped || prefersReducedMotion === true

  useEffect(() => {
    if (showAll) return
    let frame = 0
    let index = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startedAt
      let next = index
      while (next < total && schedule[next] <= elapsed) next++
      if (next !== index) {
        index = next
        setCount(next)
      }
      if (index < total) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [showAll, schedule, total])

  const revealed = showAll ? total : count

  /** Index of each segment's first character in the overall writing order. */
  const segmentStarts = useMemo(
    () => chars.map((_, i) => chars.slice(0, i).reduce((sum, segment) => sum + segment.length, 0)),
    [chars],
  )

  /** Visible text per segment, plus the hidden remainder (kept in layout so nothing jumps). */
  const parts = useMemo(() => {
    return chars.map((segment, i) => {
      const shown = Math.min(Math.max(revealed - segmentStarts[i], 0), segment.length)
      return {
        written: segment.slice(0, shown).join(''),
        unwritten: segment.slice(shown).join(''),
        isDone: shown === segment.length,
      }
    })
  }, [chars, segmentStarts, revealed])

  const skip = useCallback(() => setSkipped(true), [])
  const isDone = revealed >= total

  /** The segment the pen is currently on (-1 when finished). */
  const activeIndex = isDone ? -1 : parts.findIndex((part) => !part.isDone)

  return { parts, activeIndex, isDone, skip }
}
