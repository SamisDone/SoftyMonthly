import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { NowPlaying } from '@/components/music/now-playing'
import { Button } from '@/components/ui/button'
import { magazine, pageTitles, ui } from '@/content'
import { useCurrentPage } from '@/hooks/use-current-page'
import { PAGE_COUNT, pageNumber, type PagePath } from '@/lib/pages'
import { PageStage } from './page-stage'

/** Left/right arrow keys flip pages on desktop. */
function useArrowKeyNavigation(prev?: PagePath, next?: PagePath) {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return
      // Leave arrow keys alone while a dialog (e.g. a big photo) is open
      if (document.querySelector('[role="dialog"][data-state="open"]')) return

      const to = event.key === 'ArrowRight' ? next : event.key === 'ArrowLeft' ? prev : undefined
      if (!to) return
      event.preventDefault()
      void navigate({ to })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate, prev, next])
}

function RunningHeader() {
  return (
    <header className="relative z-30 flex h-[calc(3.5rem+env(safe-area-inset-top))] shrink-0 items-center justify-between gap-2.5 border-b-2 border-ink bg-paper pt-[env(safe-area-inset-top)] pr-3 pl-4">
      <Link to="/" aria-label="Back to the cover" className="shrink-0 rounded-md leading-none whitespace-nowrap">
        <span className="font-display text-xl font-black tracking-tight">{magazine.name}</span>
        <span className="ml-0.5 font-hand text-xl font-bold text-cherry max-[374px]:hidden">{magazine.nameSuffix}</span>
      </Link>
      <NowPlaying />
    </header>
  )
}

function PageNav({ index, prev, next }: { index: number; prev?: PagePath; next?: PagePath }) {
  const current = index === -1 ? '??' : pageNumber(index)
  const total = pageNumber(PAGE_COUNT - 1)

  return (
    <nav
      aria-label="Magazine pages"
      className="relative z-30 flex shrink-0 items-center justify-between gap-3 border-t-2 border-ink bg-paper px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
    >
      {prev ? (
        <Button asChild variant="outline" size="icon">
          <Link to={prev} aria-label={`Previous page: ${pageTitles[prev].title}`}>
            <ChevronLeft strokeWidth={3} />
          </Link>
        </Button>
      ) : (
        <span aria-hidden className="size-11" />
      )}

      <Link
        to="/contents"
        aria-label={index === -1 ? 'Go to contents' : `Page ${index + 1} of ${PAGE_COUNT}. Go to contents`}
        className="rounded-full border-2 border-ink bg-butter px-4 py-1.5 font-display text-base font-bold tabular-nums shadow-hard-sm transition-[translate,box-shadow] duration-150 active:translate-x-px active:translate-y-px active:shadow-none"
      >
        {current} <span className="text-ink-soft">/</span> {total}
      </Link>

      {next ? (
        <Button asChild variant={index === 0 ? 'default' : 'outline'} size="icon">
          <Link to={next} aria-label={`Next page: ${pageTitles[next].title}`}>
            <ChevronRight strokeWidth={3} />
          </Link>
        </Button>
      ) : (
        <span aria-hidden className="size-11" />
      )}
    </nav>
  )
}

/** The phone-sized magazine. Full screen on phones, a centered "device" on desktop. */
export function MagazineFrame() {
  const { index, prev, next } = useCurrentPage()
  useArrowKeyNavigation(prev, next)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-desk pattern-dots sm:p-6">
      <div className="relative isolate flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-paper sm:h-[min(880px,calc(100dvh-4.5rem))] sm:rounded-[2.25rem] sm:border-2 sm:border-ink sm:shadow-hard-lg">
        <RunningHeader />
        <main className="relative flex-1 overflow-hidden">
          <PageStage />
        </main>
        <PageNav index={index} prev={prev} next={next} />
        <div aria-hidden className="paper-grain absolute inset-0 z-40" />
      </div>
      <p className="mt-3 hidden font-hand text-xl text-ink-soft sm:block">{ui.desktopHint}</p>
    </div>
  )
}
