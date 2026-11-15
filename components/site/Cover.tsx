'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import type { Frame } from '@/lib/photos'

const HOLD_MS = 7000

// Travel, not an entrance: the incoming photo pushes in from the side while
// the outgoing one drifts a little the same way and dims, like a slide tray.
const EASE = [0.65, 0, 0.35, 1] as const

// My photos full screen behind whatever the page puts over them, one
// sliding in after another every seven seconds. The first frame is rendered on
// the server so the cover never starts dark. No visible controls; a pause
// that appears on keyboard focus keeps the slideshow
// stoppable, since anything that moves on its own for more than five seconds
// needs a way to stop it. With reduced motion nothing advances on its own and
// a change is a plain fade.
export default function Cover({ frames, children }: { frames: Frame[]; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1])
  const [playing, setPlaying] = useState(true)
  // Paused while keyboard focus is in the controls, so a bar is not pulled
  // out from under someone choosing it
  const [held, setHeld] = useState(false)
  const many = frames.length > 1

  useEffect(() => {
    if (reduceMotion) setPlaying(false)
  }, [reduceMotion])


  useEffect(() => {
    if (!many || !playing || held) return
    const t = setTimeout(() => setSlide(([i]) => [(i + 1) % frames.length, 1]), HOLD_MS)
    return () => clearTimeout(t)
  }, [index, playing, held, many, frames.length])

  // Fetch the next photo early so it is there when it slides in
  useEffect(() => {
    if (!many) return
    const next = new window.Image()
    next.src = frames[(index + 1) % frames.length].src
  }, [index, many, frames])

  const frame = frames[index]
  const slide = {
    enter: (dir: number) => (reduceMotion ? { opacity: 0, zIndex: 2 } : { x: `${dir * 100}%`, zIndex: 2 }),
    center: { x: '0%', opacity: 1, filter: 'brightness(1)', zIndex: 2 },
    exit: (dir: number) =>
      reduceMotion ? { opacity: 0, zIndex: 1 } : { x: `${dir * -28}%`, filter: 'brightness(0.5)', zIndex: 1 },
  }

  return (
    <section className="cover" aria-roledescription="carousel" aria-label="Photos">
      {/* Its own layer, so the slides' stacking stays under the shade and text */}
      <div className="cover-slides">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={frame.src}
          className="cover-slide"
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0.4 : 0.9, ease: EASE }}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${frames.length}: ${frame.place}`}
        >
          <Image
            src={frame.src}
            alt={frame.alt}
            fill
            sizes="100vw"
            priority={index === 0}
            draggable={false}
            className="cover-img"
            style={{ objectPosition: frame.focus ?? '50% 50%' }}
          />
        </motion.div>
      </AnimatePresence>
      </div>
      <div className="cover-shade" aria-hidden />

      <div className="cover-body wrap">
        <div className="min-w-0">{children}</div>
        <div
          className="cover-meta"
          onFocus={() => setHeld(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false)
          }}
        >
          {/* No visible photo controls. The slideshow still changes on its
              own, so a pause stays
              for keyboard users (WCAG 2.2.2): hidden until it has focus, then a
              glass pill, like the skip link. */}
          {many && (
            <button
              type="button"
              className="cover-pause-key glass"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause the photos' : 'Play the photos'}
            >
              {playing ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
              <span>{playing ? 'Pause photos' : 'Play photos'}</span>
            </button>
          )}
          <p className="cover-place">{frame.place}</p>
        </div>
      </div>
    </section>
  )
}
