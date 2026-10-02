import { createFileRoute } from '@tanstack/react-router'
import { m } from 'motion/react'
import { useState } from 'react'
import { Arrow, Heart, Sparkle, Squiggle, type TapeColor } from '@/components/magazine/doodles'
import { Lightbox } from '@/components/magazine/lightbox'
import { Page, PageKicker } from '@/components/magazine/page'
import { Polaroid } from '@/components/magazine/photo'
import { Badge } from '@/components/ui/badge'
import { photoSpread, type Photo } from '@/content'
import { findPhotoFile, getSpreadPhotos } from '@/lib/photos'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/photos')({
  component: PhotosPage,
})

/** Hand-placed feel: rotations and tape colors cycle in an uneven rhythm */
const ROTATIONS = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3, -3, 1]
const TAPES: TapeColor[] = ['butter', 'sage', 'blush', 'periwinkle', 'butter', 'blush', 'sage']
const BADGE_TONES = ['cherry', 'periwinkle', 'sage', 'default'] as const
/** On-screen polaroid width, so phones fetch the small preview rather than the full photo */
const POLAROID_SIZES = '(max-width: 448px) 40vw, 180px'

type Item = { photo: Photo; index: number }

/**
 * Two columns whose heights stay even: each photo goes to whichever column is
 * shorter so far, using its real shape. Keeps reading order roughly row by row.
 */
function balanceColumns(items: Item[]): [Item[], Item[]] {
  const columns: [Item[], Item[]] = [[], []]
  const heights = [0, 0]
  for (const item of items) {
    const file = findPhotoFile(item.photo.src)
    const ratio = file ? file.height / file.width : 1.25
    const column = heights[0] <= heights[1] ? 0 : 1
    columns[column].push(item)
    heights[column] += ratio + (item.photo.caption ? 0.3 : 0.2)
  }
  return columns
}

/**
 * Split into evenly sized groups of roughly `size`, earlier groups taking any
 * extras, so there's never a lonely last group (49 by 12 -> 13, 12, 12, 12).
 */
function evenGroups<T>(items: T[], size: number): T[][] {
  const count = Math.max(1, Math.round(items.length / size))
  const base = Math.floor(items.length / count)
  const extra = items.length % count
  const groups: T[][] = []
  let start = 0
  for (let group = 0; group < count; group++) {
    const length = base + (group < extra ? 1 : 0)
    groups.push(items.slice(start, start + length))
    start += length
  }
  return groups.filter((group) => group.length > 0)
}

// The photo list comes from the folder at build time, so lay it out once
const PHOTOS = getSpreadPhotos()
const GROUPS = evenGroups(
  PHOTOS.map((photo, index) => ({ photo, index })),
  photoSpread.groupSize,
).map((items, group) => ({ letter: String.fromCharCode(65 + group), columns: balanceColumns(items) }))

function PhotosPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Page tone="periwinkle" dotted>
      <PageKicker number="05">{photoSpread.kicker}</PageKicker>

      <h1 className="mt-5 font-display text-[3.1rem] leading-[0.9] font-black tracking-tight">{photoSpread.title}</h1>
      <p className="mt-2 font-display text-lg font-medium italic">
        <span className="font-black not-italic">{PHOTOS.length}</span> {photoSpread.countLabel}
      </p>
      <p className="mt-3 flex items-center gap-1 font-hand text-2xl leading-tight">
        {photoSpread.hint}
        <Arrow className="h-8 w-12 shrink-0 rotate-12" />
      </p>

      {GROUPS.map((group, g) => (
        <section key={group.letter} aria-label={`${photoSpread.groupLabel} ${group.letter}`} className="mt-9">
          {g > 0 && (
            <p
              className={cn(
                'mx-auto mb-9 flex w-fit max-w-[90%] items-center gap-2 rounded-2xl border-2 border-ink bg-paper px-4 py-2 font-hand text-2xl leading-tight shadow-hard',
                g % 2 ? 'rotate-2' : '-rotate-2',
              )}
            >
              {photoSpread.notes[(g - 1) % photoSpread.notes.length]}
              <Heart className="size-6 shrink-0" />
            </p>
          )}

          <h2 className="mb-5 flex items-center gap-2">
            <Badge variant={BADGE_TONES[g % BADGE_TONES.length]} className={cn('text-sm', g % 2 ? 'rotate-2' : '-rotate-2')}>
              {photoSpread.groupLabel} {group.letter}
            </Badge>
            <Squiggle className="w-20" color="var(--ink)" />
          </h2>

          <div className="grid grid-cols-2 items-start gap-x-4">
            {group.columns.map((column, c) => (
              <ul key={c} className={cn('flex flex-col gap-7', c === 1 && 'pt-8')}>
                {column.map(({ photo, index }) => (
                  <li key={photo.src}>
                    <m.button
                      type="button"
                      onClick={() => setOpenIndex(index)}
                      aria-label={`Open photo ${index + 1} of ${PHOTOS.length}${photo.caption ? `: ${photo.caption}` : ''}`}
                      className="block w-full rounded-md text-left"
                      whileHover={{ scale: 1.04, rotate: -1.5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <Polaroid
                        photo={photo}
                        sizes={POLAROID_SIZES}
                        rotate={ROTATIONS[index % ROTATIONS.length]}
                        tape={TAPES[index % TAPES.length]}
                      />
                    </m.button>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-14 flex items-center justify-center gap-3">
        <Sparkle color="var(--butter)" />
        <p className="font-hand text-2xl">{photoSpread.footer}</p>
        <Heart className="size-7" />
      </div>

      <Lightbox photos={PHOTOS} index={openIndex} onIndexChange={setOpenIndex} />
    </Page>
  )
}
