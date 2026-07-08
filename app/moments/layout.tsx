import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'moments',
  description: 'Photos from a digital camera — friends, trips, and moments worth keeping.',
}

export default function MomentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
