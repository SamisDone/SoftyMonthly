import { createRootRoute } from '@tanstack/react-router'
import { MagazineFrame } from '@/components/magazine/frame'
import { NotFoundPage } from '@/components/magazine/not-found-page'
import { MotionProvider } from '@/components/motion-provider'
import { MusicProvider } from '@/components/music/music-provider'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

/**
 * The root layout never unmounts, so the music player (inside MusicProvider and
 * the frame's "Now Playing" sticker) keeps playing smoothly across page turns.
 * Pages are rendered by <PageStage> inside the frame (see why in page-stage.tsx).
 */
function RootLayout() {
  return (
    <MotionProvider>
      <MusicProvider>
        <MagazineFrame />
      </MusicProvider>
    </MotionProvider>
  )
}
