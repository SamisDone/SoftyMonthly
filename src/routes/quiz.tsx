import { createFileRoute } from '@tanstack/react-router'
import { Check, RotateCcw, X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Heart, Sparkle, Star } from '@/components/magazine/doodles'
import { Page, PageKicker } from '@/components/magazine/page'
import { Button } from '@/components/ui/button'
import { quiz } from '@/content'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/quiz')({
  component: QuizPage,
})

const total = quiz.questions.length

function QuizPage() {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const nextButtonRef = useRef<HTMLButtonElement>(null)

  const isFinished = step >= total
  const question = quiz.questions[step]

  // Picking disables the options, so hand keyboard focus to the Next button
  useEffect(() => {
    if (picked !== null) nextButtonRef.current?.focus({ preventScroll: true })
  }, [picked])

  function pick(optionIndex: number) {
    if (picked !== null || !question) return
    setPicked(optionIndex)
    if (optionIndex === question.answer) setScore((s) => s + 1)
  }

  function advance() {
    setPicked(null)
    setStep((s) => s + 1)
  }

  function restart() {
    setPicked(null)
    setScore(0)
    setStep(0)
  }

  return (
    <Page tone="sage" dotted>
      <PageKicker number="09">{quiz.kicker}</PageKicker>
      <h1 className="mt-5 font-display text-[2.6rem] leading-[0.92] font-black tracking-tight">{quiz.title}</h1>
      <p className="mt-2 font-hand text-2xl">{quiz.intro}</p>

      {/* Progress dots */}
      <ol aria-label="Quiz progress" className="mt-5 flex gap-2">
        {quiz.questions.map((q, i) => (
          <li
            key={q.question}
            aria-label={`Question ${i + 1}${i < step ? ', done' : i === step ? ', current' : ''}`}
            className={cn(
              'h-3 flex-1 rounded-full border-2 border-ink transition-colors duration-300',
              i < step ? 'bg-cherry' : i === step ? 'bg-butter' : 'bg-paper',
            )}
          />
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        {isFinished ? (
          <QuizResult key="result" score={score} onRestart={restart} />
        ) : (
          question && (
            <m.section
              key={step}
              aria-labelledby={`quiz-q-${step}`}
              initial={{ opacity: 0, x: 40, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              // Short tween exit: with mode='wait' the next question waits for this to finish
              exit={{ opacity: 0, x: -40, rotate: -2, transition: { duration: 0.18, ease: 'easeIn' } }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="mt-6"
            >
              <p className="text-xs font-extrabold tracking-[0.18em] uppercase">
                {quiz.questionLabel} {step + 1} / {total}
              </p>
              <h2 id={`quiz-q-${step}`} className="mt-1 font-display text-2xl leading-tight font-bold">
                {question.question}
              </h2>

              <div className="mt-4 grid gap-3">
                {question.options.map((option, i) => {
                  const isAnswer = i === question.answer
                  const isPicked = i === picked
                  const revealed = picked !== null
                  return (
                    <m.button
                      key={option}
                      type="button"
                      onClick={() => pick(i)}
                      disabled={revealed}
                      aria-pressed={isPicked}
                      animate={revealed && isPicked && !isAnswer ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                      transition={{ duration: 0.4 }}
                      whileTap={revealed ? undefined : { scale: 0.96 }}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl border-2 border-ink px-4 py-3.5 text-left font-display text-lg leading-snug font-bold shadow-hard transition-colors duration-200 disabled:cursor-default',
                        !revealed && 'bg-paper hover:bg-butter',
                        revealed && isAnswer && 'bg-butter',
                        revealed && isPicked && !isAnswer && 'bg-blush',
                        revealed && !isPicked && !isAnswer && 'bg-paper opacity-60',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink text-sm font-black',
                          revealed && isAnswer ? 'bg-cherry text-paper' : 'bg-paper',
                        )}
                      >
                        {revealed && isAnswer ? (
                          <Check className="size-4" strokeWidth={3.5} />
                        ) : revealed && isPicked ? (
                          <X className="size-4" strokeWidth={3.5} />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      {option}
                    </m.button>
                  )
                })}
              </div>

              <div aria-live="polite" className="mt-5 min-h-24">
                {picked !== null && (
                  <m.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex items-center justify-between gap-3"
                  >
                    <p className="flex items-center gap-1.5 font-hand text-[1.7rem] leading-tight font-bold">
                      {picked === question.answer ? (
                        <>
                          <Star className="size-7 shrink-0" />
                          {quiz.correctReactions[step % quiz.correctReactions.length]}
                        </>
                      ) : (
                        quiz.wrongReactions[step % quiz.wrongReactions.length]
                      )}
                    </p>
                    <Button ref={nextButtonRef} onClick={advance} variant="default" className="shrink-0">
                      {step + 1 < total ? quiz.nextLabel : quiz.resultsLabel}
                    </Button>
                  </m.div>
                )}
              </div>
            </m.section>
          )
        )}
      </AnimatePresence>
    </Page>
  )
}

function QuizResult({ score, onRestart }: { score: number; onRestart: () => void }) {
  const result = quiz.results.find((r) => score >= r.minScore) ?? quiz.results[quiz.results.length - 1]

  return (
    <m.section
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className="relative mt-8 rounded-3xl border-2 border-ink bg-paper px-5 pt-8 pb-6 text-center shadow-hard-lg"
    >
      <div className="absolute -top-7 left-1/2 grid size-16 -translate-x-1/2 rotate-6 place-items-center rounded-full border-2 border-ink bg-cherry font-display text-xl font-black text-paper tabular-nums shadow-hard">
        {score}/{total}
      </div>
      <Sparkle className="absolute top-3 left-4" color="var(--butter)" />
      <Heart className="absolute top-4 right-4 size-7 rotate-12" />

      <p className="mt-2 text-xs font-extrabold tracking-[0.2em] uppercase">{quiz.resultHeading}</p>
      <h2 className="mt-1 font-display text-[2.2rem] leading-tight font-black text-cherry">{result?.title}</h2>
      <p className="mt-3 text-[1.02rem] leading-relaxed font-semibold">{result?.message}</p>

      <Button onClick={onRestart} variant="secondary" className="mt-6">
        <RotateCcw strokeWidth={3} />
        {quiz.retryLabel}
      </Button>
    </m.section>
  )
}
