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
    slug: 'monkey-gesture-detector',
    title: 'Monkey Gesture Detector',
    category: 'experiment',
    tagline: 'A real-time webcam experiment where I map face + hand gestures to live meme states',
    description:
      'I built this in-browser gesture detector using MediaPipe Face Landmarker + Hand Landmarker to read facial expressions and hand poses frame by frame, then trigger meme states instantly. The biggest focus was making it feel smooth in real life, so I added confidence thresholds, gesture history smoothing, no-hand timing logic, and priority-based state transitions to cut false triggers and flicker.',
    year: 2026,
    highlights: [
      'How to run a multi-model CV pipeline in the browser (face + hand) without killing responsiveness.',
      'How to turn raw landmarks into practical gesture rules for tongue-out, fist, middle finger, mouth-open, and two-hand detection.',
      'How much temporal smoothing matters: gesture history + no-hand frame thresholds made the UX way more stable.',
      'How to tune real-world detection with confidence gating, fallback logic, and live debug overlays.',
      'How to structure experimental code so it is still clean, modular, and easy to iterate on quickly.',
    ],
    stack: {
      frontend: ['HTML5 Canvas', 'Vanilla JavaScript', 'MediaPipe Tasks Vision'],
      backend: ['WebRTC getUserMedia', 'Face Landmarker', 'Hand Landmarker'],
      infra: ['GitHub Pages', 'GPU Delegate (Web)', 'Client-Side CV Pipeline'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/monkey-gesture-detector',
      live: 'https://tymastrangelo.github.io/monkey-gesture-detector/',
    },
    featured: true,
    image: 'https://raw.githubusercontent.com/tymastrangelo/monkey-gesture-detector/main/smile.jpg',
    gradients: {
      hero: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #22c55e 100%)',
      card: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #22c55e 100%)',
    },
  },
  {
    slug: 'retro-pong',
    title: 'Retro Pong',
    category: 'experiment',
    tagline: 'A browser-based reimagining of classic Pong with CRT visuals and AI difficulty modes',
    description:
      'Retro Pong is a vanilla JavaScript arcade game built with HTML5 Canvas and Web Audio API. It includes local multiplayer, three AI difficulty levels, retro CRT styling, and a first-to-7 scoring system. The game runs fully in the browser with no dependencies.',
    year: 2026,
    stack: {
      frontend: ['HTML5 Canvas', 'Vanilla JavaScript', 'CSS3'],
      backend: ['Web Audio API', 'Game Loop Logic'],
      infra: ['Static Hosting', 'Browser-Only Runtime'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/retro-pong',
      live: '/games/retro-pong/index.html',
    },
    featured: true,
    image: '/games/retro-pong/photos/pong-homescreen.jpeg',
    gradients: {
      hero: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #22d3ee 100%)',
      card: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #22d3ee 100%)',
    },
  },
  {
    slug: 'spring-break-voting-api',
    title: 'Spring Break Voting API',
    category: 'platform',
    tagline: 'Spring Boot REST API for ranked destination voting and one-vote enforcement',
    description:
      'A Java 21 + Spring Boot API that lets users create spring break locations, register voters, and submit ranked top-3 destination choices. The service enforces one vote per person, supports vote updates, and exposes location filtering by region. Designed as a clean backend foundation for future persistence with PostgreSQL and Spring Data JPA.',
    year: 2026,
    stack: {
      frontend: ['Postman', 'REST'],
      backend: ['Java 21', 'Spring Boot 4', 'Maven'],
      infra: ['AWS EC2', 'In-Memory Storage', 'UUID IDs'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/spring-break-voting-api',
    },
    featured: false,
    image: 'https://www.cleo.com/sites/default/files/api-integration.png',
    gradients: {
      hero: 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 55%, #22c55e 100%)',
      card: 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 50%, #22c55e 100%)',
    },
  },
  {
    slug: 'content-creation',
    title: 'Content Creation',
    category: 'web',
    tagline: 'Documenting college life, detailing work, and everything in between',
    description:
      'Short-form content capturing two sides of life: day-to-day college experiences at Elon and hands-on car detailing work back home. Posted across TikTok and Instagram to document the grind, share process, and connect with audiences who relate to the hustle.',
    year: 2024,
    stack: {
      frontend: ['TikTok', 'Instagram Reels', 'CapCut'],
      backend: ['iPhone Cinematography', 'Fast Iteration', 'Authentic Storytelling'],
      infra: ['Multi-platform Distribution', 'Audience Building', 'Content Calendar'],
    },
    featured: false,
    image: "https://cdn.sanity.io/images/1awf4j9a/production/239ff52fcc145968b26d55fe3b71f9ec7098130a-3480x1800.png?rect=26,0,3429,1800&w=1200&h=630&auto=format",
    gradients: {
      hero: 'linear-gradient(135deg, #111827 0%, #4f46e5 50%, #ec4899 100%)',
      card: 'linear-gradient(135deg, #111827 0%, #4f46e5 45%, #ec4899 100%)',
    },
  },
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
    slug: 'chords-of-hope',
    title: 'Chords of Hope',
    category: 'web',
    tagline: 'A music education site bringing free lessons to young learners',
    description:
      'Chords of Hope is a responsive, beginner-friendly website created for a Williams College program that teaches underprivileged kids guitar, piano, and voice. The site focuses on accessibility and clarity, featuring lesson pages, testimonials, and contact/donation forms to grow the community.',
    year: 2025,
    stack: {
      frontend: ['HTML5', 'CSS3', 'JavaScript'],
      backend: ['Static Site'],
      infra: ['GitHub Pages'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/chords-of-hope',
      live: 'https://tymastrangelo.github.io/chords-of-hope',
    },
    featured: false,
    image:
      'https://images.unsplash.com/photo-1758687126874-7d88e5b8fdf5?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gradients: {
      hero: 'linear-gradient(135deg, #f59e0b 0%, #22c55e 100%)',
      card: 'linear-gradient(135deg, #f59e0b 0%, #22c55e 55%, #0ea5e9 100%)',
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
