# Setup & Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Install dependencies**
   ```bash
   cd portfolio
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:3000`

3. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Node modules issues?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Customization Guide

### 1. Update Personal Information

**Social Links** (`components/Footer.tsx`):
```typescript
const socials = [
  { name: 'GitHub', href: 'https://github.com/your-username' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/your-profile' },
  // ... update with your actual links
]
```

**Email** (`app/page.tsx`):
```tsx
<a href="mailto:your-email@example.com">
  Get in Touch
</a>
```

### 2. Add Your Projects

Edit `lib/projects.ts`:

```typescript
export const projects: Project[] = [
  {
    slug: 'your-project',
    title: 'Your Project',
    category: 'software', // or 'product' or 'experiment'
    tagline: 'One-line description',
    description: 'Full description...',
    year: '2024',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    links: {
      live: 'https://yourproject.com',
      github: 'https://github.com/you/project',
    },
    featured: true,
    gradients: {
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  },
  // Add more projects...
]
```

### 3. Customize Colors

**Option A: CSS Variables** (`app/globals.css`):
```css
:root {
  --primary: #0A0A0A;      /* Dark text/backgrounds */
  --secondary: #F5F5F5;    /* Light backgrounds */
  --accent: #00FF94;       /* Accent color (green) */
  --muted: #6B6B6B;        /* Muted text */
}
```

**Option B: Tailwind Config** (`tailwind.config.js`):
```javascript
colors: {
  primary: '#0A0A0A',
  secondary: '#F5F5F5',
  accent: '#00FF94',
  muted: '#6B6B6B',
}
```

### 4. Replace Placeholder Images

Once you have real images:

1. Add images to `/public/images/`
2. Update `Placeholder` components with `<Image>` from `next/image`:

```tsx
import Image from 'next/image'

// Replace this:
<Placeholder gradient="..." />

// With this:
<Image 
  src="/images/project-hero.jpg"
  alt="Project screenshot"
  width={1200}
  height={800}
  className="rounded-lg"
/>
```

### 5. Adjust Animations

**Scroll reveal speed** (`app/page.tsx`):
```typescript
// Change threshold for when elements reveal
if (rect.top < windowHeight * 0.85) { // Adjust 0.85 higher/lower
  element.classList.add('active')
}
```

**Animation timing** (`app/globals.css`):
```css
.reveal {
  transition: opacity 0.8s ease, /* Adjust duration */
              transform 0.8s ease;
}
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Deploy!

**Environment variables** (if needed):
- Add in Vercel dashboard under Settings → Environment Variables

### Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Custom Server

```bash
# Build
npm run build

# Start on port 3000
npm start

# Or with PM2
pm2 start npm --name "portfolio" -- start
```

## Performance Optimization

### Image Optimization

Use Next.js Image component for all images:
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // For above-fold images
/>
```

### Font Loading

Fonts are currently using system fallbacks. To use custom fonts:

1. Add font files to `/public/fonts/`
2. Update `@font-face` in `app/globals.css`
3. Or use `next/font`:

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
```

### Bundle Analysis

```bash
npm install -D @next/bundle-analyzer
```

Add to `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... your config
})
```

Run analysis:
```bash
ANALYZE=true npm run build
```

## Adding New Features

### Adding a Blog

1. Create `/app/blog/page.tsx`
2. Create `/app/blog/[slug]/page.tsx`
3. Add blog data in `/lib/blog.ts` (similar to projects)

### Adding Analytics

**Google Analytics:**
```tsx
// app/layout.tsx
import Script from 'next/script'

<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

<Analytics />
```

### Adding Contact Form

Consider using:
- [Formspree](https://formspree.io)
- [Web3Forms](https://web3forms.com)
- Custom API route

## Maintenance

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update all
npm update

# Update Next.js specifically
npm install next@latest react@latest react-dom@latest
```

### Security

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix
```

## Support

For issues or questions:
1. Check the README.md
2. Review Next.js docs: https://nextjs.org/docs
3. Check Tailwind docs: https://tailwindcss.com/docs

## License

All rights reserved © 2024 Tyler Mastrangelo
