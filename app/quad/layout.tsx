import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'quad',
  icons: {
    icon: [
      {
        url: '/images/quad-icon.png',
        type: 'image/png',
      },
    ],
    shortcut: '/images/quad-icon.png',
    apple: '/images/quad-icon.png',
  },
}

export default function QuadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
