'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
type Locale = 'en' | 'es'

const localeOptions: Array<{ value: Locale; label: string; flag: string }> = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
]

type ExperienceItem = {
  role: Record<Locale, string>
  org: string
  summary: Record<Locale, string>
  href?: string
}

const profile = {
  name: 'Tyler Mastrangelo',
  role: {
    en: 'Founder · CS Student',
    es: 'Fundador · Estudiante de CS',
  },
  avatar: '/images/pfp.JPG',
  resumeHref: '/files/Tyler%20Mastrangelo%20Resume.pdf',
}

const copy: Record<
  Locale,
  {
    resume: string
    projects: string
    experience: string
    shareAria: string
    emailAria: string
    shareText: string
  }
> = {
  en: {
    resume: 'Resume',
    projects: 'Projects',
    experience: 'Experience',
    shareAria: 'Share profile',
    emailAria: 'Email Tyler',
    shareText: 'Explore Tyler\'s portfolio and work.',
  },
  es: {
    resume: 'CV',
    projects: 'Proyectos',
    experience: 'Experiencia',
    shareAria: 'Compartir perfil',
    emailAria: 'Enviar correo a Tyler',
    shareText: 'Explora el portafolio y los proyectos de Tyler.',
  },
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
    role: {
      en: 'Founder',
      es: 'Fundador',
    },
    org: 'Buffer Bros Mobile Detailing',
    summary: {
      en: 'Co-founded and built the internal software stack: CRM, scheduling, and workflows.',
      es: 'Co-fundó y construyó la stack interna: CRM, programación y flujos operativos.',
    },
  },
  {
    role: {
      en: 'Product Engineer',
      es: 'Ingeniero de Producto',
    },
    org: 'Quad',
    summary: {
      en: 'Building a campus app for events and organizations with realtime updates.',
      es: 'Construyendo una app de campus para eventos y organizaciones con actualizaciones en tiempo real.',
    },
    href: '/quad',
  },
  {
    role: {
      en: 'Senator of Arts & Sciences',
      es: 'Senador de Artes y Ciencias',
    },
    org: 'Elon Student Government',
    summary: {
      en: 'Represents students and helps shape campus policy and student initiatives.',
      es: 'Representa a los estudiantes y ayuda a definir políticas e iniciativas del campus.',
    },
    href: 'https://www.elon.edu/u/campus-life/student-involvement/student-government-association/senate-council/',
  },
  {
    role: {
      en: 'Consultant & Workshop Leader',
      es: 'Consultor y Líder de Talleres',
    },
    org: 'Elon Maker Hub',
    summary: {
      en: 'Guides student builders through prototyping and fabrication projects.',
      es: 'Guía a estudiantes en proyectos de prototipado y fabricación.',
    },
    href: 'https://www.elon.edu/u/fa/technology/makerhub/our-team/',
  },
  {
    role: {
      en: 'UGC Creator',
      es: 'Creador UGC',
    },
    org: 'Brainly',
    summary: {
      en: 'Produced campaign content with hundreds of thousands of views.',
      es: 'Produjo contenido de campañas con cientos de miles de visualizaciones.',
    },
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

function getSourceLabel(href: string, locale: Locale): string {
  if (href.startsWith('http')) {
    try {
      return new URL(href).hostname.replace('www.', '')
    } catch {
      return locale === 'es' ? 'enlace externo' : 'external link'
    }
  }

  if (href.startsWith('/projects/')) {
    return locale === 'es' ? 'proyecto del portafolio' : 'portfolio project'
  }
  if (href.startsWith('/games/')) {
    return locale === 'es' ? 'juego del portafolio' : 'portfolio game'
  }
  if (href.startsWith('/quad')) {
    return locale === 'es' ? 'página de producto' : 'product page'
  }
  return locale === 'es' ? 'enlace del portafolio' : 'portfolio link'
}

function getCategoryIcon(category: Project['category']) {
  if (category === 'mobile') return FaGlobe
  if (category === 'experiment') return HiMiniSparkles
  return HiMiniCodeBracket
}

export default function MobileLinktree() {
  const [activeTab, setActiveTab] = useState<Tab>('projects')
  const [locale, setLocale] = useState<Locale>('en')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement | null>(null)
  const activeLocaleOption =
    localeOptions.find((option) => option.value === locale) ?? localeOptions[0]

  const displayProjects = useMemo<DisplayProject[]>(
    () => {
      const quadProject = projects.find((project) => project.slug === 'quad')
      const remaining = projects.filter((project) => project.slug !== 'quad')
      const ordered = quadProject ? [quadProject, ...remaining] : projects

      return ordered.slice(0, 6).map((project) => {
        const href = getProjectHref(project)
        return {
          title: project.title,
          source: getSourceLabel(href, locale),
          href,
          category: project.category,
        }
      })
    },
    [locale]
  )

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!languageMenuRef.current) return
      if (!languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleShare = async () => {
    const shareData = {
      title: 'Tyler Mastrangelo',
      text: copy[locale].shareText,
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
                  aria-label={copy[locale].shareAria}
                  className={`rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:text-zinc-900 ${pressableClass}`}
                >
                  <FaShareAlt className="h-4 w-4" />
                </button>
                <a
                  href="mailto:mastrangelo.tyler@gmail.com"
                  aria-label={copy[locale].emailAria}
                  className={`rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:text-zinc-900 ${pressableClass}`}
                >
                  <FaEnvelope className="h-4 w-4" />
                </a>
                <div ref={languageMenuRef} className="relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isLanguageMenuOpen}
                    aria-label="Change language"
                    onClick={() => {
                      setIsLanguageMenuOpen((current) => !current)
                    }}
                    className={`inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 ${pressableClass}`}
                  >
                    <span aria-hidden="true" className="text-sm leading-none">
                      {activeLocaleOption.flag}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-700">{activeLocaleOption.value}</span>
                    <span className="text-[10px] text-zinc-500">▾</span>
                  </button>

                  {isLanguageMenuOpen ? (
                    <div
                      role="menu"
                      className="absolute right-0 top-11 z-20 min-w-[120px] rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
                    >
                      {localeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setLocale(option.value)
                            setIsLanguageMenuOpen(false)
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                            option.value === locale
                              ? 'bg-zinc-100 font-semibold text-zinc-900'
                              : 'text-zinc-600 hover:bg-zinc-50'
                          } ${pressableClass}`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden="true" className="text-sm leading-none">
                              {option.flag}
                            </span>
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{profile.name}</h1>
              <p className="mt-1 text-sm text-zinc-500">{profile.role[locale]}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={profile.resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-zinc-900 to-zinc-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ${pressableClass}`}
              >
                {copy[locale].resume}
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
              {copy[locale].projects}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('experience')
              }}
              className={`${tabButtonClass('experience')} ${pressableClass}`}
            >
              {copy[locale].experience}
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
                        <p className="text-sm font-semibold text-zinc-900">{item.role[locale]}</p>
                        <p className="text-xs font-medium text-zinc-600">{item.org}</p>
                        <p className="mt-1.5 text-xs text-zinc-500">{item.summary[locale]}</p>
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
