import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'quad — privacy policy',
  description: 'Privacy Policy for the Quad Connect mobile application.',
}

export default function QuadPrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
