'use client'

import { useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FadeImage from '@/components/FadeImage'

// To add photos: drop the file in public/moments/ and add a line here.
// Caption and location are optional — a photo with neither still renders fine.
type Moment = {
  src: string
  alt: string
  caption?: string
  location?: string
}

const moments: Moment[] = [
  // { src: '/moments/lake-day.jpg', alt: 'Friends jumping off the dock', caption: 'lake day', location: 'Lake Norman' },
]

export default function MomentsPage() {
  useEffect(() => {
    const handleReveal = () => {
      document.querySelectorAll('.reveal').forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.85) {
          element.classList.add('active')
        }
      })
    }

    handleReveal()
    window.addEventListener('scroll', handleReveal, { passive: true })
    return () => window.removeEventListener('scroll', handleReveal)
  }, [])

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="mb-16 max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight">
              Moments
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              I carry a digital camera almost everywhere. This is the unpolished
              side of the site: friends, concerts, road trips, whatever felt
              worth keeping. No case studies here. Just proof it&apos;s a good life.
            </p>
          </div>

          {moments.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6">
              {moments.map((moment) => (
                <figure
                  key={moment.src}
                  className="reveal break-inside-avoid rounded-lg bg-white p-3 pb-4 shadow-md hover:shadow-xl hover:-rotate-1 transition-all duration-300"
                >
                  <div className="relative overflow-hidden rounded-md bg-gray-100">
                    <FadeImage
                      src={moment.src}
                      alt={moment.alt}
                      width={800}
                      height={600}
                      className="w-full h-auto"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  {(moment.caption || moment.location) && (
                    <figcaption className="mt-3 px-1 flex items-baseline justify-between gap-3">
                      {moment.caption && (
                        <span className="font-serif italic text-[15px] text-gray-800">
                          {moment.caption}
                        </span>
                      )}
                      {moment.location && (
                        <span className="text-xs uppercase tracking-widest text-gray-400 whitespace-nowrap">
                          {moment.location}
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 py-24 px-8 text-center">
              <p className="font-serif italic text-xl text-gray-700">
                Film&apos;s still developing.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                The first batch from the camera roll lands here soon.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
