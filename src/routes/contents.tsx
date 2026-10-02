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
    <Page tone="paper">
      <PageKicker number="02">{magazine.edition}</PageKicker>

      <h1 className="mt-5 font-display text-6xl leading-none font-black tracking-tight">{contentsPage.title}</h1>
      <Squiggle className="mt-2 w-40" />
      <p className="mt-2 font-hand text-2xl text-ink-soft">{contentsPage.subtitle}</p>

      <ol className="mt-6">
        {entries.map(({ path, index }, i) => (
          <li key={path} className="relative">
            <Link
              to={path}
              className="group flex items-center gap-4 border-b-2 border-dashed border-ink/25 py-3.5 transition-[translate] duration-150 active:translate-x-1"
            >
              <span
                className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-ink font-display text-xl font-black tabular-nums shadow-hard-sm transition-[rotate] duration-200 group-hover:rotate-6',
                  NUMBER_TONES[i % NUMBER_TONES.length],
                  i % 2 ? 'rotate-3' : '-rotate-3',
                )}
              >
                {pageNumber(index)}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl leading-tight font-bold">{pageTitles[path].title}</span>
                <span className="block font-hand text-xl leading-tight text-ink-soft">{pageTitles[path].blurb}</span>
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

      <div className="mt-6 flex items-center justify-center gap-2 text-ink-soft">
        <Arrow className="-scale-x-100 -rotate-12" />
        <p className="font-hand text-xl">{contentsPage.swipeHint}</p>
        <Heart className="size-6" />
      </div>
    </Page>
  )
}
