'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import FadeImage from '@/components/FadeImage'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ProjectTile from '@/components/ProjectTile'
import { projects, ProjectCategory, getProjectStackList } from '@/lib/projects'

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'featured'

const categories: Array<{ value: ProjectCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'web', label: 'Web' },
  { value: 'platform', label: 'Platform / API' },
  { value: 'internal-tool', label: 'Internal Tools' },
  { value: 'experiment', label: 'Experiments' },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<ProjectCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const filteredProjects = useMemo(() => {
    let filtered = projects

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          getProjectStackList(p).some((tech) =>
            tech.toLowerCase().includes(query)
          )
      )
    }

    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category)
    }

    const sorted = [...filtered]
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => b.year - a.year)
        break
      case 'oldest':
        sorted.sort((a, b) => a.year - b.year)
        break
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'featured':
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.year - a.year
        })
        break
    }

    return sorted
  }, [searchQuery, category, sortBy])

  // Reveal cards on scroll, and again whenever the visible set changes
  useEffect(() => {
    const handleReveal = () => {
      document.querySelectorAll('.reveal').forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.85) {
          element.classList.add('active')
        }
      })
    }

    handleReveal()
    window.addEventListener('scroll', handleReveal)
    return () => window.removeEventListener('scroll', handleReveal)
  }, [filteredProjects])

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="mb-12 space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight">
              Projects
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              A collection of systems, products, and experiments. Each project
              represents a step toward building better tools and understanding
              complex systems.
            </p>
          </div>

          {/* Search and Sort */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <input
                type="search"
                placeholder="Search projects, tech, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white shadow-sm"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full md:w-auto px-5 py-3.5 rounded-full border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">A → Z</option>
              <option value="featured">Featured First</option>
            </select>
          </div>

          {/* Category Pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? 'bg-primary text-secondary shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-gray-600 font-medium">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="reveal project-card group"
               
              >
                <div className="space-y-4">
                  {project.image ? (
                    <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-500 gradient-placeholder" style={{ aspectRatio: '4/3' }}>
                      <FadeImage
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <ProjectTile
                      title={project.title}
                      category={project.category.replace('-', ' ')}
                      gradient={project.gradients.card}
                      aspectRatio="4/3"
                      className="shadow-lg group-hover:shadow-xl transition-shadow duration-500"
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
                Nothing matches that search. Try a different keyword or category.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
