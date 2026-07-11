'use client'

import { useEffect, useRef, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import FadeImage from '@/components/FadeImage'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getProject, projects } from '@/lib/projects'

const creatorProfiles = [
  {
    label: 'Personal Instagram',
    handle: '@tymastrangelo',
    href: 'https://www.instagram.com/tymastrangelo/',
  },
  {
    label: 'Personal TikTok',
    handle: '@tymastrangelo',
    href: 'https://www.tiktok.com/@tymastrangelo',
  },
  {
    label: 'Brainly TikTok',
    handle: '@studywithtyler',
    href: 'https://www.tiktok.com/@studywithtyler',
  },
  {
    label: 'Elon SGA Instagram',
    handle: '@elonsga',
    href: 'https://www.instagram.com/elonsga/',
  },
  {
    label: 'Gauth TikTok (Coming Soon)',
    handle: '@coming-soon',
    href: 'https://www.tiktok.com/',
  },
]

const creatorFeaturedVideos = [
  {
    title: 'College Move-In Day',
    videoPath: '/videos/vlog1.MP4',
    category: 'college',
    postUrl: 'https://www.tiktok.com/t/ZThveFFF1/',
  },
  {
    title: 'Car Detailing Process',
    videoPath: '/videos/detail1.MP4',
    category: 'detailing',
    postUrl: 'https://www.tiktok.com/t/ZThve9kvv/',
  },
  {
    title: 'Dorm Upgrade',
    videoPath: '/videos/vlog2.MP4',
    category: 'college',
    postUrl: 'https://www.tiktok.com/t/ZThveS26y/',
  },
  {
    title: 'Detail Work',
    videoPath: '/videos/detail2.MP4',
    category: 'detailing',
    postUrl: 'https://www.tiktok.com/t/ZThveSwB4/',
  },
]

// Serif caption under the hero print, per project
const heroCaptions: Record<string, string> = {
  quad: 'quad, in the wild',
  'buffer-bros-crm': 'the crm, at work',
  'monkey-gesture-detector': 'monkey mode, engaged',
  'spring-break-voting-api': 'every vote, counted',
  'retro-pong': 'first to 7 wins',
  'iron-man-mk3-helmet': 'faceplate up, lights on',
  'chords-of-hope': 'chords of hope, live',
  'chess-board-clock': 'board and clock, on camera',
  'blue-boy-adventure': 'blue boy, overworld',
  'content-creation': 'behind the lens',
}

type GalleryItem = {
  src?: string
  video?: string
  alt: string
  caption: string
  aspect: string
  wide?: boolean
  raw?: boolean // phone photo: skip optimizer so EXIF orientation stays put
}

// "More prints": only projects with real media get a gallery
const galleries: Record<string, GalleryItem[]> = {
  'buffer-bros-crm': [
    { src: '/images/bb-crm2.png', alt: 'Buffer Bros CRM dashboard overview', caption: 'the dashboard', aspect: '16/10' },
    { src: '/images/bb-crm3.png', alt: 'Buffer Bros CRM client and job details', caption: 'clients and jobs', aspect: '16/10' },
    { video: '/videos/bb-video.mp4', alt: 'Buffer Bros CRM in motion', caption: 'in motion', aspect: '21/9', wide: true },
  ],
  quad: [
    { src: '/images/quad-preview2.png', alt: 'Quad events dashboard preview', caption: 'events at a glance', aspect: '16/10' },
    { src: '/images/quad-preview3.png', alt: 'Quad organizations and events preview', caption: 'orgs and members', aspect: '16/10' },
    { video: '/videos/quad-video.mp4', alt: 'Quad in motion', caption: 'in motion', aspect: '21/9', wide: true },
  ],
  'blue-boy-adventure': [
    { src: '/images/blueboy1.png', alt: 'Blue Boy Adventure gameplay screenshot', caption: 'the overworld', aspect: '16/10' },
    { src: '/images/blueboy2.jpg', alt: 'Blue Boy Adventure combat scene', caption: 'combat', aspect: '16/10' },
  ],
  'iron-man-mk3-helmet': [
    { src: '/images/ironman2.JPG', alt: 'Iron Man MK3 helmet build photo', caption: 'fresh off the printer', aspect: '4/3', raw: true },
  ],
  'retro-pong': [
    { src: '/games/retro-pong/photos/pong-homescreen.jpeg', alt: 'Retro Pong home screen', caption: 'the menu', aspect: '16/10' },
    { src: '/games/retro-pong/photos/pong-ailevels.jpeg', alt: 'Retro Pong AI level selection', caption: 'three difficulties', aspect: '16/10' },
    { src: '/games/retro-pong/photos/pong-gameplay.jpeg', alt: 'Retro Pong gameplay', caption: 'match point', aspect: '16/10' },
  ],
}

const pillOutline =
  'inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-colors border-[#1b1813]/25 hover:border-[#1b1813]'
const pillDisabled =
  'inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium border-[#1b1813]/10 text-[#1b1813]/40 cursor-not-allowed'

const hairline = { borderColor: 'var(--hairline)' } as const
const inkSoft = { color: 'var(--ink-soft)' } as const
const safelight = { color: 'var(--safelight)' } as const

function SectionLabel({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mono pb-2 border-b" style={hairline}>
      {children}
    </h2>
  )
}

const Dot = () => (
  <span style={safelight} aria-hidden>
    ·
  </span>
)

export default function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = getProject(params.slug)
  const isIronMan = project?.slug === 'iron-man-mk3-helmet'
  const isContentCreation = project?.slug === 'content-creation'
  const isChessBoardClock = project?.slug === 'chess-board-clock'
  const isRetroPong = project?.slug === 'retro-pong'
  const retroPongContainerRef = useRef<HTMLDivElement | null>(null)
  const retroPongFrameRef = useRef<HTMLIFrameElement | null>(null)
  const [isRetroPongMuted, setIsRetroPongMuted] = useState(false)
  const [isRetroPongFullscreen, setIsRetroPongFullscreen] = useState(false)
  const [isRetroPongPlayerOpen, setIsRetroPongPlayerOpen] = useState(false)

  useEffect(() => {
    if (!isRetroPong) {
      return
    }

    const handleFullscreenChange = () => {
      const container = retroPongContainerRef.current
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null
      }

      setIsRetroPongFullscreen(
        document.fullscreenElement === container ||
          doc.webkitFullscreenElement === container
      )
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [isRetroPong])

  useEffect(() => {
    // Reveal sections on scroll
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal')
      reveals.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const windowHeight = window.innerHeight
        if (rect.top < windowHeight * 0.85) {
          element.classList.add('active')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!project) {
    notFound()
  }

  const liveHref = project.links?.live
  const isInternalLive = !!liveHref && liveHref.startsWith('/')
  const frameIndex = projects.findIndex((p) => p.slug === project.slug)
  const frameNum = `${String(frameIndex + 1).padStart(2, '0')}A`
  const heroCaption = heroCaptions[project.slug] ?? project.title.toLowerCase()
  const gallery = galleries[project.slug]
  const demoVideo = project.links?.demoVideo
  const hasRealDemo = !!demoVideo && demoVideo !== 'coming-soon'

  const focusRetroPongGame = () => {
    retroPongFrameRef.current?.focus()
    retroPongFrameRef.current?.contentWindow?.focus()
  }

  const openRetroPongPlayer = () => {
    setIsRetroPongPlayerOpen(true)
    setTimeout(() => {
      focusRetroPongGame()
    }, 50)
  }

  const closeRetroPongPlayer = () => {
    setIsRetroPongPlayerOpen(false)
  }

  const toggleRetroPongMute = () => {
    const nextMuted = !isRetroPongMuted

    retroPongFrameRef.current?.contentWindow?.postMessage(
      {
        type: 'retro-pong:set-muted',
        muted: nextMuted,
      },
      window.location.origin
    )

    setIsRetroPongMuted(nextMuted)
    focusRetroPongGame()
  }

  const handleRetroPongFullscreen = () => {
    const container = retroPongContainerRef.current
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void
      webkitFullscreenElement?: Element | null
    }

    if (!container) {
      return
    }

    if (
      document.fullscreenElement === container ||
      doc.webkitFullscreenElement === container
    ) {
      if (document.exitFullscreen) {
        void document.exitFullscreen().catch(() => {
          // Ignore fullscreen errors.
        })
        return
      }

      if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      }
      return
    }

    if (container.requestFullscreen) {
      void container.requestFullscreen().then(() => {
        setTimeout(() => {
          focusRetroPongGame()
        }, 50)
      }).catch(() => {
        // Ignore fullscreen errors (browser policy/user gesture edge cases).
      })
      return
    }

    const webkitContainer = container as HTMLDivElement & {
      webkitRequestFullscreen?: () => void
    }

    if (webkitContainer.webkitRequestFullscreen) {
      webkitContainer.webkitRequestFullscreen()
      setTimeout(() => {
        focusRetroPongGame()
      }, 50)
    }
  }

  return (
    <main className="filmy relative min-h-screen">
      <Navigation />

      {/* Hero: rebate line, title, voice tagline, one taped print */}
      <section className="pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <div>
            <p className="mono develop mb-6">
              Frame {frameNum} <Dot /> {project.category} <Dot /> {project.year}
            </p>
            <h1
              className="develop font-display font-semibold tracking-tight text-4xl lg:text-5xl leading-[1.05]"
              style={{ animationDelay: '0.1s' }}
            >
              {project.title}
            </h1>
            <p
              className="voice develop mt-5 text-xl md:text-2xl leading-snug max-w-xl"
              style={{ animationDelay: '0.25s', ...inkSoft }}
            >
              {project.tagline}
            </p>

            <div className="develop mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: '0.4s' }}>
              {demoVideo && !isContentCreation && (
                demoVideo === 'coming-soon' ? (
                  <button disabled className={pillDisabled}>
                    {isIronMan ? 'Build walkthrough coming soon' : 'Demo video coming soon'}
                  </button>
                ) : (
                  <a href={demoVideo} target="_blank" rel="noopener noreferrer" className="connect-btn">
                    {isIronMan ? 'Build walkthrough' : 'Watch demo'}
                    <span className="text-xs">↗</span>
                  </a>
                )
              )}
              {liveHref && !isRetroPong && (
                isInternalLive ? (
                  <Link href={liveHref} className={hasRealDemo ? pillOutline : 'connect-btn'}>
                    Visit live site
                    <span className="text-xs">→</span>
                  </Link>
                ) : (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={hasRealDemo ? pillOutline : 'connect-btn'}
                  >
                    Visit live site
                    <span className="text-xs">↗</span>
                  </a>
                )
              )}
              {isRetroPong && (
                <button type="button" onClick={openRetroPongPlayer} className="connect-btn">
                  Play it here
                  <span className="text-xs">→</span>
                </button>
              )}
              {project.links?.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={pillOutline}>
                  View source
                  <span className="text-xs">↗</span>
                </a>
              )}
              {project.links?.beta && (
                <a href={project.links.beta} target="_blank" rel="noopener noreferrer" className={pillOutline}>
                  Join beta
                  <span className="text-xs">↗</span>
                </a>
              )}
              {isIronMan && (
                <>
                  <a href="/files/instructions.pdf" target="_blank" rel="noopener noreferrer" className={pillOutline}>
                    Open instructions
                    <span className="text-xs">↗</span>
                  </a>
                  <a href="/images/wiring-diagram.png" target="_blank" rel="noopener noreferrer" className={pillOutline}>
                    Wiring diagram
                    <span className="text-xs">↗</span>
                  </a>
                </>
              )}
            </div>

            {isChessBoardClock && (
              <div className="develop mt-9 grid gap-4 sm:grid-cols-2 max-w-xl" style={{ animationDelay: '0.5s' }}>
                <div className="index-card p-5">
                  <p className="mono">Creator</p>
                  <p className="mt-2 font-medium">Tyler Mastrangelo</p>
                  <p className="mt-1 text-sm leading-relaxed" style={inkSoft}>
                    Double major in Computer Science and Cybersecurity
                  </p>
                </div>
                <div className="index-card p-5">
                  <p className="mono">Sponsor</p>
                  <p className="mt-2 font-medium">Brendan Haggerty</p>
                  <p className="mt-1 text-sm leading-relaxed" style={inkSoft}>
                    Professor of the College of Arts and Sciences
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* The hero print */}
          <div className="develop" style={{ animationDelay: '0.3s' }}>
            <div className="print mx-auto w-full max-w-[540px]" style={{ transform: 'rotate(-1.5deg)' }}>
              <span className="tape" aria-hidden />
              {isIronMan ? (
                <div className="print-photo" style={{ aspectRatio: '16/9' }}>
                  <video
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                    controls={false}
                    controlsList="nodownload noplaybackrate noremoteplayback"
                  >
                    <source src="/videos/ironman.MOV" />
                  </video>
                </div>
              ) : isChessBoardClock ? (
                <div className="print-photo" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src="https://www.youtube.com/embed/Ib9ktLTNnNU"
                    title="Chess Board + Clock video"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : isRetroPong ? (
                <div className="print-photo" style={{ aspectRatio: '16/10' }}>
                  <FadeImage
                    src="/games/retro-pong/photos/pong-homescreen.jpeg"
                    alt="Retro Pong preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 z-[2] flex items-center justify-center">
                    <button
                      type="button"
                      aria-label="Play Retro Pong"
                      onClick={openRetroPongPlayer}
                      className="inline-flex items-center gap-2 rounded-full bg-[#16130e]/85 px-6 py-3 text-sm font-medium text-[#f5f2ea] backdrop-blur transition-colors hover:bg-[#16130e]"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play
                    </button>
                  </div>
                </div>
              ) : project.image ? (
                <div className="print-photo" style={{ aspectRatio: '4/3' }}>
                  <FadeImage
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="print-photo" style={{ aspectRatio: '4/3', background: project.gradients.hero }} />
              )}
              <span className="print-caption">{heroCaption}</span>
            </div>

            {isIronMan && (
              <div className="mt-8 grid grid-cols-2 gap-4 max-w-[540px] mx-auto">
                <div className="index-card px-5 py-4">
                  <p className="mono">Build time</p>
                  <p className="mt-1 font-medium">~ 8 hours</p>
                </div>
                <div className="index-card px-5 py-4">
                  <p className="mono">Skill range</p>
                  <p className="mt-1 font-medium">Intermediate maker</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The story */}
      {!isContentCreation && (
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="reveal max-w-3xl">
              <SectionLabel id={isIronMan ? 'overview' : undefined}>The story</SectionLabel>
              <p className="mt-6 text-lg leading-relaxed" style={inkSoft}>
                {project.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Chess board + clock: the two builds */}
      {isChessBoardClock && (
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-screen-xl mx-auto space-y-14">
            <div className="reveal grid gap-12 lg:grid-cols-2">
              <div>
                <SectionLabel>The board</SectionLabel>
                <ul className="mt-2">
                  {[
                    'Regulation tournament size with 2 inch squares and a 16x16 inch playing surface.',
                    'Alternating maple and walnut squares with a maple border, elevated on an MDF base for a floating effect.',
                    'Practice cuts on scrap plywood first to dial in the table saw before cutting the expensive hardwood.',
                    'Finished with danish oil, which made the colors pop, and built at the Elon Maker Hub as the first serious woodworking project.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 border-b py-4" style={hairline}>
                      <span
                        className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: 'var(--safelight)' }}
                        aria-hidden
                      />
                      <span className="leading-relaxed" style={inkSoft}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionLabel>The clock</SectionLabel>
                <ul className="mt-2">
                  {[
                    'Arduino Nano, buttons, and an LCD display to keep score cleanly during play.',
                    'Laser-engraved case for a more finished look next to the board.',
                    'Used an Instructables wiring guide as the reference for the electronics layout.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 border-b py-4" style={hairline}>
                      <span
                        className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: 'var(--safelight)' }}
                        aria-hidden
                      />
                      <span className="leading-relaxed" style={inkSoft}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="reveal max-w-3xl">
              <SectionLabel>What&apos;s next</SectionLabel>
              <p className="voice mt-5 text-lg leading-relaxed">
                Plan to use it as a centerpiece in the room and keep building more woodworking and Arduino projects
                from there.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* What I learned: numbered like frames on a roll */}
      {project.highlights && project.highlights.length > 0 && !isIronMan && !isChessBoardClock && (
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="reveal max-w-3xl">
              <SectionLabel>What I learned</SectionLabel>
              <ol className="mt-2">
                {project.highlights.map((item, i) => (
                  <li key={item} className="flex items-baseline gap-6 border-b py-5" style={hairline}>
                    <span className="mono shrink-0" style={safelight}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-relaxed" style={inkSoft}>
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* Retro Pong lightbox player */}
      {isRetroPong && isRetroPongPlayerOpen && (
        <div className="fixed inset-0 z-[90] bg-[#16130e]/85 backdrop-blur-sm p-4 md:p-8">
          <div className="mx-auto h-full max-w-6xl flex items-center justify-center">
            <div
              ref={retroPongContainerRef}
              className="relative w-full overflow-hidden rounded-md border border-white/20 bg-black shadow-2xl"
              style={{ aspectRatio: '16/10' }}
            >
              <iframe
                ref={retroPongFrameRef}
                src="/games/retro-pong/index.html"
                title="Retro Pong"
                className="h-full w-full bg-black"
                allowFullScreen
                tabIndex={-1}
              />

              <div className="absolute right-3 top-3 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={isRetroPongMuted ? 'Unmute game audio' : 'Mute game audio'}
                  onClick={toggleRetroPongMute}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-black/75 text-white backdrop-blur transition-all hover:bg-black"
                >
                  {isRetroPongMuted ? (
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H3v6h3l5 4V5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 9l-6 6" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9l6 6" />
                    </svg>
                  ) : (
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H3v6h3l5 4V5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.54 8.46a5 5 0 010 7.07" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.07 4.93a10 10 0 010 14.14" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  aria-label={isRetroPongFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  onClick={handleRetroPongFullscreen}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-black/75 text-white backdrop-blur transition-all hover:bg-black"
                >
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isRetroPongFullscreen ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4H4v6" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20H4v-6" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 20h6v-6" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10V4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10V4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14v6" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 14v6" />
                      </>
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4H4v5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 4h5v5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 15v5h-5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15v5h5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4L4 9" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 4l5 5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 15l-5 5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15l5 5" />
                      </>
                    )}
                  </svg>
                </button>

                <button
                  type="button"
                  aria-label="Close game window"
                  onClick={closeRetroPongPlayer}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-black/75 text-white backdrop-blur transition-all hover:bg-black"
                >
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chords of Hope: mission + founder card */}
      {project.slug === 'chords-of-hope' && (
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="reveal grid gap-12 md:grid-cols-2 items-start">
              <div>
                <SectionLabel>The mission</SectionLabel>
                <p className="mt-6 leading-relaxed" style={inkSoft}>
                  Built to make music education approachable, the site organizes lessons by instrument and keeps the
                  experience lightweight for students, parents, and educators. It is designed to remove barriers and
                  help kids build confidence through creativity.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['Free lessons', 'Community first', 'Mobile friendly'].map((chip) => (
                    <span key={chip} className="rounded-full border px-3 py-1 text-sm" style={{ ...hairline, ...inkSoft }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div className="index-card p-6 md:p-7">
                <span className="tape" aria-hidden />
                <p className="mono">Program founder</p>
                <div className="mt-4 flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold shrink-0"
                    style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                  >
                    BCD
                  </div>
                  <div>
                    <p className="font-medium">Brayden Cruz-Diaz</p>
                    <p className="text-sm" style={inkSoft}>
                      Williams College, MA
                    </p>
                  </div>
                </div>
                <p className="voice mt-4 text-[15px]" style={inkSoft}>
                  Built to inspire hope through the power of music and community-led teaching.
                </p>
                <a
                  className="quiet-link mt-4 inline-block text-sm font-medium"
                  href="https://www.linkedin.com/in/brayden-cruz-diaz/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View LinkedIn ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Iron Man: the build guide */}
      {isIronMan && (
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid lg:grid-cols-[240px_1fr] gap-10">
              <aside className="reveal lg:sticky lg:top-28 h-fit index-card p-6">
                <p className="mono">Guide contents</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {[
                    ['#overview', 'Overview'],
                    ['#quick-steps', 'Quick steps'],
                    ['#sizing', 'Sizing'],
                    ['#printed-parts', 'Printed parts'],
                    ['#hardware', 'Hardware and electronics'],
                    ['#arduino-code', 'Arduino code'],
                    ['#wiring', 'Wiring diagram'],
                    ['#dry-assembly', 'Dry assembly'],
                    ['#finishing', 'Finishing'],
                    ['#credits', 'Credits'],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <a className="link-hover" href={href}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-3">
                  <a
                    href="/files/instructions.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="connect-btn w-full justify-center !px-4 !py-2 text-xs"
                  >
                    Open instructions PDF
                  </a>
                  <a
                    href="https://youtu.be/9uIXtODioGM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border px-4 py-2 text-xs font-medium transition-colors border-[#1b1813]/25 hover:border-[#1b1813]"
                  >
                    Build walkthrough
                  </a>
                </div>
              </aside>

              <div className="space-y-10">
                <section id="quick-steps" className="reveal index-card p-7 md:p-8">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Quick steps</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5" style={inkSoft}>
                    <li>Print the sizing ring and verify ear clearance.</li>
                    <li>Batch print panels and fit-critical parts.</li>
                    <li>Upload the Arduino sketch to a Nano Every.</li>
                    <li>Bench test servos, LEDs, and dimmer before install.</li>
                    <li>Dry-fit shell + faceplate and dial servo links.</li>
                    <li>Sand, prime, paint red/gold, then clear coat.</li>
                    <li>Glue seams, add hardware, padding, and straps.</li>
                    <li>Suit up and enjoy the arc-reactor vibes.</li>
                  </ol>
                </section>

                <section id="sizing" className="reveal index-card p-7 md:p-8">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Sizing the helmet</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5" style={inkSoft}>
                    <li>Print the sizing ring included with the model.</li>
                    <li>Test fit. Light resistance over ears = perfect.</li>
                    <li>Scale the shell up/down evenly and reprint if needed.</li>
                    <li>Do not scale precision parts: brain_base, brain_cap, dimmer_arm, dimmer_mount, ServoArm_active, ServoArm_passive.</li>
                    <li>Need battery clearance? Use the Dome_04-Resize insert.</li>
                  </ol>
                </section>

                <section id="printed-parts" className="reveal index-card p-7 md:p-8">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Printed parts list</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2" style={inkSoft}>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Bolt x8</li>
                      <li>Brain_base, Brain_cap</li>
                      <li>CheekL, CheekR, Chin</li>
                      <li>Dimmer, Dimmer_arm, Dimmer_mount</li>
                      <li>Dome_01, Dome_01-trenchL, Dome_01-trenchR</li>
                    </ul>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Dome_02, Dome_03, Dome_04</li>
                      <li>EarL, EarR, Eyes, Face, Jaw, Mouth</li>
                      <li>ServoArm_active, ServoArm_passive</li>
                      <li>ServoMount_face, ServoMount_head, Visor</li>
                    </ul>
                  </div>
                  <div
                    className="mt-5 rounded-md border px-5 py-4 text-sm"
                    style={{ borderColor: 'rgba(255, 94, 66, 0.45)', background: 'rgba(255, 94, 66, 0.08)' }}
                  >
                    Keep the precision servo parts at 100% scale even if the shell is resized.
                  </div>
                </section>

                <section id="hardware" className="reveal index-card p-7 md:p-8">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Hardware and electronics</h3>
                  <div className="mt-5 grid gap-6 md:grid-cols-2">
                    <div className="rounded-md border px-6 py-5" style={hairline}>
                      <p className="mono">Electronics</p>
                      <ul className="mt-4 list-disc space-y-2 pl-5" style={inkSoft}>
                        <li>Arduino Nano Every</li>
                        <li>ES08MA micro servos x2</li>
                        <li>LED eyes (strip or custom PCB)</li>
                        <li>10k potentiometer for brightness</li>
                        <li>3-pin slide switch + momentary push button</li>
                        <li>AAA battery pack (4-cell)</li>
                        <li>Jumper wire kit, 2x 2x6x2.5 mm bearings (optional)</li>
                      </ul>
                    </div>
                    <div className="rounded-md border px-6 py-5" style={hairline}>
                      <p className="mono">Assembly</p>
                      <ul className="mt-4 list-disc space-y-2 pl-5" style={inkSoft}>
                        <li>CA glue / Weld-On 16 for seams</li>
                        <li>Elastic head strap + padding kit</li>
                        <li>Sandpaper (120-400 grit) + filler primer</li>
                        <li>Metallic red &amp; gold spray paint + clear coat</li>
                        <li>Clamps or painter&apos;s tape</li>
                        <li>M2 &amp; M2.5 hardware assortment, self-tapping screws</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="arduino-code" className="reveal index-card p-7 md:p-8">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Arduino code</h3>
                  <p className="mt-3" style={inkSoft}>
                    Upload this sketch with the ServoEasing library installed. Tune the open/closed constants to your
                    servo geometry.
                  </p>
                  <pre
                    className="mt-6 overflow-x-auto rounded-md px-6 py-5 text-sm"
                    style={{ background: 'var(--rebate)', color: 'var(--paper)' }}
                  >
                    <code>{`#include "ServoEasing.h"
ServoEasing servoTop;
ServoEasing servoBottom;

const int action_pin = 2; // trigger/proximity input (pullup)
const int ledPin = 6;     // eyes
const int potPin = A0;    // dimmer

int location = 31;
int bottom_closed = 107;
int top_closed = 167;
int bottom_open = 20;
int top_open = 20;
int value;
int maxBrightness;

void setup() {
    pinMode(action_pin, INPUT_PULLUP);
    pinMode(potPin, INPUT);
    servoTop.attach(9);
    servoBottom.attach(10);
    setSpeedForAllServos(190);
    servoTop.setEasingType(EASE_CUBIC_IN_OUT);
    servoBottom.setEasingType(EASE_CUBIC_IN_OUT);
    synchronizeAllServosStartAndWaitForAllServosToStop();
}

void loop() {
    value = analogRead(potPin);
    maxBrightness = map(value, 250, 750, 0, 255);
    int proximity = digitalRead(action_pin);
    if (proximity == LOW) {
        if (location > bottom_open) {
            servoTop.setEaseTo(top_open);
            servoBottom.setEaseTo(bottom_open);
            synchronizeAllServosStartAndWaitForAllServosToStop();
            location = bottom_open;
            delay(10);
            analogWrite(ledPin, 0);
        } else {
            servoTop.setEaseTo(top_closed);
            servoBottom.setEaseTo(bottom_closed);
            synchronizeAllServosStartAndWaitForAllServosToStop();
            location = bottom_closed;
            delay(50);
            analogWrite(ledPin, maxBrightness / 3);
            delay(100);
            analogWrite(ledPin, maxBrightness / 5);
            delay(100);
            analogWrite(ledPin, maxBrightness / 2);
            delay(100);
            analogWrite(ledPin, maxBrightness / 3);
            delay(100);
            analogWrite(ledPin, maxBrightness);
            delay(100);
        }
    }
}`}</code>
                  </pre>
                  <p className="mt-4 text-sm" style={inkSoft}>
                    Upload via Arduino IDE: select &quot;Arduino Nano Every&quot; as the board, install ServoEasing, and
                    tweak servo endpoints until the faceplate seals cleanly.
                  </p>
                </section>

                <section id="wiring" className="reveal index-card p-7 md:p-8">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Wiring diagram and notes</h3>
                  <p className="mt-3" style={inkSoft}>
                    Tap to view full size.
                  </p>
                  <a href="/images/wiring-diagram.png" target="_blank" rel="noopener noreferrer" className="mt-5 block">
                    <div
                      className="relative overflow-hidden rounded-md border bg-white"
                      style={{ aspectRatio: '16/9', ...hairline }}
                    >
                      <FadeImage
                        src="/images/wiring-diagram.png"
                        alt="Wiring diagram for servos, LEDs, potentiometer, and switch connections."
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 70vw"
                      />
                    </div>
                  </a>
                  <ul className="mt-5 list-disc space-y-2 pl-5" style={inkSoft}>
                    <li>Servos: signals on D9/D10, power from battery or regulated 5V, shared ground with Arduino.</li>
                    <li>LED driver: PWM control on D6 (use a MOSFET if your LEDs pull real current).</li>
                    <li>Potentiometer: wiper to A0, outer legs to 5V/GND.</li>
                    <li>Faceplate trigger: normally-open momentary switch from D2 to ground with INPUT_PULLUP.</li>
                  </ul>
                </section>

                <section id="dry-assembly" className="reveal index-card p-7 md:p-8">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Dry assembly and alignment</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5" style={inkSoft}>
                    <li>Mount servos to brackets and validate travel range on the bench.</li>
                    <li>Dry-fit face + dome with painter&apos;s tape; cycle servos to confirm clearance.</li>
                    <li>If you scaled the shell, mark and re-drill servo pivot holes to match.</li>
                    <li>Use self-tapping screws for temporary alignment, then commit to CA/Weld-On.</li>
                  </ol>
                </section>

                <section id="finishing" className="reveal index-card p-7 md:p-8">
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Finishing</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5" style={inkSoft}>
                    <li>Sand prints (120 to 220 to 400 grit) and apply filler primer between passes.</li>
                    <li>Lay down metallic red on the shell and gold on the faceplate; finish with clear coat.</li>
                    <li>Install padding, straps, and tuck wiring for a safe wearable fit.</li>
                  </ol>
                  <p className="mt-4 text-sm" style={inkSoft}>
                    Painting walkthrough:{' '}
                    <a
                      className="link-hover"
                      href="https://youtu.be/xsrnA712-SU"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Smoothing &amp; painting tips
                    </a>
                  </p>
                </section>

                <section
                  id="credits"
                  className="reveal rounded-md p-7 md:p-8"
                  style={{ background: 'var(--rebate)', color: 'var(--paper)' }}
                >
                  <h3 className="text-2xl font-display font-semibold tracking-tight">Credits and references</h3>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(245, 242, 234, 0.75)' }}>
                    This build consolidates guidance from{' '}
                    <a
                      className="underline underline-offset-4 decoration-[rgba(245,242,234,0.4)] hover:decoration-[#f5f2ea] transition-colors"
                      href="https://www.youtube.com/@BoxandLoop"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Box and Loop
                    </a>
                    , the{' '}
                    <a
                      className="underline underline-offset-4 decoration-[rgba(245,242,234,0.4)] hover:decoration-[#f5f2ea] transition-colors"
                      href="https://cults3d.com/en/3d-model/various/iron-man-helmet-articulated-wearable"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cults3D release
                    </a>
                    , the{' '}
                    <a
                      className="underline underline-offset-4 decoration-[rgba(245,242,234,0.4)] hover:decoration-[#f5f2ea] transition-colors"
                      href="https://www.thingiverse.com/thing:4629346"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Thingiverse remix
                    </a>
                    , and the original{' '}
                    <a
                      className="underline underline-offset-4 decoration-[rgba(245,242,234,0.4)] hover:decoration-[#f5f2ea] transition-colors"
                      href="https://www.reddit.com/r/3Dprinting/comments/jev5ax/iron_man_helmet_articulated_wearable_with_stls/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Reddit thread
                    </a>
                    . Huge thanks to the community for sharing designs and troubleshooting tips.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content creation: the reels */}
      {isContentCreation && (
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-screen-xl mx-auto space-y-14">
            <div className="reveal max-w-2xl">
              <SectionLabel>Two worlds, one story</SectionLabel>
              <p className="voice mt-6 text-xl md:text-2xl leading-relaxed">
                College life at Elon: classes, projects, campus grind. Back home: hands-on detailing work, transforming
                cars one at a time. Both sides tell my story.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {creatorFeaturedVideos.map((video, index) => (
                <a
                  key={video.videoPath}
                  href={video.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="print reveal group block"
                  style={{ transform: `rotate(${index % 2 === 0 ? '-1.4deg' : '1.4deg'})` }}
                >
                  <span className="tape" aria-hidden />
                  <div className="print-photo" style={{ aspectRatio: '9/16' }}>
                    <video
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      disablePictureInPicture
                      controls={false}
                      controlsList="nodownload noplaybackrate noremoteplayback"
                    >
                      <source src={video.videoPath} type="video/mp4" />
                    </video>
                    <div className="absolute inset-x-0 bottom-0 z-[2] flex justify-center bg-gradient-to-t from-black/60 to-transparent pb-3 pt-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="mono" style={{ color: '#f5f2ea' }}>
                        Watch on TikTok ↗
                      </span>
                    </div>
                  </div>
                  <span className="print-caption">{video.title.toLowerCase()}</span>
                </a>
              ))}
            </div>

            <div className="reveal">
              <SectionLabel>Platforms</SectionLabel>
              <div className="mt-6 flex flex-wrap gap-3">
                {creatorProfiles.map((profile) => (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors border-[#1b1813]/25 hover:border-[#1b1813]"
                  >
                    <span>{profile.label}</span>
                    <span style={inkSoft}>{profile.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stack: a strip of film rebate, sprocket holes and all */}
      <section className="relative px-6 md:px-12 py-16" style={{ background: 'var(--rebate)' }}>
        <div
          className="absolute left-0 right-0 top-2 h-[10px]"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(ellipse 4px 3.5px at center, var(--paper) 0 97%, transparent 100%)',
            backgroundSize: '26px 10px',
            backgroundRepeat: 'repeat-x',
          }}
        />
        <div
          className="absolute left-0 right-0 bottom-2 h-[10px]"
          aria-hidden
          style={{
            backgroundImage:
              'radial-gradient(ellipse 4px 3.5px at center, var(--paper) 0 97%, transparent 100%)',
            backgroundSize: '26px 10px',
            backgroundRepeat: 'repeat-x',
          }}
        />
        <div className="max-w-screen-xl mx-auto py-4">
          <div className="reveal">
            <h2 className="mono" style={{ color: 'rgba(245, 242, 234, 0.55)' }}>
              Stack <span style={safelight}>·</span> as built
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10">
              {(
                [
                  ['Frontend', project.stack.frontend],
                  ['Backend', project.stack.backend],
                  ['Infra', project.stack.infra ?? []],
                ] as const
              )
                .filter(([, items]) => items.length > 0)
                .map(([label, items]) => (
                  <div key={label}>
                    <h3 className="mono" style={safelight}>
                      {label}
                    </h3>
                    <ul className="mt-3">
                      {items.map((tech) => (
                        <li
                          key={tech}
                          className="border-b py-2.5 text-sm"
                          style={{ borderColor: 'rgba(245, 242, 234, 0.14)', color: 'var(--paper)' }}
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* More prints: real media only */}
      {gallery && (
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="reveal">
              <SectionLabel>More prints</SectionLabel>
            </div>
            <div className="mt-12 grid md:grid-cols-2 gap-x-10 gap-y-14">
              {gallery.map((item, i) => (
                <div
                  key={item.src ?? item.video}
                  className={`print reveal ${item.wide ? 'md:col-span-2' : ''}`}
                  style={{ transform: `rotate(${i % 2 === 0 ? '-1.2deg' : '1.2deg'})` }}
                >
                  <span className="tape" aria-hidden />
                  <div className="print-photo" style={{ aspectRatio: item.aspect }}>
                    {item.video ? (
                      <video
                        className="h-full w-full object-cover pointer-events-none"
                        autoPlay
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        controls={false}
                        controlsList="nodownload noplaybackrate noremoteplayback"
                      >
                        <source src={item.video} type="video/mp4" />
                      </video>
                    ) : (
                      <FadeImage
                        src={item.src!}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        style={item.raw ? { imageOrientation: 'none' } : undefined}
                        unoptimized={item.raw}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                  </div>
                  <span className="print-caption">{item.caption}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quad: what it does */}
      {project.slug === 'quad' && (
        <section className="px-6 md:px-12 pb-16">
          <div className="max-w-screen-xl mx-auto">
            <div className="reveal max-w-3xl">
              <SectionLabel>What it does</SectionLabel>
              <dl className="mt-2">
                <div className="index-row">
                  <dt>Events</dt>
                  <dd>
                    Create, schedule, and manage events with built-in RSVP tracking, automated reminders, and
                    attendance analytics.
                  </dd>
                </div>
                <div className="index-row">
                  <dt>Members</dt>
                  <dd>
                    A centralized member directory with role management, communication tools, and activity tracking.
                  </dd>
                </div>
                <div className="index-row">
                  <dt>Analytics</dt>
                  <dd>
                    Real-time insight into engagement metrics, event performance, and member activity patterns.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Closing: modest, on paper */}
      <section className="px-6 md:px-12 pb-24 pt-4">
        <div className="max-w-screen-xl mx-auto border-t pt-14 text-center" style={hairline}>
          <div className="reveal space-y-8">
            <p className="voice text-xl md:text-2xl" style={inkSoft}>
              {project.slug === 'quad'
                ? 'Curious what Quad could do for your campus?'
                : isIronMan
                  ? 'Want to build your own helmet?'
                  : isContentCreation
                    ? 'Want to make something together?'
                    : 'Want the full story behind this one?'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {demoVideo && !isContentCreation && demoVideo !== 'coming-soon' && (
                <a href={demoVideo} target="_blank" rel="noopener noreferrer" className="connect-btn">
                  {isIronMan ? 'Build walkthrough' : 'Watch demo'}
                  <span className="text-xs">↗</span>
                </a>
              )}
              {isContentCreation && (
                <a
                  href="mailto:mastrangelo.tyler@gmail.com?subject=Content%20Collaboration%20Inquiry"
                  className="connect-btn"
                >
                  Collab with me
                  <span className="text-xs">→</span>
                </a>
              )}
              {isIronMan && (
                <a href="/files/instructions.pdf" target="_blank" rel="noopener noreferrer" className={pillOutline}>
                  Download instructions
                  <span className="text-xs">↗</span>
                </a>
              )}
              {liveHref &&
                (isRetroPong ? (
                  <a
                    href="mailto:mastrangelo.tyler@gmail.com?subject=Retro%20Pong%20Project%20Inquiry"
                    className={pillOutline}
                  >
                    Contact me
                    <span className="text-xs">→</span>
                  </a>
                ) : isInternalLive ? (
                  <Link href={liveHref} className={hasRealDemo ? pillOutline : 'connect-btn'}>
                    Visit live site
                    <span className="text-xs">→</span>
                  </Link>
                ) : (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={hasRealDemo ? pillOutline : 'connect-btn'}
                  >
                    Visit live site
                    <span className="text-xs">↗</span>
                  </a>
                ))}
              <Link href="/projects" className={pillOutline}>
                More projects
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
