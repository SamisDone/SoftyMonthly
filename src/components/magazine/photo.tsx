import { useState, type CSSProperties } from 'react'
import type { Photo as PhotoData } from '@/content'
import { findPhotoFile } from '@/lib/photos'
import { cn } from '@/lib/utils'
import { Tape, type TapeColor } from './doodles'

const PLACEHOLDER_TONES = ['bg-butter', 'bg-periwinkle', 'bg-sage', 'bg-blush'] as const
/** Placeholder shape when a photo file is missing */
const PLACEHOLDER_RATIO = '4 / 5'

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
  /** Deliberately crop to this CSS aspect ratio. Without it the photo shows whole, in its real shape. */
  aspect?: string
  /** Fill the parent box (full-bleed), trimming edges as needed; pair with `focus`. */
  fill?: boolean
  /** CSS object-position: which part of the photo to keep if the box must trim it. */
  focus?: string
  /**
   * How wide the photo shows on screen (the <img> `sizes` attribute). Lets the
   * browser pick the small preview for grids and the full photo for big views.
   */
  sizes?: string
}

/**
 * A plain <img> with its real width/height (read from the file at build time,
 * so nothing jumps while loading) and a lightweight preview via srcset.
 * Missing files show a colored placeholder, so the magazine never breaks.
 */
export function Photo({ photo, className, priority = false, aspect, fill = false, focus, sizes = '100vw' }: PhotoProps) {
  const file = findPhotoFile(photo.src)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!file || failedSrc === photo.src) {
    const fileName = photo.src.split('/').pop()
    return (
      <div
        role="img"
        aria-label={photo.alt}
        className={cn('grid place-items-center pattern-stripes text-center', toneFor(photo.src), fill && 'size-full', className)}
        style={{ aspectRatio: fill ? undefined : (aspect ?? PLACEHOLDER_RATIO) }}
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
      src={file.src}
      srcSet={file.thumb ? `${file.thumb} ${file.thumbWidth}w, ${file.src} ${file.width}w` : undefined}
      sizes={file.thumb ? sizes : undefined}
      alt={photo.alt}
      width={file.width}
      height={file.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      onError={() => setFailedSrc(photo.src)}
      className={cn('block w-full bg-paper-deep object-cover', fill ? 'h-full' : 'h-auto', className)}
      style={{ aspectRatio: aspect, objectPosition: focus }}
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
  /** On-screen width hint for picking the preview vs. the full photo */
  sizes?: string
}

export function Polaroid({ photo, className, style, rotate = -2, tape = 'butter', sizes }: PolaroidProps) {
  return (
    <figure
      className={cn(
        'relative rounded-md border-2 border-ink bg-[#fffdf8] p-2.5 shadow-hard',
        // A real polaroid's thick bottom edge, even without a caption
        photo.caption ? 'pb-1' : 'pb-7',
        className,
      )}
      style={{ rotate: `${rotate}deg`, ...style }}
    >
      {tape && <Tape color={tape} rotate={-rotate * 2 - 3} className="-top-3 left-1/2 -translate-x-1/2" />}
      <div className="overflow-hidden rounded-sm border-2 border-ink">
        <Photo photo={photo} sizes={sizes} className="w-full" />
      </div>
      {photo.caption && (
        <figcaption className="px-1 pt-1.5 pb-1 text-center font-hand text-[1.45rem] leading-tight text-ink">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  )
}
