import { useState, type CSSProperties } from 'react'
import type { Photo as PhotoData } from '@/content'
import { cn } from '@/lib/utils'
import { Tape, type TapeColor } from './doodles'

const PLACEHOLDER_TONES = ['bg-butter', 'bg-periwinkle', 'bg-sage', 'bg-blush'] as const

/** Stable pseudo-random tone per file name, so placeholders don't all match. */
function toneFor(src: string) {
  let hash = 0
  for (const char of src) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return PLACEHOLDER_TONES[Math.abs(hash) % PLACEHOLDER_TONES.length]
}

type PhotoProps = {
  photo: PhotoData
  className?: string
  /** For the above-the-fold cover photo: load eagerly with high priority. */
  priority?: boolean
  /** Crop to this CSS aspect ratio (e.g. "4 / 5"). Defaults to the photo's own. */
  aspect?: string
}

/**
 * A plain <img> with explicit width/height (no layout shift) that swaps to a
 * colored placeholder block if the file is missing, so the magazine never breaks.
 */
export function Photo({ photo, className, priority = false, aspect }: PhotoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = failedSrc === photo.src
  const aspectRatio = aspect ?? `${photo.width} / ${photo.height}`

  if (failed) {
    const fileName = photo.src.split('/').pop()
    return (
      <div
        role="img"
        aria-label={photo.alt}
        className={cn('grid place-items-center pattern-stripes text-center', toneFor(photo.src), className)}
        style={{ aspectRatio }}
      >
        <span className="px-3 font-hand text-xl leading-tight text-ink">
          photo goes here
          <span className="block font-sans text-[0.7rem] font-bold tracking-wider text-ink-soft uppercase">
            {fileName}
          </span>
        </span>
      </div>
    )
  }

  return (
    <img
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      onError={() => setFailedSrc(photo.src)}
      className={cn('block h-auto w-full bg-paper-deep object-cover', className)}
      style={{ aspectRatio }}
    />
  )
}

type PolaroidProps = {
  photo: PhotoData
  className?: string
  style?: CSSProperties
  /** Degrees. Polaroids look best a little crooked. */
  rotate?: number
  tape?: TapeColor | false
  /** Force a square crop (classic polaroid). */
  square?: boolean
}

export function Polaroid({ photo, className, style, rotate = -2, tape = 'butter', square = false }: PolaroidProps) {
  return (
    <figure
      className={cn('relative rounded-md border-2 border-ink bg-[#fffdf8] p-2.5 pb-1 shadow-hard', className)}
      style={{ rotate: `${rotate}deg`, ...style }}
    >
      {tape && <Tape color={tape} rotate={-rotate * 2 - 3} className="-top-3 left-1/2 -translate-x-1/2" />}
      <div className="overflow-hidden rounded-sm border-2 border-ink">
        <Photo photo={photo} aspect={square ? '1 / 1' : undefined} className="w-full" />
      </div>
      {photo.caption && (
        <figcaption className="px-1 pt-1.5 pb-1 text-center font-hand text-[1.45rem] leading-tight text-ink">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  )
}
