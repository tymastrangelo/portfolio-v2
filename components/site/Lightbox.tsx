'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import ModalShell from '@/components/ModalShell'
import LoopVideo from '@/components/site/LoopVideo'
import type { Frame } from '@/lib/photos'

// The lightbox opens like a lens: a six-bladed aperture, closed to a point,
// swings open over the frame. Same six vertices in both states so the shape
// interpolates; the open hexagon is big enough to clear every corner.
function iris(r: number) {
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k + Math.PI / 6
    return `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`
  })
  return `polygon(${pts.join(', ')})`
}
const IRIS_SHUT = iris(0)
const IRIS_OPEN = iris(92)

// One photo of an album, as large as the window allows, with the rest a step
// away: arrow buttons, the arrow keys, or a swipe. Escape, a click outside the
// photo and the close button all close it, and focus goes back to the
// thumbnail that opened it.
export default function Lightbox({
  frames,
  index,
  onIndex,
  onClose,
}: {
  frames: Frame[]
  index: number | null
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const reduceMotion = useReducedMotion()
  const frame = index !== null ? frames[index] : null
  const many = frames.length > 1

  useEffect(() => {
    if (index === null || !many) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % frames.length)
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + frames.length) % frames.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, many, frames.length, onIndex])

  const step = (d: number) => index !== null && onIndex((index + d + frames.length) % frames.length)

  return (
    <AnimatePresence>
      {frame && index !== null && (
        <ModalShell label={`Photo ${index + 1} of ${frames.length}`} onClose={onClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="lightbox"
            onClick={onClose}
          >
            <button type="button" onClick={onClose} aria-label="Close photo" className="icon-btn lightbox-close">
              <X className="h-4 w-4" aria-hidden />
            </button>
            {many && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                  aria-label="Previous photo"
                  className="icon-btn lightbox-prev"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                  aria-label="Next photo"
                  className="icon-btn lightbox-next"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </>
            )}
            <motion.figure
              initial={reduceMotion ? { opacity: 0 } : { clipPath: IRIS_SHUT }}
              animate={reduceMotion ? { opacity: 1 } : { clipPath: IRIS_OPEN }}
              exit={reduceMotion ? { opacity: 0 } : { clipPath: IRIS_SHUT }}
              transition={{ duration: reduceMotion ? 0.22 : 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none m-0"
              style={{ width: `min(84vw, calc(80svh * ${frame.ar}))` }}
            >
              {/* The photo takes its own clicks (and a sideways swipe), so only
                  the backdrop closes the lightbox */}
              <motion.span
                key={frame.src}
                className="lightbox-media pointer-events-auto"
                style={{ aspectRatio: frame.ar }}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                drag={many ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) step(1)
                  else if (info.offset.x > 60) step(-1)
                }}
              >
                {frame.video ? (
                  <LoopVideo src={frame.src} label={frame.alt} />
                ) : (
                  <Image src={frame.src} alt={frame.alt} fill sizes="84vw" draggable={false} className="object-cover" />
                )}
              </motion.span>
              <figcaption className="frame-caption">
                <span>{frame.place}</span>
                {frame.date && <span>{frame.date}</span>}
                {many && (
                  <span className="ml-auto tabular-nums" aria-live="polite">
                    {index + 1} of {frames.length}
                  </span>
                )}
              </figcaption>
            </motion.figure>
          </motion.div>
        </ModalShell>
      )}
    </AnimatePresence>
  )
}
