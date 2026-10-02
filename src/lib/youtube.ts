declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
  }
}

const API_SRC = 'https://www.youtube.com/iframe_api'
const LOAD_TIMEOUT_MS = 15_000

let apiPromise: Promise<typeof YT> | null = null

/**
 * Loads the official YouTube IFrame Player API once and resolves with the
 * global `YT` namespace. Rejects on network failure or timeout (e.g. an ad
 * blocker), so callers can fall back to "no music" gracefully.
 */
export function loadYouTubeApi(): Promise<typeof YT> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise<typeof YT>((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }

    const timeout = window.setTimeout(() => reject(new Error('YouTube API load timed out')), LOAD_TIMEOUT_MS)

    // The API calls this global when ready. Chain any existing handler.
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      window.clearTimeout(timeout)
      resolve(window.YT)
    }

    const script = document.createElement('script')
    script.src = API_SRC
    script.async = true
    script.onerror = () => {
      window.clearTimeout(timeout)
      reject(new Error('YouTube API failed to load'))
    }
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    // Allow a retry on a later page load attempt
    apiPromise = null
    throw error
  })

  return apiPromise
}
