export type ProjectCategory =
  | 'mobile'
  | 'web'
  | 'api'
  | 'game'
  | 'hardware'
  | 'experiment'
  | 'content'

/** How a project's kind reads next to its year ("App, 2025") */
export const kindLabel: Record<ProjectCategory, string> = {
  mobile: 'App',
  web: 'Web',
  api: 'API',
  game: 'Game',
  hardware: 'Hardware',
  experiment: 'Experiment',
  content: 'Video',
}

/** Which shelf a project sits on, for the filters on /projects */
export type ProjectGroup = 'software' | 'hold' | 'fun'

export const groupLabel: Record<ProjectGroup, string> = {
  software: 'Software',
  hold: 'Things you can hold',
  fun: 'Just for fun',
}

/** A real photo or a real screen capture. Never a mockup or a generated
 *  image: a project with nothing real to show has no media at all. */
export type Media = {
  src: string
  kind: 'photo' | 'screen'
  alt: string
  /** Photos only, and the only caption a photo gets */
  place?: string
  /** Native aspect ratio, w/h */
  ar: string
}

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
  /** Headings for the three stack columns. Frontend / Backend / Infra unless a
   *  project is not software shaped (a chess board has no backend). */
  stackLabels?: [string, string, string]

  links?: {
    github?: string
    live?: string
    beta?: string
    demoVideo?: string | 'coming-soon'
  }

  group: ProjectGroup
  /** First item is the lead: the project's cover and its background on /projects */
  media?: Media[]
}

const allProjects: Project[] = [
  {
    slug: 'monkey-gesture-detector',
    title: 'Monkey Gesture Detector',
    category: 'experiment',
    tagline: "A webcam toy that swaps in a different monkey meme depending on what your face and hands are doing.",
    description:
      "A browser toy that watches your face and hands through the webcam and swaps in a different monkey meme when you stick your tongue out, make a fist or open your mouth. It runs MediaPipe's face and hand models at the same time, entirely on your own machine. Wiring up the models was quick. Turning raw landmarks into gestures I could trust, and then stopping them from flickering, took most of the time: confidence thresholds, a short history of recent frames, and rules for which gesture wins when two show up at once.",
    year: 2026,
    highlights: [
      'Running two models at once in a browser tab is mostly a performance budget, because if either one falls behind the whole thing stops feeling live.',
      'Landmarks are not gestures, and deciding what counts as a tongue out or a fist took more tuning than setting up the models did.',
      'Smoothing over the last few frames is what made it stable. Without it one bad frame makes the meme flicker, and it looks broken even when the detection was right.',
      'I built a debug overlay early, which paid off, since I could not tune something I could not see going wrong.',
      'It is a joke project, but I built it properly anyway, and that is the reason it stayed fun to keep working on.',
    ],
    stack: {
      frontend: ['HTML5 Canvas', 'Vanilla JavaScript', 'Webcam (getUserMedia)'],
      backend: ['MediaPipe Tasks Vision', 'Face Landmarker', 'Hand Landmarker', 'GPU delegate'],
      infra: ['GitHub Pages', 'Runs fully in the browser'],
    },
    stackLabels: ['Page', 'Vision', 'Hosting'],
    links: {
      github: 'https://github.com/tymastrangelo/monkey-gesture-detector',
      live: 'https://tymastrangelo.github.io/monkey-gesture-detector/',
    },
    group: 'fun',
  },
  {
    slug: 'retro-pong',
    title: 'Retro Pong',
    category: 'game',
    tagline: "Pong written from scratch on a canvas with every sound generated live, and you can play it right here.",
    description:
      "I rebuilt Pong to see how good I could make it feel with nothing but a canvas and plain JavaScript. There's no framework and no game engine, so the game loop, the collisions and three AI difficulty levels are all written by hand, and every sound is generated live with the Web Audio API. It has local two player, a CRT look, and first to 7 wins. You can play it right on this page.",
    year: 2026,
    highlights: [
      'How the game feels comes from small details, like the angle the ball leaves the paddle and the way the AI misses, much more than from the physics being accurate.',
      'Generating every sound with Web Audio meant there were no audio files to load, so the whole game opens instantly.',
      'The three difficulty levels are really three different amounts of mistakes I let the AI make while it tracks the ball.',
      'Writing a game loop by hand once was worth it, because it is the part every engine quietly does for you.',
    ],
    stack: {
      frontend: ['HTML5 Canvas', 'Vanilla JavaScript', 'CSS'],
      backend: ['Web Audio API'],
      infra: ['Static files', 'Runs fully in the browser'],
    },
    stackLabels: ['Game', 'Sound', 'Hosting'],
    links: {
      github: 'https://github.com/tymastrangelo/retro-pong',
      live: '/games/retro-pong/index.html',
    },
    group: 'fun',
    media: [
      { kind: 'screen', src: '/projects/retro-pong/title.jpg', alt: 'Retro Pong\'s title screen', ar: '40/27' },
      { kind: 'screen', src: '/projects/retro-pong/rally.jpg', alt: 'A rally in progress', ar: '40/27' },
      { kind: 'screen', src: '/projects/retro-pong/difficulty.jpg', alt: 'Choosing how good the AI is', ar: '40/27' },
    ],
  },
  {
    slug: 'chess-board-clock',
    title: 'Chess Board + Clock',
    category: 'hardware',
    tagline: "A tournament size maple and walnut board I built at the Maker Hub, with an Arduino clock to match.",
    description:
      "I've played chess for years and never owned a board I actually liked, so I built one. It's regulation size, with alternating maple and walnut squares I cut on the table saw at the Elon Maker Hub, finished with danish oil and paid for with a Kickbox grant. Then I wired up an Arduino Nano chess clock with an LCD and a laser-engraved case to sit next to it. It was my first serious woodworking project.",
    year: 2025,
    highlights: [
      'Regulation tournament size with 2-inch squares and a 16x16 inch playing surface.',
      'Alternating maple and walnut squares, a maple border, and an elevated MDF base for a floating effect.',
      'Practice cuts on scrap plywood first to dial in the table saw before cutting the hardwood.',
      'Finished with danish oil and built at the Elon Maker Hub as a first serious woodworking project.',
      'Arduino Nano clock with buttons, LCD display, and a laser-engraved case wired from an Instructables guide.',
    ],
    stack: {
      frontend: ['Maple', 'Walnut', 'MDF base', 'Danish oil'],
      backend: ['Arduino Nano', 'LCD display', 'Push buttons'],
      infra: ['Table saw', 'Laser engraver', 'Elon Maker Hub'],
    },
    stackLabels: ['Board', 'Clock', 'Shop'],
    group: 'hold',
    // From his Adobe Express write-up of the build (Nov 2026)
    media: [
      { kind: 'photo', src: '/projects/chess-board-clock/board-window.jpg', alt: 'The finished maple and walnut board with a full set of pieces in the Maker Hub, a big window behind it', ar: '3/4' },
      { kind: 'photo', src: '/projects/chess-board-clock/board-front.jpg', alt: 'The board set up for a game, seen straight on from the white side', ar: '3/4' },
      { kind: 'photo', src: '/projects/chess-board-clock/board-bare.jpg', alt: 'The bare board after its danish oil finish, alternating maple and walnut squares', ar: '3/4' },
      { kind: 'photo', src: '/projects/chess-board-clock/board-shop.jpg', alt: 'The board and pieces on a workbench in front of the Maker Hub tool wall', ar: '3/4' },
      { kind: 'photo', src: '/projects/chess-board-clock/board-corner.jpg', alt: 'The board set up in the electronics corner of the Maker Hub', ar: '3/4' },
      { kind: 'photo', src: '/projects/chess-board-clock/clock-prototype.jpg', alt: 'The clock prototype: a red button, an LCD asking for a time control, and the Arduino wiring behind it', ar: '3/4' },
      { kind: 'photo', src: '/projects/chess-board-clock/clock-case.jpg', alt: 'The finished clock in its clear case beside a board, both players’ times on the LCD', ar: '4/3' },
    ],
  },
  {
    slug: 'spring-break-voting-api',
    title: 'Spring Break Voting API',
    category: 'api',
    tagline: "My friends couldn't agree on where to go for spring break, so everyone voted through an API instead of the group chat.",
    description:
      "My friends and I couldn't agree on where to go for spring break, so I had everyone submit a ranked top three through an API instead of arguing in the group chat. It's Java 21 and Spring Boot: you can register, add destinations, vote once (that part is enforced), change your mind and resubmit, and filter destinations by region. It runs on an EC2 instance with in-memory storage for now, and the data is modeled so Postgres and JPA can drop in when it needs to save anything.",
    year: 2026,
    highlights: [
      'One vote per person sounds simple until you write it, and it ended up being the only rule in the whole API that actually needed to be locked down.',
      'Letting people change their vote mattered more than locking it, because everyone\'s opinion kept moving all week.',
      'I modeled the data for Postgres even though it runs in memory, so adding a real database later is a swap instead of a rewrite.',
      'Spring Boot is a lot of framework for a group of friends picking a beach, and I used it anyway because learning it was the point.',
    ],
    stack: {
      frontend: ['Java 21', 'Spring Boot 4', 'Maven'],
      backend: ['AWS EC2', 'In-memory storage', 'UUID IDs'],
      infra: ['Postman', 'REST'],
    },
    stackLabels: ['API', 'Server', 'Testing'],
    links: {
      github: 'https://github.com/tymastrangelo/spring-break-voting-api',
    },
    group: 'software',
  },
  {
    slug: 'content-creation',
    title: 'Content Creation',
    category: 'content',
    tagline: "Videos about my life at Elon and back home, which have passed 2 million views.",
    description:
      "I started posting my everyday life on TikTok and Instagram and kept it going every day for more than 250 days straight. Most of it is college and lifestyle videos from Elon and from home on Marco Island, plus the detailing work I do with Buffer Bros. I film on my iPhone and edit in CapCut. The videos have passed 2 million total views, and along the way they led to paid work with Old Spice, Hulu and Brainly.",
    year: 2024,
    highlights: [
      'The videos that did best were the normal ones about my own life, not the polished ones, and the brand deals came because of those.',
      'Posting every day for over 250 days showed me that showing up consistently matters more than any one video.',
      'Filming both campus and the detailing side taught me that the story gets made in the edit, and the footage is just what I start with.',
    ],
    stack: {
      frontend: ['TikTok', 'Instagram Reels'],
      backend: ['iPhone', 'CapCut'],
      infra: ['Old Spice', 'Hulu', 'Brainly'],
    },
    stackLabels: ['Platforms', 'Tools', 'Brand work'],
    group: 'fun',
  },
  {
    slug: 'iron-man-mk3-helmet',
    title: 'Iron Man MK3 Helmet',
    category: 'hardware',
    tagline: "A wearable 3D-printed helmet: tap a button and the faceplate swings open while the eyes fade in.",
    description:
      "A 3D-printed, wearable MK3 helmet. Tap a button and two micro servos swing the faceplate open while the LED eyes fade in, with a knob to set how bright they are. After I finished mine I wrote the whole build up as a guide covering print settings, wiring, the Arduino sketch, sanding and paint, and then ran it as a workshop at the Maker Hub so other people could build their own.",
    year: 2024,
    highlights: [
      'Printing is maybe a third of the work. Sanding, filler primer and paint decide whether it reads as a helmet or as a print.',
      'The servos needed easing rather than just angles, because a faceplate that snaps open looks broken and one that swings looks real.',
      'Writing the build up as a guide forced me to understand the parts I had gotten working by accident.',
      'Running it as a Maker Hub workshop was the real test of the documentation, since other people hit every step I had glossed over.',
    ],
    stack: {
      frontend: ['3D printing', 'PLA+'],
      backend: ['Arduino Nano Every', 'Micro servos', 'ServoEasing', 'PWM LED eyes'],
      infra: ['Sanding', 'Filler primer', 'Spray paint'],
    },
    stackLabels: ['Print', 'Electronics', 'Finish'],
    links: {
      demoVideo: 'https://youtu.be/9uIXtODioGM',
    },
    group: 'hold',
    media: [
      { kind: 'photo', src: '/projects/iron-man-mk3-helmet/workbench.jpg', alt: 'The finished helmet on a workbench among tools and wires', ar: '4/3' },
      { kind: 'photo', src: '/projects/iron-man-mk3-helmet/parts.jpg', alt: 'The printed and painted helmet pieces laid out before assembly', ar: '3/4' },
      { kind: 'photo', src: '/projects/iron-man-mk3-helmet/wearing.jpg', alt: 'Wearing the helmet with the eyes lit', ar: '3/4' },
    ],
  },
  {
    slug: 'onby',
    title: 'onby',
    category: 'mobile',
    tagline: "The campus events app I'm building so every event at Elon lands in one feed.",
    description:
      "onby (it used to be called Quad) is the campus events app I've been building since August 2025. Finding out what's happening at Elon usually means checking group chats, flyers and six different Instagram accounts, so onby puts every org's events in one feed. You save the ones you want to catch, it reminds you before they start, and the orgs get RSVPs and attendance numbers back. I'm the founder and the only developer, building it in React Native with Supabase and AWS behind it. A $2,500 Elon Innovation Grant funded it, and Elon's Student Involvement office approved a spring 2027 pilot with 19 student organizations.",
    year: 2025,
    highlights: [
      'I kept the pilot small on purpose, because I already know the app works, and what I still need to find out is whether students will actually change where they look for things to do.',
      'New events show up in the feed live, since most org events get posted a few hours before they start and a feed you have to refresh is already behind.',
      'Notifications only go out for events you saved yourself, because an events app that pings you about everything gets muted within a week.',
      'Getting through App Store review was its own project after the code was done, with the privacy disclosures and store copy all needing to be right before Apple approved it.',
    ],
    stack: {
      frontend: ['React Native', 'Expo', 'TypeScript'],
      backend: ['Supabase', 'PostgreSQL', 'AWS Lambda'],
      infra: ['DynamoDB', 'S3', 'Push notifications'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/elon-events-app',
      live: 'https://joinonby.com',
    },
    group: 'software',
  },
  {
    slug: 'chords-of-hope',
    title: 'Chords of Hope',
    category: 'web',
    tagline: "The website for a free music lessons program a friend runs out of Williams College.",
    description:
      "A friend at Williams College runs a program that teaches guitar, piano and voice to kids whose families can't afford lessons, and I built the website for it. It has a page for each instrument, testimonials, and forms for contact and donations. I kept it simple on purpose, just static HTML and CSS on GitHub Pages, so it loads fast and parents can find what they need.",
    year: 2025,
    highlights: [
      'The people visiting are parents looking for one specific thing, so I built the site to get them there fast instead of trying to impress anyone.',
      'Plain HTML on GitHub Pages made sense for a volunteer program that cannot pay for hosting or for someone to keep it running.',
      'With no build step, the site will still work years from now even if nobody touches it.',
    ],
    stack: {
      frontend: ['HTML5', 'CSS3', 'JavaScript'],
      backend: [],
      infra: ['GitHub Pages'],
    },
    stackLabels: ['Site', '', 'Hosting'],
    links: {
      github: 'https://github.com/tymastrangelo/chords-of-hope',
      live: 'https://tymastrangelo.github.io/chords-of-hope',
    },
    group: 'software',
  },
  {
    slug: 'blue-boy-adventure',
    title: 'Blue Boy Adventure',
    category: 'game',
    tagline: "A top-down pixel RPG I wrote in plain Java to learn what a game engine actually does for you.",
    description:
      "A 2D adventure game I wrote in plain Java to find out what game engines actually do for you, by doing all of it myself: the game loop, tile maps, collision, NPC dialogue, an inventory, and saving and loading. You explore a pixel world, fight orcs and a skeleton lord, and collect gear to level up.",
    year: 2024,
    highlights: [
      'Tile collision by hand is where most of my time and most of my bugs went, and it is the clearest example of something an engine normally handles for you.',
      'Saving and loading made me be honest about the game state, because anything I could not save was something I had not really modeled.',
      'Writing the loop, the maps, the dialogue and the inventory myself is how I finally understood what an engine is doing.',
    ],
    stack: {
      frontend: ['Java', '2D graphics', 'Tile maps'],
      backend: ['Game loop', 'Collision', 'Save and load'],
      infra: ['Desktop (macOS)'],
    },
    stackLabels: ['Game', 'Engine', 'Platform'],
    links: {
      github: 'https://github.com/tymastrangelo/Blue-Boy-Adventure',
    },
    group: 'fun',
    media: [
      { kind: 'screen', src: '/projects/blue-boy-adventure/world.jpg', alt: 'Blue Boy at a crossroads in the forest', ar: '1600/963' },
      { kind: 'screen', src: '/projects/blue-boy-adventure/controls.jpg', alt: 'The controls screen', ar: '953/568' },
    ],
  },
  {
    slug: 'buffer-bros-crm',
    title: 'Buffer Bros CRM',
    category: 'web',
    tagline: "The CRM my detailing company runs on, built when the schedule outgrew our spreadsheets.",
    description:
      "Buffer Bros is the mobile detailing company I co-founded back home on Marco Island, and this is the software we run it on. We started out on spreadsheets, and once the schedule outgrew them I built a Next.js CRM that tracks every job, client, vehicle, quote and expense, with a dashboard that shows how the business is actually doing. Supabase handles logins, the database and the pricing math, and a Google Sheets sync keeps everything in the format we already used for the books.",
    year: 2024,
    highlights: [
      'The Google Sheets sync is there because our books already lived in Sheets, and asking my co-founder to change how we worked would have killed the tool faster than any missing feature.',
      'Quote totals are calculated in one place in the database, so the price a customer sees cannot drift between screens.',
      'The dashboard only became worth building once its numbers started changing which jobs we took.',
      'Running software for my own business means I am the one who feels every bug, usually on a Saturday, so things get fixed fast.',
    ],
    stack: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts'],
      backend: ['Supabase', 'PostgreSQL', 'RPC Functions'],
      infra: ['Vercel', 'Google Sheets API'],
    },
    links: {
      github: 'https://github.com/tymastrangelo/bufferbros-admin',
      demoVideo: 'coming-soon',
    },
    group: 'software',
    media: [
      { kind: 'screen', src: '/projects/buffer-bros-crm/today.jpg', alt: 'The CRM\'s Today view with the day\'s jobs and the month\'s numbers', ar: '1800/1004' },
      { kind: 'screen', src: '/projects/buffer-bros-crm/calendar.jpg', alt: 'The calendar view with a month of booked details', ar: '1376/768' },
    ],
  },
  {
    slug: 'doomsday-drill',
    title: 'Doomsday Drill',
    category: 'web',
    tagline: "A practice page for working out the weekday of any date in your head.",
    description:
      "I picked up John Conway's Doomsday rule from an It's Okay to be Smart video, and now I can tell you that July 4, 1776 was a Thursday. The math is short once the anchors are memorized, but it only gets quick with practice, so I built a way to practice. The page deals you a random date, you work out the weekday in your head, and you hit reveal when you think you have it. It keeps a running tally, a streak and a timer so you can see whether you're getting faster, and the month and century anchors sit in a cheatsheet right under the card for when they haven't stuck yet.",
    year: 2026,
    highlights: [
      'The whole method comes down to three numbers: the century anchor, the year offset, and the doomsday date for the month.',
      'You reveal the answer and then say whether you got it, since the honor system is the only way to grade math you did in your head.',
      'Weekdays are easy to get wrong across timezones, so every date is built in UTC and never slips a day based on where you open the page.',
      'Practice only works if going again is instant, so the whole loop runs on the keyboard: space to reveal, then y or n.',
      'Your stats save in the browser, which is all the backend a practice tool needs.',
    ],
    stack: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'UTC date math'],
      backend: ['localStorage'],
      infra: ['Vercel'],
    },
    stackLabels: ['Frontend', 'Storage', 'Hosting'],
    links: {
      live: '/doomsday',
    },
    group: 'software',
  },
  {
    slug: 'floor-board',
    title: 'Floor Board',
    category: 'web',
    tagline: "The page behind the QR code on my door, so my residents always know what's next on the floor.",
    description:
      "I'm an RA at Elon, and a floor calendar is usually a sheet of paper by the elevator that nobody stops to read. Mine is a page instead. The QR code on my door opens it, and residents see the next event as a comic panel with a live countdown, the flyer, a share button, and one tap to add it to their calendar. Adding an event is one entry in a file plus a script that converts the flyer, and that's the whole backend, because I post about one flyer a week and an upload form would have taken longer to build than it would ever save. People only show up to things that look worth showing up to, and the code is what makes that take five minutes a week.",
    year: 2026,
    highlights: [
      'The server runs in UTC, so every event time goes through Eastern time first, or the board would drop events four hours early.',
      'The page refreshes every ten minutes so the "up next" event does not freeze at whatever was true when the site last built.',
      'A small shell script around the sips tool that comes with macOS turned out better than any CMS I looked at, since one flyer a week does not need logins.',
      'The comic look only applies inside the floor page, so the red and blue world never leaks into the rest of this site.',
      'Link previews pull from the next event, so when someone drops the link in the floor group chat it shows the flyer instead of a bare URL.',
    ],
    stack: {
      frontend: ['Next.js 14', 'TypeScript', 'Scoped CSS', 'Web Share API'],
      backend: ['TypeScript event file', 'Refreshes every 10 minutes', 'Google Calendar links'],
      infra: ['Vercel', 'sips flyer script', 'QR code'],
    },
    links: {
      live: '/floor',
    },
    group: 'software',
  },
  {
    slug: 'ewok-hop',
    title: 'Ewok Hop',
    category: 'game',
    tagline: "A Doodle Jump style climber on Endor where every gap is guaranteed to be jumpable.",
    description:
      "A pixel Ewok climbing up through the redwoods on Endor, built in vanilla JavaScript on a canvas with no framework and no build step. He bounces on his own every time he lands, so all you do is steer, and the forest gets harder the higher you go: walkways narrow, branches sway faster, vine covered logs crumble a beat after you touch them, and red mushrooms launch you up a whole screen. The part I spent the most time on is the part nobody sees, which is making sure every gap can actually be jumped instead of hoping the random placement worked out. I leaned on AI to build a lot of this, and the real work turned out to be the prompting: describing the feel I wanted clearly enough to get it, then reading the result closely enough to know what to throw out.",
    year: 2026,
    highlights: [
      'A normal bounce lifts about 207 pixels, so the level generator works out how far he can drift sideways during a jump and places the next platform inside that window.',
      'Crumbling logs needed their own rule, because without a limit on the gaps around them, falling back through the hole one left behind could not be survived no matter how well you played.',
      'Each character is a single sprite, so the game fakes movement by drawing the head, body and legs as bands that can slide against each other.',
      'Everything moves in whole pixels, and the legs never move down, otherwise the sprite shimmers or tears a gap at the hip.',
      'AI got me to a working game fast, but the tuning, the jump math and the reasons behind each rule were mine to figure out.',
    ],
    stack: {
      frontend: ['HTML5 Canvas', 'Vanilla JavaScript', 'CSS'],
      backend: ['Game loop', 'Procedural levels', 'Web Audio API', 'localStorage'],
      infra: ['GitHub Pages', 'Pillow sprite script'],
    },
    stackLabels: ['Game', 'Systems', 'Hosting'],
    links: {
      github: 'https://github.com/tymastrangelo/ewok_game',
      live: '/games/ewok_game/index.html',
    },
    group: 'fun',
    media: [
      { kind: 'screen', src: '/projects/ewok-hop/climb.jpg', alt: 'The Ewok climbing platforms through the redwoods', ar: '3/4' },
      { kind: 'screen', src: '/projects/ewok-hop/pick.jpg', alt: 'Picking an Ewok on the title screen', ar: '3/4' },
    ],
  },
]

// Showcase order: strongest work first. Real products with users, then
// technical depth, then the personality builds.
const showcaseOrder = [
  'onby',
  'buffer-bros-crm',
  'floor-board',
  'iron-man-mk3-helmet',
  'chess-board-clock',
  'monkey-gesture-detector',
  'doomsday-drill',
  'spring-break-voting-api',
  'retro-pong',
  'ewok-hop',
  'chords-of-hope',
  'blue-boy-adventure',
  'content-creation',
]

export const projects: Project[] = [
  ...showcaseOrder
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p)),
  // Anything not ranked yet lands at the end instead of disappearing
  ...allProjects.filter((p) => !showcaseOrder.includes(p.slug)),
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
