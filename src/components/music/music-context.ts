import { createContext, useContext } from 'react'

export type MusicStatus =
  /** API not requested yet */
  | 'idle'
  /** API / player loading */
  | 'loading'
  /** Player ready, not playing */
  | 'ready'
  | 'playing'
  | 'paused'
  /** Failed to load: the sticker hides and the magazine carries on silently */
  | 'error'

export type MusicContextValue = {
  status: MusicStatus
  isPlaying: boolean
  /** Start playback. Call it directly inside a tap/click handler so mobile browsers allow sound. */
  start: () => void
  toggle: () => void
  /** Callback ref for the element the YouTube iframe is mounted into. */
  playerSlotRef: (element: HTMLDivElement | null) => void
}

export const MusicContext = createContext<MusicContextValue | null>(null)

export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext)
  if (!context) throw new Error('useMusic must be used inside <MusicProvider>')
  return context
}
