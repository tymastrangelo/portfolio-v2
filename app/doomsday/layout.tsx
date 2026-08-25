import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'doomsday',
  description:
    'Practice the Doomsday rule: get a random date, work out the weekday in your head, and check yourself.',
}

export default function DoomsdayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
