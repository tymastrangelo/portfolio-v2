import Link from 'next/link'
import Image from 'next/image'
import { EMAIL } from '@/lib/contact'
import { kindLabel, type Media, type Project } from '@/lib/projects'

// The sections every project page shares. Each is a heading in the serif on
// the left and its content on the right (one column on a phone).

export function Section({
  id,
  title,
  children,
  wide = false,
}: {
  id: string
  title: string
  children: React.ReactNode
  /** content runs under the heading across the full width */
  wide?: boolean
}) {
  return (
    <section className={`wrap project-section${wide ? ' is-wide' : ''}`} aria-labelledby={id}>
      <h2 id={id} className="display project-h2">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export function ProjectStory({ project }: { project: Project }) {
  return (
    <Section id="story" title="The story">
      <p className="project-prose">{project.description}</p>
    </Section>
  )
}

export function ProjectLearned({ items }: { items: string[] }) {
  return (
    <Section id="learned" title="What I learned">
      <ol className="learned">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </Section>
  )
}

export function ProjectStack({ project }: { project: Project }) {
  const columns = (
    [
      [project.stackLabels?.[0] || 'Frontend', project.stack.frontend],
      [project.stackLabels?.[1] || 'Backend', project.stack.backend],
      [project.stackLabels?.[2] || 'Infra', project.stack.infra ?? []],
    ] as const
  ).filter(([, items]) => items.length > 0)
  return (
    <Section id="stack" title="What it’s built with">
      <div className="stack">
        {columns.map(([label, items]) => (
          <div key={label}>
            <h3>{label}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

// Photos are captioned with their place (or not at all); screens get a short
// plain label, which then stands in for the alt text.
export function ProjectGallery({ items }: { items: Media[] }) {
  const allScreens = items.every((m) => m.kind === 'screen')
  return (
    <Section id="gallery" title={allScreens ? 'Screens' : 'Photos'} wide>
      <div className="gallery">
        {items.map((m) => {
          const caption = m.kind === 'screen' ? m.alt : m.place
          return (
            <figure key={m.src}>
              <span className="gallery-media" style={{ '--ar': m.ar } as React.CSSProperties}>
                <Image
                  src={m.src}
                  alt={m.kind === 'screen' ? '' : m.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </span>
              {caption && <figcaption>{caption}</figcaption>}
            </figure>
          )
        })}
      </div>
    </Section>
  )
}

const closingLines: Record<string, string> = {
  onby: 'If you run an org at Elon, or you want onby on your campus, email me.',
  'iron-man-mk3-helmet': "If you build one, I'd love to see it. Email me if you get stuck.",
  'content-creation': 'If you want to make something together, email me.',
}

export function ProjectClosing({ project, next }: { project: Project; next: Project }) {
  const line = closingLines[project.slug] ?? 'If you want the longer version of this one, email me.'
  const subject = project.slug === 'content-creation' ? 'Making something together' : project.title
  return (
    <section className="wrap project-closing">
      <p className="lead max-w-[46ch]">{line}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`} className="button">
          Email me
        </a>
        <Link href="/projects" className="button button-quiet">
          All projects
        </Link>
      </div>
      <Link href={`/projects/${next.slug}`} className="next-project surface">
        <span className="text-sm text-mist">Next project</span>
        <span className="next-project-name">
          {next.title}
        </span>
        <span className="text-mist">
          {kindLabel[next.category]}, {next.year}
        </span>
      </Link>
    </section>
  )
}
