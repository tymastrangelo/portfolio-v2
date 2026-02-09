import type { Metadata } from 'next'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'
import NoiseOverlay from '@/components/NoiseOverlay'

export const metadata: Metadata = {
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
    title: 'Tyler Mastrangelo — Founder & Developer',
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
    <html lang="en">
      <body>
        <NoiseOverlay />
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
