import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { notFound } from '@/content'
import { Squiggle, Star, Tape } from './doodles'
import { Page, PageKicker } from './page'

/** A jagged "ripped paper" bottom edge, generated once. */
const TORN_EDGE = (() => {
  const steps = 18
  const points = ['0 0', '100% 0']
  for (let i = 0; i <= steps; i++) {
    const x = 100 - (i * 100) / steps
    const y = i % 2 === 0 ? 93 : 86 + ((i * 7) % 5)
    points.push(`${x}% ${y}%`)
  }
  return `polygon(${points.join(', ')})`
})()

export function NotFoundPage() {
  return (
    <Page tone="periwinkle" dotted fit className="items-center justify-center text-center">
      <PageKicker className="absolute top-[clamp(0.75rem,3.2cqh,1.5rem)] left-5">{notFound.kicker}</PageKicker>

      <div className="relative mt-[clamp(0.75rem,4cqh,2rem)] w-full max-w-xs shrink-0" style={{ rotate: '-3deg', filter: 'drop-shadow(4px 4px 0 var(--ink))' }}>
        <Tape color="butter" rotate={8} className="-top-3 left-6 z-10" />
        <div
          className="border-2 border-ink bg-paper px-6 pt-[clamp(1rem,4cqh,2rem)] pb-[clamp(2.5rem,8cqh,4rem)]"
          style={{ clipPath: TORN_EDGE, borderRadius: '1.5rem 1.5rem 0 0' }}
        >
          <p className="font-display text-7xl leading-none font-black text-cherry">404</p>
          <Squiggle className="mx-auto mt-2" />
          <h1 className="mt-4 font-display text-2xl leading-tight font-bold">{notFound.title}</h1>
        </div>
      </div>

      <p className="mt-[clamp(0.75rem,3cqh,1.5rem)] max-w-xs shrink-0 text-base font-semibold">{notFound.message}</p>
      <Star className="mt-[clamp(0.5rem,2cqh,1rem)] size-10 shrink-0 animate-float" />

      <Button asChild size="lg" variant="secondary" className="mt-[clamp(0.75rem,3cqh,1.5rem)] shrink-0">
        <Link to="/">{notFound.backLabel}</Link>
      </Button>
    </Page>
  )
}
