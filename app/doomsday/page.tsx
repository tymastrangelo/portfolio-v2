'use client'

import { useCallback, useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
  { years: '1600 · 2000 · 2400', day: 'Tuesday' },
  { years: '1700 · 2100 · 2500', day: 'Sunday' },
  { years: '1800 · 2200 · 2600', day: 'Friday' },
  { years: '1900 · 2300', day: 'Wednesday' },
]

const steps = [
  'Start with the anchor day for the century, so 1900s is Wednesday and 2000s is Tuesday.',
  'Take the last two digits of the year and divide by 12, then keep the quotient, the remainder, and the remainder divided by 4 with the fraction thrown away.',
  'Add those three numbers to the anchor and subtract 7s until you are under 7. That weekday is the doomsday for the whole year.',
  'Every date in the month list above lands on that weekday, so count forward or back from the closest one to your date.',
]

const inkSoft = { color: 'var(--ink-soft)' } as const
const hairline = { borderColor: 'var(--hairline)' } as const

const pillOutline =
  'pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium border-[#1b1813]/25 hover:border-[#1b1813]'

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-1 py-4 text-center md:px-3">
      <p className="mono">{label}</p>
      <p className="mt-1.5 text-2xl tabular-nums font-display font-semibold">
        {value}
      </p>
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

  // Keyboard drill: space reveals, then y or n records it. Skipped whenever a
  // control has focus so buttons and links keep their own key handling.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (document.activeElement && document.activeElement !== document.body) return
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

  const resetStats = () => {
    setStats(emptyStats)
    try {
      localStorage.removeItem(STORE_KEY)
    } catch {
      // Already gone as far as this browser is concerned
    }
  }

  const seconds = (elapsed / 1000).toFixed(1)

  return (
    <main className="filmy relative min-h-screen">
      <Navigation />

      <section className="pt-28 md:pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <p className="mono develop">Doomsday drill · calendar math</p>
          <h1
            className="develop font-display font-semibold tracking-tight text-3xl md:text-4xl leading-[1.1] mt-5"
            style={{ animationDelay: '0.1s' }}
          >
            What day of the week was it?
          </h1>
          <p
            className="voice develop mt-4 text-lg md:text-xl leading-snug"
            style={{ animationDelay: '0.2s', ...inkSoft }}
          >
            You get a date, you work it out in your head, and you hit reveal
            once you think you have it.
          </p>

          <div
            className="develop mt-8 flex flex-wrap items-center gap-2"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="mono mr-1">Years</span>
            {ranges.map((range) => (
              <button
                key={range.key}
                type="button"
                onClick={() => setRangeKey(range.key)}
                aria-pressed={rangeKey === range.key}
                className="px-4 py-1.5 rounded-full border text-sm transition-colors"
                style={{
                  borderColor:
                    rangeKey === range.key ? 'var(--ink)' : 'var(--hairline)',
                  background:
                    rangeKey === range.key ? 'var(--ink)' : 'transparent',
                  color:
                    rangeKey === range.key ? 'var(--paper)' : 'var(--ink-soft)',
                }}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* The card: one date at a time */}
          <div
            className="index-card develop mt-6 px-6 py-10 md:px-10 md:py-12"
            style={{ animationDelay: '0.4s' }}
          >
            <span className="tape" aria-hidden />

            <div className="flex items-center justify-between">
              <p className="mono">Frame {stats.right + stats.wrong + 1}</p>
              <p className="mono tabular-nums">{seconds}s</p>
            </div>

            {puzzle ? (
              <>
                <p className="mt-6 text-center font-display font-semibold tracking-tight text-4xl md:text-6xl leading-[1.05] text-balance">
                  {MONTHS[puzzle.m - 1]} {puzzle.d}, {puzzle.y}
                </p>
                <p className="mono mt-3 text-center tabular-nums">
                  {String(puzzle.m).padStart(2, '0')} ·{' '}
                  {String(puzzle.d).padStart(2, '0')} · {puzzle.y}
                </p>

                {revealed ? (
                  <div className="mt-9 text-center">
                    <p className="mono">It is a</p>
                    <p
                      key={`${puzzle.y}-${puzzle.m}-${puzzle.d}`}
                      className="develop mt-2 font-display font-semibold tracking-tight text-3xl md:text-5xl"
                      style={{ color: 'var(--safelight)' }}
                    >
                      {DAYS[weekdayOf(puzzle)]}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => score(true)}
                        className="connect-btn"
                      >
                        Got it
                        <span className="text-xs">Y</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => score(false)}
                        className={pillOutline}
                      >
                        Missed it
                        <span className="text-xs">N</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-9 flex flex-col items-center gap-3">
                    <button type="button" onClick={reveal} className="connect-btn">
                      Reveal the day
                      <span className="text-xs">→</span>
                    </button>
                    <p className="mono">or press space</p>
                  </div>
                )}
              </>
            ) : (
              <p className="mono mt-10 mb-6 text-center">Dealing a date...</p>
            )}
          </div>

          {/* Running tally, kept in this browser */}
          <div
            className="mt-6 grid grid-cols-4 rounded-[var(--r-3)] border [&>*+*]:border-l [&>*]:border-[color:var(--hairline)]"
            style={hairline}
          >
            <Stat label="Right" value={stats.right} />
            <Stat label="Missed" value={stats.wrong} />
            <Stat label="Streak" value={stats.streak} />
            <Stat label="Best" value={stats.best} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="mono">Saved in this browser only</p>
            <button type="button" onClick={resetStats} className="mono hover:text-[color:var(--safelight)]">
              Reset
            </button>
          </div>

          {/* The sheet, for when the anchors have not stuck yet */}
          <details className="index-card mt-10 px-6 py-5 md:px-8 md:py-6">
            <summary className="mono cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              Cheatsheet ▾
            </summary>

            <div className="mt-6">
              <p className="mono pb-2 border-b" style={hairline}>
                Doomsday by month
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {monthDoomsdays.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full border text-sm tabular-nums"
                    style={hairline}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={inkSoft}>
                The dates in parentheses are the leap year versions of January
                and February.
              </p>
            </div>

            <div className="mt-8">
              <p className="mono pb-2 border-b" style={hairline}>
                Doomsday by century
              </p>
              <dl className="mt-3">
                {centuryAnchors.map((anchor) => (
                  <div
                    key={anchor.day}
                    className="flex items-baseline justify-between gap-4 py-2 border-b last:border-b-0"
                    style={hairline}
                  >
                    <dt className="text-sm tabular-nums" style={inkSoft}>
                      {anchor.years}
                    </dt>
                    <dd className="m-0 font-medium">{anchor.day}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8">
              <p className="mono pb-2 border-b" style={hairline}>
                The steps
              </p>
              <ol className="mt-3 space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      className="mono shrink-0 pt-0.5"
                      style={{ color: 'var(--safelight)' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://www.youtube.com/watch?v=714LTMNJy5M"
                target="_blank"
                rel="noopener noreferrer"
                className={pillOutline}
              >
                Watch the explainer
                <span className="text-xs">↗</span>
              </a>
              <a
                href="/files/doomsday-cheatsheet.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={pillOutline}
              >
                Print the cheatsheet
                <span className="text-xs">↗</span>
              </a>
            </div>

            <p className="mt-5 text-sm leading-relaxed" style={inkSoft}>
              The trick is John Conway&apos;s Doomsday rule. I learned it from
              the It&apos;s Okay to be Smart video above, and the printable
              sheet is theirs.
            </p>
          </details>
        </div>
      </section>

      <Footer />
    </main>
  )
}
