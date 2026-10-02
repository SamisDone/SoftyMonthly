import { createFileRoute } from '@tanstack/react-router'
import { Feather } from 'lucide-react'
import { m } from 'motion/react'
import { useEffect, useRef, useState, type Ref, type RefObject } from 'react'
import { Heart, Sparkle, Underline } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { Polaroid } from '@/components/magazine/photo'
import { letter } from '@/content'
import { useHandwriting } from '@/hooks/use-handwriting'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/letter')({
  component: LetterPage,
})

/** Everything the pen writes, in order. */
const SEGMENTS = [letter.greeting, ...letter.paragraphs, letter.signoff, letter.signature, letter.ps, letter.pps]
const GREETING = 0
const FIRST_PARAGRAPH = 1
const SIGNOFF = FIRST_PARAGRAPH + letter.paragraphs.length
const SIGNATURE = SIGNOFF + 1
const PS = SIGNATURE + 1
const PPS = PS + 1

// The letter writes itself the first time it's opened; after that it's simply there.
let hasBeenWritten = false

function LetterPage() {
  const [alreadyWritten] = useState(() => hasBeenWritten)
  const { parts, activeIndex, isDone, skip } = useHandwriting(SEGMENTS, {
    msPerChar: letter.msPerLetter,
    instant: alreadyWritten,
  })
  const penRef = useRef<HTMLSpanElement>(null)
  useFollowPen(penRef, !isDone)

  useEffect(() => {
    if (isDone) hasBeenWritten = true
  }, [isDone])

  /** Written text, the pen (if it's on this bit), then the unwritten rest kept invisible so nothing reflows. */
  const ink = (index: number) => (
    <>
      {parts[index].written}
      {activeIndex === index && <Pen ref={penRef} />}
      <span className="invisible">{parts[index].unwritten}</span>
    </>
  )

  return (
    <Page tone="sage">
      <div className="flex items-center justify-between gap-3">
        <PageKicker number="03" className="min-w-0 shrink">
          {letter.kicker}
        </PageKicker>
        <button
          type="button"
          onClick={skip}
          className={cn(
            'shrink-0 rounded-full px-2 font-hand text-xl font-bold underline decoration-cherry decoration-wavy underline-offset-4',
            isDone && 'invisible',
          )}
        >
          {letter.skipLabel}
        </button>
      </div>

      <article className="relative mt-7 -rotate-1 rounded-3xl border-2 border-ink bg-paper pattern-lined px-5 pt-6 pb-7 shadow-hard-lg">
        <Polaroid
          photo={letter.photo}
          rotate={7}
          tape="periwinkle"
          className="float-right -mt-12 -mr-4 mb-3 ml-3 w-28 p-1.5 [&_figcaption]:text-base"
        />

        {/* Screen readers get the whole letter at once; the animated copy below is decorative */}
        <div className="sr-only">
          <h1>{letter.greeting}</h1>
          {letter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            {letter.signoff} {letter.signature}
          </p>
          <p>{letter.ps}</p>
          {letter.pps && <p>{letter.pps}</p>}
        </div>

        <div aria-hidden>
          <p className="font-hand text-[2.6rem] leading-none font-bold text-cherry">{ink(GREETING)}</p>
          <Underline className="mt-1 w-36" />

          <div className="mt-6 space-y-8 font-hand text-[1.6rem] leading-8 font-medium">
            {letter.paragraphs.map((paragraph, i) => (
              <p key={paragraph}>{ink(FIRST_PARAGRAPH + i)}</p>
            ))}
          </div>

          <div className="clear-both mt-8">
            <p className="font-hand text-[1.6rem] leading-8 font-medium">{ink(SIGNOFF)}</p>
            <p className="inline-flex items-center gap-2 font-hand text-5xl leading-none font-bold text-cherry">
              <span>{ink(SIGNATURE)}</span>
              <m.span
                className="inline-block"
                initial={false}
                animate={parts[SIGNATURE].isDone ? { scale: 1, rotate: -12 } : { scale: 0, rotate: -40 }}
                transition={{ type: 'spring', stiffness: 500, damping: 12 }}
              >
                <Heart className="size-9" />
              </m.span>
            </p>
            <p className="mt-5 font-hand text-2xl leading-tight text-ink-soft">{ink(PS)}</p>
            {/* The final word: a scribbled, slightly menacing warning */}
            {letter.pps && (
              <p className="mt-4 -rotate-1 font-hand text-2xl leading-tight font-bold text-cherry">{ink(PPS)}</p>
            )}
          </div>
        </div>

        <Sparkle className="absolute right-5 bottom-5 size-8" color="var(--butter)" />
      </article>
    </Page>
  )
}

/** A little quill whose nib sits exactly where the next letter will appear. */
function Pen({ ref }: { ref?: Ref<HTMLSpanElement> }) {
  return (
    <span ref={ref} className="relative inline-block h-[1em] w-0">
      <Feather
        className="absolute bottom-[0.1em] -left-0.5 size-8 animate-scribble text-cherry"
        fill="var(--paper)"
        strokeWidth={2.2}
      />
    </span>
  )
}

/**
 * Keeps the pen in view as the letter writes past the fold, until the reader
 * scrolls on their own (then we stop pulling the page around).
 */
function useFollowPen(penRef: RefObject<HTMLSpanElement | null>, writing: boolean) {
  useEffect(() => {
    if (!writing) return
    const container = penRef.current?.closest<HTMLElement>('[data-page-scroll]')
    if (!container) return

    let following = true
    const stopFollowing = () => {
      following = false
    }
    container.addEventListener('wheel', stopFollowing, { passive: true })
    container.addEventListener('touchstart', stopFollowing, { passive: true })

    const id = window.setInterval(() => {
      const pen = penRef.current
      if (!following || !pen) return
      const penBox = pen.getBoundingClientRect()
      const view = container.getBoundingClientRect()
      // Keep the pen within the upper ~70% of the page
      const overshoot = penBox.bottom - (view.bottom - view.height * 0.3)
      if (overshoot > 0) container.scrollBy({ top: overshoot, behavior: 'smooth' })
    }, 350)

    return () => {
      window.clearInterval(id)
      container.removeEventListener('wheel', stopFollowing)
      container.removeEventListener('touchstart', stopFollowing)
    }
  }, [penRef, writing])
}
