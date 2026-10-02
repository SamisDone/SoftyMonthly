import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import type { Plugin } from 'vite'

/**
 * Photo manifest + previews.
 *
 * Scans public/photos and exposes `virtual:photos`: every image with its real
 * pixel size (so <img> width/height are exact and nothing jumps while loading)
 * and a small WebP preview for grids. Previews are generated once into
 * public/photos/thumbs and regenerated only when the original changes, so
 * Vite serves them in dev and copies them into the build automatically.
 */

const VIRTUAL_ID = 'virtual:photos'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const IMAGE_FILE = /\.(jpe?g|png|webp|avif)$/i
const THUMB_DIR = 'thumbs'
/** Wide enough for a half-screen polaroid on a 3x phone screen */
export const THUMB_WIDTH = 560
const THUMB_QUALITY = 72

export type PhotoFile = {
  /** File name, e.g. "photo12.jpg" */
  file: string
  /** Public URL of the original, e.g. "/photos/photo12.jpg" */
  src: string
  width: number
  height: number
  /** Small WebP preview (absent when the original is already small) */
  thumb?: string
  thumbWidth?: number
}

/** photo2 before photo10 */
const naturalOrder = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare

async function readPhoto(dir: string, file: string): Promise<PhotoFile> {
  const original = path.join(dir, file)
  const meta = await sharp(original).metadata()
  // EXIF orientations 5-8 are rotated 90°, so the displayed size is swapped
  const rotated = (meta.orientation ?? 1) >= 5
  const width = (rotated ? meta.height : meta.width) ?? 1
  const height = (rotated ? meta.width : meta.height) ?? 1
  const photo: PhotoFile = { file, src: `/photos/${file}`, width, height }

  if (width > THUMB_WIDTH) {
    const thumbFile = `${file.replace(IMAGE_FILE, '')}-${THUMB_WIDTH}.webp`
    const thumbPath = path.join(dir, THUMB_DIR, thumbFile)
    const [originalStat, thumbStat] = await Promise.all([
      fs.stat(original),
      fs.stat(thumbPath).catch(() => null),
    ])
    if (!thumbStat || thumbStat.mtimeMs < originalStat.mtimeMs) {
      await sharp(original)
        .rotate() // apply EXIF orientation
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: THUMB_QUALITY })
        .toFile(thumbPath)
    }
    photo.thumb = `/photos/${THUMB_DIR}/${thumbFile}`
    photo.thumbWidth = THUMB_WIDTH
  }
  return photo
}

export function photosPlugin(): Plugin {
  let photosDir = ''

  async function buildManifest(): Promise<PhotoFile[]> {
    const entries = await fs.readdir(photosDir, { withFileTypes: true }).catch(() => [])
    const files = entries
      .filter((entry) => entry.isFile() && IMAGE_FILE.test(entry.name))
      .map((entry) => entry.name)
      .sort(naturalOrder)
    if (files.length) await fs.mkdir(path.join(photosDir, THUMB_DIR), { recursive: true })
    return Promise.all(files.map((file) => readPhoto(photosDir, file)))
  }

  return {
    name: 'magazine-photos',

    configResolved(config) {
      photosDir = path.join(config.publicDir, 'photos')
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    async load(id) {
      if (id !== RESOLVED_ID) return
      const manifest = await buildManifest()
      return `export default ${JSON.stringify(manifest)}`
    },

    // Adding, replacing or removing a photo updates the magazine without a restart
    configureServer(server) {
      server.watcher.add(photosDir)
      const onChange = (file: string) => {
        const inPhotos = path.dirname(path.resolve(file)) === path.resolve(photosDir)
        if (!inPhotos || !IMAGE_FILE.test(file)) return
        const client = server.environments.client
        const module = client.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) client.moduleGraph.invalidateModule(module)
        client.hot.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}
