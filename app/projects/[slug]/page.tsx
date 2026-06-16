'use client'

import { useEffect, useRef, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Placeholder from '@/components/Placeholder'
import { getProject } from '@/lib/projects'

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

export default function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = getProject(params.slug)
  const isIronMan = project?.slug === 'iron-man-mk3-helmet'
  const isChords = project?.slug === 'chords-of-hope'
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
      document.body.classList.remove('disable-custom-cursor-page')
      return
    }

    document.body.classList.add('disable-custom-cursor-page')

    return () => {
      document.body.classList.remove('disable-custom-cursor-page')
    }
  }, [isRetroPong])

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
    <main className="relative min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 rounded-full uppercase tracking-wide">
                    {project.category}
                  </span>
                  <span className="text-sm text-gray-500">{project.year}</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold tracking-tight">
                  {project.title}
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  {project.tagline}
                </p>
              </div>

              {project.links && (
                <div className="flex flex-wrap gap-4">
                  {project.links.demoVideo && !isContentCreation && (
                    project.links.demoVideo === 'coming-soon' ? (
                      <button
                        disabled
                        className="inline-flex items-center px-6 py-3 bg-gray-300 text-gray-600 rounded-full text-sm font-medium cursor-not-allowed"
                      >
                        {isIronMan ? 'Build Walkthrough Coming Soon' : 'Demo Video Coming Soon'}
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    ) : (
                      <a
                        href={project.links.demoVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-primary text-secondary rounded-full text-sm font-medium hover:bg-accent hover:text-primary transition-all cursor-hover magnetic"
                      >
                        {isIronMan ? 'Build Walkthrough' : 'Watch Demo'}
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </a>
                    )
                  )}
                  {liveHref && !isRetroPong && (
                    isInternalLive ? (
                      <Link
                        href={liveHref}
                        className="inline-flex items-center px-6 py-3 bg-primary text-secondary rounded-full text-sm font-medium hover:bg-accent hover:text-primary transition-all cursor-hover magnetic"
                      >
                        Visit Live Site
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </Link>
                    ) : (
                      <a
                        href={liveHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-primary text-secondary rounded-full text-sm font-medium hover:bg-accent hover:text-primary transition-all cursor-hover magnetic"
                      >
                        Visit Live Site
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    )
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border border-primary rounded-full text-sm font-medium hover:bg-primary hover:text-secondary transition-all cursor-hover magnetic"
                    >
                      View Source
                    </a>
                  )}
                  {project.links.beta && (
                    <a
                      href={project.links.beta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 border border-primary rounded-full text-sm font-medium hover:bg-primary hover:text-secondary transition-all cursor-hover magnetic"
                    >
                      Join Beta
                    </a>
                  )}
                </div>
              )}
              {isChessBoardClock && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-border bg-white/90 p-5 shadow-sm backdrop-blur">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Creator
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      Tyler Mastrangelo
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Computer Science (A.B.) with minors in Cybersecurity and Psychology
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-white/90 p-5 shadow-sm backdrop-blur">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Sponsor
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      Brendan Haggerty
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Professor of the College of Arts and Sciences
                    </p>
                  </div>
                </div>
              )}
              {isIronMan && (
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/files/instructions.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-primary text-secondary rounded-full text-sm font-medium hover:bg-accent hover:text-primary transition-all cursor-hover magnetic"
                  >
                    Open Instructions (PDF)
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 16V4m0 12l-4-4m4 4l4-4M4 20h16"
                      />
                    </svg>
                  </a>
                  <a
                    href="/images/wiring-diagram.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-primary rounded-full text-sm font-medium hover:bg-primary hover:text-secondary transition-all cursor-hover magnetic"
                  >
                    Wiring Diagram
                  </a>
                </div>
              )}
            </div>

            <div className="reveal">
              {isIronMan ? (
                <div className="space-y-4">
                  <div
                    className="relative overflow-hidden rounded-lg shadow-2xl"
                    style={{ aspectRatio: '16/9' }}
                  >
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
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
                      <p className="text-xs uppercase tracking-widest text-gray-500">Build time</p>
                      <p className="text-lg font-semibold text-gray-900">~ 8 hours</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
                      <p className="text-xs uppercase tracking-widest text-gray-500">Skill range</p>
                      <p className="text-lg font-semibold text-gray-900">Intermediate maker</p>
                    </div>
                  </div>
                </div>
              ) : isChords ? (
                <div className="space-y-4">
                  <div
                    className="relative overflow-hidden rounded-2xl border border-border shadow-2xl bg-white"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-3 bg-white/90 backdrop-blur">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        Live site
                      </span>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1758687126874-7d88e5b8fdf5?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Chords of Hope website hero"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800">
                        Music education for young learners
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="rounded-full border border-border px-3 py-1">Guitar</span>
                    <span className="rounded-full border border-border px-3 py-1">Piano</span>
                    <span className="rounded-full border border-border px-3 py-1">Voice</span>
                  </div>
                </div>
              ) : isRetroPong ? (
                <div className="space-y-4">
                  <div
                    className="relative overflow-hidden rounded-2xl border border-border shadow-2xl"
                    style={{ aspectRatio: '16/10' }}
                  >
                    <Image
                      src="/games/retro-pong/photos/pong-homescreen.jpeg"
                      alt="Retro Pong preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center"
                    >
                      <button
                        type="button"
                        aria-label="Play Retro Pong"
                        onClick={openRetroPongPlayer}
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/70 px-6 py-3 text-white text-sm font-medium backdrop-blur transition-all hover:bg-black"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Play
                      </button>
                    </div>
                  </div>
                </div>
              ) : isChessBoardClock ? (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl bg-black" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      src="https://www.youtube.com/embed/Ib9ktLTNnNU"
                      title="Chess Board + Clock video"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Placeholder
                      aspectRatio="4/3"
                      gradient="linear-gradient(135deg, #111827 0%, #3f3f46 45%, #a16207 100%)"
                      className="shadow-lg"
                    />
                    <Placeholder
                      aspectRatio="4/3"
                      gradient="linear-gradient(135deg, #111827 0%, #5b4636 45%, #d6b98c 100%)"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              ) : project.image ? (
                <div className="relative overflow-hidden rounded-lg shadow-2xl gradient-placeholder" style={{ aspectRatio: '4/3' }}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <Placeholder
                  aspectRatio="4/3"
                  gradient={project.gradients.hero}
                  className="shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      {!isContentCreation && (
        <section className="py-16 px-6 md:px-12" id={isIronMan ? 'overview' : undefined}>
          <div className="max-w-4xl mx-auto">
            <div className="reveal space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                Overview
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                {project.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {isChessBoardClock && (
        <section className="pt-0 pb-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="reveal grid gap-8 lg:grid-cols-2">
              <div className="space-y-5">
                <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                  The Board
                </h2>
                <ul className="space-y-3 text-base md:text-lg leading-relaxed text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Regulation tournament size with 2 inch squares and a 16x16 inch playing surface.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Alternating maple and walnut squares with a maple border, elevated on an MDF base for a floating effect.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Practice cuts on scrap plywood first to dial in the table saw before cutting the expensive hardwood.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Finished with danish oil, which made the colors pop, and built at the Elon Maker Hub as the first serious woodworking project.</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-5">
                <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                  The Clock
                </h2>
                <ul className="space-y-3 text-base md:text-lg leading-relaxed text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Arduino Nano, buttons, and an LCD display to keep score cleanly during play.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Laser-engraved case for a more finished look next to the board.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>Used an Instructables wiring guide as the reference for the electronics layout.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="reveal rounded-3xl border border-border bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                What&apos;s Next
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600 max-w-3xl">
                Plan to use it as a centerpiece in the room and keep building more woodworking and Arduino projects from there.
              </p>
            </div>
          </div>
        </section>
      )}

      {project.highlights && project.highlights.length > 0 && !isIronMan && !isChessBoardClock && (
        <section className="pt-0 pb-16 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="reveal space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                What I Learned
              </h2>
              <ul className="space-y-3 text-base md:text-lg leading-relaxed text-gray-600">
                {project.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {isRetroPong && (
        <section className="pt-10 pb-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="reveal space-y-5">
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                Visual Overview
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-black" style={{ aspectRatio: '16/10' }}>
                  <Image
                    src="/games/retro-pong/photos/pong-homescreen.jpeg"
                    alt="Retro Pong home screen"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-border bg-black" style={{ aspectRatio: '16/10' }}>
                  <Image
                    src="/games/retro-pong/photos/pong-ailevels.jpeg"
                    alt="Retro Pong AI level selection"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-border bg-black" style={{ aspectRatio: '16/10' }}>
                  <Image
                    src="/games/retro-pong/photos/pong-gameplay.jpeg"
                    alt="Retro Pong gameplay"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isRetroPong && isRetroPongPlayerOpen && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm p-4 md:p-8">
          <div className="mx-auto h-full max-w-6xl flex items-center justify-center">
            <div
              ref={retroPongContainerRef}
              className="relative w-full overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl"
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

      {isChords && (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="reveal grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                  Mission & Impact
                </h2>
                <p className="text-lg leading-relaxed text-gray-600">
                  Built to make music education approachable, the site organizes
                  lessons by instrument and keeps the experience lightweight for
                  students, parents, and educators. It is designed to remove
                  barriers and help kids build confidence through creativity.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="rounded-full border border-border px-3 py-1">
                    Free lessons
                  </span>
                  <span className="rounded-full border border-border px-3 py-1">
                    Community-first
                  </span>
                  <span className="rounded-full border border-border px-3 py-1">
                    Mobile friendly
                  </span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-amber-100" />
                <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-emerald-100" />
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-widest text-gray-500">
                    Program Founder
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-secondary text-sm font-semibold">
                      BCD
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Brayden Cruz-Diaz
                      </p>
                      <p className="text-sm text-gray-600">
                        Williams College, MA
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Built to inspire hope through the power of music and community-led teaching.
                  </p>
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-secondary"
                    href="https://www.linkedin.com/in/brayden-cruz-diaz/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View LinkedIn
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isIronMan && (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <div className="grid lg:grid-cols-[240px_1fr] gap-10">
              <aside className="reveal lg:sticky lg:top-28 h-fit rounded-2xl border border-border bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-gray-500">Guide Contents</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li><a className="link-hover" href="#overview">Overview</a></li>
                  <li><a className="link-hover" href="#quick-steps">Quick Steps</a></li>
                  <li><a className="link-hover" href="#sizing">Sizing</a></li>
                  <li><a className="link-hover" href="#printed-parts">Printed Parts</a></li>
                  <li><a className="link-hover" href="#hardware">Hardware & Electronics</a></li>
                  <li><a className="link-hover" href="#arduino-code">Arduino Code</a></li>
                  <li><a className="link-hover" href="#wiring">Wiring Diagram</a></li>
                  <li><a className="link-hover" href="#dry-assembly">Dry Assembly</a></li>
                  <li><a className="link-hover" href="#finishing">Finishing</a></li>
                  <li><a className="link-hover" href="#credits">Credits</a></li>
                </ul>
                <div className="mt-6 space-y-3">
                  <a
                    href="/files/instructions.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-secondary transition-all hover:bg-accent hover:text-primary cursor-hover magnetic"
                  >
                    Open Instructions PDF
                  </a>
                  <a
                    href="https://youtu.be/9uIXtODioGM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-secondary cursor-hover magnetic"
                  >
                    Build Walkthrough
                  </a>
                </div>
              </aside>

              <div className="space-y-10">
                <section id="quick-steps" className="reveal rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-display font-semibold">Quick Steps</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600">
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

                <section id="sizing" className="reveal rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-display font-semibold">Sizing the Helmet</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600">
                    <li>Print the sizing ring included with the model.</li>
                    <li>Test fit. Light resistance over ears = perfect.</li>
                    <li>Scale the shell up/down evenly and reprint if needed.</li>
                    <li>Do not scale precision parts: brain_base, brain_cap, dimmer_arm, dimmer_mount, ServoArm_active, ServoArm_passive.</li>
                    <li>Need battery clearance? Use the Dome_04-Resize insert.</li>
                  </ol>
                </section>

                <section id="printed-parts" className="reveal rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-display font-semibold">Printed Parts List</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 text-gray-600">
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
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-gray-700">
                    Keep the precision servo parts at 100% scale even if the shell is resized.
                  </div>
                </section>

                <section id="hardware" className="reveal rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-display font-semibold">Hardware & Electronics</h3>
                  <div className="mt-5 grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-secondary/40 px-6 py-5">
                      <p className="text-xs uppercase tracking-widest text-gray-500">Electronics</p>
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                        <li>Arduino Nano Every</li>
                        <li>ES08MA micro servos x2</li>
                        <li>LED eyes (strip or custom PCB)</li>
                        <li>10k potentiometer for brightness</li>
                        <li>3-pin slide switch + momentary push button</li>
                        <li>AAA battery pack (4-cell)</li>
                        <li>Jumper wire kit, 2x 2x6x2.5 mm bearings (optional)</li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-secondary/40 px-6 py-5">
                      <p className="text-xs uppercase tracking-widest text-gray-500">Assembly</p>
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                        <li>CA glue / Weld-On 16 for seams</li>
                        <li>Elastic head strap + padding kit</li>
                        <li>Sandpaper (120-400 grit) + filler primer</li>
                        <li>Metallic red & gold spray paint + clear coat</li>
                        <li>Clamps or painter&apos;s tape</li>
                        <li>M2 & M2.5 hardware assortment, self-tapping screws</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="arduino-code" className="reveal rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-display font-semibold">Arduino Code</h3>
                  <p className="mt-3 text-gray-600">
                    Upload this sketch with the ServoEasing library installed. Tune the open/closed constants to your servo geometry.
                  </p>
                  <pre className="mt-6 overflow-x-auto rounded-2xl bg-primary px-6 py-5 text-sm text-secondary">
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
                  <p className="mt-4 text-sm text-gray-600">
                    Upload via Arduino IDE: select &quot;Arduino Nano Every&quot; as the board, install ServoEasing, and tweak servo endpoints until the faceplate seals cleanly.
                  </p>
                </section>

                <section id="wiring" className="reveal rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-display font-semibold">Wiring Diagram & Notes</h3>
                  <p className="mt-3 text-gray-600">Tap to view full size.</p>
                  <a
                    href="/images/wiring-diagram.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block"
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-lg" style={{ aspectRatio: '16/9' }}>
                      <Image
                        src="/images/wiring-diagram.png"
                        alt="Wiring diagram for servos, LEDs, potentiometer, and switch connections."
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 70vw"
                      />
                    </div>
                  </a>
                  <ul className="mt-5 list-disc space-y-2 pl-5 text-gray-600">
                    <li>Servos: signals on D9/D10, power from battery or regulated 5V, shared ground with Arduino.</li>
                    <li>LED driver: PWM control on D6 (use a MOSFET if your LEDs pull real current).</li>
                    <li>Potentiometer: wiper to A0, outer legs to 5V/GND.</li>
                    <li>Faceplate trigger: normally-open momentary switch from D2 to ground with INPUT_PULLUP.</li>
                  </ul>
                </section>

                <section id="dry-assembly" className="reveal rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-display font-semibold">Dry Assembly & Alignment</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600">
                    <li>Mount servos to brackets and validate travel range on the bench.</li>
                    <li>Dry-fit face + dome with painter&apos;s tape; cycle servos to confirm clearance.</li>
                    <li>If you scaled the shell, mark and re-drill servo pivot holes to match.</li>
                    <li>Use self-tapping screws for temporary alignment, then commit to CA/Weld-On.</li>
                  </ol>
                </section>

                <section id="finishing" className="reveal rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <h3 className="text-2xl font-display font-semibold">Finishing</h3>
                  <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600">
                    <li>Sand prints (120 to 220 to 400 grit) and apply filler primer between passes.</li>
                    <li>Lay down metallic red on the shell and gold on the faceplate; finish with clear coat.</li>
                    <li>Install padding, straps, and tuck wiring for a safe wearable fit.</li>
                  </ol>
                  <p className="mt-4 text-sm text-gray-600">
                    Painting walkthrough:{' '}
                    <a
                      className="link-hover"
                      href="https://youtu.be/xsrnA712-SU"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Smoothing & painting tips
                    </a>
                  </p>
                </section>

                <section id="credits" className="reveal rounded-2xl border border-border bg-primary p-8 text-secondary shadow-sm">
                  <h3 className="text-2xl font-display font-semibold text-secondary">Credits & References</h3>
                  <p className="mt-4 text-sm text-secondary/80">
                    This build consolidates guidance from{' '}
                    <a
                      className="link-hover text-secondary"
                      href="https://www.youtube.com/@BoxandLoop"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Box and Loop
                    </a>
                    , the{' '}
                    <a
                      className="link-hover text-secondary"
                      href="https://cults3d.com/en/3d-model/various/iron-man-helmet-articulated-wearable"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cults3D release
                    </a>
                    , the{' '}
                    <a
                      className="link-hover text-secondary"
                      href="https://www.thingiverse.com/thing:4629346"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Thingiverse remix
                    </a>
                    , and the original{' '}
                    <a
                      className="link-hover text-secondary"
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

      {isContentCreation && (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto space-y-12">
            <div className="reveal space-y-6 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
                Two Worlds, One Story
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                College life at Elon — classes, projects, campus grind. Back home — hands-on detailing work, transforming cars one at a time. Both sides tell my story.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {creatorFeaturedVideos.map((video, index) => (
                <a
                  key={video.videoPath}
                  href={video.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reveal rounded-2xl border border-border bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-hover group"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="aspect-[9/16] bg-primary/5 relative">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold text-white uppercase tracking-wide">
                        {video.category}
                      </p>
                      <p className="text-[10px] text-white/80 mt-1">Click to view on TikTok</p>
                    </div>
                  </div>
                  <div className="px-3 py-3 border-t border-border">
                    <p className="text-xs font-medium text-primary group-hover:text-primary/80 transition-colors">
                      {video.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="reveal pt-4">
              <h3 className="text-xl font-display font-semibold tracking-tight text-primary mb-4">
                Platforms
              </h3>
              <div className="flex flex-wrap gap-3">
                {creatorProfiles.map((profile) => (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-all"
                  >
                    <span>{profile.label}</span>
                    <span className="text-gray-500">{profile.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Tech Stack Section */}
      <section
        className={`px-6 md:px-12 bg-primary text-secondary ${
          isChords ? 'pt-24 pb-16' : isRetroPong ? 'pt-24 pb-16' : 'py-16'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="reveal space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Stack & Architecture
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.frontend.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-secondary/10 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.backend.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-secondary/10 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {project.stack.infra && project.stack.infra.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Infra</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.infra.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-secondary/10 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Gallery Section */}
      {!isChords && !isContentCreation && project.slug !== 'spring-break-voting-api' && !isRetroPong && (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <div className="reveal mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                Visual Overview
              </h2>
            </div>

            {project.slug === 'buffer-bros-crm' ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="reveal">
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    style={{ aspectRatio: '16/10' }}
                  >
                    <Image
                      src="/images/bb-crm2.png"
                      alt="Buffer Bros CRM dashboard overview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="reveal" style={{ animationDelay: '0.1s' }}>
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    style={{ aspectRatio: '16/10' }}
                  >
                    <Image
                      src="/images/bb-crm3.png"
                      alt="Buffer Bros CRM client and job details"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div
                  className="reveal md:col-span-2"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    style={{ aspectRatio: '21/9' }}
                  >
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
                      <source src="/videos/bb-video.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            ) : project.slug === 'quad' ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="reveal">
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    style={{ aspectRatio: '16/10' }}
                  >
                    <Image
                      src="/images/quad-preview2.png"
                      alt="Quad events dashboard preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="reveal" style={{ animationDelay: '0.1s' }}>
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    style={{ aspectRatio: '16/10' }}
                  >
                    <Image
                      src="/images/quad-preview3.png"
                      alt="Quad organizations and events preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div
                  className="reveal md:col-span-2"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg"
                    style={{ aspectRatio: '21/9' }}
                  >
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
                      <source src="/videos/quad-video.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            ) : project.slug === 'blue-boy-adventure' ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="reveal">
                <div
                  className="relative overflow-hidden rounded-lg shadow-lg"
                  style={{ aspectRatio: '16/10' }}
                >
                  <Image
                    src="/images/blueboy1.png"
                    alt="Blue Boy Adventure gameplay screenshot"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="reveal" style={{ animationDelay: '0.1s' }}>
                <div
                  className="relative overflow-hidden rounded-lg shadow-lg"
                  style={{ aspectRatio: '16/10' }}
                >
                  <Image
                    src="/images/blueboy2.jpg"
                    alt="Blue Boy Adventure combat scene"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          ) : project.slug === 'iron-man-mk3-helmet' ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="reveal">
                <div
                  className="relative overflow-hidden rounded-lg shadow-lg bg-white"
                  style={{ aspectRatio: '4/3' }}
                >
                  <Image
                    src="/images/ironman2.JPG"
                    alt="Iron Man MK3 helmet build photo"
                    fill
                    className="object-cover"
                    style={{ imageOrientation: 'none' }}
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="reveal">
                  <Placeholder
                    aspectRatio="16/10"
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    className="shadow-lg"
                  />
                </div>
                <div className="reveal" style={{ animationDelay: '0.1s' }}>
                  <Placeholder
                    aspectRatio="16/10"
                    gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    className="shadow-lg"
                  />
                </div>
                <div
                  className="reveal md:col-span-2"
                  style={{ animationDelay: '0.2s' }}
                >
                  <Placeholder
                    aspectRatio="21/9"
                    gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    className="shadow-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Key Features (Conditional - only for campaign-style projects) */}
      {project.slug === 'quad' && (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="reveal space-y-12">
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                Built for Modern Organizations
              </h2>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold">
                    Event Management
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create, schedule, and manage events with built-in RSVP
                    tracking, automated reminders, and attendance analytics.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold">
                    Member Portal
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Centralized member directory with role management,
                    communication tools, and activity tracking.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-display font-semibold">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Real-time insights into engagement metrics, event
                    performance, and member activity patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 bg-primary text-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
              {project.slug === 'quad'
                ? 'Ready to transform your organization?'
                : isIronMan
                  ? 'Want to build your own helmet?'
                  : isContentCreation
                    ? 'Want to collaborate?'
                    : 'Interested in this project?'}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {project.links?.demoVideo && !isContentCreation && (
                project.links.demoVideo === 'coming-soon' ? (
                  <button
                    disabled
                    className="inline-flex items-center px-8 py-4 bg-gray-300 text-gray-600 rounded-full text-sm font-medium cursor-not-allowed"
                  >
                    {isIronMan ? 'Build Walkthrough Coming Soon' : 'Demo Video Coming Soon'}
                  </button>
                ) : (
                  <a
                    href={project.links.demoVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-accent text-primary rounded-full text-sm font-medium hover:bg-secondary transition-all cursor-hover magnetic"
                  >
                    {isIronMan ? 'Build Walkthrough' : 'Watch Demo'}
                  </a>
                )
              )}
              {isContentCreation && (
                <a
                  href="mailto:mastrangelo.tyler@gmail.com?subject=Content%20Collaboration%20Inquiry"
                  className="inline-flex items-center px-8 py-4 bg-accent text-primary rounded-full text-sm font-medium hover:bg-secondary transition-all cursor-hover magnetic"
                >
                  Collab With Me
                </a>
              )}
              {isIronMan && (
                <a
                  href="/files/instructions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-accent text-primary rounded-full text-sm font-medium hover:bg-secondary transition-all cursor-hover magnetic"
                >
                  Download Instructions
                </a>
              )}
              {liveHref && (
                isRetroPong ? (
                  <a
                    href="mailto:mastrangelo.tyler@gmail.com?subject=Retro%20Pong%20Project%20Inquiry"
                    className="inline-flex items-center px-8 py-4 bg-accent text-primary rounded-full text-sm font-medium hover:bg-secondary transition-all cursor-hover magnetic"
                  >
                    Contact Me
                  </a>
                ) : isInternalLive ? (
                  <Link
                    href={liveHref}
                    className="inline-flex items-center px-8 py-4 bg-accent text-primary rounded-full text-sm font-medium hover:bg-secondary transition-all cursor-hover magnetic"
                  >
                    Get Started
                  </Link>
                ) : (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-accent text-primary rounded-full text-sm font-medium hover:bg-secondary transition-all cursor-hover magnetic"
                  >
                    Get Started
                  </a>
                )
              )}
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 border border-secondary rounded-full text-sm font-medium hover:bg-secondary hover:text-primary transition-all cursor-hover magnetic"
              >
                View More Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
