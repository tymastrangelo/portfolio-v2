import type { Metadata } from 'next'
import { getProject, projects } from '@/lib/projects'

// Prerender every project page at build time so navigation is instant
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const project = getProject(params.slug)
  const projectTitle = project?.title ? project.title.toLowerCase() : null
  const title = projectTitle ? `projects · ${projectTitle}` : 'projects'
  const isQuadProject = project?.slug === 'quad'

  return {
    title,
    ...(isQuadProject
      ? {
          icons: {
            icon: [
              {
                url: '/images/quad-icon.png',
                type: 'image/png',
              },
            ],
            shortcut: '/images/quad-icon.png',
            apple: '/images/quad-icon.png',
          },
        }
      : {}),
  }
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
