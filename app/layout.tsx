import type { Metadata } from 'next'
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
    apple: '/icon.svg',
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
