import { createFileRoute } from '@tanstack/react-router'
import { Heart, Squiggle, Star } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { Polaroid } from '@/components/magazine/photo'
import { Badge } from '@/components/ui/badge'
import { story } from '@/content'

export const Route = createFileRoute('/story')({
  component: StoryPage,
})

function StoryPage() {
  return (
    <Page tone="paper">
      <PageKicker number="04">{story.section}</PageKicker>

      <header className="relative mt-6">
        <Badge variant="cherry" className="-rotate-3">
          {story.kicker}
        </Badge>
        <h1 className="mt-3 font-display text-[3.6rem] leading-[0.9] font-black tracking-tight">{story.title}</h1>
        <Star className="absolute top-0 right-1 size-10 rotate-12 animate-wobble [--tilt:12deg]" />
        <p className="mt-3 font-display text-xl leading-snug font-medium text-ink-soft italic">{story.deck}</p>
        <p className="mt-3 border-y-2 border-ink py-1.5 text-[0.68rem] font-extrabold tracking-[0.14em] uppercase">
          {story.byline}
        </p>
      </header>

      <Polaroid photo={story.photo} rotate={-2} tape="sage" className="mx-1 mt-7" />

      <div className="mt-8 space-y-4 text-[1.04rem] leading-relaxed">
        {story.before.map((paragraph, i) => (
          <p key={paragraph} className={i === 0 ? 'drop-cap' : undefined}>
            {paragraph}
          </p>
        ))}
      </div>

      <figure className="relative my-9 rotate-[-1.5deg] rounded-3xl border-2 border-ink bg-periwinkle px-5 pt-9 pb-5 shadow-hard-lg">
        <span
          aria-hidden
          className="absolute -top-7 left-4 font-display text-[6rem] leading-none font-black text-cherry [paint-order:stroke_fill] [-webkit-text-stroke:3px_var(--ink)]"
        >
          &ldquo;
        </span>
        <blockquote className="font-display text-[1.7rem] leading-tight font-bold italic">{story.pullQuote}</blockquote>
        <Squiggle className="mt-3" color="var(--ink)" />
      </figure>

      <div className="space-y-4 text-[1.04rem] leading-relaxed">
        {story.after.map((paragraph, i) => (
          <p key={paragraph}>
            {paragraph}
            {i === story.after.length - 1 && <Heart className="ml-1.5 inline-block size-5 -translate-y-0.5" />}
          </p>
        ))}
      </div>
    </Page>
  )
}
