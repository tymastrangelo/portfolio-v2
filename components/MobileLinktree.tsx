'use client'

import Link from 'next/link'
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaShareAlt, FaTiktok } from 'react-icons/fa'
import FadeImage from '@/components/FadeImage'
import { projects } from '@/lib/projects'

const socialLinks = [
  { label: 'Email', href: 'mailto:mastrangelo.tyler@gmail.com', icon: FaEnvelope },
  { label: 'GitHub', href: 'https://github.com/tymastrangelo', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/tymastrangelo', icon: FaLinkedin },
  { label: 'Instagram', href: 'https://instagram.com/tymastrangelo', icon: FaInstagram },
  { label: 'TikTok', href: 'https://tiktok.com/@tymastrangelo', icon: FaTiktok },
]

// Same voice lines as the desktop directory, so the two homes rhyme
const siteLinks = [
  { href: '/projects', label: 'Projects', line: 'Ten things I have shipped, ranked.' },
  { href: '/moments', label: 'Moments', line: 'The camera roll.' },
  { href: '/about', label: 'About', line: 'The short version of who I am.' },
  { href: 'https://joinquad.app', label: 'Quad', line: 'My campus events app, first beta fall 2026.' },
]

// Short version of the About index, for a phone screen
const now = [
  { org: 'Quad', line: 'Founder, first beta at Elon fall 2026' },
  {
    org: 'Firestone',
    line: (
      <>
        Contract software engineer on a{' '}
        <a
          href="https://firestonerestorations.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="quiet-link"
        >
          roofing CRM
        </a>
      </>
    ),
  },
  { org: 'Buffer Bros', line: 'Co-founder, built the CRM and all the software' },
  { org: 'Elon SGA', line: 'VP of Communications' },
  { org: 'Elon', line: 'CS1 teaching assistant and Maker Hub consultant' },
]

const pressable = 'transition-transform duration-150 active:scale-[0.98]'
const hairline = { borderColor: 'var(--hairline)' } as const
const inkSoft = { color: 'var(--ink-soft)' } as const
const safelight = { color: 'var(--safelight)' } as const

const Dot = () => (
  <span style={safelight} aria-hidden>
    ·
  </span>
)

export default function MobileLinktree() {
  const featured = projects.slice(0, 5)

  const handleShare = async () => {
    const shareData = {
      title: 'Tyler Mastrangelo',
      text: 'Tyler builds software and photographs everything else.',
      url: window.location.origin,
    }

    if (navigator.share) {
      await navigator.share(shareData)
      return
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url)
    }
  }

  return (
    <main className="filmy relative min-h-[100dvh] w-full px-6 pb-16 pt-12">
      <div className="filmy-vignette" aria-hidden />

      {/* Header: profile card, small taped print for the avatar */}
      <header>
        <div className="flex items-start justify-between">
          <div
            className="print develop w-24 shrink-0"
            style={{ transform: 'rotate(-2.5deg)', padding: 7 }}
          >
            <span className="tape" aria-hidden />
            <div className="print-photo" style={{ aspectRatio: '1/1' }}>
              <FadeImage
                src="/images/pfp-sm.jpg"
                alt="Tyler Mastrangelo"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 22%' }}
                sizes="96px"
                priority
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              void handleShare()
            }}
            aria-label="Share this page"
            className={`develop inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1b1813]/20 ${pressable}`}
          >
            <FaShareAlt className="h-4 w-4" style={inkSoft} />
          </button>
        </div>

        <h1
          className="develop mt-6 font-display text-2xl font-semibold tracking-tight"
          style={{ animationDelay: '0.1s' }}
        >
          Tyler Mastrangelo
        </h1>
        <p className="mono develop mt-2" style={{ animationDelay: '0.2s' }}>
          Elon, NC <Dot /> Marco Island, FL
        </p>
        <p
          className="voice develop mt-3 text-[17px] leading-snug"
          style={{ animationDelay: '0.3s', ...inkSoft }}
        >
          Founder of Quad; CS and cybersecurity at Elon.
        </p>

        <div className="develop mt-7" style={{ animationDelay: '0.4s' }}>
          <a
            href="/files/Tyler%20Mastrangelo%20Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`connect-btn !px-5 !py-2.5 text-[13px] ${pressable}`}
          >
            Resume
            <span className="text-xs">↗</span>
          </a>

          {/* The socials join the row system instead of floating in the middle
              of the header: mono label left, glyphs right, the same shape as
              every row further down the page. -mr-2.5 trims the last tap box's
              dead space so the glyph itself lands on the margin. */}
          <div
            className="mt-7 flex items-center justify-between border-t"
            style={hairline}
          >
            <span className="mono">Elsewhere</span>
            <div className="-mr-2.5 flex items-center">
              {socialLinks.map((link) => {
                const Icon = link.icon
                const external = link.href.startsWith('http')
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={link.label}
                    className={`inline-flex h-12 w-9 items-center justify-center ${pressable}`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* The directory, no label needed */}
      <nav className="develop mt-12" style={{ animationDelay: '0.6s' }}>
        {siteLinks.map((link, i) => {
          const external = link.href.startsWith('http')
          return (
            <Link
              key={link.href}
              href={link.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={`flex items-center justify-between gap-4 border-b py-4 ${i === 0 ? 'border-t' : ''} ${pressable}`}
              style={hairline}
            >
              <span className="min-w-0">
                <span className="block text-[16px] font-medium">{link.label}</span>
                <span className="voice mt-0.5 block text-[14px]" style={inkSoft}>
                  {link.line}
                </span>
              </span>
              <span style={safelight} aria-hidden>
                {external ? '↗' : '→'}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Selected work: frames off the roll */}
      <section className="develop mt-12" style={{ animationDelay: '0.7s' }}>
        <h2 className="mono border-b pb-2" style={hairline}>
          Selected work
        </h2>
        {featured.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`flex items-center justify-between gap-4 border-b py-4 ${pressable}`}
            style={hairline}
          >
            <span className="flex min-w-0 items-baseline gap-4">
              <span className="mono shrink-0" style={safelight}>
                {String(i + 1).padStart(2, '0')}A
              </span>
              <span className="truncate text-[15px] font-medium">{project.title}</span>
            </span>
            <span className="mono shrink-0" style={inkSoft}>
              {project.category}
            </span>
          </Link>
        ))}
      </section>

      {/* Now */}
      <section className="develop mt-12" style={{ animationDelay: '0.8s' }}>
        <h2 className="mono border-b pb-2" style={hairline}>
          Now
        </h2>
        <dl>
          {now.map((row) => (
            <div key={row.org} className="index-row">
              <dt>{row.org}</dt>
              <dd>{row.line}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mono develop mt-14 text-center" style={{ animationDelay: '0.9s' }}>
        Shot on a Kodak Pixpro FZ55
      </p>
    </main>
  )
}
