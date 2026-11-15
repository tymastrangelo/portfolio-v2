'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const ranges = [
  { key: 'now', label: 'this century', from: 2000, to: 2099 },
  { key: 'past', label: 'the 1900s', from: 1900, to: 1999 },
  { key: 'wide', label: 'anything', from: 1600, to: 2400 },
] as const

type RangeKey = (typeof ranges)[number]['key']
type Puzzle = { y: number; m: number; d: number }
type Stats = { right: number; wrong: number; streak: number; best: number }

const emptyStats: Stats = { right: 0, wrong: 0, streak: 0, best: 0 }
const STORE_KEY = 'doomsday-stats'

const randomInt = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1))

function dealDate(from: number, to: number): Puzzle {
  const y = randomInt(from, to)
  const m = randomInt(1, 12)
  // Day 0 of the next month is the last day of this one, leap years included
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return { y, m, d: randomInt(1, lastDay) }
}

// UTC throughout: a local parse would slide the weekday by a day depending on
// which side of the world the page is open.
const weekdayOf = ({ y, m, d }: Puzzle) =>
  new Date(Date.UTC(y, m - 1, d)).getUTCDay()

const monthDoomsdays = [
  '1/3 (1/4)',
  '2/28 (2/29)',
  '3/14',
  '4/4',
  '5/9',
  '6/6',
  '7/11',
  '8/8',
  '9/5',
  '10/10',
  '11/7',
  '12/12',
]

const centuryAnchors = [
  { years: '1600, 2000, 2400', day: 'Tuesday' },
  { years: '1700, 2100, 2500', day: 'Sunday' },
  { years: '1800, 2200, 2600', day: 'Friday' },
  { years: '1900, 2300', day: 'Wednesday' },
]

const steps = [
  'Start with the anchor day for the century, so 1900s is Wednesday and 2000s is Tuesday.',
  'Take the last two digits of the year and divide by 12, then keep the quotient, the remainder, and the remainder divided by 4 with the fraction thrown away.',
  'Add those three numbers to the anchor and subtract 7s until you are under 7. That weekday is the doomsday for the whole year.',
  'Every date in the month list above lands on that weekday, so count forward or back from the closest one to your date.',
]

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="drill-stat">
      <p className="text-sm text-mist">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

export default function DoomsdayPage() {
  const [rangeKey, setRangeKey] = useState<RangeKey>('wide')
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [startedAt, setStartedAt] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [stats, setStats] = useState<Stats>(emptyStats)
  // The tally from just before a reset, kept until the next answer so a
  // stray click on Reset is one click to take back
  const [cleared, setCleared] = useState<Stats | null>(null)

  const deal = useCallback(() => {
    const range = ranges.find((r) => r.key === rangeKey) ?? ranges[2]
    setPuzzle(dealDate(range.from, range.to))
    setRevealed(false)
    setStartedAt(Date.now())
    setElapsed(0)
  }, [rangeKey])

  // Nothing is dealt on the server: a random date would not survive hydration.
  // Changing the range deals a fresh one.
  useEffect(() => {
    deal()
  }, [deal])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY)
      if (saved) setStats({ ...emptyStats, ...JSON.parse(saved) })
    } catch {
      // Private mode or a corrupt entry: start the tally over, no harm done
    }
  }, [])

  useEffect(() => {
    if (!puzzle || revealed) return
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 200)
    return () => clearInterval(id)
  }, [puzzle, revealed, startedAt])

  const reveal = useCallback(() => {
    setElapsed(Date.now() - startedAt)
    setRevealed(true)
  }, [startedAt])

  const score = useCallback(
    (got: boolean) => {
      setCleared(null)
      setStats((prev) => {
        const streak = got ? prev.streak + 1 : 0
        const next: Stats = {
          right: prev.right + (got ? 1 : 0),
          wrong: prev.wrong + (got ? 0 : 1),
          streak,
          best: Math.max(prev.best, streak),
        }
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(next))
        } catch {
          // Nothing to persist to, the tally still runs for this session
        }
        return next
      })
      deal()
    },
    [deal]
  )

  // Keyboard drill: space reveals, then y or n records it. Skipped while any
  // other control has focus so buttons and links keep their own keys; the
  // drill's own buttons (data-drill) are the exception, since focus lands on
  // Got it when the answer shows.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const active = document.activeElement as HTMLElement | null
      if (active && active !== document.body && !active.dataset.drill) return
      if (!revealed && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault()
        reveal()
      } else if (revealed && (event.key === 'y' || event.key === 'Y')) {
        score(true)
      } else if (revealed && (event.key === 'n' || event.key === 'N')) {
        score(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealed, reveal, score])

  const save = (next: Stats | null) => {
    try {
      if (next) localStorage.setItem(STORE_KEY, JSON.stringify(next))
      else localStorage.removeItem(STORE_KEY)
    } catch {
      // Nothing to persist to; the tally on screen is still right
    }
  }

  const resetStats = () => {
    setCleared(stats)
    setStats(emptyStats)
    save(null)
  }

  const undoReset = () => {
    if (!cleared) return
    setStats(cleared)
    save(cleared)
    setCleared(null)
  }

  const seconds = (elapsed / 1000).toFixed(1)

  return (
    <>
      <Nav />
      <main id="content" className="site">
        <div className="wrap project-head">
          <div className="max-w-2xl">
            <Link href="/projects/doomsday-drill" className="link text-sm text-mist">
              About the drill
            </Link>
            <h1 className="display drill-title">What day of the week was it?</h1>
            <p className="lead mt-5 text-mist">
              You get a date, you work it out in your head, and you hit reveal once you think you have it.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-sm text-mist" id="years-label">
                Years
              </span>
              <div className="seg glass-well" role="group" aria-labelledby="years-label">
                {ranges.map((range) => (
                  <button
                    key={range.key}
                    type="button"
                    onClick={() => setRangeKey(range.key)}
                    aria-pressed={rangeKey === range.key}
                    className="seg-item"
                  >
                    {rangeKey === range.key && (
                      <motion.span
                        layoutId="years-thumb"
                        className="seg-thumb glass"
                        transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                        aria-hidden
                      />
                    )}
                    <span className="seg-label">{range.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* The card: one date at a time */}
            <div className="drill-card surface mt-6">
              {/* Read out when the answer shows; always mounted so it is heard */}
              <p className="sr-only" aria-live="polite">
                {revealed && puzzle ? `It falls on a ${DAYS[weekdayOf(puzzle)]}.` : ''}
              </p>

              <div className="flex items-center justify-between text-sm text-mist tabular-nums">
                <p>Date {stats.right + stats.wrong + 1}</p>
                <p>{seconds}s</p>
              </div>

              {puzzle ? (
                <>
                  <p className="display drill-date" aria-live="polite">
                    {MONTHS[puzzle.m - 1]} {puzzle.d}, {puzzle.y}
                  </p>
                  <p className="mt-3 text-center text-sm text-mist tabular-nums">
                    {String(puzzle.m).padStart(2, '0')}/{String(puzzle.d).padStart(2, '0')}/{puzzle.y}
                  </p>

                  {revealed ? (
                    <div className="mt-9 text-center">
                      <p className="text-sm text-mist">It falls on a</p>
                      <p className="display drill-day">{DAYS[weekdayOf(puzzle)]}</p>
                      <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <button type="button" onClick={() => score(true)} className="button" data-drill autoFocus>
                          Got it
                          <kbd aria-hidden>Y</kbd>
                        </button>
                        <button type="button" onClick={() => score(false)} className="button button-quiet" data-drill>
                          Missed it
                          <kbd aria-hidden>N</kbd>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-9 flex flex-col items-center gap-3">
                      <button type="button" onClick={reveal} className="button" data-drill>
                        Reveal the day
                      </button>
                      <p className="text-sm text-mist">or press space</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="mb-6 mt-10 text-center text-sm text-mist">Dealing a date…</p>
              )}
            </div>

            {/* Running tally, kept in this browser */}
            <div className="drill-stats mt-6">
              <Stat label="Right" value={stats.right} />
              <Stat label="Missed" value={stats.wrong} />
              <Stat label="Streak" value={stats.streak} />
              <Stat label="Best" value={stats.best} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              {/* Always on the page, so the "cleared" note is announced */}
              <p className="text-mist" role="status">
                {cleared ? 'Tally cleared' : 'Saved in this browser only'}
              </p>
              {cleared ? (
                <button type="button" onClick={undoReset} className="link">
                  Undo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetStats}
                  className="link disabled:opacity-40"
                  disabled={stats.right + stats.wrong === 0}
                >
                  Reset tally
                </button>
              )}
            </div>

            {/* The sheet, for when the anchors have not stuck yet */}
            <details className="drill-sheet mt-10">
              <summary>
                Cheatsheet
                <ChevronDown className="h-4 w-4" aria-hidden />
              </summary>

              <div className="mt-6">
                <h2>Doomsday by month</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {monthDoomsdays.map((item) => (
                    <li key={item} className="chip tabular-nums">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-mist">
                  The dates in parentheses are the leap year versions of January and February.
                </p>
              </div>

              <div className="mt-8">
                <h2>Doomsday by century</h2>
                <dl className="pairs mt-3">
                  {centuryAnchors.map((anchor) => (
                    <div key={anchor.day}>
                      <dt className="tabular-nums">{anchor.years}</dt>
                      <dd>{anchor.day}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8">
                <h2>The steps</h2>
                <ol className="learned mt-3">
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/watch?v=714LTMNJy5M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-quiet is-small"
                >
                  Watch the explainer
                </a>
                <a
                  href="/files/doomsday-cheatsheet.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-quiet is-small"
                >
                  Print the cheatsheet
                </a>
              </div>

              <p className="mt-5 text-sm text-mist">
                The trick is John Conway&apos;s Doomsday rule. I learned it from the It&apos;s Okay to be Smart video
                above, and the printable sheet is theirs.
              </p>
            </details>
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
