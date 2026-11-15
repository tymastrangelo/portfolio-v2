import type { Metadata, Viewport } from 'next'
import { Inter_Tight } from 'next/font/google'
import { readdirSync } from 'fs'
import path from 'path'
import './globals.css'
import './site.css'
import MusicPlayer from '@/components/MusicPlayer'
import MotionProvider from '@/components/MotionProvider'
import PageTransitions from '@/components/site/PageTransitions'

// Songs for the corner player: every .mp3 in public/music, read at build time.
function musicFiles() {
  try {
    return readdirSync(path.join(process.cwd(), 'public', 'music'))
      .filter((f) => f.toLowerCase().endsWith('.mp3'))
      .sort()
  } catch {
    return []
  }
}

// The site reads in SF Pro (the system font on Apple devices, see --font-sans
// in globals.css). Inter Tight is only the fallback elsewhere, so it is not
// preloaded: Apple devices never download it.
const inter = Inter_Tight({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: false })

// Pin the mobile browser chrome to the page color so the bars match the site.
// viewportFit cover lets the phone tab bar sit above the home indicator.
export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tymastrangelo.com'),
  title: {
    default: 'home',
    template: '%s',
  },
  description: 'Tyler Mastrangelo studies computer science and cybersecurity at Elon, builds onby, a campus events app, and co-founded Buffer Bros.',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/icon.svg',
    // iOS ignores an SVG here, so Add to Home Screen fell back to a screenshot
    apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: 'Tyler Mastrangelo',
    description: 'Tyler Mastrangelo studies computer science and cybersecurity at Elon, builds onby, a campus events app, and co-founded Buffer Bros.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: the inline script below adds reveal-on to
    // <html> before React hydrates
    <html lang="en" className={`${inter.variable} overflow-x-clip`} suppressHydrationWarning>
      <body className="overflow-x-clip max-w-full">
        {/* Before the first paint, so blocks that materialize in
            (public/reveal.js) are hidden from the start instead of flashing;
            skipped when the reader asks for less motion, undone after 2.5s if
            reveal.js never ran, and without JS nothing is ever hidden */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('reveal-on');setTimeout(function(){if(!window.__revealReady)document.documentElement.classList.remove('reveal-on')},2500)}",
          }}
        />
        <MotionProvider>
          <PageTransitions />
          {children}
          {/* After the page, so it is not the first thing a keyboard reaches */}
          <MusicPlayer files={musicFiles()} />
        </MotionProvider>
        {/* Entrances: deferred, so it runs as soon as the page's HTML has been
            parsed, still before hydration (public/reveal.js); the inline
            script above shows everything anyway if this never loads */}
        <script src="/reveal.js" defer />
      </body>
    </html>
  )
}
