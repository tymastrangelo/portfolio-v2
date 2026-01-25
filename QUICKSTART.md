# 🚀 Quick Start Guide

Get Tyler's portfolio running in under 2 minutes.

## Installation

```bash
cd portfolio
npm install
```

## Development

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## First Steps

### 1. Update Personal Info (5 minutes)

**Social Links** → `components/Footer.tsx`
```typescript
const socials = [
  { name: 'GitHub', href: 'https://github.com/YOUR_USERNAME' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/YOUR_PROFILE' },
  { name: 'Instagram', href: 'https://instagram.com/YOUR_USERNAME' },
  { name: 'TikTok', href: 'https://tiktok.com/@YOUR_USERNAME' },
]
```

**Email** → `app/page.tsx` (line ~68)
```tsx
<a href="mailto:your.email@example.com">
```

### 2. Add Your Projects (10 minutes)

Edit `lib/projects.ts` and add your projects:

```typescript
{
  slug: 'your-project',
  title: 'Your Project Name',
  category: 'software', // or 'product' or 'experiment'
  tagline: 'One compelling sentence',
  description: 'Full description of what you built and why...',
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
}
```

### 3. Customize Colors (2 minutes)

Edit `app/globals.css`:

```css
:root {
  --primary: #0A0A0A;      /* Your primary color */
  --accent: #00FF94;       /* Your accent color */
}
```

### 4. Deploy (2 minutes)

**Push to GitHub**, then:

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your repo
4. Click "Deploy"

Done! 🎉

## File Structure

```
portfolio/
├── app/
│   ├── page.tsx              ← Landing page
│   └── projects/
│       ├── page.tsx          ← Projects list
│       └── [slug]/page.tsx   ← Project details
├── components/               ← Reusable UI
├── lib/
│   └── projects.ts          ← **Add your projects here**
└── package.json
```

## Key Features

✅ Custom cursor (desktop)  
✅ Scroll animations  
✅ Gradient placeholders  
✅ Mobile responsive  
✅ TypeScript  
✅ Production ready  

## Need Help?

- **Setup issues?** → See `SETUP.md`
- **Deployment?** → See `SETUP.md` Deployment section
- **Architecture?** → See `PROJECT_OVERVIEW.md`

## Next Steps

1. Replace gradient placeholders with real images
2. Add more projects to `lib/projects.ts`
3. Customize colors and fonts
4. Deploy to Vercel

**You're ready to ship.** 🚀
