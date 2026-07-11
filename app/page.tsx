'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import MobileLinktree from '@/components/MobileLinktree'
import FadeImage from '@/components/FadeImage'

// The desk: photo prints scattered on paper. Swap photos by editing this list;
// files live in public/images/ (or anywhere under public/).
// position must be inline: .print sets position:relative in filmy.css, which
// loads after Tailwind's utilities and would override an `absolute` class.
const prints = [
  {
    src: '/moments/guatemala/trail-first-light.jpg',
    alt: 'Walking the Acatenango trail at first light, volcano on the horizon',
    caption: 'first light on acatenango',
    stamp: `'26 3 27`,
    className: 'w-[225px] lg:w-[240px] top-0 left-4',
    rotate: '-3.5deg',
    aspect: '5/8',
    position: '50% 45%',
  },
  {
    src: '/images/prints/concert.jpg',
    alt: 'Tyler and friends at a concert',
    caption: 'the boys',
    stamp: `'24 8 14`,
    className: 'w-[290px] lg:w-[310px] top-10 right-0',
    rotate: '2.5deg',
    aspect: '4/3',
    position: '50% 50%',
  },
  {
    src: '/images/prints/spikeball.jpg',
    alt: 'Friends playing spikeball on the beach under a burning sunset',
    caption: 'spikeball, golden hour',
    stamp: `'23 8 3`,
    className: 'w-[215px] lg:w-[230px] bottom-0 left-[32%]',
    rotate: '-2deg',
    aspect: '3/4',
    position: '50% 50%',
  },
]

const directory = [
  { href: '/projects', label: 'Projects', line: 'Ten things I have shipped, ranked.' },
  { href: '/moments', label: 'Moments', line: 'The camera roll.' },
  { href: '/about', label: 'About', line: 'The short version of who I am.' },
]

export default function Home() {
  return (
    <>
      {/* Mobile Linktree - Shows on mobile only */}
      <div className="block md:hidden">
        <MobileLinktree />
      </div>

      {/* Desktop Site - Hidden on mobile */}
      <main className="filmy relative min-h-screen w-full hidden md:block">
        <Navigation />

        {/* Hero: intro + prints on the desk. The collage height is fixed and
            every print is positioned to end inside it, so nothing gets cut
            by the fold. */}
        <section className="pt-32 pb-16 px-6 md:px-12">
          <div className="max-w-screen-xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
            <div>
              <p className="mono develop mb-6">
                Tyler Mastrangelo <span style={{ color: 'var(--safelight)' }} aria-hidden>·</span> Elon, NC
              </p>
              <h1
                className="develop font-display font-semibold tracking-tight text-4xl lg:text-5xl leading-[1.05] max-w-xl"
                style={{ animationDelay: '0.1s' }}
              >
                I build software and photograph everything else.
              </h1>
              <p
                className="develop mt-6 text-lg leading-relaxed max-w-md"
                style={{ animationDelay: '0.25s', color: 'var(--ink-soft)' }}
              >
                Double major in CS and Cybersecurity at Elon,
                <br />
                founder of{' '}
                <a
                  href="https://joinquad.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#1b1813] hover:underline underline-offset-4"
                  style={{ textDecorationColor: 'var(--safelight)' }}
                >
                  Quad
                </a>
                .
              </p>

              <div className="develop mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: '0.4s' }}>
                <Link
                  href="/projects"
                  prefetch={true}
                  className="connect-btn"
                >
                  View projects
                  <span className="text-xs">→</span>
                </Link>
                <Link
                  href="/about"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-colors border-[#1b1813]/25 hover:border-[#1b1813]"
                >
                  About me
                </Link>
              </div>

              <p className="develop mono mt-10" style={{ animationDelay: '0.5s' }}>
                <a
                  href="/files/Tyler%20Mastrangelo%20Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet-link"
                >
                  Resume ↗
                </a>
                <span className="mx-3" aria-hidden>·</span>
                <Link href="/moments" className="quiet-link">
                  Moments
                </Link>
              </p>
            </div>

            {/* The prints */}
            <div className="relative h-[540px] lg:h-[560px]">
              {prints.map((print, i) => (
                <div
                  key={print.src}
                  className={`print develop ${print.className}`}
                  style={{
                    position: 'absolute',
                    transform: `rotate(${print.rotate})`,
                    animationDelay: `${0.3 + i * 0.2}s`,
                  }}
                >
                  <span className="tape" aria-hidden />
                  <div className="print-photo" style={{ aspectRatio: print.aspect }}>
                    <FadeImage
                      src={print.src}
                      alt={print.alt}
                      fill
                      className="object-cover"
                      style={{ objectPosition: print.position }}
                      sizes="320px"
                      priority={i === 0}
                    />
                    <span className="datestamp" aria-hidden>{print.stamp}</span>
                  </div>
                  <span className="print-caption">{print.caption}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Directory */}
        <section className="px-6 md:px-12 pb-20">
          <div className="max-w-screen-xl mx-auto">
            {directory.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className="dir-row group flex items-baseline gap-8 border-t py-7 transition-colors"
                style={{ borderColor: 'var(--hairline)' }}
              >
                <span className="mono w-28 shrink-0 pt-1">{item.label}</span>
                <span className="voice text-xl md:text-2xl flex-1" style={{ color: 'var(--ink)' }}>
                  {item.line}
                </span>
                <span
                  className="text-xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: 'var(--safelight)' }}
                  aria-hidden
                >
                  →
                </span>
              </Link>
            ))}
            <div className="border-t" style={{ borderColor: 'var(--hairline)' }} />
          </div>
        </section>

        {/* Closing line */}
        <section className="px-6 md:px-12 pb-28">
          <p className="voice text-center text-lg" style={{ color: 'var(--ink-soft)' }}>
            Built to learn, shipped to prove it, photographed along the way.
          </p>
        </section>

        <Footer />
      </main>
    </>
  )
}
