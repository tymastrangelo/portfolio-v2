import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import { trips } from '@/lib/photos'

// Every trip as an album: its cover, three more frames under it, its name
export default function PhotosPage() {
  return (
    <>
      <Nav />
      <main id="content" className="site">
        <header className="wrap project-head">
          <h1 className="display project-title">Photos</h1>
          <p className="lead mt-6 max-w-[46ch] text-mist">
            Trips, sunsets back home, and the people I go with, filed by place.
          </p>
        </header>

        <ul className="wrap albums">
          {trips.map((trip, i) => {
            const cover = trip.frames.find((f) => f.src === trip.cover) ?? trip.frames[0]
            const more = trip.frames.filter((f) => f !== cover && !f.video).slice(0, 3)
            return (
              <li key={trip.slug} data-album={trip.slug}>
                <Link href={`/photos/${trip.slug}`} className="album">
                  {/* Opening the album zooms this cover into the album page's
                      hero (components/site/PageTransitions) */}
                  <span className="album-cover" data-vt-zoom="album-hero">
                    <Image
                      src={cover.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      priority={i < 3}
                      draggable={false}
                      className="object-cover"
                    />
                  </span>
                  {more.length > 0 && (
                    <span className="album-strip">
                      {more.map((f) => (
                        <span key={f.src} className="album-thumb">
                          <Image src={f.src} alt="" fill sizes="10vw" draggable={false} className="object-cover" />
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="display album-title">
                    {trip.title}
                  </span>
                  <span className="album-meta">
                    {trip.place}, {trip.frames.length} {trip.frames.length === 1 ? 'photo' : 'photos'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <Footer />
      </main>
    </>
  )
}
