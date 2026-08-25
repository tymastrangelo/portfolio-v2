'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarPlus, Check, Clock, MapPin, Share2, X } from 'lucide-react'
import FadeImage from '@/components/FadeImage'
import { FloorEvent, calendarUrl, endOf, formatWhen, toInstant } from '@/lib/floor'

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

function untilLabel(e: FloorEvent, now: number) {
  const start = toInstant(e.start)
  if (now >= start) return now < endOf(e) ? 'happening now' : 'wrapped up'
  const mins = Math.round((start - now) / 60000)
  if (mins < 60) return `in ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `in ${hours} hr ${mins % 60} min`
  const days = Math.floor(hours / 24)
  return `in ${days} day${days === 1 ? '' : 's'} ${hours % 24} hr`
}

function Flyer({ event, onOpen }: { event: FloorEvent; onOpen: () => void }) {
  if (!event.flyer) return null
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flyer"
      style={{ aspectRatio: event.ar ?? '3/4' }}
      aria-label={`Enlarge the ${event.title} flyer`}
    >
      <FadeImage
        src={event.flyer}
        alt={`${event.title} flyer`}
        fill
        sizes="(max-width: 640px) 100vw, 560px"
        priority
      />
      <span className="flyer-hint tag">Tap to enlarge</span>
    </button>
  )
}

function Row({ event, dim = false }: { event: FloorEvent; dim?: boolean }) {
  const date = event.start.split('T')[0].split('-').map(Number)
  return (
    <div className="row" style={dim ? { opacity: 0.55 } : undefined}>
      <div className="date-chip">
        <span className="block text-[11px] tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
          {MONTHS[date[1] - 1]}
        </span>
        <span className="block text-xl">{date[2]}</span>
      </div>
      <div className="min-w-0">
        <p className="comic text-[19px] leading-tight">{event.title}</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--ink-soft)' }}>
          {formatWhen(event)} · {event.where}
        </p>
      </div>
    </div>
  )
}

// One pass across the header on load. The figure hangs off the rope and stays
// aligned with it, so the CSS only has to swing the rope and carry the rig
// across. Strokes with round caps, no detail that would matter at 76px.
function SwingBy() {
  return (
    <span className="floor-swing" aria-hidden>
      <span className="rope">
        <span className="line" />
        <svg viewBox="0 0 64 96" fill="none">
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* legs, one kicked forward and one tucked under */}
            <g stroke="var(--blue)" strokeWidth="8">
              <path d="M30 55 L44 60 L48 74" />
              <path d="M30 55 L22 68 L30 80" />
            </g>
            {/* trailing arm, torso, then the arm holding the web */}
            <g stroke="var(--red)">
              <path d="M33 31 L20 40 L12 50" strokeWidth="6" />
              <path d="M33 30 L30 55" strokeWidth="12" />
              <path d="M32 4 L34 16 L33 29" strokeWidth="6" />
            </g>
          </g>
          <circle cx="40" cy="29" r="8.5" fill="var(--red)" />
          <ellipse cx="42.5" cy="27.5" rx="3.4" ry="2.4" fill="#f4f1ea" transform="rotate(-20 42.5 27.5)" />
          <ellipse cx="36" cy="29.5" rx="2.8" ry="2" fill="#f4f1ea" transform="rotate(-20 36 29.5)" />
        </svg>
      </span>
    </span>
  )
}

export default function FloorBoard({
  next,
  later,
  past,
}: {
  next: FloorEvent | null
  later: FloorEvent[]
  past: FloorEvent[]
}) {
  // Countdown only after mount: the server has no clock the phone agrees with.
  const [countdown, setCountdown] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [lightbox, setLightbox] = useState<FloorEvent | null>(null)

  useEffect(() => {
    if (!next) return
    const tick = () => setCountdown(untilLabel(next, Date.now()))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [next])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  const share = async (event: FloorEvent) => {
    const url = window.location.href
    const payload = {
      title: `${event.title} · Chandler 1`,
      text: `${event.title}, ${formatWhen(event)}, ${event.where}.`,
      url,
    }
    if (navigator.share) {
      try {
        await navigator.share(payload)
        return
      } catch {
        // cancelled or blocked, fall through to the copy path
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard denied: the address bar already has the link
    }
  }

  return (
    <main className="floor">
      <span className="floor-web tr" aria-hidden />
      <span className="floor-web bl" aria-hidden />
      <SwingBy />

      <div className="relative mx-auto w-full max-w-[560px] px-5 pt-14 pb-16">
        <header className="rise">
          <p className="tag">Chandler 1 · Danieley · Elon</p>
          <h1 className="mt-3 text-[32px] sm:text-[40px]">
            Your friendly neighborhood floor board
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Everything happening on the floor gets posted here first, so save the
            link and send it to whoever you want to bring.
          </p>
        </header>

        {next ? (
          <section className="rise mt-10" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between gap-3">
              <p className="tag">Up next</p>
              {countdown && (
                <span className={`ticker${countdown === 'happening now' ? ' live' : ''}`}>
                  <span className="dot" aria-hidden />
                  {countdown}
                </span>
              )}
            </div>

            <div className="panel mt-3 overflow-hidden">
              <Flyer event={next} onOpen={() => setLightbox(next)} />
              <div className={`p-5 ${next.flyer ? 'border-t-2 border-[var(--ink)]' : 'halftone'}`}>
                <h2 className="text-[26px] leading-tight">{next.title}</h2>
                <p className="mt-3 flex items-center gap-2 text-[15px]">
                  <Clock className="h-4 w-4 shrink-0" style={{ color: 'var(--red)' }} aria-hidden />
                  {formatWhen(next)}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-[15px]">
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--red)' }} aria-hidden />
                  {next.where}
                </p>
                {next.blurb && (
                  <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {next.blurb}
                  </p>
                )}

                <div className="mt-5 flex gap-3">
                  <button type="button" className="btn btn-solid" onClick={() => share(next)}>
                    {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
                    {copied ? 'Link copied' : 'Share'}
                  </button>
                  <a className="btn btn-ghost" href={calendarUrl(next)} target="_blank" rel="noreferrer">
                    <CalendarPlus className="h-4 w-4" aria-hidden />
                    Add
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="rise mt-10" style={{ animationDelay: '0.1s' }}>
            <p className="tag">Up next</p>
            <div className="panel halftone mt-3 p-6">
              <h2 className="text-[22px]">Nothing on the board yet</h2>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                The next thing goes up here as soon as it is planned. Knock on my
                door if you want something on it.
              </p>
            </div>
          </section>
        )}

        {later.length > 0 && (
          <section className="rise mt-12" style={{ animationDelay: '0.2s' }}>
            <p className="tag mb-1">Also coming up</p>
            {later.map((e) => (
              <Row key={e.start + e.title} event={e} />
            ))}
          </section>
        )}

        {past.length > 0 && (
          <section className="rise mt-12" style={{ animationDelay: '0.25s' }}>
            <p className="tag mb-1">Already happened</p>
            {past.slice(0, 6).map((e) => (
              <Row key={e.start + e.title} event={e} dim />
            ))}
          </section>
        )}

        <footer className="mt-16 flex items-center justify-between gap-4">
          <p className="tag">Tyler · your RA</p>
          <Link href="/" className="tag underline underline-offset-4">
            tymastrangelo.com
          </Link>
        </footer>
      </div>

      <AnimatePresence>
        {lightbox?.flyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0b0b13]/92 p-4"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${lightbox.title} flyer`}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close flyer"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#f4f1ea]/30 text-[#f4f1ea]"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="pointer-events-none relative"
              style={(() => {
                const [w, h] = (lightbox.ar ?? '3/4').split('/').map(Number)
                return { aspectRatio: lightbox.ar ?? '3/4', width: `min(94vw, calc(84vh * ${w / h}))` }
              })()}
            >
              <FadeImage
                src={lightbox.flyer}
                alt={`${lightbox.title} flyer`}
                fill
                sizes="94vw"
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
