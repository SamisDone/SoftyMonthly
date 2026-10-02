import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { m } from 'motion/react'
import { Barcode, Heart, Sparkle, Star } from '@/components/magazine/doodles'
import { Page } from '@/components/magazine/page'
import { Photo } from '@/components/magazine/photo'
import { useMusic } from '@/components/music/music-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cover, magazine } from '@/content'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: CoverPage,
})

const BADGE_TONES = ['periwinkle', 'sage'] as const

/**
 * Extra cover lines only appear when the page is tall enough for them to sit
 * below his face (they stack up from the bottom). Thresholds are page heights.
 */
const COVER_LINE_MIN_HEIGHT = [
  '[@container(max-height:600px)]:hidden',
  '[@container(max-height:700px)]:hidden',
  '[@container(max-height:830px)]:hidden',
] as const

/**
 * A real magazine cover: the photo fills the whole page edge to edge, with the
 * masthead and cover lines printed over it. Everything fits on one screen.
 */
function CoverPage() {
  const music = useMusic()
  const navigate = useNavigate()
  const [lead, ...coverLines] = cover.headlines

  function openMagazine() {
    // Must run inside the tap handler so mobile browsers allow sound
    music.start()
    void navigate({ to: '/contents' })
  }

  return (
    <Page tone="butter" fit className="max-w-none p-0">
      {/* Full-bleed cover photo; `photoFocus` keeps his face in frame on any screen shape */}
      <div className="absolute inset-0">
        <Photo photo={cover.photo} priority fill focus={cover.photoFocus} />
      </div>

      <div className="relative flex h-full flex-col px-4 py-[clamp(0.75rem,3cqh,1.5rem)]">
        {/* Masthead */}
        <h1 className="shrink-0 text-center font-display text-[clamp(3.4rem,min(25vw,13cqh),6.5rem)] leading-[0.85] font-black tracking-tight whitespace-nowrap text-cherry [paint-order:stroke_fill] [text-shadow:4px_4px_0_var(--ink)] [-webkit-text-stroke:5px_var(--ink)]">
          {magazine.name}
        </h1>
        <Star className="absolute top-[clamp(0.5rem,2cqh,1rem)] right-3 size-9 rotate-12 animate-wobble [--tilt:12deg]" />

        {/* Special-edition ribbon banner */}
        <div className="relative mx-auto mt-[clamp(0.4rem,1.6cqh,0.75rem)] w-fit shrink-0 -rotate-2">
          <span
            aria-hidden
            className="absolute top-2 -left-5 h-full w-10 bg-cherry [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,35%_50%)]"
          />
          <span
            aria-hidden
            className="absolute top-2 -right-5 h-full w-10 bg-cherry [clip-path:polygon(0_0,100%_0,65%_50%,100%_100%,0_100%)]"
          />
          <p className="relative rounded-sm border-2 border-ink bg-ink px-5 py-1.5 font-display text-[0.95rem] font-extrabold tracking-wide whitespace-nowrap text-butter">
            {magazine.edition}
          </p>
        </div>

        <p className="mx-auto mt-[clamp(0.5rem,1.6cqh,0.75rem)] w-fit shrink-0 rounded-full border-2 border-ink bg-butter px-3 py-0.5 text-center text-[0.66rem] font-extrabold tracking-[0.14em] uppercase shadow-hard-sm">
          {magazine.issue} · {magazine.date}
        </p>

        {/* Sticker on the left, clear of his face */}
        <m.div
          className="absolute top-[34%] left-3 grid size-[clamp(4.5rem,13cqh,6rem)] place-items-center rounded-full border-2 border-ink bg-cherry text-center shadow-hard [--tilt:-10deg] rotate-(--tilt) animate-wobble"
          whileTap={{ scale: 1.15 }}
        >
          <span className="font-hand text-[clamp(1.1rem,3.4cqh,1.5rem)] leading-[0.9] font-bold whitespace-pre-line text-paper">
            {cover.sticker}
          </span>
        </m.div>
        <Sparkle className="absolute top-[58%] left-5 size-7 animate-float" color="var(--butter)" />

        {/* Pushes the cover lines down onto the lower part of the photo */}
        <div className="min-h-4 flex-1" />

        {lead && (
          <div className="relative w-[min(19rem,100%)] shrink-0 -rotate-2 rounded-2xl border-2 border-ink bg-paper p-3 pr-10 shadow-hard">
            <Badge variant="cherry" className="-mt-6 mb-1 rotate-2">
              {lead.kicker}
            </Badge>
            <p className="font-display text-[clamp(1.05rem,3cqh,1.25rem)] leading-tight font-extrabold">{lead.text}</p>
            <Heart className="absolute -right-3 -bottom-3 size-11 rotate-12" />
          </div>
        )}

        {/* Smaller cover lines: as many as fit below his face */}
        <ul className="flex shrink-0 flex-col">
          {coverLines.map((line, i) => (
            <li
              key={line.text}
              className={cn(
                'mt-[clamp(0.35rem,1.2cqh,0.6rem)] flex w-fit max-w-[88%] items-center gap-2 rounded-xl border-2 border-ink bg-paper px-2.5 py-1 shadow-hard-sm first:mt-[clamp(0.6rem,2cqh,1rem)]',
                i % 2 ? 'ml-auto rotate-1' : '-rotate-1',
                COVER_LINE_MIN_HEIGHT[i] ?? 'hidden',
              )}
            >
              <Badge variant={BADGE_TONES[i % BADGE_TONES.length]}>{line.kicker}</Badge>
              <p className="font-display text-[clamp(0.9rem,2.4cqh,1rem)] leading-snug font-bold">{line.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(0.6rem,2.4cqh,1.25rem)] flex shrink-0 items-end justify-between gap-3">
          <Button size="lg" onClick={openMagazine} className="text-lg">
            {cover.openButton}
            <ChevronRight strokeWidth={3} />
          </Button>
          <div className="flex flex-col items-end gap-1 rounded-lg border-2 border-ink bg-paper p-1 shadow-hard-sm">
            <Barcode />
            <span className="px-0.5 text-[0.6rem] font-extrabold tracking-[0.16em] uppercase">{magazine.price}</span>
          </div>
        </div>
      </div>
    </Page>
  )
}
