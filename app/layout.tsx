import type { Metadata, Viewport } from 'next'
import { readdirSync } from 'fs'
import path from 'path'
import './globals.css'
import './filmy.css'
import NoiseOverlay from '@/components/NoiseOverlay'
import ShutterNavigator from '@/components/ShutterNavigator'
import ShutterBlades from '@/components/ShutterBlades'
import MusicPlayer from '@/components/MusicPlayer'

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

// Mobile browser chrome samples the page otherwise and lands on a muddy tint;
// pin it to paper so the bars match the site top and bottom.
export const viewport: Viewport = {
  themeColor: '#f5f2ea',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tymastrangelo.com'),
  title: {
    default: 'home',
    template: '%s',
  },
  description: 'Computer Science & Cybersecurity student building real systems and products.',
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
    title: 'Tyler Mastrangelo · Founder & Developer',
    description: 'Computer Science & Cybersecurity student building real systems and products.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden max-w-full">
        <NoiseOverlay />
        <ShutterNavigator />
        <ShutterBlades />
        <MusicPlayer files={musicFiles()} />
        {children}
      </body>
    </html>
  )
}
