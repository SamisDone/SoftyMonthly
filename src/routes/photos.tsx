import { createFileRoute } from '@tanstack/react-router'
import { m } from 'motion/react'
import { useState } from 'react'
import { Arrow, Heart, Sparkle } from '@/components/magazine/doodles'
import type { TapeColor } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { Photo, Polaroid } from '@/components/magazine/photo'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { photoSpread } from '@/content'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/photos')({
  component: PhotosPage,
})

/** Hand-placed scatter: rotation + tape color, cycled if there are more photos. */
const SCATTER: { rotate: number; tape: TapeColor }[] = [
  { rotate: -5, tape: 'butter' },
  { rotate: 4, tape: 'sage' },
  { rotate: 3, tape: 'blush' },
  { rotate: -3, tape: 'butter' },
  { rotate: -6, tape: 'sage' },
  { rotate: 5, tape: 'blush' },
]

function PhotosPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const openPhoto = openIndex === null ? null : photoSpread.photos[openIndex]

  return (
    <Page tone="periwinkle" dotted>
      <PageKicker number="05">{photoSpread.kicker}</PageKicker>

      <h1 className="mt-5 font-display text-[3.1rem] leading-[0.9] font-black tracking-tight">{photoSpread.title}</h1>
      <p className="mt-2 font-display text-lg font-medium italic">{photoSpread.subtitle}</p>
      <p className="mt-3 flex items-center gap-1 font-hand text-2xl">
        {photoSpread.hint}
        <Arrow className="h-8 w-12 rotate-12" />
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7">
        {photoSpread.photos.map((photo, i) => {
          const { rotate, tape } = SCATTER[i % SCATTER.length]
          return (
            <li key={photo.src} className={cn(i % 2 === 1 && 'translate-y-8')}>
              <m.button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Open photo: ${photo.caption ?? photo.alt}`}
                className="block w-full rounded-md text-left"
                whileHover={{ scale: 1.04, rotate: -1.5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                <Polaroid photo={photo} square rotate={rotate} tape={tape} />
              </m.button>
            </li>
          )
        })}
      </ul>

      <div className="mt-16 flex items-center justify-center gap-3">
        <Sparkle color="var(--butter)" />
        <p className="font-hand text-2xl">{photoSpread.footer}</p>
        <Heart className="size-7" />
      </div>

      <Dialog open={openPhoto !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="max-w-[min(26rem,calc(100%-2rem))] rotate-[-1deg] bg-[#fffdf8] p-3 pb-2">
          {openPhoto && (
            <>
              <div className="overflow-hidden rounded-xl border-2 border-ink">
                <Photo photo={openPhoto} className="max-h-[65dvh]" />
              </div>
              <DialogTitle className="text-center font-hand text-3xl font-bold">
                {openPhoto.caption ?? openPhoto.alt}
              </DialogTitle>
              <DialogDescription className="sr-only">{openPhoto.alt}</DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  )
}
