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

export const Route = createFileRoute('/')({
  component: CoverPage,
})

const BADGE_TONES = ['cherry', 'periwinkle', 'sage'] as const

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
    <Page tone="butter" className="px-4 pt-5">
      {/* Masthead */}
      <h1 className="text-center font-display text-[clamp(3.8rem,25vw,6.25rem)] leading-[0.85] font-black tracking-tight whitespace-nowrap text-cherry [paint-order:stroke_fill] [text-shadow:4px_4px_0_var(--ink)] [-webkit-text-stroke:5px_var(--ink)]">
        {magazine.name}
      </h1>

      {/* Special-edition ribbon banner */}
      <div className="relative mx-auto mt-3 w-fit -rotate-2">
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

      <p className="mt-3 text-center text-[0.7rem] font-extrabold tracking-[0.16em] uppercase">
        {magazine.issue} · {magazine.date}
      </p>

      {/* Cover photo with sticker cover-lines */}
      <div className="relative mt-4">
        <div className="overflow-hidden rounded-3xl border-2 border-ink bg-paper shadow-hard-lg">
          <Photo photo={cover.photo} priority aspect="4 / 5" />
        </div>

        <m.div
          className="absolute -top-5 -right-2 grid size-24 place-items-center rounded-full border-2 border-ink bg-cherry text-center shadow-hard [--tilt:12deg] [rotate:var(--tilt)] animate-wobble"
          whileTap={{ scale: 1.15 }}
        >
          <span className="font-hand text-2xl leading-[0.9] font-bold whitespace-pre-line text-paper">{cover.sticker}</span>
        </m.div>

        <Star className="absolute top-1/3 -left-3 size-9 -rotate-12" />
        <Sparkle className="absolute top-[45%] -right-2 size-7 animate-float" color="var(--paper)" />

        {lead && (
          <div className="absolute right-12 -bottom-6 left-3 -rotate-3 rounded-2xl border-2 border-ink bg-paper p-3 shadow-hard">
            <Badge variant="cherry" className="-mt-6 mb-1 rotate-2">
              {lead.kicker}
            </Badge>
            <p className="font-display text-xl leading-tight font-extrabold">{lead.text}</p>
          </div>
        )}
        <Heart className="absolute right-3 -bottom-4 size-11 rotate-12" />
      </div>

      <ul className="mt-12 space-y-3">
        {coverLines.map((line, i) => (
          <li key={line.text} className="flex items-start gap-3">
            <Badge variant={BADGE_TONES[i % BADGE_TONES.length]} className={i % 2 ? 'mt-0.5 rotate-2' : 'mt-0.5 -rotate-2'}>
              {line.kicker}
            </Badge>
            <p className="font-display text-lg leading-snug font-bold">{line.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-end justify-between gap-3">
        <Button size="lg" onClick={openMagazine} className="text-lg">
          {cover.openButton}
          <ChevronRight strokeWidth={3} />
        </Button>
        <div className="flex flex-col items-end gap-1">
          <Barcode className="rounded-sm border-2 border-ink" />
          <span className="text-[0.62rem] font-extrabold tracking-[0.16em] uppercase">{magazine.price}</span>
        </div>
      </div>
    </Page>
  )
}
