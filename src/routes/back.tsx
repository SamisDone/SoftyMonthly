import { createFileRoute, Link } from '@tanstack/react-router'
import confetti from 'canvas-confetti'
import { RotateCcw } from 'lucide-react'
import { m } from 'motion/react'
import { useEffect } from 'react'
import { Heart, Sparkle, Squiggle, Star } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { Button } from '@/components/ui/button'
import { backCover, magazine } from '@/content'

export const Route = createFileRoute('/back')({
  component: BackCoverPage,
})

const COLORS = ['#E5484D', '#FFD670', '#9AB1FF', '#B8E0C8', '#FFF6E9']

let heartShape: confetti.Shape | undefined
function getHeartShape() {
  heartShape ??= confetti.shapeFromPath({
    path: 'M12 21C5 16 1 12.5 1 8 1 4.7 3.5 2.3 6.6 2.3c2.2 0 4 1.2 5.4 3 1.4-1.8 3.2-3 5.4-3C20.5 2.3 23 4.7 23 8c0 4.5-4 8-11 13z',
  })
  return heartShape
}

function burst() {
  const shared = {
    colors: COLORS,
    shapes: [getHeartShape(), 'circle'] as confetti.Shape[],
    scalar: 1.4,
    disableForReducedMotion: true,
    zIndex: 60,
  }
  confetti({ ...shared, particleCount: 90, spread: 75, startVelocity: 42, origin: { x: 0.5, y: 0.55 } })
  confetti({ ...shared, particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.75 } })
  confetti({ ...shared, particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.75 } })
}

function BackCoverPage() {
  useEffect(() => {
    // Wait for the page-turn to land before celebrating
    const id = window.setTimeout(burst, 450)
    return () => {
      window.clearTimeout(id)
      confetti.reset()
    }
  }, [])

  return (
    <Page tone="periwinkle" dotted fit className="items-center text-center">
      <PageKicker number="10" className="self-start">
        {backCover.kicker}
      </PageKicker>

      {/* The heart takes whatever height is left (up to its full size) */}
      <div className="flex min-h-20 w-full flex-1 items-center justify-center @container-size">
        <div className="relative">
          <Sparkle className="absolute -top-2 -left-6 size-9 animate-float" color="var(--butter)" />
          <Star className="absolute top-8 -right-8 size-10 animate-wobble [--tilt:-12deg]" />
          <m.button
          type="button"
          onClick={burst}
          aria-label={backCover.heartLabel}
            className="block rounded-full"
            animate={{ scale: [1, 1.08, 1, 1.05, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            whileTap={{ scale: 0.85 }}
          >
            <Heart className="size-[min(13rem,88cqh)] drop-shadow-[5px_5px_0_var(--ink)]" />
          </m.button>
        </div>
      </div>

      <h1 className="mt-[clamp(0.25rem,1.4cqh,1rem)] shrink-0 font-display text-[clamp(1.9rem,6cqh,2.7rem)] leading-[0.95] font-black tracking-tight">
        {backCover.title}
      </h1>
      <Squiggle className="mt-[clamp(0.4rem,1.4cqh,0.75rem)] shrink-0" />
      <p className="mt-[clamp(0.5rem,1.8cqh,1rem)] max-w-sm shrink-0 rounded-3xl border-2 border-ink bg-paper p-[clamp(0.75rem,2.6cqh,1.25rem)] text-[clamp(0.92rem,2.5cqh,1.05rem)] leading-snug font-semibold shadow-hard">
        {backCover.message}
      </p>
      <p className="mt-[clamp(0.5rem,2cqh,1.25rem)] shrink-0 -rotate-2 font-hand text-[clamp(1.8rem,5cqh,2.25rem)] leading-none font-bold text-cherry">
        {backCover.signature}
      </p>

      <Button asChild variant="secondary" size="lg" className="mt-[clamp(0.6rem,2.4cqh,1.75rem)] shrink-0">
        <Link to="/">
          <RotateCcw strokeWidth={3} />
          {backCover.replayLabel}
        </Link>
      </Button>

      <footer className="mt-[clamp(0.5rem,2.4cqh,1.75rem)] shrink-0 text-[0.66rem] font-extrabold tracking-[0.18em] uppercase [@container(max-height:700px)]:hidden">
        <p>
          {magazine.name} {magazine.nameSuffix} · {magazine.issue}
        </p>
        <p className="mt-1 font-hand text-lg tracking-normal text-ink-soft normal-case">{backCover.footer}</p>
      </footer>
    </Page>
  )
}
