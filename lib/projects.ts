export type ProjectCategory =
  | 'mobile'
  | 'web'
  | 'platform'
  | 'internal-tool'
  | 'experiment'

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  tagline: string
  description: string
  year: number

  role?: string
  highlights?: string[]

  stack: {
    frontend: string[]
    backend: string[]
    infra?: string[]
  }

  links?: {
    github?: string
    live?: string
    beta?: string
    demoVideo?: string | 'coming-soon'
  }

  featured: boolean
  image?: string

  gradients: {
    hero: string
    card: string
  }
}

export const projects: Project[] = [
  {
    slug: 'iron-man-mk3-helmet',
    title: 'Iron Man MK3 Helmet',
    category: 'experiment',
    tagline: 'Articulated wearable helmet build with servo faceplate + dimmable eyes',
    description:
      'A classroom-tested, end-to-end build guide for a 3D-printed MK3 helmet. Includes print settings, wiring, Arduino code, finishing tips, and a printable PDF for workshop-style builds.',
    year: 2024,
    stack: {
      frontend: ['3D Printing', 'Arduino Nano Every', 'ServoEasing'],
      backend: ['Electronics', 'PWM Lighting', 'Micro Servos'],
      infra: ['PLA+', 'Filler Primer', 'Spray Finish'],
    },
    links: {
      demoVideo: 'https://youtu.be/9uIXtODioGM',
    },
    featured: true,
    image: '/images/ironman.png',
    gradients: {
      hero: 'linear-gradient(135deg, #f43f5e 0%, #111827 100%)',
      card: 'linear-gradient(135deg, #f43f5e 0%, #ef4444 40%, #111827 100%)',
    },
  },
  {
    slug: 'quad',
    title: 'Quad',
    category: 'mobile',
    tagline: 'A real-time campus events and organizations platform',
    description:
      'Quad is a React Native (Expo) app for discovering campus events and clubs with realtime updates, push notifications, interactive maps, and an in-app notification center. Powered by Supabase (PostgreSQL + Edge Functions + Realtime).',
    year: 2025,
    stack: {
      frontend: ['React Native', 'Expo', 'TypeScript'],
      backend: ['Supabase', 'PostgreSQL', 'Edge Functions'],
      infra: ['Supabase Realtime', 'Expo Notifications', 'react-native-maps'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/elon-events-app',
      live: '/quad',
    },
    featured: true,
    image: '/images/quad.jpg',
    gradients: {
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    },
  },
  {
    slug: 'blue-boy-adventure',
    title: 'Blue Boy Adventure',
    category: 'experiment',
    tagline: 'A pixel-art adventure game built in Java with combat and exploration',
    description:
      'Blue Boy Adventure is a 2D adventure game where you explore a pixel-art world, battle enemies like orcs and skeleton lords, and collect gear to level up. The game features NPC interactions, save/load progression, and classic top-down combat inspired by retro RPGs.',
    year: 2024,
    stack: {
      frontend: ['Java', '2D Graphics', 'Tile Maps'],
      backend: ['Game Loop', 'Collision System', 'Save System'],
      infra: ['Desktop (macOS)'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/Blue-Boy-Adventure',
    },
    featured: false,
    image: '/images/blueboy1.png',
    gradients: {
      hero: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
      card: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 50%, #22d3ee 100%)',
    },
  },
  {
    slug: 'buffer-bros-crm',
    title: 'Buffer Bros CRM',
    category: 'internal-tool',
    tagline: 'Internal operations dashboard for a service business',
    description:
      'A Next.js 14 App Router CRM for managing jobs, clients, vehicles, and operational workflows. Features dashboard metrics, quotes/expenses, Supabase auth/DB/RPC, and Google Sheets sync. Hosted on Vercel.',
    year: 2024,
    stack: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts'],
      backend: ['Supabase', 'PostgreSQL', 'RPC Functions'],
      infra: ['Vercel', 'Google Sheets API'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/bufferbros-crm',
      demoVideo: 'coming-soon',
    },
    featured: false,
    image: '/images/bb-crm.jpg',
    gradients: {
      hero: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      card: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)',
    },
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

export function getProjectsByCategory(
  category: ProjectCategory
): Project[] {
  return projects.filter((p) => p.category === category)
}

export function getProjectStackList(project: Project): string[] {
  const list = [
    ...project.stack.frontend,
    ...project.stack.backend,
    ...(project.stack.infra ?? []),
  ]
  return Array.from(new Set(list))
}
