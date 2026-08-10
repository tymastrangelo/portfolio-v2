'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FadeImage from '@/components/FadeImage'

// Each album is one roll of film: a closed canister on the shelf that opens
// into a staggered two column strip. To add a roll: drop web-sized photos in
// public/moments/<album>/ and add an entry here. ar is the media's native
// aspect ratio (w/h). date comes from the file's EXIF; leave it off if the
// file had none. video: true renders a muted looping clip, like a live photo.
// No captions on frames, per Tyler.
type Frame = {
  src: string
  alt: string
  date?: string
  ar: string
  video?: boolean
}

type Roll = {
  id: string
  num: string
  title: string
  period: string
  line: string
  frames: Frame[]
}

// Film stocks cycle by roll number, so a new album gets a look automatically.
// Order is tuned so the current rolls land on fitting colors (home = gold, etc).
const stocks = ['stock-fuji', 'stock-kodachrome', 'stock-ektachrome', 'stock-ilford', 'stock-gold']
const stockFor = (roll: Roll) => stocks[(parseInt(roll.num, 10) - 1) % stocks.length]

const rolls: Roll[] = [
  {
    id: 'guatemala',
    num: '02',
    title: 'guatemala',
    period: 'March 2026',
    line: 'Two days up Acatenango over spring break, watching the volcano next door erupt.',
    frames: [
      { src: '/moments/guatemala/antigua-night.jpg', alt: 'Two friends in front of a lit cathedral in Antigua at night', date: "mar 25 '26", ar: '3/2' },
      { src: '/moments/guatemala/rooftop-breakfast.jpg', alt: 'Breakfast on an Antigua rooftop with a volcano on the horizon', date: "mar 26 '26", ar: '3/4' },
      { src: '/moments/guatemala/trail-selfie.jpg', alt: 'Trail selfie with backpacks at the start of the hike', ar: '9/16' },
      { src: '/moments/guatemala/basecamp-dog.mp4', alt: 'A dog rolling in the dirt at basecamp', ar: '16/9', video: true },
      { src: '/moments/guatemala/fuego-night-eruption.jpg', alt: 'Volcán de Fuego erupting at night with lava and city lights below', date: "mar 27 '26", ar: '4/3' },
      { src: '/moments/guatemala/summit-selfie.jpg', alt: 'Sunrise selfie above the clouds near the summit of Acatenango', date: "mar 27 '26", ar: '4/3' },
      { src: '/moments/guatemala/summit-sunrise.jpg', alt: 'The sun rising beside Volcán de Agua with hikers silhouetted', date: "mar 27 '26", ar: '4/3' },
      { src: '/moments/guatemala/fuego-above-clouds.jpg', alt: 'Volcán de Fuego smoking above a sea of clouds', date: "mar 27 '26", ar: '16/9' },
      { src: '/moments/guatemala/fuego-erupting.mp4', alt: 'Volcán de Fuego pushing out a smoke plume in daylight', ar: '16/9', video: true },
      { src: '/moments/guatemala/volcano-through-pines.jpg', alt: 'A volcano above the clouds seen through the pines', date: "mar 27 '26", ar: '16/9' },
      { src: '/moments/guatemala/trail-first-light.jpg', alt: 'Walking the volcanic trail at first light', date: "mar 27 '26", ar: '5/8' },
    ],
  },
  {
    id: 'greece-italy',
    num: '03',
    title: 'greece & italy',
    period: 'June 2024',
    line: 'The family trip, from the islands to the Amalfi coast.',
    frames: [
      { src: '/moments/greece/santorini-caldera.jpg', alt: 'Santorini caldera and whitewashed buildings over the sea', date: "jun 25 '24", ar: '4/3' },
      { src: '/moments/greece/blue-dome.jpg', alt: 'A blue domed church behind pink bougainvillea on Santorini', ar: '9/16' },
      { src: '/moments/greece/mykonos-windmill.jpg', alt: 'A whitewashed windmill on Mykonos with a blue gate', date: "jun 27 '24", ar: '4/3' },
      { src: '/moments/greece/mykonos-harbor.jpg', alt: 'Boats moored in the clear water of Mykonos harbor', date: "jun 27 '24", ar: '4/3' },
      { src: '/moments/greece/mykonos-old-port.jpg', alt: 'A sailboat coming into the old port of Mykonos', date: "jun 27 '24", ar: '4/3' },
      { src: '/moments/greece/mykonos-shallows.jpg', alt: 'Clear teal shallows in front of the town on Mykonos', date: "jun 27 '24", ar: '4/3' },
      { src: '/moments/greece/amalfi-coast.jpg', alt: 'Looking down the Amalfi coastline from above the town', date: "jun 29 '24", ar: '4/3' },
    ],
  },
  {
    id: 'ski',
    num: '04',
    title: 'skiing',
    period: "Winters '22 to '24",
    line: 'Vail with the boys, three Februarys running.',
    frames: [
      { src: '/moments/ski/vail-wipeout.jpg', alt: 'Two friends wiped out in deep powder by the trees', date: "feb 23 '22", ar: '4/3' },
      { src: '/moments/ski/vail-ridge.jpg', alt: 'Looking down a snowy run toward the valley at Vail', date: "feb 26 '23", ar: '3/4' },
      { src: '/moments/ski/cornice.jpg', alt: 'Snowboarder standing on a cornice above the valley', date: "feb 21 '24", ar: '3/4' },
      { src: '/moments/ski/lift-into-sun.jpg', alt: 'Chairlift climbing into a bright winter sun', ar: '9/16' },
    ],
  },
  {
    id: 'home',
    num: '05',
    title: 'home',
    period: "The gulf, '23 to '24",
    line: 'On the beach or off the back of the boat, I never skip a sunset.',
    frames: [
      { src: '/moments/sunsets/naples-fire.jpg', alt: 'Vivid orange sunset over the Gulf of Mexico', date: "apr 5 '23", ar: '4/3' },
      { src: '/moments/sunsets/naples-beach.jpg', alt: 'Soft sunset over gentle surf on the beach', date: "apr 5 '23", ar: '4/3' },
      { src: '/moments/sunsets/boat-wake.jpg', alt: 'Sunset over the wake behind the boat', date: "may 29 '23", ar: '4/3' },
      { src: '/moments/sunsets/boat-sun.jpg', alt: 'The sun touching the horizon over open water', date: "may 29 '23", ar: '4/3' },
      { src: '/moments/sunsets/gulf-horizon.jpg', alt: 'Deep blue gulf water under an orange band of sky', date: "jun 13 '23", ar: '4/3' },
      { src: '/moments/sunsets/waterway-dusk.jpg', alt: 'Pink and blue dusk over a calm waterway', date: "jun 24 '23", ar: '4/3' },
      { src: '/moments/sunsets/spikeball-sunset.jpg', alt: 'Friends playing spikeball on white sand under an orange sunset sky', date: "aug 3 '23", ar: '3/4' },
      { src: '/moments/sunsets/bridge-dawn.jpg', alt: 'The bridge onto the island at dawn', date: "aug 5 '23", ar: '4/3' },
      { src: '/moments/sunsets/nye-sunset.jpg', alt: 'Pastel sunset over calm water on New Year’s Eve', date: "dec 31 '23", ar: '4/3' },
      { src: '/moments/sunsets/key-west-sunrise.jpg', alt: 'Storm clouds over the marina at sunrise in Key West', date: "aug 1 '24", ar: '4/3' },
      { src: '/moments/sunsets/pool-night.jpg', alt: 'The resort pool glowing at night from the balcony', date: "aug 7 '24", ar: '4/3' },
    ],
  },
  {
    id: 'concerts',
    num: '06',
    title: 'concerts',
    period: "'24 and '25",
    line: 'Country shows with the boys, cowboy hats mandatory.',
    frames: [
      { src: '/moments/shows/tortuga-hats.jpg', alt: 'Six friends in cowboy hats at a beach music festival', date: "apr 6 '24", ar: '4/3' },
      { src: '/moments/shows/tortuga-two.jpg', alt: 'Two friends in front of the stage on the sand', date: "apr 7 '24", ar: '4/3' },
      { src: '/moments/shows/country-show.jpg', alt: 'Friends shoulder to shoulder at a country concert', date: "aug 14 '24", ar: '9/16' },
      { src: '/moments/shows/festival-selfie.jpg', alt: 'Group selfie on the festival lawn in cowboy hats', date: "may 29 '25", ar: '4/3' },
    ],
  },
]

// One renderer for both kinds of frame: photos fade in, videos loop silently
function FrameMedia({ frame, sizes }: { frame: Frame; sizes: string }) {
  if (frame.video) {
    return (
      <video
        src={frame.src}
        muted
        loop
        autoPlay
        playsInline
        aria-label={frame.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    )
  }
  return (
    <FadeImage src={frame.src} alt={frame.alt} fill className="object-cover" sizes={sizes} />
  )
}

export default function MomentsPage() {
  const [openRoll, setOpenRoll] = useState<Roll | null>(null)
  const [lightbox, setLightbox] = useState<{ frame: Frame; num: string } | null>(null)

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

  // Kept separate from the key/scroll effect below, which also re-runs on every
  // lightbox change: the canister you opened should get focus back exactly once,
  // when the roll itself closes.
  useEffect(() => {
    if (!openRoll) return
    const opener = document.activeElement as HTMLElement | null
    return () => opener?.focus?.()
  }, [openRoll])

  useEffect(() => {
    if (!openRoll) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (lightbox) setLightbox(null)
      else setOpenRoll(null)
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [openRoll, lightbox])

  const closeRoll = () => {
    setLightbox(null)
    setOpenRoll(null)
  }

  return (
    <main className="filmy relative min-h-screen">
      <Navigation />

      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="develop mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <p className="mono">The camera roll · Kodak Pixpro FZ55</p>
            <p className="mono" aria-hidden>
              {rolls.length} rolls · {rolls.reduce((n, r) => n + r.frames.length, 0)} frames
            </p>
          </div>
          <h1
            className="develop font-display text-4xl md:text-5xl font-semibold tracking-tight"
            style={{ animationDelay: '0.1s' }}
          >
            Moments
          </h1>
          <p
            className="voice develop mt-5 mb-14 max-w-2xl text-lg leading-relaxed"
            style={{ animationDelay: '0.25s', color: 'var(--ink-soft)' }}
          >
            The unpolished side of the site, filed by trip: click a roll to
            unspool it.
          </p>

          {/* The shelf */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 md:gap-x-14">
            {rolls.map((roll, i) => (
              <button
                key={roll.id}
                type="button"
                className={`film-canister develop ${stockFor(roll)}`}
                style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                onClick={() => setOpenRoll(roll)}
                aria-haspopup="dialog"
                aria-label={`Open the ${roll.title} roll, ${roll.frames.length} frames`}
              >
                <span className="can-leader" aria-hidden />
                <span className="can-shadow" aria-hidden />
                <span className="can-spool" aria-hidden />
                <span className="can-cap can-cap-top" aria-hidden />
                <span className="can-body">
                  <span className="canister-label">
                    <span className="mono label-band">
                      Roll {roll.num} · {roll.frames.length} exp
                    </span>
                    <span className="label-title font-display text-base md:text-lg font-semibold tracking-tight leading-tight">
                      {roll.title}
                    </span>
                    <span className="mono label-period">{roll.period}</span>
                  </span>
                </span>
                <span className="can-cap can-cap-bottom" aria-hidden />
                <span className="can-sheen" aria-hidden />
              </button>
            ))}
          </div>

          <p className="voice text-center text-lg pt-16" style={{ color: 'var(--ink-soft)' }}>
            More rolls when they come back from the lab.
          </p>
        </div>
      </div>

      {/* The opened roll */}
      <AnimatePresence>
        {openRoll && (
          <>
            {/* Lights off in the darkroom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#16130e]/70 backdrop-blur-sm z-[80]"
              onClick={closeRoll}
            />
            <div className="fixed inset-0 z-[81] flex items-center justify-center p-3 md:p-6 pointer-events-none">
              {/* The strip pulls out of the can: rises in, scrolls vertically */}
              <motion.div
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 48 }}
                // Critically damped: the roll settles without overshoot, and
                // reopening mid-close picks up from wherever it is on screen.
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 0.4,
                  opacity: { type: 'tween', duration: 0.22, ease: 'easeOut' },
                }}
                className="film-column filmy pointer-events-auto"
                role="dialog"
                aria-modal="true"
                aria-label={`${openRoll.title} film roll`}
              >
                <div className="film-column-head">
                  <div className="min-w-0">
                    <p className="mono" style={{ color: 'rgba(245, 242, 234, 0.55)' }}>
                      Roll {openRoll.num} · {openRoll.title} · {openRoll.period}
                    </p>
                    <p className="voice mt-1 text-[15px]" style={{ color: 'rgba(245, 242, 234, 0.75)' }}>
                      {openRoll.line}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeRoll}
                    aria-label="Close roll"
                    className="w-9 h-9 rounded-full border border-[#f5f2ea]/25 hover:border-[#f5f2ea] flex items-center justify-center transition-colors shrink-0 text-[#f5f2ea]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="film-column-scroll">
                  <div className="film-column-track">
                    {openRoll.frames.map((frame, i) => {
                      const num = `${String(i + 1).padStart(2, '0')}A`
                      return (
                        <figure key={frame.src} className="film-frame !w-full">
                          <button
                            type="button"
                            className="frame-btn"
                            onClick={() => setLightbox({ frame, num })}
                            aria-label={`Enlarge frame ${num}: ${frame.alt}`}
                          >
                            <span className="frame-photo block" style={{ aspectRatio: frame.ar }}>
                              <FrameMedia frame={frame} sizes="(max-width: 768px) 46vw, 280px" />
                            </span>
                          </button>
                          <figcaption className="frame-label">
                            <span className="num">{num}</span>
                            {frame.date && <span>{frame.date}</span>}
                          </figcaption>
                        </figure>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* One frame, blown up */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="film-lightbox fixed inset-0 z-[90] flex items-center justify-center bg-[#16130e]/85 p-4"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.frame.alt}
          >
            <motion.figure
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="pointer-events-none m-0"
              style={(() => {
                const [w, h] = lightbox.frame.ar.split('/').map(Number)
                return {
                  aspectRatio: lightbox.frame.ar,
                  width: `min(92vw, calc(82vh * ${w / h}))`,
                }
              })()}
            >
              <span
                className="relative block h-full w-full overflow-hidden bg-[#26221b]"
                style={{ borderRadius: 'var(--r-2)' }}
              >
                <FrameMedia frame={lightbox.frame} sizes="92vw" />
              </span>
              <figcaption className="frame-label">
                <span className="num">{lightbox.num}</span>
                {lightbox.frame.date && <span>{lightbox.frame.date}</span>}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
