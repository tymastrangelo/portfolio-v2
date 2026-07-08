'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FadeImage from '@/components/FadeImage'
import { projects } from '@/lib/projects'

// projects is already in curated showcase order (see lib/projects.ts)
const orderedProjects = projects

export default function ProjectsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Array<HTMLAnchorElement | null>>([])

  // Rows crossing the middle of the list drive the preview. On desktop the
  // list is its own scroll container, so the observer roots there; on mobile
  // it falls back to the viewport.
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number((entry.target as HTMLElement).dataset.index))
          }
        })
      },
      {
        root: isDesktop ? listRef.current : null,
        rootMargin: '-45% 0px -45% 0px',
      }
    )
    rowRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const activeProject = orderedProjects[activeIndex]

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <div className="pt-28 pb-12 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="sr-only">Projects</h1>

          <div className="grid lg:grid-cols-[1fr_minmax(380px,480px)] gap-16 items-start lg:h-[calc(100dvh-10rem)]">
            {/* Title list — scrolls on its own next to the fixed preview */}
            <div
              ref={listRef}
              className="no-scrollbar lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-6 lg:[mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]"
            >
              {orderedProjects.map((project, index) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  data-index={index}
                  ref={(el) => {
                    rowRefs.current[index] = el
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`group flex items-baseline gap-5 border-b border-gray-200 py-7 transition-colors ${
                    index === 0 ? 'lg:border-t-0 border-t' : ''
                  }`}
                >
                  <span
                    className={`text-xs tabular-nums transition-colors ${
                      activeIndex === index ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-display font-semibold tracking-tight text-2xl md:text-4xl leading-tight transition-all duration-300 ${
                        activeIndex === index
                          ? 'text-gray-900 translate-x-1'
                          : 'text-gray-400'
                      }`}
                    >
                      {project.title}
                    </span>
                    <span className="mt-1.5 block text-xs uppercase tracking-[0.2em] text-gray-400">
                      {project.category.replace('-', ' ')} · {project.year}
                    </span>
                  </span>
                  <span
                    className={`hidden md:block text-xl transition-all duration-300 ${
                      activeIndex === index
                        ? 'opacity-100 translate-x-0 text-gray-900'
                        : 'opacity-0 -translate-x-2'
                    }`}
                    aria-hidden
                  >
                    →
                  </span>

                  {/* Inline thumbnail on small screens (no fixed preview there) */}
                  <span className="block lg:hidden w-20 h-16 shrink-0 self-center relative overflow-hidden rounded-md">
                    {project.image ? (
                      <FadeImage
                        src={project.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <span
                        className="absolute inset-0"
                        style={{ background: project.gradients.card }}
                      />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            {/* Fixed preview (desktop) */}
            <div className="hidden lg:flex h-full flex-col justify-center">
              <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{ aspectRatio: '4/3' }}>
                {orderedProjects.map((project, index) => (
                  <div
                    key={project.slug}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      activeIndex === index
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                    }`}
                    aria-hidden={activeIndex !== index}
                  >
                    {project.image ? (
                      <>
                        <div
                          className="absolute inset-0"
                          style={{ background: project.gradients.card }}
                        />
                        <FadeImage
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1280px) 40vw, 480px"
                        />
                      </>
                    ) : (
                      <div
                        className="absolute inset-0 flex items-end p-8"
                        style={{ background: project.gradients.card }}
                      >
                        <div className="absolute inset-0 bg-black/15" />
                        <div className="relative">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">
                            {project.category.replace('-', ' ')}
                          </p>
                          <p className="mt-1 text-3xl font-display font-semibold text-white leading-tight text-balance">
                            {project.title}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p
                key={activeProject.slug}
                className="mt-5 text-sm text-gray-600 leading-relaxed animate-fade-in"
              >
                {activeProject.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
