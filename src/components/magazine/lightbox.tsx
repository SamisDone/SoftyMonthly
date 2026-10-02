import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, m, type PanInfo, type Variants } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { photoSpread, type Photo as PhotoData } from '@/content'
import { findPhotoFile } from '@/lib/photos'
import { Photo } from './photo'

const SWIPE_THRESHOLD = 60

const slide: Variants = {
  enter: (direction: number) => ({ x: direction * 70, opacity: 0, rotate: direction * 2 }),
  center: { x: 0, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 380, damping: 32 } },
  exit: (direction: number) => ({ x: direction * -70, opacity: 0, rotate: direction * -2, transition: { duration: 0.16 } }),
}

type LightboxProps = {
  photos: readonly PhotoData[]
  /** Open photo, or null when closed */
  index: number | null
  onIndexChange: (index: number | null) => void
}

/** Big-photo view: swipe, tap the arrows or use the arrow keys to flip through every photo. */
export function Lightbox({ photos, index, onIndexChange }: LightboxProps) {
  const [direction, setDirection] = useState(1)
  const total = photos.length
  const photo = index === null ? undefined : photos[index]

  function go(step: 1 | -1) {
    if (index === null || total < 2) return
    setDirection(step)
    onIndexChange((index + step + total) % total)
  }

  // Preload the neighbours' full-size files so the next swipe is instant
  useEffect(() => {
    if (index === null || total < 2) return
    for (const step of [1, -1]) {
      const file = findPhotoFile(photos[(index + step + total) % total].src)
      if (file) new Image().src = file.src
    }
  }, [index, photos, total])

  function handleDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const swipe = info.offset.x + info.velocity.x * 0.2
    if (swipe < -SWIPE_THRESHOLD) go(1)
    else if (swipe > SWIPE_THRESHOLD) go(-1)
  }

  const counter = index === null ? '' : `${index + 1} / ${total}`

  return (
    <Dialog open={photo !== undefined} onOpenChange={(open) => !open && onIndexChange(null)}>
      <DialogContent
        className="max-w-[min(26rem,calc(100%-2rem))] rotate-[-1deg] bg-[#fffdf8] p-3"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') go(1)
          else if (event.key === 'ArrowLeft') go(-1)
          else return
          event.preventDefault()
        }}
      >
        {photo && (
          <>
            <div className="grid place-items-center">
              <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                <m.div
                  key={photo.src}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag={total > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                  style={{ touchAction: 'pan-y' }}
                  className="w-fit max-w-full overflow-hidden rounded-xl border-2 border-ink"
                >
                  {/* Whole photo, never cropped: tall photos shrink to fit the screen */}
                  <Photo photo={photo} sizes="100vw" className="max-h-[62dvh] w-auto max-w-full" />
                </m.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" size="icon-sm" onClick={() => go(-1)} aria-label={photoSpread.previousLabel} className={total < 2 ? 'invisible' : undefined}>
                <ChevronLeft strokeWidth={3} />
              </Button>
              <div className="min-w-0 text-center">
                <DialogTitle className="font-hand text-3xl leading-tight font-bold">{photo.caption ?? counter}</DialogTitle>
                {photo.caption && <p className="text-xs font-extrabold tracking-[0.14em] tabular-nums">{counter}</p>}
              </div>
              <Button variant="outline" size="icon-sm" onClick={() => go(1)} aria-label={photoSpread.nextLabel} className={total < 2 ? 'invisible' : undefined}>
                <ChevronRight strokeWidth={3} />
              </Button>
            </div>
            <DialogDescription className="sr-only">{photo.alt}</DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
