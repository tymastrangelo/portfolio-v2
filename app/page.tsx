'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Placeholder from '@/components/Placeholder'
import AnimatedConnectButton from '@/components/AnimatedConnectButton'
import { getFeaturedProjects, getProjectStackList } from '@/lib/projects'
import Image from 'next/image'

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const projects = getFeaturedProjects()

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY
        const opacity = Math.max(1 - scrolled / 600, 0)
        const translateY = scrolled * 0.5
        heroRef.current.style.opacity = opacity.toString()
        heroRef.current.style.transform = `translateY(${translateY}px)`
      }

      // Reveal sections on scroll
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

  return (
    <main className="relative min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="min-h-screen relative overflow-hidden bg-secondary"
      >
        {/* Optimized background image via next/image */}
        <Image
          src="/images/background.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dim overlay for professional readability */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        
        <div className="relative z-10 min-h-screen flex items-center px-6 md:px-12 pt-24">
          <div className="max-w-screen-2xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4 text-white">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white">
                  Tyler
                  <br />
                  <span className="italic font-serif" style={{ fontFamily: 'Georgia, serif' }}>M</span>astrangelo
                </h1>
                  <p className="text-lg text-gray-300">
                    Founder · CS & Cybersecurity Student
                  </p>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <div className="bg-primary/5 backdrop-blur-sm border border-border rounded-xl p-4 hover:bg-primary/10 transition-all cursor-hover text-white">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span className="text-sm font-medium text-white">SaaS Platforms</span>
                  </div>
                </div>
                
                <div className="bg-primary/5 backdrop-blur-sm border border-border rounded-xl p-4 hover:bg-primary/10 transition-all cursor-hover text-white">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    <span className="text-sm font-medium text-white">Web Apps</span>
                  </div>
                </div>
                
                <div className="bg-primary/5 backdrop-blur-sm border border-border rounded-xl p-4 hover:bg-primary/10 transition-all cursor-hover text-white">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                      <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                    <span className="text-sm font-medium text-white">APIs & Systems</span>
                  </div>
                </div>
                
                <div className="bg-primary/5 backdrop-blur-sm border border-border rounded-xl p-4 hover:bg-primary/10 transition-all cursor-hover text-white">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span className="text-sm font-medium text-white">Security</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Card */}
            <div className="bg-primary/5 backdrop-blur-md border border-border rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">
                Building real systems and products.
              </h3>
              <p className="text-gray-200 leading-relaxed">
                Focused on creating tools that solve actual problems and scale with intent. From Quad—the operating system for student organizations—to custom CRM systems, each project represents thoughtful engineering and product development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="reveal mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-4">
              Featured Work
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Selected projects that showcase technical depth and product thinking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="reveal project-card group cursor-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-6">
                  {project.image ? (
                    <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-500 gradient-placeholder" style={{ aspectRatio: '16/10' }}>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <Placeholder
                      aspectRatio="16/10"
                      gradient={project.gradients.card}
                      className="group-hover:shadow-2xl transition-shadow duration-500"
                    />
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">
                        {project.title}
                      </h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {project.year}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {project.tagline}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {getProjectStackList(project).slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-medium bg-primary/5 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="reveal mt-16 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm font-medium link-hover cursor-hover"
            >
              View All Projects
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-6 md:px-12 py-24 bg-primary text-secondary">
        <div className="max-w-4xl mx-auto">
          <div className="reveal space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
              Built to ship.
            </h2>
            <p className="text-lg md:text-xl leading-relaxed opacity-80">
              Every project is an opportunity to build something meaningful.
              Focus on systems that scale, products that matter, and code that
              lasts. No shortcuts, no compromises.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Connect Button - Animated with Three.js */}
      <AnimatedConnectButton />
    </main>
  )
}
