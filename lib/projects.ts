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
    tagline: 'Point a webcam at your face and it turns you into a live meme',
    description:
      'A browser experiment that reads your face and hands frame by frame with MediaPipe, then swaps meme states in real time when you stick your tongue out, make a fist, or open your mouth. Most of the work went into making it feel solid instead of jittery: confidence thresholds, gesture-history smoothing, and priority rules so states don\'t flicker when the model hesitates. Runs entirely client-side, no server.',
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
    tagline: 'Pong rebuilt from scratch — canvas, Web Audio, zero dependencies',
    description:
      'I rebuilt Pong to see how much game feel I could get out of a canvas and nothing else. No libraries, no framework: a hand-rolled game loop, collision code, three AI difficulty levels, local two-player, CRT-style visuals, and sound synthesized with the Web Audio API. First to 7 wins. You can play it right here on the site.',
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
    slug: 'chess-board-clock',
    title: 'Chess Board + Clock',
    category: 'experiment',
    tagline: 'A tournament-size maple and walnut board with a matching Arduino clock',
    description:
      'I\'ve played chess for years and never owned a board I actually liked, so I built one. Regulation size, alternating maple and walnut squares cut on the table saw at the Elon Maker Hub, finished with danish oil, funded through a Kickbox grant. Then I wired up an Arduino Nano chess clock with an LCD and a laser-engraved case to sit next to it. My first serious woodworking project.',
    year: 2025,
    highlights: [
      'Regulation tournament size with 2-inch squares and a 16x16 inch playing surface.',
      'Alternating maple and walnut squares, a maple border, and an elevated MDF base for a floating effect.',
      'Practice cuts on scrap plywood first to dial in the table saw before cutting the hardwood.',
      'Finished with danish oil and built at the Elon Maker Hub as a first serious woodworking project.',
      'Arduino Nano clock with buttons, LCD display, and a laser-engraved case wired from an Instructables guide.',
    ],
    stack: {
      frontend: ['Woodworking', 'Arduino Nano', 'LCD Display'],
      backend: ['Buttons', 'Laser Engraving', 'Table Saw Setup'],
      infra: ['Maple', 'Walnut', 'MDF Base'],
    },
    featured: false,
    gradients: {
      hero: 'linear-gradient(135deg, #111827 0%, #8b5e34 45%, #d4a373 100%)',
      card: 'linear-gradient(135deg, #111827 0%, #8b5e34 50%, #d4a373 100%)',
    },
  },
  {
    slug: 'spring-break-voting-api',
    title: 'Spring Break Voting API',
    category: 'platform',
    tagline: 'A Spring Boot API built to settle where my friends and I go for spring break',
    description:
      'My friend group could not agree on a spring break destination, so I made everyone submit a ranked top-3 through an API instead. Java 21 and Spring Boot: register voters, add destinations, vote once per person (enforced), change your mind and resubmit, filter destinations by region. Runs on an EC2 box with in-memory storage for now — the entities are modeled so Postgres and JPA can drop in when it needs to persist.',
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
    gradients: {
      hero: 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 55%, #22c55e 100%)',
      card: 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 50%, #22c55e 100%)',
    },
  },
  {
    slug: 'content-creation',
    title: 'Content Creation',
    category: 'web',
    tagline: 'Short-form video from two sides of my life — campus and the detailing business',
    description:
      'I film the two halves of my life: college at Elon and the car detailing work back home with Buffer Bros. Shot on an iPhone, cut in CapCut, posted to TikTok and Instagram. It has grown past 2M total views and turned into paid campaign work with Hulu and Brainly along the way.',
    year: 2024,
    stack: {
      frontend: ['TikTok', 'Instagram Reels', 'CapCut'],
      backend: ['iPhone Cinematography', 'Fast Iteration', 'Authentic Storytelling'],
      infra: ['Multi-platform Distribution', 'Audience Building', 'Content Calendar'],
    },
    featured: false,
    gradients: {
      hero: 'linear-gradient(135deg, #111827 0%, #4f46e5 50%, #ec4899 100%)',
      card: 'linear-gradient(135deg, #111827 0%, #4f46e5 45%, #ec4899 100%)',
    },
  },
  {
    slug: 'iron-man-mk3-helmet',
    title: 'Iron Man MK3 Helmet',
    category: 'experiment',
    tagline: 'A wearable 3D-printed helmet with a servo faceplate and dimmable LED eyes',
    description:
      'A 3D-printed, wearable MK3 helmet: tap a button and two micro servos swing the faceplate open while the LED eyes fade in, with a potentiometer for brightness. After building mine I wrote the whole thing up as a guide — print settings, wiring, the Arduino sketch, sanding and paint — and ran it as a workshop-style build others could follow at the Maker Hub.',
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
    tagline: 'The campus events app I\'m building and beta-testing at Elon',
    description:
      'Quad is my answer to how scattered campus life is — events buried in group chats, flyers, and six different Instagram accounts. Every org\'s events land in one live feed with RSVPs, push notifications, and a campus map. React Native + Expo on the front, Supabase (Postgres, Realtime, Edge Functions) behind it. It won an Innovation Grant from the Elon Innovation Council and is in TestFlight beta at Elon right now.',
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
    tagline: 'The site for a free music-lessons program run out of Williams College',
    description:
      'A friend at Williams College runs a program teaching guitar, piano, and voice to kids whose families can\'t afford lessons. I built the website for it: lesson pages by instrument, testimonials, and contact and donation forms. Kept it deliberately simple — static HTML and CSS on GitHub Pages — so it loads fast and parents can actually find what they need.',
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
    tagline: 'A top-down pixel RPG written in plain Java — engine and all',
    description:
      'A 2D adventure game I wrote in plain Java to learn what game engines actually do for you, by doing all of it myself: the game loop, tile maps, collision, NPC dialogue, an inventory, and save/load. You explore a pixel world, fight orcs and a skeleton lord, and collect gear to level up.',
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
    tagline: 'The CRM I built to run our detailing business',
    description:
      'Buffer Bros is the mobile detailing company I co-founded, and this is the software that runs it. A Next.js CRM tracking every job, client, vehicle, quote, and expense, with dashboard metrics so we can see how the business is actually doing. Supabase handles auth, the database, and RPC functions; a Google Sheets sync keeps the books compatible with how we already worked. Built it because spreadsheets stopped scaling with the schedule.',
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
