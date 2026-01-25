# Tyler Mastrangelo — Portfolio

A modern, tech-forward portfolio built with Next.js, TypeScript, and Framer Motion. This site showcases a clean, product-focused aesthetic with scroll-based animations, custom cursor interactions, and campaign-style project presentations.

## Features

- **Next.js App Router** with TypeScript
- **Custom cursor** with hover states (desktop only)
- **Scroll-based motion** and parallax effects
- **Designed placeholder system** with gradients and shimmer effects
- **Campaign-style project pages** (see Quad)
- **Responsive design** with mobile-optimized interactions
- **Clean routing** with dynamic project pages
- **Modular component architecture**

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- CSS custom properties

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
│   ├── projects/
│   │   ├── [slug]/
│   │   │   └── page.tsx      # Dynamic project pages
│   │   └── page.tsx          # Projects archive
│   ├── globals.css           # Global styles + custom cursor
│   ├── layout.tsx            # Root layout
│   ├── not-found.tsx         # 404 page
│   └── page.tsx              # Landing page
├── components/
│   ├── CustomCursor.tsx      # Custom cursor component
│   ├── Footer.tsx            # Footer with social links
│   ├── Navigation.tsx        # Minimal nav
│   ├── NoiseOverlay.tsx      # Noise texture overlay
│   └── Placeholder.tsx       # Gradient placeholder system
├── lib/
│   └── projects.ts           # Project data + helpers
└── public/                   # Static assets
```

## Adding Projects

Edit `lib/projects.ts` to add new projects:

```typescript
{
  slug: 'project-slug',
  title: 'Project Name',
  category: 'product', // 'product' | 'software' | 'experiment'
  tagline: 'Short description',
  description: 'Longer description...',
  year: '2024',
  stack: ['Tech', 'Stack'],
  links: {
    live: 'https://...',
    github: 'https://...',
  },
  featured: true,
  gradients: {
    hero: 'linear-gradient(...)',
    card: 'linear-gradient(...)',
  },
}
```

## Customization

### Colors

Edit `tailwind.config.js` or CSS variables in `app/globals.css`:

```css
:root {
  --primary: #0A0A0A;
  --secondary: #F5F5F5;
  --accent: #00FF94;
  --muted: #6B6B6B;
}
```

### Fonts

Update font families in `app/globals.css` and `tailwind.config.js`.

### Animations

All animations use CSS and Framer Motion. Adjust timing/easing in:
- `app/globals.css` for global animations
- Individual components for specific motion

## Performance Notes

- Custom cursor is disabled on mobile
- Scroll animations use `requestAnimationFrame`
- Images are lazy-loaded
- CSS animations preferred over JS when possible

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari (iOS 12+)
- Chrome Android

## License

All rights reserved © 2024 Tyler Mastrangelo
