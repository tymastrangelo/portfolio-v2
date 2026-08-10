'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import ContactModal from '@/components/ContactModal'
import FadeImage from '@/components/FadeImage'
import Navigation from '@/components/Navigation'

// Same three destinations and voice lines as the desktop directory, so the two
// homes rhyme. Everything else a phone visitor needs lives in the Connect sheet.
const directory = [
  { href: '/projects', label: 'Projects', line: 'Ten things I have shipped, ranked.' },
  { href: '/moments', label: 'Moments', line: 'The camera roll.' },
  { href: '/about', label: 'About', line: 'The short version of who I am.' },
]

// Long enough that the page has been read before Quad interrupts it
const NOTIF_DELAY_MS = 10_000

const pressable = 'transition-transform duration-150 active:scale-[0.98]'
const hairline = { borderColor: 'var(--hairline)' } as const
const inkSoft = { color: 'var(--ink-soft)' } as const
const safelight = { color: 'var(--safelight)' } as const

export default function MobileLinktree() {
  const [contactOpen, setContactOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => setNotifOpen(true), NOTIF_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  // Enters and leaves along the same path, from off the top edge. Scale rides
  // with the slide so it reads as a surface arriving rather than a fade, and the
  // spring gets a little bounce because a thing that drops in has momentum.
  // Reduced motion keeps the beat and drops the travel.
  const notifMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25, ease: 'easeOut' as const },
      }
    : {
        initial: { opacity: 0, y: -26, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -22, scale: 0.97 },
        transition: {
          type: 'spring' as const,
          bounce: 0.24,
          duration: 0.5,
          opacity: { type: 'tween' as const, duration: 0.22, ease: 'easeOut' as const },
        },
      }

  return (
    // px-6 matches the nav bar's own gutter, so everything lines up with the pill
    <main
      className="filmy flex min-h-[100dvh] w-full flex-col px-6"
      style={{
        // 98px clears the floating nav pill (24px offset + 56px tall). env() is
        // 0 until viewport-fit=cover, and correct the moment it is set. The
        // bottom pad also clears Safari's floating toolbar.
        paddingTop: 'calc(env(safe-area-inset-top) + 98px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 22px)',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Navigation />

      {/* The essentials, centred in whatever height the phone has left, so the
          page never needs a scroll to reach a link or a button. The gaps are
          vh-based so a short phone compresses instead of overflowing. */}
      <div
        className="flex flex-1 flex-col justify-center"
        style={{
          gap: 'clamp(14px, 3.6vh, 38px)',
          paddingTop: 'clamp(4px, 1.8vh, 30px)',
          paddingBottom: 'clamp(4px, 1.8vh, 30px)',
        }}
      >
        <header>
          <p className="mono develop" style={{ animationDelay: '0.06s' }}>
            Marco Island, FL
          </p>
          <h1
            className="develop mt-3 font-display font-semibold"
            style={{
              animationDelay: '0.1s',
              // Tracking is size-specific: the bigger this gets, the tighter it needs
              fontSize: 'clamp(28px, 8.4vw, 38px)',
              letterSpacing: '-0.035em',
              lineHeight: 1.03,
            }}
          >
            Tyler Mastrangelo
          </h1>
          <p
            className="develop mt-3 text-[15px] leading-relaxed"
            style={{ animationDelay: '0.16s', ...inkSoft }}
          >
            Double major in computer science and cybersecurity at Elon University.
          </p>
        </header>

        <nav className="develop" style={{ animationDelay: '0.22s' }}>
          {directory.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`tap-row -mx-2 flex items-center gap-4 border-b px-2 py-4 ${i === 0 ? 'border-t' : ''}`}
              style={hairline}
            >
              <span className="mono w-6 shrink-0" style={safelight}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block font-display font-semibold"
                  style={{ fontSize: 23, letterSpacing: '-0.022em', lineHeight: 1.1 }}
                >
                  {item.label}
                </span>
                <span className="voice mt-0.5 block text-[13.5px]" style={inkSoft}>
                  {item.line}
                </span>
              </span>
              <span className="text-lg" style={safelight} aria-hidden>
                →
              </span>
            </Link>
          ))}
        </nav>

        <div className="develop flex items-center gap-3" style={{ animationDelay: '0.3s' }}>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className={`connect-btn h-[52px] flex-1 justify-center ${pressable}`}
          >
            Connect
          </button>
          <a
            href="/files/Tyler%20Mastrangelo%20Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-[#1b1813]/25 text-sm font-medium ${pressable}`}
          >
            Resume
            <span className="text-xs">↗</span>
          </a>
        </div>
      </div>

      {/* Quad arrives like a phone notification: it takes no space in the layout
          until it drops in over the top chrome, then it is tap-to-open or
          dismiss. Not on a timer out: it waits for one of the two. */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            className="quad-notif glass-dark"
            role="status"
            {...notifMotion}
          >
            <a
              href="https://joinquad.app"
              target="_blank"
              rel="noopener noreferrer"
              className="notif-hit"
            >
              <span className="banner-icon relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px]">
                <FadeImage
                  src="/images/quad-icon.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium">Quad</span>
                {/* The copy is what signals the notification is tappable */}
                <span className="banner-line mt-0.5 block text-[13px]">
                  Tap to see my campus events app!
                </span>
              </span>
            </a>
            <button
              type="button"
              onClick={() => setNotifOpen(false)}
              aria-label="Dismiss"
              className="notif-close"
            >
              <X className="relative h-[15px] w-[15px]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  )
}
