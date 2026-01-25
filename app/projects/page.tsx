'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Placeholder from '@/components/Placeholder'
import { projects, Project, getProjectStackList } from '@/lib/projects'

export default function ProjectsPage() {
  const [filter, setFilter] = useState<'all' | Project['category']>('all')

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

  useEffect(() => {
    // Re-trigger reveal animation when filter changes
    const reveals = document.querySelectorAll('.reveal')
    reveals.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      if (rect.top < windowHeight * 0.85) {
        element.classList.add('active')
      }
    })
  }, [filter])

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter)

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'web', label: 'Web' },
    { value: 'platform', label: 'Platforms' },
    { value: 'internal-tool', label: 'Internal Tools' },
    { value: 'experiment', label: 'Experiments / Labs' },
  ]

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="mb-16 space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight">
              Projects
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              A collection of systems, products, and experiments. Each project
              represents a step toward building better tools and understanding
              complex systems.
            </p>
          </div>

          {/* Filter */}
          <div className="mb-12 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value as typeof filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-hover magnetic ${
                  filter === cat.value
                    ? 'bg-primary text-secondary'
                    : 'bg-primary/5 text-gray-700 hover:bg-primary/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="reveal project-card group cursor-hover"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="space-y-4">
                  {project.image ? (
                    <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-500 gradient-placeholder" style={{ aspectRatio: '4/3' }}>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <Placeholder
                      aspectRatio="4/3"
                      gradient={project.gradients.card}
                      className="group-hover:shadow-xl transition-shadow duration-500"
                    />
                  )}

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-display font-semibold tracking-tight">
                        {project.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {project.year}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.tagline}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {getProjectStackList(project).slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs font-medium bg-primary/5 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {getProjectStackList(project).length > 2 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{getProjectStackList(project).length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-24">
              <p className="text-gray-600">
                No projects in this category yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
