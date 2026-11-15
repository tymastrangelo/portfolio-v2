import Link from 'next/link'
import Image from 'next/image'
import LoopVideo from '@/components/site/LoopVideo'
import GameCabinet, { type Game } from './GameCabinet'
import { kindLabel, type Project } from '@/lib/projects'

// Games that play inside the site instead of sending you off to GitHub Pages
export const games: Record<string, Game> = {
  'retro-pong': {
    src: '/games/retro-pong/index.html',
    title: 'Retro Pong',
    aspect: '16/10',
    ratio: 1.6,
    maxWidth: 980,
    mute: 'retro-pong:set-muted',
  },
  'ewok-hop': {
    // The field is 400 wide and 700 tall, so a portrait window fills it exactly.
    // No mute here: the game draws its own speaker in the corner.
    src: '/games/ewok_game/index.html',
    title: 'Ewok Hop',
    aspect: '4/7',
    ratio: 4 / 7,
    maxWidth: 470,
  },
}

// Projects whose header shows something other than their first photo. The
// helmet opens in its own video; the chess board's video is on YouTube.
export const headerOverrides = new Set(['iron-man-mk3-helmet', 'chess-board-clock'])

const liveLabels: Record<string, string> = {
  'doomsday-drill': 'Start the drill',
  'floor-board': 'Open the floor board',
  'monkey-gesture-detector': 'Try it in your browser',
  onby: 'Visit joinonby.com',
}

function HeaderMedia({ project }: { project: Project }) {
  if (project.slug === 'iron-man-mk3-helmet') {
    return (
      <div className="wrap mt-12 md:mt-16">
      <div className="project-media vt-media" style={{ '--ar': '16/9', viewTransitionName: `media-${project.slug}` } as React.CSSProperties}>
        <LoopVideo
          src="/projects/iron-man-mk3-helmet/faceplate.mp4"
          poster="/projects/iron-man-mk3-helmet/faceplate-poster.jpg"
          label="The helmet's faceplate swinging open"
        />
      </div>
      </div>
    )
  }
  if (project.slug === 'chess-board-clock') {
    return (
      <div className="wrap mt-12 md:mt-16">
      <div className="project-media vt-media" style={{ '--ar': '16/9', viewTransitionName: `media-${project.slug}` } as React.CSSProperties}>
        <iframe
          src="https://www.youtube.com/embed/Ib9ktLTNnNU"
          title="The chess board and clock on video"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      </div>
    )
  }
  const lead = project.media?.[0]
  if (!lead) return null
  return (
    <div className="wrap mt-12 md:mt-16">
      <div className="project-media vt-media" style={{ '--ar': lead.ar, viewTransitionName: `media-${project.slug}` } as React.CSSProperties}>
        <Image src={lead.src} alt={lead.alt} fill priority sizes="(min-width: 1280px) 1280px, 100vw" className="object-cover" />
      </div>
    </div>
  )
}

// Title, one line, the things you can do with it, then its photo or screen
export default function ProjectHeader({ project }: { project: Project }) {
  const game = games[project.slug]
  const live = project.links?.live
  const demo = project.links?.demoVideo
  const isHelmet = project.slug === 'iron-man-mk3-helmet'

  // Each action renders with the class it is handed: the first is the filled button
  const actions: ((cls: string) => React.ReactNode)[] = []
  if (demo && demo !== 'coming-soon' && project.slug !== 'content-creation') {
    actions.push((cls) => (
      <a key="demo" href={demo} target="_blank" rel="noopener noreferrer" className={cls}>
        {isHelmet ? 'Build walkthrough' : 'Watch the demo'}
      </a>
    ))
  }
  if (game) {
    actions.push((cls) => <GameCabinet key="play" game={game} className={cls} />)
  } else if (live) {
    const label = liveLabels[project.slug] ?? 'Visit the site'
    // The floor board is its own world, so it opens in a new tab like an
    // outside link would
    const internal = live.startsWith('/') && project.slug !== 'floor-board'
    actions.push((cls) =>
      internal ? (
        <Link key="live" href={live} className={cls}>
          {label}
        </Link>
      ) : (
        <a key="live" href={live} target="_blank" rel="noopener noreferrer" className={cls}>
          {label}
        </a>
      )
    )
  }
  if (project.links?.github) {
    const href = project.links.github
    actions.push((cls) => (
      <a key="source" href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        View the source
      </a>
    ))
  }
  if (project.links?.beta) {
    const href = project.links.beta
    actions.push((cls) => (
      <a key="beta" href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        Join the beta
      </a>
    ))
  }
  if (isHelmet) {
    actions.push((cls) => (
      <a key="pdf" href="/files/instructions.pdf" target="_blank" rel="noopener noreferrer" className={cls}>
        Instructions PDF
      </a>
    ))
    actions.push((cls) => (
      <a key="wiring" href="/images/wiring-diagram.png" target="_blank" rel="noopener noreferrer" className={cls}>
        Wiring diagram
      </a>
    ))
  }

  return (
    <>
      <header className="wrap project-head">
        <Link href="/projects" className="link text-sm text-mist">
          All projects
        </Link>
        <h1 className="display project-title">
          {project.title}
        </h1>
        <p className="mt-4 text-mist" data-group={project.group}>
          <span className="group-dot" aria-hidden />
          {kindLabel[project.category]}, {project.year}
        </p>
        <p className="lead mt-6 max-w-[46ch]">{project.tagline}</p>
        {actions.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map((make, i) => make(i === 0 ? 'button' : 'button button-quiet'))}
          </div>
        )}
      </header>
      <HeaderMedia project={project} />
    </>
  )
}
