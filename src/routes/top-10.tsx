import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { Heart, Star } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { top10 } from '@/content'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/top-10')({
  component: Top10Page,
})

const CARD_TONES = ['bg-paper', 'bg-butter', 'bg-periwinkle', 'bg-sage'] as const

function Top10Page() {
  const [loved, setLoved] = useState<ReadonlySet<number>>(() => new Set())

  function toggle(index: number) {
    setLoved((current) => {
      const nextLoved = new Set(current)
      if (!nextLoved.delete(index)) nextLoved.add(index)
      return nextLoved
    })
  }

  return (
    <Page tone="cherry">
      <PageKicker number="07" className="text-paper [&>span:first-child]:text-ink">
        {top10.kicker}
      </PageKicker>

      <div className="relative mt-5">
        <p className="font-display text-[5.5rem] leading-[0.8] font-black text-butter [paint-order:stroke_fill] [text-shadow:4px_4px_0_var(--ink)] [-webkit-text-stroke:5px_var(--ink)]">
          {top10.bigTitle}
        </p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight font-extrabold text-paper [text-shadow:2px_2px_0_var(--ink)]">
          {top10.title}
        </h1>
        <p className="mt-1 font-hand text-2xl leading-tight text-paper">{top10.subtitle}</p>
        <Star className="absolute top-1 right-1 size-12 animate-wobble [--tilt:10deg]" />
      </div>

      <ol className="mt-7 space-y-4">
        {top10.items.map((item, i) => {
          const isLoved = loved.has(i)
          const tilt = i % 2 === 0 ? -1.5 : 1.5
          return (
            <m.li
              key={item}
              initial={{ opacity: 0, y: 28, scale: 0.9, rotate: tilt * 3 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={isLoved}
                className={cn(
                  'relative flex w-full items-center gap-4 rounded-3xl border-2 border-ink p-4 text-left shadow-hard transition-[translate,box-shadow] duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-hard-sm',
                  CARD_TONES[i % CARD_TONES.length],
                )}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-ink bg-cherry font-display text-2xl font-black text-paper tabular-nums shadow-hard-sm">
                  {i + 1}
                </span>
                <span className="font-display text-lg leading-snug font-bold">{item}</span>

                <AnimatePresence>
                  {isLoved && (
                    <m.span
                      className="absolute -top-3 -right-2"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 12 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                    >
                      <Heart className="size-10" />
                    </m.span>
                  )}
                </AnimatePresence>
              </button>
            </m.li>
          )
        })}
      </ol>

      <p className="mt-8 text-center font-hand text-2xl text-paper">{top10.hint}</p>
    </Page>
  )
}
