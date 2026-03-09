'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Placeholder from '@/components/Placeholder'
import { projects, Project, getProjectStackList } from '@/lib/projects'

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'featured'

export default function ProjectsPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showWithDemoOnly, setShowWithDemoOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values from projects
  const allYears = useMemo(
    () => Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a),
    []
  )

  const allTechs = useMemo(() => {
    const techSet = new Set<string>()
    projects.forEach((p) => {
      getProjectStackList(p).forEach((tech) => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [])

  const categories = [
    { value: 'mobile', label: 'Mobile' },
    { value: 'web', label: 'Web' },
    { value: 'platform', label: 'Platform / API' },
    { value: 'internal-tool', label: 'Internal Tools' },
    { value: 'experiment', label: 'Experiments / Labs' },
  ]

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

  // Smart filtering logic
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Search filter
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

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      )
    }

    // Year filter
    if (selectedYears.length > 0) {
      filtered = filtered.filter((p) => selectedYears.includes(p.year))
    }

    // Tech filter
    if (selectedTechs.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTechs.some((tech) => getProjectStackList(p).includes(tech))
      )
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter((p) => p.featured)
    }

    // Demo filter
    if (showWithDemoOnly) {
      filtered = filtered.filter(
        (p) => p.links?.demoVideo || p.links?.live || p.links?.beta
      )
    }

    // Sort
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
  }, [
    searchQuery,
    selectedCategories,
    selectedYears,
    selectedTechs,
    showFeaturedOnly,
    showWithDemoOnly,
    sortBy,
  ])

  // Re-trigger reveal animation when filters change
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    reveals.forEach((element) => {
      element.classList.remove('active')
    })
    setTimeout(() => {
      const handleReveal = () => {
        reveals.forEach((element) => {
          const rect = element.getBoundingClientRect()
          const windowHeight = window.innerHeight
          if (rect.top < windowHeight * 0.85) {
            element.classList.add('active')
          }
        })
      }
      handleReveal()
    }, 10)
  }, [filteredProjects])

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedYears([])
    setSelectedTechs([])
    setShowFeaturedOnly(false)
    setShowWithDemoOnly(false)
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedYears.length > 0 ||
    selectedTechs.length > 0 ||
    showFeaturedOnly ||
    showWithDemoOnly

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const toggleYear = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    )
  }

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    )
  }

  return (
    <main className="relative min-h-screen">
      <Navigation />

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowFilters(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col pointer-events-auto"
              >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-display font-semibold tracking-tight">
                  Filter Projects
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-hover"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 overscroll-contain">
                {/* Quick Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Quick Filters
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-hover ${
                        showFeaturedOnly
                          ? 'bg-primary text-secondary shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      ⭐ Featured Only
                    </button>
                    <button
                      onClick={() => setShowWithDemoOnly(!showWithDemoOnly)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-hover ${
                        showWithDemoOnly
                          ? 'bg-primary text-secondary shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🎬 Has Demo/Live Site
                    </button>
                  </div>
                </div>

                {/* Category Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Category
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-hover ${
                          selectedCategories.includes(cat.value)
                            ? 'bg-primary text-secondary shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Year
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {allYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => toggleYear(year)}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-hover ${
                          selectedYears.includes(year)
                            ? 'bg-primary text-secondary shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tech Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Technology
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {allTechs.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-hover ${
                          selectedTechs.includes(tech)
                            ? 'bg-primary text-secondary shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors cursor-hover"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-3 bg-primary text-secondary rounded-full text-sm font-medium hover:shadow-lg transition-all cursor-hover"
                >
                  Show {filteredProjects.length} Projects
                </button>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

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

          {/* Search and Controls Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search projects, tech, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white shadow-sm"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(true)}
                className={`flex-1 md:flex-none px-5 py-3.5 rounded-full text-sm font-medium transition-all cursor-hover shadow-sm ${
                  hasActiveFilters
                    ? 'bg-primary text-secondary'
                    : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                }`}
              >
                <span className="flex items-center gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-secondary text-primary rounded-full min-w-[20px] h-5 px-1.5 text-xs flex items-center justify-center font-semibold">
                      {[
                        selectedCategories.length,
                        selectedYears.length,
                        selectedTechs.length,
                        showFeaturedOnly ? 1 : 0,
                        showWithDemoOnly ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 md:flex-none px-5 py-3.5 rounded-full border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-hover shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">A → Z</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium">Active:</span>
              {selectedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="px-3 py-1.5 bg-primary text-secondary rounded-full text-xs font-medium flex items-center gap-1.5 cursor-hover hover:shadow-md transition-all"
                >
                  {categories.find((c) => c.value === cat)?.label}
                  <span className="text-sm">×</span>
                </button>
              ))}
              {selectedYears.map((year) => (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className="px-3 py-1.5 bg-primary text-secondary rounded-full text-xs font-medium flex items-center gap-1.5 cursor-hover hover:shadow-md transition-all"
                >
                  {year}
                  <span className="text-sm">×</span>
                </button>
              ))}
              {selectedTechs.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  className="px-3 py-1.5 bg-primary text-secondary rounded-full text-xs font-medium flex items-center gap-1.5 cursor-hover hover:shadow-md transition-all"
                >
                  {tech}
                  <span className="text-sm">×</span>
                </button>
              ))}
              {showFeaturedOnly && (
                <button
                  onClick={() => setShowFeaturedOnly(false)}
                  className="px-3 py-1.5 bg-primary text-secondary rounded-full text-xs font-medium flex items-center gap-1.5 cursor-hover hover:shadow-md transition-all"
                >
                  Featured Only
                  <span className="text-sm">×</span>
                </button>
              )}
              {showWithDemoOnly && (
                <button
                  onClick={() => setShowWithDemoOnly(false)}
                  className="px-3 py-1.5 bg-primary text-secondary rounded-full text-xs font-medium flex items-center gap-1.5 cursor-hover hover:shadow-md transition-all"
                >
                  Has Demo/Live
                  <span className="text-sm">×</span>
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 text-gray-600 hover:text-primary text-xs font-medium cursor-hover underline"
              >
                Clear all
              </button>
            </div>
          )}

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
