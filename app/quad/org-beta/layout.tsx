import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'quad · org beta',
}

export default function QuadOrgBetaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
