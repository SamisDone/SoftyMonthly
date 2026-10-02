import photoFiles from 'virtual:photos'
import { cover, letter, photoSpread, story, type Photo } from '@/content'

export type PhotoFile = (typeof photoFiles)[number]

const bySrc = new Map(photoFiles.map((photo) => [photo.src, photo]))

/** Real size + preview info for a photo path, or undefined if the file isn't there. */
export function findPhotoFile(src: string): PhotoFile | undefined {
  return bySrc.get(src)
}

/** Every photo in public/photos, in number order (photo2 before photo10). */
export const allPhotoFiles: readonly PhotoFile[] = photoFiles

/**
 * The photo spread: every photo in the folder except the ones already used on
 * the cover, letter and story, with any captions from content.ts.
 */
export function getSpreadPhotos(): Photo[] {
  const usedElsewhere = new Set([cover.photo.src, letter.photo.src, story.photo.src])
  return allPhotoFiles
    .filter((file) => !usedElsewhere.has(file.src))
    .map((file) => {
      const caption = photoSpread.captions[file.file]
      return { src: file.src, alt: caption ?? photoSpread.defaultAlt, caption }
    })
}
