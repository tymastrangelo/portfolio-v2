'use client'

import { useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Placeholder from '@/components/Placeholder'
import { getProject } from '@/lib/projects'

export default function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = getProject(params.slug)

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
                  {project.links.demoVideo && (
                    project.links.demoVideo === 'coming-soon' ? (
                      <button
                        disabled
                        className="inline-flex items-center px-6 py-3 bg-gray-300 text-gray-600 rounded-full text-sm font-medium cursor-not-allowed"
                      >
                        Demo Video Coming Soon
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
                        Watch Demo
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
                  {liveHref && (
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
            </div>

            <div className="reveal">
              {project.image ? (
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
      <section className="py-16 px-6 md:px-12">
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

      {/* Tech Stack Section */}
      <section className="py-16 px-6 md:px-12 bg-primary text-secondary">
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
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="reveal mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Visual Overview
            </h2>
          </div>

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
            <div className="reveal md:col-span-2" style={{ animationDelay: '0.2s' }}>
              <Placeholder
                aspectRatio="21/9"
                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                className="shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

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
                : 'Interested in this project?'}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {project.links?.demoVideo && (
                project.links.demoVideo === 'coming-soon' ? (
                  <button
                    disabled
                    className="inline-flex items-center px-8 py-4 bg-gray-300 text-gray-600 rounded-full text-sm font-medium cursor-not-allowed"
                  >
                    Demo Video Coming Soon
                  </button>
                ) : (
                  <a
                    href={project.links.demoVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-accent text-primary rounded-full text-sm font-medium hover:bg-secondary transition-all cursor-hover magnetic"
                  >
                    Watch Demo
                  </a>
                )
              )}
              {liveHref && (
                isInternalLive ? (
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
