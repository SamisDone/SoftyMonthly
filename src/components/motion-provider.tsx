import { LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

const loadFeatures = () => import('@/lib/motion-features').then((module) => module.default)

/**
 * Motion features load in a separate chunk to keep the first paint light.
 * `reducedMotion="user"` honors prefers-reduced-motion: transforms are
 * skipped and only opacity animates.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
