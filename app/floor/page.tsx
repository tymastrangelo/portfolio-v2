import type { Metadata, Viewport } from 'next'
import FloorBoard from '@/components/FloorBoard'
import { events, formatWhen, splitEvents } from '@/lib/floor'
import './floor.css'

// The page is static, so without this the "next event" would freeze at build
// time. Ten minutes is plenty for a board that changes a few times a week.
export const revalidate = 600

const board = () => splitEvents(events)

export const viewport: Viewport = {
  themeColor: '#0b0b13',
  colorScheme: 'dark',
}

export function generateMetadata(): Metadata {
  const { next } = board()
  const title = 'chandler 1'
  const description = next
    ? `${next.title}, ${formatWhen(next)}, ${next.where}.`
    : 'Events on Chandler 1, posted here first.'

  return {
    title,
    description,
    openGraph: {
      title: next ? `${next.title} · Chandler 1` : 'Chandler 1 floor board',
      description,
      type: 'website',
      url: '/floor',
      // Shared links preview the flyer itself when there is one
      images: next?.flyer ? [{ url: next.flyer }] : undefined,
    },
    twitter: {
      card: next?.flyer ? 'summary_large_image' : 'summary',
      title: next ? `${next.title} · Chandler 1` : 'Chandler 1 floor board',
      description,
      images: next?.flyer ? [next.flyer] : undefined,
    },
  }
}

export default function FloorPage() {
  const { next, later, past } = board()
  return <FloorBoard next={next} later={later} past={past} />
}
