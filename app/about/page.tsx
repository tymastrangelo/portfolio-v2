'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ContactModal from '@/components/ContactModal'
import FadeImage from '@/components/FadeImage'

// The film roll. Sources are 640px variants in public/moments/reel/ so the
// strip stays light; regenerate them from photo-originals/ when swapping.
// position controls the crop focal point; date is the photo's EXIF capture
// date (left off when the file had none).
const frames = [
  {
    src: '/moments/reel/suits.jpg',
    alt: 'Tyler and friends in suits before a formal',
    date: "apr 27 '24",
    position: '50% 35%',
  },
  {
    src: '/moments/reel/summit-selfie.jpg',
    alt: 'Sunrise above the clouds on Acatenango with a friend',
    date: "mar 27 '26",
    position: '50% 35%',
  },
  {
    src: '/moments/reel/concert.jpg',
    alt: 'Tyler and friends at a country concert',
    date: "aug 14 '24",
    position: '50% 40%',
  },
  {
    src: '/moments/reel/cornice.jpg',
    alt: 'Snowboarding above the valley at Vail',
    date: "feb 21 '24",
    position: '50% 45%',
  },
  {
    src: '/moments/reel/mom-dad.jpg',
    alt: 'Tyler with his parents at a formal event',
    position: '50% 18%',
  },
  {
    src: '/moments/reel/grad-caps.jpg',
    alt: 'Graduation caps flying at the ceremony',
    date: "may 31 '24",
    position: '50% 45%',
  },
  {
    src: '/moments/reel/mykonos-windmill.jpg',
    alt: 'A whitewashed windmill on Mykonos',
    date: "jun 27 '24",
    position: '50% 55%',
  },
  {
    src: '/moments/reel/godafoss.jpg',
    alt: 'Goðafoss waterfall in Iceland',
    date: "jun 7 '23",
    position: '50% 55%',
  },
  {
    src: '/moments/reel/banquet.jpg',
    alt: 'With friends at a campus banquet',
    date: "apr 9 '26",
    position: '50% 30%',
  },
  {
    src: '/moments/reel/naples-fire.jpg',
    alt: 'Orange sunset over the gulf back home',
    date: "apr 5 '23",
    position: '50% 50%',
  },
  {
    src: '/moments/reel/nassau-dinner.jpg',
    alt: 'Family dinner on a trip to Nassau',
    date: "jun 14 '24",
    position: '50% 45%',
  },
  {
    src: '/moments/reel/friends-night.jpg',
    alt: 'Three friends at an event on campus',
    date: "apr 7 '26",
    position: '50% 35%',
  },
]

const index = [
  { label: 'School', value: 'Elon University, class of 2028' },
  { label: 'Study', value: 'Double major, Computer Science and Cybersecurity' },
  { label: 'Work', value: 'Founder of Quad, co-founder of Buffer Bros, contract SWE on a roofing CRM' },
  { label: 'Honors', value: 'Presidential Scholar, two Elon innovation grants' },
  { label: 'Before', value: 'D1 athlete, cross country and track' },
  { label: 'Campus', value: 'SGA VP of Communications, CS1 teaching assistant, Maker Hub consultant' },
  { label: 'Elsewhere', value: '2M+ views documenting life and college, plus brand deals with Brainly and Hulu' },
]

export default function About() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <main className="filmy relative min-h-screen">
      <div className="filmy-grain" aria-hidden />
      <div className="filmy-vignette" aria-hidden />
      <Navigation />

      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="sr-only">About Tyler Mastrangelo</h1>

          {/* Roll header */}
          <div className="develop mb-8 flex flex-wrap items-baseline justify-between gap-3">
            <p className="mono">Roll 01 · Tyler Mastrangelo · Elon, NC</p>
            <p className="mono" aria-hidden>Kodak Pixpro FZ55</p>
          </div>

          {/* The strip: advances on its own, pauses on hover */}
          <div className="film-strip film-autoroll develop mb-6" style={{ animationDelay: '0.15s' }}>
            <div className="film-frames">
              {[0, 1].map((half) => (
                <div key={half} className="reel-half" aria-hidden={half === 1}>
                  {frames.map((frame, i) => (
                    <figure key={frame.src} className="film-frame">
                      <div className="frame-photo">
                        <FadeImage
                          src={frame.src}
                          alt={half === 0 ? frame.alt : ''}
                          fill
                          className="object-cover"
                          style={{ objectPosition: frame.position }}
                          sizes="(max-width: 768px) 60vw, 280px"
                          priority={half === 0 && i < 2}
                        />
                      </div>
                      <figcaption className="frame-label">
                        <span className="num">{String(i + 1).padStart(2, '0')}A</span>
                        {frame.date && <span>{frame.date}</span>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="voice develop text-xl md:text-2xl mb-20" style={{ animationDelay: '0.5s' }}>
            What the last few years have looked like.
          </p>

          {/* Story + index card */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-20 items-start">
            <div className="space-y-6 leading-relaxed text-[17px]">
              <p className="mono pb-2 border-b" style={{ borderColor: 'var(--hairline)' }}>
                The story
              </p>
              <p>
                I&apos;m Tyler, a computer science and cybersecurity double
                major at Elon, raised on Marco Island, Florida.
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
                for, plus contract work shipping production features on a{' '}
                <a
                  href="https://firestonerestorations.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet-link font-semibold"
                >
                  roofing industry CRM
                </a>
                .
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
                The rest of the roll lives in{' '}
                <Link href="/moments" className="quiet-link">Moments</Link>.
              </p>
            </div>

            <div>
              <p className="mono pb-2 border-b" style={{ borderColor: 'var(--hairline)' }}>
                Index
              </p>
              <dl className="mb-8">
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
