import Link from 'next/link'
import Image from 'next/image'
import { kindLabel, type Project } from '@/lib/projects'

// One project as a card, on the home page and in the /projects grid. With a
// real photo or screen it is a photo tile; without one it is a type tile with
// the name set large (never a placeholder image). Only the title is the link,
// so a screen reader hears a short name; .work-link::after stretches it over
// the whole card. The photo carries a view-transition-name and travels into
// the project page header; the title does not (text flying across the screen
// reads as a float-in).
export default function WorkCard({
  project,
  level = 3,
  priority = false,
}: {
  project: Project
  level?: 2 | 3
  priority?: boolean
}) {
  const lead = project.media?.[0]
  const Heading = level === 2 ? 'h2' : 'h3'
  const href = `/projects/${project.slug}`

  return (
    <article className={`work-card surface${lead ? '' : ' is-type'}`}>
      {lead && (
        <span className="work-media vt-media" style={{ viewTransitionName: `media-${project.slug}` }}>
          <Image
            src={lead.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            priority={priority}
            className="object-cover object-top"
          />
        </span>
      )}
      <div className="work-body">
        <span className="work-meta" data-group={project.group}>
          <span className="group-dot" aria-hidden />
          {kindLabel[project.category]}, {project.year}
        </span>
        <Heading className="work-name">
          <Link href={href} className="work-link">
            {project.title}
          </Link>
        </Heading>
        <span className="work-line">{project.tagline}</span>
        <span className="work-read" aria-hidden>
          {project.category === 'content' ? 'Read about it' : 'Read how I built it'}
        </span>
      </div>
    </article>
  )
}

// onby, the flagship, runs wide (home and /projects). No photo yet, so the
// space goes to what it does and where it stands, with its icon by its name.
export function OnbyCard({ project, level = 3 }: { project: Project; level?: 2 | 3 }) {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <article className="work-card work-feature surface">
      <div className="work-feature-main">
        <span className="work-meta" data-group={project.group}>
          <span className="group-dot" aria-hidden />
          {kindLabel[project.category]}, {project.year}
        </span>
        <div className="work-feature-title">
          <Image src="/images/onby-icon.png" alt="" width={64} height={64} className="work-feature-icon" />
          <Heading className="work-name">
            <Link href={`/projects/${project.slug}`} className="work-link">
              {project.title}
            </Link>
          </Heading>
        </div>
        <span className="lead">{project.tagline}</span>
        <span className="work-line">
          Finding out what&apos;s happening at Elon usually means checking group chats, flyers and six different
          Instagram accounts. onby puts every org&apos;s events in one feed, reminds you before they start, and hands
          orgs their RSVPs and attendance afterward.
        </span>
        <span className="work-read" aria-hidden>
          Read how I built it
        </span>
      </div>
      <div className="work-stats">
        <span>
          <b>19</b> student orgs in the spring 2027 pilot
        </span>
        <span>
          <b>$2,500</b> Elon Innovation Grant behind it
        </span>
        <span>
          <b>Since August 2025</b> as the founder and only developer
        </span>
      </div>
    </article>
  )
}
