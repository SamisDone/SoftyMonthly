import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { music } from '@/content'
import { loadYouTubeApi } from '@/lib/youtube'
import { MusicContext, type MusicContextValue, type MusicStatus } from './music-context'

const FADE_MS = 2000
const FADE_STEP_MS = 50
/** If the player hasn't reported ready by then, give up and hide the sticker. */
const READY_TIMEOUT_MS = 20_000
/** How long to wait for an autoplay attempt before assuming the browser blocked it. */
const AUTOPLAY_CHECK_MS = 2500
/** Events that count as a user gesture, so the browser lets audio start. */
const GESTURE_EVENTS = ['pointerup', 'touchend', 'keydown'] as const

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
  /** Autoplay was blocked: start on the visitor's first tap/swipe/key press anywhere. */
  const [awaitingGesture, setAwaitingGesture] = useState(false)

  const playerRef = useRef<YT.Player | null>(null)
  const wantsPlayRef = useRef(music.autoplay)
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

  // Load the player as soon as the page itself has loaded, so music can start
  // right away without competing with the cover photo and fonts.
  useEffect(() => {
    if (shouldLoad) return
    const load = () => setShouldLoad(true)
    if (document.readyState === 'complete') {
      load()
      return
    }
    window.addEventListener('load', load, { once: true })
    return () => window.removeEventListener('load', load)
  }, [shouldLoad])

  // Create the player inside the sticker's slot
  useEffect(() => {
    if (!shouldLoad || !slot) return

    let cancelled = false
    let player: YT.Player | undefined
    let autoplayCheck: number | undefined
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
                // Browsers block sound until the visitor interacts (iPhones always do).
                // If it didn't start, or YouTube fell back to silent playback, wait for
                // the first tap/swipe/key press instead.
                autoplayCheck = window.setTimeout(() => {
                  if (cancelled) return
                  if (target.getPlayerState() !== api.PlayerState.PLAYING || target.isMuted()) setAwaitingGesture(true)
                }, AUTOPLAY_CHECK_MS)
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
      window.clearTimeout(autoplayCheck)
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
      if (!isActivelyPlaying(player)) {
        play(player)
      } else if (player.isMuted()) {
        // YouTube was playing silently after a blocked autoplay: restart with sound
        player.seekTo(0, true)
        player.unMute()
        fadeIn(player)
      }
    } else {
      wantsPlayRef.current = true
    }
  }, [play, fadeIn])

  // Blocked autoplay: the first gesture anywhere on the page starts the music.
  // start() runs synchronously inside the event, which is what unlocks audio.
  useEffect(() => {
    if (!awaitingGesture) return
    const onGesture = () => {
      setAwaitingGesture(false)
      start()
    }
    for (const type of GESTURE_EVENTS) window.addEventListener(type, onGesture, { capture: true })
    return () => {
      for (const type of GESTURE_EVENTS) window.removeEventListener(type, onGesture, { capture: true })
    }
  }, [awaitingGesture, start])

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
