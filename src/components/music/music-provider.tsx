import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { music } from '@/content'
import { loadYouTubeApi } from '@/lib/youtube'
import { MusicContext, type MusicContextValue, type MusicStatus } from './music-context'

const FADE_MS = 2000
const FADE_STEP_MS = 50
/** If the player hasn't reported ready by then, give up and hide the sticker. */
const READY_TIMEOUT_MS = 20_000

function isActivelyPlaying(player: YT.Player) {
  const state = player.getPlayerState()
  return state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING
}

/**
 * Background music via the official YouTube IFrame Player API.
 * Lives in the root layout, so it never unmounts and keeps playing across pages.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<MusicStatus>('idle')
  const [shouldLoad, setShouldLoad] = useState(false)
  const [slot, setSlot] = useState<HTMLDivElement | null>(null)

  const playerRef = useRef<YT.Player | null>(null)
  const wantsPlayRef = useRef(false)
  const needsFadeRef = useRef(false)
  const pausedByHiddenRef = useRef(false)
  const fadeTimerRef = useRef<number | undefined>(undefined)

  const stopFade = useCallback(() => {
    window.clearInterval(fadeTimerRef.current)
    fadeTimerRef.current = undefined
  }, [])

  const fadeIn = useCallback(
    (player: YT.Player) => {
      stopFade()
      const startedAt = performance.now()
      player.setVolume(0)
      fadeTimerRef.current = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - startedAt) / FADE_MS)
        player.setVolume(Math.round(music.volume * progress))
        if (progress >= 1) stopFade()
      }, FADE_STEP_MS)
    },
    [stopFade],
  )

  const play = useCallback((player: YT.Player) => {
    // Start silent; the fade kicks in once YouTube reports PLAYING
    player.setVolume(0)
    if (player.isMuted()) player.unMute()
    needsFadeRef.current = true
    player.playVideo()
  }, [])

  // Warm up the API when the browser is idle, so the first tap starts music instantly
  // without competing with the magazine's own first paint.
  useEffect(() => {
    if (shouldLoad) return
    const load = () => setShouldLoad(true)
    // Safari has no requestIdleCallback
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(load, 1500)
    return () => window.clearTimeout(id)
  }, [shouldLoad])

  // Create the player inside the sticker's slot
  useEffect(() => {
    if (!shouldLoad || !slot) return

    let cancelled = false
    let player: YT.Player | undefined
    const readyTimeout = window.setTimeout(() => {
      if (!cancelled && !playerRef.current) setStatus('error')
    }, READY_TIMEOUT_MS)

    loadYouTubeApi()
      .then((api) => {
        if (cancelled) return
        // YouTube replaces the target element with its iframe, so give it a
        // node React doesn't own.
        const host = document.createElement('div')
        slot.appendChild(host)

        player = new api.Player(host, {
          width: '100%',
          height: '100%',
          videoId: music.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: music.youtubeId, // required for loop=1 to work on a single video
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              if (cancelled) return
              window.clearTimeout(readyTimeout)
              playerRef.current = target
              target.setVolume(music.volume)
              setStatus('ready')
              if (wantsPlayRef.current) {
                wantsPlayRef.current = false
                play(target)
              }
            },
            onStateChange: ({ target, data }) => {
              if (cancelled) return
              if (data === api.PlayerState.PLAYING) {
                setStatus('playing')
                if (needsFadeRef.current) {
                  needsFadeRef.current = false
                  fadeIn(target)
                }
              } else if (data === api.PlayerState.PAUSED) {
                setStatus('paused')
              } else if (data === api.PlayerState.ENDED) {
                // Belt and braces in case loop=1 is ignored
                target.seekTo(0, true)
                target.playVideo()
              }
            },
            onError: () => {
              if (!cancelled) setStatus('error')
            },
          },
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      window.clearTimeout(readyTimeout)
      stopFade()
      player?.destroy()
      playerRef.current = null
      slot.replaceChildren()
    }
  }, [shouldLoad, slot, play, fadeIn, stopFade])

  // Pause while the tab is hidden, resume (with a fresh fade) when it comes back
  useEffect(() => {
    const onVisibilityChange = () => {
      const player = playerRef.current
      if (!player) return
      if (document.hidden) {
        if (isActivelyPlaying(player)) {
          pausedByHiddenRef.current = true
          stopFade()
          player.pauseVideo()
        }
      } else if (pausedByHiddenRef.current) {
        pausedByHiddenRef.current = false
        play(player)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [play, stopFade])

  const start = useCallback(() => {
    setShouldLoad(true)
    const player = playerRef.current
    // Calling playVideo synchronously inside the tap handler is what lets
    // mobile browsers allow sound. If not ready yet, play as soon as it is.
    if (player) {
      if (!isActivelyPlaying(player)) play(player)
    } else {
      wantsPlayRef.current = true
    }
  }, [play])

  const toggle = useCallback(() => {
    const player = playerRef.current
    if (player && isActivelyPlaying(player)) {
      stopFade()
      pausedByHiddenRef.current = false
      player.pauseVideo()
    } else {
      start()
    }
  }, [start, stopFade])

  const value = useMemo<MusicContextValue>(
    () => ({
      status: status === 'idle' && shouldLoad ? 'loading' : status,
      isPlaying: status === 'playing',
      start,
      toggle,
      playerSlotRef: setSlot,
    }),
    [status, shouldLoad, start, toggle],
  )

  return <MusicContext value={value}>{children}</MusicContext>
}
