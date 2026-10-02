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
    <Page tone="periwinkle" dotted className="flex flex-col items-center text-center">
      <PageKicker number="10" className="self-start">
        {backCover.kicker}
      </PageKicker>

      <div className="relative mt-8">
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
          <Heart className="size-52 drop-shadow-[5px_5px_0_var(--ink)]" />
        </m.button>
      </div>

      <h1 className="mt-4 font-display text-[2.7rem] leading-[0.95] font-black tracking-tight">{backCover.title}</h1>
      <Squiggle className="mt-3" />
      <p className="mt-4 max-w-sm rounded-3xl border-2 border-ink bg-paper p-5 text-[1.05rem] leading-relaxed font-semibold shadow-hard">
        {backCover.message}
      </p>
      <p className="mt-5 -rotate-2 font-hand text-4xl font-bold text-cherry">{backCover.signature}</p>

      <Button asChild variant="secondary" size="lg" className="mt-7">
        <Link to="/">
          <RotateCcw strokeWidth={3} />
          {backCover.replayLabel}
        </Link>
      </Button>

      <footer className="mt-auto pt-10 text-[0.66rem] font-extrabold tracking-[0.18em] uppercase">
        <p>
          {magazine.name} {magazine.nameSuffix} · {magazine.issue}
        </p>
        <p className="mt-1 text-ink-soft normal-case tracking-normal font-hand text-lg">{backCover.footer}</p>
      </footer>
    </Page>
  )
}
