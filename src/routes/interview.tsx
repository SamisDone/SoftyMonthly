import { createFileRoute } from '@tanstack/react-router'
import { Sparkle, Squiggle } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { interview, people } from '@/content'

export const Route = createFileRoute('/interview')({
  component: InterviewPage,
})

function InterviewPage() {
  return (
    <Page tone="butter" dotted>
      <PageKicker number="06">{interview.kicker}</PageKicker>

      <div className="relative mt-6">
        <Badge variant="periwinkle" className="rotate-[-4deg]">
          {interview.badge}
        </Badge>
        <h1 className="mt-3 font-display text-[3.4rem] leading-[0.9] font-black tracking-tight">{interview.title}</h1>
        <Squiggle className="mt-2 w-36" />
        <Sparkle className="absolute top-0 right-2 size-10 animate-float" color="var(--paper)" />
      </div>

      <p className="mt-4 rounded-2xl border-2 border-ink bg-paper p-4 text-[1.02rem] leading-relaxed font-medium shadow-hard">
        {interview.intro}
      </p>

      <Accordion type="single" collapsible defaultValue="q-0" className="mt-6">
        {interview.questions.map(({ q, a }, i) => (
          <AccordionItem key={q} value={`q-${i}`} className={i % 2 ? 'rotate-[0.6deg]' : 'rotate-[-0.6deg]'}>
            <AccordionTrigger>
              <span className="flex items-start gap-2.5">
                <span aria-hidden className="mt-0.5 font-display text-base font-black text-cherry">
                  Q.
                </span>
                <span>{q}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="flex items-start gap-2.5 text-[1.02rem] leading-relaxed">
                <span aria-hidden className="font-display font-black text-ink-soft">
                  A.
                </span>
                <span>
                  <span className="sr-only">{people.him} says: </span>
                  {a}
                </span>
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Page>
  )
}
