import { Pause, Play } from 'lucide-react'
import { music } from '@/content'
import { cn } from '@/lib/utils'
import { useMusic } from './music-context'

function Equalizer({ active }: { active: boolean }) {
  return (
    <span aria-hidden className="flex h-2.5 items-end gap-[2px]">
      {[0, 0.25, 0.5].map((delay) => (
        <span
          key={delay}
          className={cn('block h-full w-[3px] origin-bottom rounded-full bg-cherry', active ? 'animate-eq' : 'scale-y-30')}
          style={{ animationDelay: `-${delay}s` }}
        />
      ))}
    </span>
  )
}

/**
 * Floating "Now Playing" sticker. The real YouTube iframe sits inside the
 * little screen (visible, never display:none). Hides itself if loading fails.
 */
export function NowPlaying({ className }: { className?: string }) {
  const { status, isPlaying, toggle, playerSlotRef } = useMusic()
  if (status === 'error') return null

  return (
    <section
      aria-label="Background music"
      className={cn(
        'flex min-w-0 items-center gap-1.5 rounded-2xl border-2 border-ink bg-butter p-1 shadow-hard-sm [--tilt:2deg] [rotate:var(--tilt)] hover:animate-wobble',
        className,
      )}
    >
      <div className="relative h-[30px] w-[52px] shrink-0 overflow-hidden rounded-[0.6rem] border-2 border-ink bg-ink">
        <img
          src={`https://i.ytimg.com/vi/${music.youtubeId}/mqdefault.jpg`}
          alt=""
          width={320}
          height={180}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
        <div ref={playerSlotRef} className="absolute inset-0 [&_iframe]:block [&_iframe]:size-full" />
      </div>

      <div className="w-[5.6rem] min-w-0 leading-none">
        <p className="flex items-center gap-1 text-[0.5rem] font-extrabold tracking-[0.1em] whitespace-nowrap uppercase">
          {music.label}
          <Equalizer active={isPlaying} />
        </p>
        <p className="mt-0.5 truncate font-display text-[0.82rem] font-bold">{music.title}</p>
        <p className="truncate text-[0.62rem] font-semibold text-ink-soft">{music.artist}</p>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        aria-busy={status === 'loading'}
        className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-cherry text-paper shadow-hard-sm transition-[translate,box-shadow,scale] duration-150 active:translate-x-px active:translate-y-px active:scale-90 active:shadow-none"
      >
        {isPlaying ? <Pause className="size-3.5" fill="currentColor" /> : <Play className="size-3.5 translate-x-px" fill="currentColor" />}
      </button>
    </section>
  )
}
