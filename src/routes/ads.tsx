import { createFileRoute } from '@tanstack/react-router'
import { Scissors } from 'lucide-react'
import { m } from 'motion/react'
import { Sparkle, Star } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { Badge } from '@/components/ui/badge'
import { ads, type AdTone } from '@/content'

export const Route = createFileRoute('/ads')({
  component: AdsPage,
})

type Ad = (typeof ads.items)[number]

const TONE_BG: Record<AdTone, string> = {
  butter: 'bg-butter',
  periwinkle: 'bg-periwinkle',
  sage: 'bg-sage',
}

function AdsPage() {
  const [first, second] = ads.items

  return (
    <Page tone="paper" dotted>
      <PageKicker number="08">{ads.subtitle}</PageKicker>
      <h1 className="mt-5 font-display text-[3.4rem] leading-[0.9] font-black tracking-tight">{ads.title}</h1>

      <div className="mt-7 space-y-10">
        {first && <CouponAd ad={first} />}
        {second && <SunburstAd ad={second} />}
      </div>
    </Page>
  )
}

function AdLabel() {
  return <p className="mb-1 text-center text-[0.6rem] font-extrabold tracking-[0.3em] text-ink-soft uppercase">{ads.labels.advertisement}</p>
}

/** Retro "clip & save" ad with a dashed coupon. */
function CouponAd({ ad }: { ad: Ad }) {
  return (
    <section aria-label={`Advertisement: ${ad.brand}`}>
      <AdLabel />
      <div className={`relative -rotate-1 rounded-3xl border-2 border-ink p-5 shadow-hard-lg ${TONE_BG[ad.tone]}`}>
        <m.div
          className="absolute -top-5 -right-3 grid size-20 place-items-center bg-cherry text-center font-display text-lg leading-none font-black text-paper [--tilt:14deg] [rotate:var(--tilt)] animate-wobble"
          style={{
            clipPath:
              'polygon(50% 0, 61% 12%, 77% 6%, 80% 22%, 96% 25%, 89% 40%, 100% 52%, 87% 62%, 93% 78%, 76% 79%, 70% 95%, 56% 86%, 43% 100%, 35% 85%, 18% 92%, 17% 75%, 2% 70%, 11% 56%, 0 43%, 13% 34%, 7% 18%, 24% 18%, 30% 3%, 43% 12%)',
          }}
          whileTap={{ scale: 1.2 }}
        >
          {ads.labels.burst}
        </m.div>

        <p className="font-sans text-xs font-black tracking-[0.25em] uppercase">{ad.brand}</p>
        <h2 className="mt-1 font-display text-[2.6rem] leading-[0.9] font-black uppercase italic">{ad.headline}</h2>
        <p className="mt-2 font-hand text-[1.7rem] leading-tight font-bold text-cherry">{ad.tagline}</p>
        <p className="mt-3 text-[1rem] leading-relaxed font-semibold">{ad.body}</p>

        <div className="relative mt-5 rounded-2xl border-[3px] border-dashed border-ink bg-paper px-4 py-3 text-center">
          <Scissors aria-hidden className="absolute -top-3.5 left-4 size-6 -rotate-90 bg-paper px-0.5" strokeWidth={2.5} />
          <p className="font-display text-xl font-black tracking-wide uppercase">{ad.cta}</p>
          <p className="text-[0.66rem] font-extrabold tracking-[0.2em] text-ink-soft uppercase">{ads.labels.clip}</p>
        </div>
        <p className="mt-3 text-[0.68rem] leading-snug font-semibold text-ink-soft">{ad.fine}</p>
      </div>
    </section>
  )
}

/** "As seen on TV" ad with retro sunburst rays. */
function SunburstAd({ ad }: { ad: Ad }) {
  return (
    <section aria-label={`Advertisement: ${ad.brand}`}>
      <AdLabel />
      <div className={`relative rotate-1 overflow-hidden rounded-3xl border-2 border-ink text-center shadow-hard-lg ${TONE_BG[ad.tone]}`}>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'repeating-conic-gradient(from 0deg at 50% 38%, color-mix(in oklab, var(--paper) 45%, transparent) 0deg 9deg, transparent 9deg 18deg)',
          }}
        />
        <div className="relative px-5 pt-6 pb-5">
          <Badge variant="cherry" className="-rotate-2">
            {ads.labels.asSeenOnTv}
          </Badge>
          <p className="mt-3 font-sans text-xs font-black tracking-[0.25em] uppercase">{ad.brand}</p>
          <h2 className="mt-1 font-display text-[2.9rem] leading-[0.88] font-black text-paper [paint-order:stroke_fill] [text-shadow:3px_3px_0_var(--ink)] [-webkit-text-stroke:4px_var(--ink)]">
            {ad.headline}
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Sparkle color="var(--butter)" />
            <p className="font-hand text-[1.7rem] leading-tight font-bold">{ad.tagline}</p>
            <Sparkle color="var(--butter)" />
          </div>
          <p className="mx-auto mt-3 max-w-xs rounded-2xl border-2 border-ink bg-paper p-3 text-[1rem] leading-relaxed font-semibold">
            {ad.body}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-butter px-5 py-2 font-display text-lg font-black shadow-hard">
            <Star className="size-5" color="var(--cherry)" />
            {ad.cta}
          </p>
          <p className="mt-4 text-[0.68rem] leading-snug font-semibold">{ad.fine}</p>
        </div>
      </div>
    </section>
  )
}
