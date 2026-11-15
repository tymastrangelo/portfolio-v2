import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import TripAlbum from '@/components/site/TripAlbum'
import { getTrip, trips } from '@/lib/photos'

export function generateStaticParams() {
  return trips.map((t) => ({ trip: t.slug }))
}

export function generateMetadata({ params }: { params: { trip: string } }): Metadata {
  const trip = getTrip(params.trip)
  return { title: trip ? trip.title.toLowerCase() : 'photos' }
}

export default function TripPage({ params }: { params: { trip: string } }) {
  const trip = getTrip(params.trip)
  if (!trip) notFound()
  const next = trips[(trips.indexOf(trip) + 1) % trips.length]
  const cover = trip.frames.find((f) => f.src === trip.cover) ?? trip.frames[0]

  return (
    <>
      <Nav />
      <main id="content" className="site">
        {/* The album opens on its cover, full bleed, the way Photos opens an
            album: the tile you tapped zooms into this hero (album-hero in
            components/site/PageTransitions), and the title sits on it */}
        <header className="album-hero">
          <span className="album-hero-media vt-media" style={{ viewTransitionName: 'album-hero' }}>
            <Image
              src={cover.src}
              alt=""
              fill
              priority
              sizes="100vw"
              draggable={false}
              className="object-cover"
              style={{ objectPosition: cover.focus ?? '50% 45%' }}
            />
          </span>
          <span className="album-hero-shade" aria-hidden />
          <div className="wrap album-hero-body">
            <Link href="/photos" className="link text-sm">
              All photos
            </Link>
            <h1 className="display project-title">{trip.title}</h1>
            <p className="mt-3 text-mist">
              {trip.place}, {trip.frames.length} {trip.frames.length === 1 ? 'photo' : 'photos'}
            </p>
            {trip.line && <p className="lead mt-5 max-w-[46ch]">{trip.line}</p>}
          </div>
        </header>

        <div className="wrap mt-12 md:mt-16">
          <TripAlbum frames={trip.frames} />
        </div>

        <p className="wrap project-closing">
          <Link href={`/photos/${next.slug}`} className="link text-[1.3125rem]">
            Next, {next.title}
          </Link>
        </p>
        <Footer />
      </main>
    </>
  )
}
