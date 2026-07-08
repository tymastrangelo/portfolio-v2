# Tyler Mastrangelo — Portfolio

A modern, product-focused portfolio built with Next.js, TypeScript, and Tailwind CSS. Scroll-based animations, campaign-style project pages, and a linktree-style mobile home screen.

## Features

- **Next.js App Router** with TypeScript
- **Scroll-based motion** and reveal effects
- **Designed placeholder system** with gradients and shimmer effects
- **Campaign-style project pages** (see Quad)
- **Mobile linktree** home screen with a full responsive site behind it
- **Playable Retro Pong** embedded on its project page
- **Security headers** configured in `next.config.js`

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Motion (motion/react)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
portfolio/
├── app/
│   ├── about/                # About page
│   ├── projects/
│   │   ├── [slug]/           # Dynamic project pages
│   │   └── page.tsx          # Projects archive with search + filters
│   ├── quad/                 # Quad product pages (landing, testflight, org beta, privacy)
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── not-found.tsx         # 404 page
│   └── page.tsx              # Landing page (desktop) + mobile linktree
├── components/
│   ├── AnimatedConnectButton.tsx  # Floating contact button
│   ├── Footer.tsx            # Footer with social links
│   ├── MobileLinktree.tsx    # Mobile home screen
│   ├── Navigation.tsx        # Minimal nav
│   ├── NoiseOverlay.tsx      # Noise texture overlay
│   └── Placeholder.tsx       # Gradient placeholder system
├── lib/
│   └── projects.ts           # Project data + helpers
└── public/                   # Static assets, games, videos, resume
```

## Adding Projects

Edit `lib/projects.ts` and add an entry to the `projects` array. The `Project` interface at the top of that file documents every field (slug, title, category, tagline, description, year, stack, links, gradients, etc.). Project pages render automatically at `/projects/<slug>`.

## License

All rights reserved © Tyler Mastrangelo
