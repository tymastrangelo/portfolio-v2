import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'photos',
  description: 'Photos from trips, sunsets back home on Marco Island, and the people I go with.',
}

export default function PhotosLayout({ children }: { children: React.ReactNode }) {
  return children
}
