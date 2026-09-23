'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ContactModal from '@/components/ContactModal'

// The photographs that used to run through here as Roll 01 now live in the
// strip on the home page, so there is one place for them instead of two.

const index = [
  { label: 'School', value: 'Elon University, class of 2028' },
  { label: 'Study', value: 'Double major, Computer Science and Cybersecurity' },
  { label: 'Work', value: 'Founder of Quad, co-founder of Buffer Bros' },
  { label: 'Honors', value: 'Presidential Scholar, two Elon innovation grants' },
  { label: 'Before', value: 'Software engineering intern on a roofing CRM, D1 cross country and track' },
  { label: 'Campus', value: 'SGA VP of Communications, CS1 teaching assistant, Maker Hub consultant' },
  { label: 'Elsewhere', value: '2M+ views documenting life and college, plus brand deals with Brainly and Hulu' },
]

export default function About() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    // One screen: the whole page sits inside the first viewport and is sized in
    // vh so it fits a laptop and a monitor without scrolling. The footer is the
    // only thing below the fold, reached by scrolling past it. Content taller
    // than the window still grows rather than colliding, the same fallback the
    // home hero uses.
    <main className="filmy relative min-h-screen">
      <div className="page-frame" aria-hidden />
      <div className="filmy-grain" aria-hidden />
      <div className="filmy-vignette" aria-hidden />
      <Navigation />

      <div className="about-screen px-6 md:px-12">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="sr-only">About Tyler Mastrangelo</h1>

          {/* Masthead. The roll used to open the page; without it the page
              needs a head of its own, so the eyebrow and the lead sentence
              carry it. */}
          <div
            className="develop flex flex-wrap items-baseline justify-between gap-3 border-b pb-4"
            style={{ borderColor: 'var(--hairline)' }}
          >
            <p className="mono">About · Tyler Mastrangelo</p>
            <p className="mono">Elon, NC · Marco Island, FL</p>
          </div>

          <p
            className="about-lead develop max-w-3xl font-display font-semibold tracking-tight"
            style={{ animationDelay: '0.15s' }}
          >
            I&apos;m a computer science and cybersecurity double major at Elon,
            raised in Marco Island, Florida.
          </p>

          {/* Story + index card */}
          <div className="about-grid develop" style={{ animationDelay: '0.3s' }}>
            <div className="about-body">
              <p className="mono border-b" style={{ borderColor: 'var(--hairline)' }}>
                The story
              </p>
              <p>
                Most of my time right now goes to{' '}
                <a href="https://joinquad.app" target="_blank" rel="noopener noreferrer" className="quiet-link font-semibold">Quad</a>,
                my campus events app. It has an approved App Store release and
                launches its first beta at Elon in fall 2026 with a small group
                of clubs, to find out if it actually helps.
              </p>
              <p>
                There&apos;s also{' '}
                <a href="https://bufferbros.org" target="_blank" rel="noopener noreferrer" className="quiet-link font-semibold">
                  Buffer Bros
                </a>
                , the detailing company I co-founded and wrote all the software
                for. Last summer I worked as a software engineer on a{' '}
                <a
                  href="https://firestonerestorations.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet-link font-semibold"
                >
                  roofing industry CRM
                </a>
                , shipping production features across the whole stack.
              </p>
              <p>
                The rest of my time goes to running communications for Elon&apos;s
                student government, TAing intro CS, helping people prototype at
                the Maker Hub, and whatever project is currently taking over my
                desk: a chess board, an Iron Man helmet, a Pong clone.
              </p>
              <p>
                Outside of that, it&apos;s friends, the beach back home, and a
                camera within arm&apos;s reach.
              </p>
              <p className="voice text-lg pt-2">
                The photographs live in{' '}
                <Link href="/moments" className="quiet-link">Moments</Link>.
              </p>
            </div>

            <div className="about-index">
              <p className="mono border-b" style={{ borderColor: 'var(--hairline)' }}>
                Index
              </p>
              <dl>
                {index.map((row) => (
                  <div key={row.label} className="index-row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="connect-btn"
              >
                Connect
                <span className="text-xs">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <Footer />
    </main>
  )
}
