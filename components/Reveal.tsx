'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

// Calm scroll reveal: rise and fade, once, never replayed on scroll back.
//
// Travel is 40px, between the site's 24px load reveals and the 6rem the
// reference site uses. The curve is expo-out, which spends most of its time
// decelerating, so things arrive rather than snap. Reduced motion keeps the
// fade and drops the movement entirely.
//
// `delay` staggers siblings by hand rather than through a variant tree, since
// every use here is a short list and a parent/child variant setup would be
// more machinery than the effect is worth.

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number
  /** px of upward travel; 0 fades in place */
  y?: number
}

export default function Reveal({
  delay = 0,
  y = 40,
  children,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      // once: the page should settle as you read it, not re-animate on the way
      // back up. The negative bottom margin starts it just before it is on
      // screen so the movement is finishing as it becomes readable.
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{
        duration: reduceMotion ? 0.3 : 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
