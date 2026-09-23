'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { MapPin } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import MobileLinktree from '@/components/MobileLinktree'
import FadeImage from '@/components/FadeImage'
import { projects } from '@/lib/projects'

// The photographs band: every frame that used to live on the About page roll,
// plus the ones that were already here, in the order they read best left to
// right. Tall and wide frames alternate on purpose so the strip has a rhythm.
// place and date are the real ones; ar is the file's native aspect (w/h) and
// lift is the px offset that keeps the row off a dead flat line. roll is the
// canister it opens on /moments, left off for the frames that are not in a
// published roll. Swap one by pointing src at another file in
// public/moments/<album>/.
type Frame = {
  src: string
  alt: string
  place: string
  /** EXIF capture date, left off where the file had none */
  date?: string
  /** the canister it opens on /moments; off for frames not in a published roll */
  roll?: string
  ar: string
  lift: string
}

const strip: Frame[] = [
  {
    src: '/moments/guatemala/fuego-night-eruption.jpg',
    alt: 'Volcán de Fuego erupting at night with lava and city lights below',
    place: 'Acatenango, Guatemala',
    date: "mar 27 '26",
    roll: 'guatemala',
    ar: '4/3',
    lift: '0px',
  },
  {
    src: '/moments/ski/cornice.jpg',
    alt: 'Snowboarder standing on a cornice above the valley',
    place: 'Vail, Colorado',
    date: "feb 21 '24",
    roll: 'ski',
    ar: '3/4',
    lift: '14px',
  },
  {
    src: '/moments/life/suits.jpg',
    alt: 'Four friends in suits before a formal',
    place: 'Marco Island, Florida',
    date: "apr 27 '24",
    ar: '4/3',
    lift: '-8px',
  },
  {
    src: '/moments/elon/banquet.jpg',
    alt: 'With friends at a campus banquet',
    place: 'Elon, North Carolina',
    date: "apr 9 '26",
    ar: '3/2',
    lift: '6px',
  },
  {
    src: '/moments/greece/blue-dome.jpg',
    alt: 'A blue domed church behind pink bougainvillea on Santorini',
    place: 'Santorini, Greece',
    date: "jun '24",
    roll: 'greece-italy',
    ar: '9/16',
    lift: '16px',
  },
  {
    src: '/moments/shows/tortuga-hats.jpg',
    alt: 'Six friends in cowboy hats at a beach music festival',
    place: 'Fort Lauderdale, Florida',
    date: "apr 6 '24",
    roll: 'concerts',
    ar: '4/3',
    lift: '-6px',
  },
  {
    src: '/moments/sunsets/naples-fire.jpg',
    alt: 'Vivid orange sunset over the Gulf of Mexico',
    place: 'Marco Island, Florida',
    date: "apr 5 '23",
    roll: 'home',
    ar: '4/3',
    lift: '4px',
  },
  {
    src: '/moments/reel/mom-dad.jpg',
    alt: 'With my mom and dad before a night out',
    place: 'Marco Island, Florida',
    ar: '2/3',
    lift: '12px',
  },
  {
    src: '/moments/life/godafoss.jpg',
    alt: 'Goðafoss waterfall in Iceland',
    place: 'Goðafoss, Iceland',
    date: "jun 7 '23",
    ar: '4/3',
    lift: '-8px',
  },
  {
    src: '/moments/guatemala/summit-selfie.jpg',
    alt: 'Sunrise above the clouds on Acatenango with a friend',
    place: 'Acatenango, Guatemala',
    date: "mar 27 '26",
    roll: 'guatemala',
    ar: '4/3',
    lift: '2px',
  },
  {
    src: '/moments/shows/country-show.jpg',
    alt: 'Friends shoulder to shoulder at a country concert',
    place: 'Tampa, Florida',
    date: "aug 14 '24",
    roll: 'concerts',
    ar: '9/16',
    lift: '14px',
  },
  {
    src: '/moments/greece/mykonos-windmill.jpg',
    alt: 'A whitewashed windmill on Mykonos with a blue gate',
    place: 'Mykonos, Greece',
    date: "jun 27 '24",
    roll: 'greece-italy',
    ar: '4/3',
    lift: '-4px',
  },
  {
    src: '/moments/life/grad-caps.jpg',
    alt: 'Graduation caps flying at the ceremony',
    place: 'Marco Island, Florida',
    ar: '4/3',
    lift: '8px',
  },
  {
    src: '/moments/guatemala/trail-first-light.jpg',
    alt: 'Walking the volcanic trail at first light',
    place: 'Acatenango, Guatemala',
    date: "mar 27 '26",
    roll: 'guatemala',
    ar: '5/8',
    lift: '16px',
  },
  {
    src: '/moments/life/nassau-dinner.jpg',
    alt: 'Family dinner on a trip to Nassau',
    place: 'Nassau, Bahamas',
    date: "jun 14 '24",
    ar: '4/3',
    lift: '-6px',
  },
  {
    src: '/moments/elon/friends-night.jpg',
    alt: 'Three friends at an event on campus',
    place: 'Elon, North Carolina',
    date: "apr 7 '26",
    ar: '4/3',
    lift: '6px',
  },
  {
    src: '/moments/sunsets/boat-wake.jpg',
    alt: 'Sunset over the wake behind the boat',
    place: 'Marco Island, Florida',
    date: "may 29 '23",
    roll: 'home',
    ar: '4/3',
    lift: '0px',
  },
]

// One pass of the strip, in seconds. Keep in step with the photo-roll
// animation in filmy.css: it is what a random start offset is measured against.
const ROLL_SECONDS = 150

// projects is already in curated showcase order, so the strongest four lead
const featured = projects.slice(0, 4)

export default function Home() {
  // The strip rolls on its own, but only while it is on screen: no CPU spent
  // animating a band nobody is looking at, and nothing moving in the corner of
  // the eye while the work above is being read. Nothing else stops it, hover
  // and focus included.
  const stripRef = useRef<HTMLDivElement>(null)
  const rolling = useInView(stripRef, { amount: 0.25 })

  // A different frame leads the strip on every visit. The offset is a negative
  // animation delay, which starts the loop partway in, and it is set after
  // mount so the server and the client still render the same markup.
  const [rollOffset, setRollOffset] = useState(0)
  useEffect(() => setRollOffset(-Math.random() * ROLL_SECONDS), [])

  return (
    <>
      {/* Mobile Linktree - Shows on mobile only */}
      <div className="block md:hidden">
        <MobileLinktree />
      </div>

      {/* Desktop Site - Hidden on mobile */}
      {/* no-grab plus the handler below: photographs cannot be dragged out or
          saved from the right click menu. The menu still opens everywhere else,
          so links keep their open in new tab. */}
      <main
        className="filmy no-grab relative min-h-screen w-full hidden md:block"
        onContextMenu={(e) => {
          if ((e.target as HTMLElement).tagName === 'IMG') e.preventDefault()
        }}
      >
        <div className="page-frame" aria-hidden />
        <div className="filmy-grain grain-soft" aria-hidden />
        <div className="filmy-vignette vignette-soft" aria-hidden />
        <Navigation />

        {/* Hero, on the editorial reference: surname as a full-width masthead,
            the cutout portrait overlapping its right end on the coral disc, and
            the introduction set warm and small underneath on the left. */}
        <section className="hero-screen px-6 md:px-12">
          <span className="edge-stack left" aria-hidden>
            Software · Photography
          </span>
          <span className="edge-stack right" aria-hidden>
            Elon, NC · Marco Island, FL
          </span>

          <div className="max-w-screen-xl mx-auto">
            <div
              className="develop flex items-baseline justify-between gap-6 border-b pb-4"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <p className="mono flex items-center gap-2">
                <span style={{ color: 'var(--safelight)' }} aria-hidden>✳</span>
                Computer Science · Cybersecurity
              </p>
              <p className="mono flex items-center gap-3">
                Seeking Summer 2027 internships
                <span aria-hidden>⟶</span>
              </p>
            </div>

            <div className="hero-portrait develop" style={{ animationDelay: '0.26s' }}>
              <span className="hero-disc" aria-hidden />
              <FadeImage
                src="/images/portrait.webp"
                alt="Tyler Mastrangelo"
                width={998}
                height={1400}
                draggable={false}
                sizes="(max-width: 1280px) 34vw, 470px"
                priority
              />
            </div>

            <div className="hero-masthead mt-5">
              <h1 className="sr-only">Tyler Mastrangelo</h1>

              <p className="hero-word develop" aria-hidden style={{ animationDelay: '0.08s' }}>
                Tyler Mastrangelo
              </p>

              <div className="hero-intro">
                <p className="hero-role develop" style={{ animationDelay: '0.36s' }}>
                  Founder of Quad · Co-founder of Buffer Bros
                </p>

                <p
                  className="develop mt-4 text-[17px] leading-relaxed"
                  style={{ animationDelay: '0.48s', color: 'var(--ink-soft)' }}
                >
                  Most of my time goes to{' '}
                  <a
                    href="https://joinquad.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quad-link"
                  >
                    Quad
                    {/* A safelight map pin on the word, dropping once every
                        few seconds. Long quiet stretch between drops on
                        purpose: it should be noticed on the second look, not
                        the first. */}
                    <span className="quad-pin" aria-hidden>
                      <MapPin size={11} strokeWidth={2.25} />
                    </span>
                  </a>
                  , the campus events app I am building for Elon. The rest goes
                  to the software that runs the detailing company I co-founded,
                  and a computer science and cybersecurity double major.
                </p>

                <div
                  className="develop mt-6 flex flex-wrap items-center gap-4"
                  style={{ animationDelay: '0.54s' }}
                >
                  <Link href="/projects" prefetch={true} className="connect-btn">
                    View projects
                    <span className="text-xs">→</span>
                  </Link>
                  <Link
                    href="/about"
                    prefetch={true}
                    className="pill inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium border-[#1b1813]/25 hover:border-[#1b1813]"
                  >
                    About me
                  </Link>
                  <span className="mono ml-1">
                    <a
                      href="/files/Tyler%20Mastrangelo%20Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quiet-link"
                    >
                      Resume ↗
                    </a>
                  </span>
                </div>

                {/* Three facts instead of an ornament. Camera lives here now,
                    once, rather than in the footer of every page. */}
                <dl className="hero-facts develop" style={{ animationDelay: '0.6s' }}>
                  <div>
                    <dt>Now</dt>
                    <dd>Building Quad, VP of Communications for Elon SGA</dd>
                  </div>
                  <div>
                    <dt>Before</dt>
                    <dd>Software engineering intern on a roofing industry CRM, summer 2026</dd>
                  </div>
                  <div>
                    <dt>Seeking</dt>
                    <dd>Summer 2027 internships in software, security, product, or consulting</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Selected work: the reference's numbered project band. The home page
            deliberately had no featured projects before; say the word and this
            comes back out. */}
        <section className="px-6 md:px-12 pb-20">
          <div className="max-w-screen-xl mx-auto">
            <Reveal
              className="flex flex-wrap items-end justify-between gap-6 border-b pb-5"
              style={{ borderColor: 'var(--hairline)' }}
            >
              <h2 className="font-display font-semibold tracking-tight text-3xl lg:text-4xl leading-none">
                Selected work
              </h2>
              <Link href="/projects" prefetch={true} className="mono quiet-link">
                All projects →
              </Link>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {featured.map((project, i) => (
                <Reveal key={project.slug} delay={i * 0.08}>
                <Link
                  href={`/projects/${project.slug}`}
                  prefetch={true}
                  className="work-card group block"
                >
                  <span className="work-thumb">
                    <span
                      className="absolute inset-0"
                      style={{ background: project.gradients.card }}
                    />
                    {project.image && (
                      <FadeImage
                        src={project.image}
                        alt=""
                        fill
                        draggable={false}
                        className="object-cover"
                        sizes="(max-width: 1024px) 45vw, 280px"
                      />
                    )}
                  </span>
                  <span className="mt-4 block">
                    <span className="work-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mt-2 block font-display font-semibold text-lg leading-tight tracking-tight">
                      {project.title}
                    </span>
                    <span className="mono mt-1 block">
                      {project.category.replace('-', ' ')} · {project.year}
                    </span>
                  </span>
                </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Photos: one strip of real frames running the full width of the
            window, rolling slowly on its own while it is on screen. Holds
            everything the About page roll used to carry, so the photographs
            live in one place instead of two. */}
        <section className="pb-12">
          <div className="px-6 md:px-12">
            <div className="max-w-screen-xl mx-auto">
              <Reveal
                className="flex flex-wrap items-end justify-between gap-6 border-b pb-5"
                style={{ borderColor: 'var(--hairline)' }}
              >
                <div>
                  <h2 className="font-display font-semibold tracking-tight text-3xl lg:text-4xl leading-none">
                    Photos
                  </h2>
                  <p className="mono mt-3">
                    17 frames · 2023 to 2026
                  </p>
                </div>
                <Link href="/moments" prefetch={true} className="mono quiet-link">
                  Every roll →
                </Link>
              </Reveal>
            </div>
          </div>

          <Reveal y={24} className="mt-8">
            <div ref={stripRef} className={`photo-strip${rolling ? ' rolling' : ''}`}>
              {/* The list twice over: the loop is a translate of exactly one
                  copy's width, so the seam never shows. The second copy is
                  scenery, hidden from screen readers and out of the tab order. */}
              <div
                className="photo-strip-row"
                style={{ animationDelay: `${rollOffset}s` }}
              >
                {[0, 1].map((copy) =>
                  strip.map((frame) => (
                    <Link
                      key={`${copy}-${frame.src}`}
                      href={frame.roll ? `/moments?roll=${frame.roll}` : '/moments'}
                      prefetch={false}
                      className="photo-frame"
                      style={{ '--ar': frame.ar, '--lift': frame.lift } as React.CSSProperties}
                      aria-hidden={copy === 1}
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      <span className="photo-frame-img">
                        <FadeImage
                          src={frame.src}
                          alt={frame.alt}
                          fill
                          draggable={false}
                          className="object-cover"
                          sizes="420px"
                        />
                      </span>
                      <span className="photo-frame-meta">
                        <b>{frame.place}</b>
                        {frame.date && <i>{frame.date}</i>}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </Reveal>
        </section>

        {/* Closing line */}
        <section className="px-6 md:px-12 pb-28">
          <p className="voice text-center text-lg" style={{ color: 'var(--ink-soft)' }}>
            Most of this started as something I wanted to exist, and the rest I built because I wanted to know how.
          </p>
        </section>

        <Footer />
      </main>
    </>
  )
}
