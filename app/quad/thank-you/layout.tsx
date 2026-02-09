import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'quad — thank you',
}

export default function QuadThankYouLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
