'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import WorkCard, { OnbyCard } from '@/components/site/WorkCard'
import { groupLabel, type Project, type ProjectGroup } from '@/lib/projects'

const filters: (ProjectGroup | 'all')[] = ['all', 'software', 'hold', 'fun']

// Critically damped, as Apple ships most UI motion: it settles without
// bouncing (motion/react turns the movement off under reduced motion)
const spring = { type: 'spring', bounce: 0, duration: 0.4 } as const

// Every project as a card in a bento grid, onby first and wide. Picking a
// filter slides the thumb in the segmented control and lets the cards that
// stay glide to their new places while the others fade out.
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  const [group, setGroup] = useState<ProjectGroup | 'all'>('all')
  const shown = projects.filter((p) => group === 'all' || p.group === group)

  return (
    <>
      <header className="wrap project-head">
        <h1 className="display project-title">Projects</h1>
        <p className="lead mt-6 max-w-[46ch] text-mist">
          {projects.length} things I&apos;ve built, from software to things you can hold.
        </p>
        <div className="seg glass-well mt-8" role="group" aria-label="Show">
          {filters.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className="seg-item"
              data-group={g === 'all' ? undefined : g}
            >
              {group === g && (
                <motion.span layoutId="seg-thumb" className="seg-thumb glass" transition={spring} aria-hidden />
              )}
              <span className="seg-label">
                {g !== 'all' && <span className="group-dot" aria-hidden />}
                {g === 'all' ? 'Everything' : groupLabel[g]}
              </span>
            </button>
          ))}
        </div>
      </header>

      <ul className="wrap project-grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={spring}
              className={p.slug === 'onby' ? 'is-wide' : undefined}
            >
              {p.slug === 'onby' ? (
                <OnbyCard project={p} level={2} />
              ) : (
                <WorkCard project={p} level={2} priority={i < 3} />
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <p className="sr-only" aria-live="polite">
        {group === 'all' ? '' : `Showing ${shown.length} ${shown.length === 1 ? 'project' : 'projects'}`}
      </p>
    </>
  )
}
