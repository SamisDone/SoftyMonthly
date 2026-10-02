import { createFileRoute, Link } from '@tanstack/react-router'
import { Arrow, Heart, Squiggle } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { contentsPage, magazine, pageTitles } from '@/content'
import { cn } from '@/lib/utils'
import { PAGE_ORDER, pageNumber } from '@/lib/pages'

export const Route = createFileRoute('/contents')({
  component: ContentsPage,
})

const NUMBER_TONES = ['bg-butter', 'bg-periwinkle', 'bg-sage', 'bg-cherry text-paper'] as const

function ContentsPage() {
  const entries = PAGE_ORDER.map((path, index) => ({ path, index })).filter(({ path }) => path !== '/contents')

  return (
    <Page tone="paper" fit>
      <PageKicker number="02">{magazine.edition}</PageKicker>

      <h1 className="mt-[clamp(0.5rem,2.4cqh,1.25rem)] shrink-0 font-display text-[clamp(2.2rem,8cqh,3.75rem)] leading-none font-black tracking-tight">
        {contentsPage.title}
      </h1>
      <Squiggle className="mt-1.5 w-40 shrink-0" />
      <p className="mt-1 shrink-0 font-hand text-2xl text-ink-soft [@container(max-height:640px)]:hidden">{contentsPage.subtitle}</p>

      {/* The entries share whatever height is left */}
      <ol className="mt-[clamp(0.25rem,1.6cqh,1rem)] flex min-h-0 flex-1 flex-col justify-evenly">
        {entries.map(({ path, index }, i) => (
          <li key={path} className="relative">
            <Link
              to={path}
              className="group flex items-center gap-4 border-b-2 border-dashed border-ink/25 py-[clamp(0.1rem,0.7cqh,0.75rem)] transition-[translate] duration-150 active:translate-x-1"
            >
              <span
                className={cn(
                  'grid size-[clamp(2rem,5.2cqh,3rem)] shrink-0 place-items-center rounded-2xl border-2 border-ink font-display text-[clamp(0.95rem,2.6cqh,1.25rem)] font-black tabular-nums shadow-hard-sm transition-[rotate] duration-200 group-hover:rotate-6',
                  NUMBER_TONES[i % NUMBER_TONES.length],
                  i % 2 ? 'rotate-3' : '-rotate-3',
                )}
              >
                {pageNumber(index)}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[clamp(0.95rem,2.7cqh,1.25rem)] leading-tight font-bold">{pageTitles[path].title}</span>
                <span className="block font-hand text-[clamp(0.95rem,2.6cqh,1.25rem)] leading-none text-ink-soft">{pageTitles[path].blurb}</span>
              </span>
            </Link>

            {path === '/top-10' && (
              <span aria-hidden className="pointer-events-none absolute -top-3 -right-1 flex items-center">
                <span className="rotate-6 rounded-full border-2 border-ink bg-butter px-2.5 py-0.5 font-hand text-lg font-bold shadow-hard-sm">
                  {contentsPage.editorsPick}
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-[clamp(0.25rem,1.6cqh,1.5rem)] flex shrink-0 items-center justify-center gap-2 text-ink-soft [@container(max-height:700px)]:hidden">
        <Arrow className="-scale-x-100 -rotate-12" />
        <p className="font-hand text-xl">{contentsPage.swipeHint}</p>
        <Heart className="size-6" />
      </div>
    </Page>
  )
}
