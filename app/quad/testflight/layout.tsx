import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'quad — testflight',
}

export default function QuadTestflightLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
