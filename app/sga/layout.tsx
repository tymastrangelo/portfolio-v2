import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SGA Communications Dashboard',
  description: 'A mobile-friendly communications workflow dashboard for SGA at Elon University.',
}

export default function SgaLayout({ children }: { children: React.ReactNode }) {
  return children
}