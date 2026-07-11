import type { Metadata } from 'next'
import './globals.css'
import './filmy.css'
import NoiseOverlay from '@/components/NoiseOverlay'
import ShutterNavigator from '@/components/ShutterNavigator'
import ShutterBlades from '@/components/ShutterBlades'

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
        {children}
      </body>
    </html>
  )
}
