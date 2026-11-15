'use client'

import { MotionConfig } from 'motion/react'

// Every motion/react animation on the site follows the visitor's reduced
// motion setting: transforms and layout moves are skipped, opacity still
// fades. One wrapper here instead of a check in each component.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
