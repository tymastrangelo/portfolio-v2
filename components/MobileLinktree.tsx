'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import {
  FaEnvelope,
  FaExternalLinkAlt,
  FaFileAlt,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaShareAlt,
  FaTiktok,
} from 'react-icons/fa'
import { HiMiniCodeBracket, HiMiniSparkles } from 'react-icons/hi2'

import { projects, type Project } from '@/lib/projects'

type DisplayProject = {
  title: string
  source: string
  href: string
  category: Project['category']
}

type Tab = 'projects' | 'experience'

type ExperienceItem = {
  role: string
  org: string
  summary: string
  href?: string
}

const profile = {
  name: 'Tyler Mastrangelo',
  role: 'Founder · CS Student',
  avatar: '/images/pfp.JPG',
  resumeHref: '/files/Tyler%20Mastrangelo%20Resume.pdf',
}

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/tymastrangelo', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/tymastrangelo', icon: FaLinkedin },
  { label: 'Instagram', href: 'https://instagram.com/tymastrangelo', icon: FaInstagram },
  { label: 'TikTok', href: 'https://tiktok.com/@tymastrangelo', icon: FaTiktok },
]

const pressableClass =
  'transition-all duration-150 will-change-transform active:scale-[0.97] active:translate-y-[1px] active:brightness-95'

const experiences: ExperienceItem[] = [
  {
    role: 'Founder',
    org: 'Buffer Bros Mobile Detailing',
    summary: 'Co-founded and built the internal software stack: CRM, scheduling, and workflows.',
  },
  {
    role: 'Product Engineer',
    org: 'Quad',
    summary: 'Building a campus app for events and organizations with realtime updates.',
    href: '/quad',
  },
  {
    role: 'Senator of Arts & Sciences',
    org: 'Elon Student Government',
    summary: 'Represents students and helps shape campus policy and student initiatives.',
    href: 'https://www.elon.edu/u/campus-life/student-involvement/student-government-association/senate-council/',
  },
  {
    role: 'Consultant & Workshop Leader',
    org: 'Elon Maker Hub',
    summary: 'Guides student builders through prototyping and fabrication projects.',
    href: 'https://www.elon.edu/u/fa/technology/makerhub/our-team/',
  },
  {
    role: 'UGC Creator',
    org: 'Brainly',
    summary: 'Produced campaign content with hundreds of thousands of views.',
    href: 'https://www.tiktok.com/@studywithtyler?is_from_webapp=1&sender_device=pc',
  },
]

function getProjectHref(project: Project): string {
  if (project.links?.live) return project.links.live
  if (project.links?.github) return project.links.github
  if (project.links?.demoVideo && project.links.demoVideo !== 'coming-soon') {
    return project.links.demoVideo
  }
  return `/projects/${project.slug}`
}

function getSourceLabel(href: string): string {
  if (href.startsWith('http')) {
    try {
      return new URL(href).hostname.replace('www.', '')
    } catch {
      return 'external link'
    }
  }

  if (href.startsWith('/projects/')) return 'portfolio project'
  if (href.startsWith('/games/')) return 'portfolio game'
  if (href.startsWith('/quad')) return 'product page'
  return 'portfolio link'
}

function getCategoryIcon(category: Project['category']) {
  if (category === 'mobile') return FaGlobe
  if (category === 'experiment') return HiMiniSparkles
  return HiMiniCodeBracket
}

export default function MobileLinktree() {
  const [activeTab, setActiveTab] = useState<Tab>('projects')

  const displayProjects = useMemo<DisplayProject[]>(
    () => {
      const quadProject = projects.find((project) => project.slug === 'quad')
      const remaining = projects.filter((project) => project.slug !== 'quad')
      const ordered = quadProject ? [quadProject, ...remaining] : projects

      return ordered.slice(0, 6).map((project) => {
        const href = getProjectHref(project)
        return {
          title: project.title,
          source: getSourceLabel(href),
          href,
          category: project.category,
        }
      })
    },
    []
  )

  const handleShare = async () => {
    const shareData = {
      title: 'Tyler Mastrangelo',
      text: 'Explore Tyler\'s portfolio and work.',
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

  const tabButtonClass = (tab: Tab) =>
    `rounded-full px-5 py-2.5 text-sm transition-all ${
      activeTab === tab
        ? 'bg-white text-zinc-950 font-semibold shadow-sm'
        : 'text-zinc-400 font-medium hover:text-zinc-700'
    }`

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-zinc-50 px-6 pb-10 pt-8 text-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-6"
      >
        <header>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full border border-zinc-200 object-cover shadow-sm"
                priority
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void handleShare()
                  }}
                  aria-label="Share profile"
                  className={`rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:text-zinc-900 ${pressableClass}`}
                >
                  <FaShareAlt className="h-4 w-4" />
                </button>
                <a
                  href="mailto:mastrangelo.tyler@gmail.com"
                  aria-label="Email Tyler"
                  className={`rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:text-zinc-900 ${pressableClass}`}
                >
                  <FaEnvelope className="h-4 w-4" />
                </a>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700">
                  EN
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{profile.name}</h1>
              <p className="mt-1 text-sm text-zinc-500">{profile.role}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={profile.resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-zinc-900 to-zinc-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ${pressableClass}`}
              >
                Resume
                <FaFileAlt className="h-3.5 w-3.5" />
              </a>

              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:text-zinc-900 ${pressableClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </header>

        <section>
          <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('projects')
              }}
              className={`${tabButtonClass('projects')} ${pressableClass}`}
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('experience')
              }}
              className={`${tabButtonClass('experience')} ${pressableClass}`}
            >
              Experience
            </button>
          </div>
        </section>

        <motion.section
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {activeTab === 'projects'
            ? displayProjects.map((item) => {
                const href = item.href
                const external = href.startsWith('http')
                const Icon = getCategoryIcon(item.category)

                return (
                  <Link
                    key={`projects-${item.title}`}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className={`flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${pressableClass}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-900">{item.title}</p>
                        <p className="truncate text-xs text-zinc-500">{item.source}</p>
                      </div>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400">
                      <FaExternalLinkAlt className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                )
              })
            : experiences.map((item) => {
                const external = Boolean(item.href && item.href.startsWith('http'))

                return (
                  <Link
                    key={`${item.org}-${item.role}`}
                    href={item.href ?? '/about'}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className={`block rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${pressableClass}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900">{item.role}</p>
                        <p className="text-xs font-medium text-zinc-600">{item.org}</p>
                        <p className="mt-1.5 text-xs text-zinc-500">{item.summary}</p>
                      </div>
                      <FaExternalLinkAlt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    </div>
                  </Link>
                )
              })}
        </motion.section>
      </motion.div>

    </main>
  )
}
