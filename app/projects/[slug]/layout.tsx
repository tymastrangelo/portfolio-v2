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
  // Tab titles are lowercase: "iron man mk3 helmet"
  const title = project?.title ? project.title.toLowerCase() : 'projects'
  const isOnbyProject = project?.slug === 'onby'

  // The project's own line, so a shared link previews this project and not
  // the site-wide description
  const description = project?.tagline

  return {
    title,
    ...(description
      ? {
          description,
          openGraph: {
            title: project?.title,
            description,
            type: 'article',
            // A page's own openGraph drops the root's file-based share image,
            // so name it again (alt text matches app/opengraph-image.alt.txt)
            images: [
              {
                url: '/opengraph-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Tyler Mastrangelo over a photo of the trail up Acatenango at first light',
              },
            ],
          },
        }
      : {}),
    ...(isOnbyProject
      ? {
          icons: {
            icon: [
              {
                url: '/images/onby-icon.png',
                type: 'image/png',
              },
            ],
            shortcut: '/images/onby-icon.png',
            apple: '/images/onby-icon.png',
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
