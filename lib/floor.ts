// Events for the floor board at /floor (Chandler 1, Danieley). One source of
// truth: add an entry to `events` and you're done, newest or oldest order
// doesn't matter since the page sorts.
//
// To add a flyer: run  ./scripts/flyer.sh <file.pdf|jpg|png> <slug>
// It writes public/floor/<slug>.jpg and prints the entry to paste here.

export type FloorEvent = {
  title: string
  /** Elon local time, 'YYYY-MM-DDTHH:MM'. No timezone suffix, see toInstant. */
  start: string
  /** Same format. Defaults to two hours after start. */
  end?: string
  where: string
  /** One or two lines, shown under the title. Optional. */
  blurb?: string
  /** '/floor/<slug>.jpg' from the flyer script. Optional, the card works without one. */
  flyer?: string
  /** Flyer aspect ratio, w/h. The flyer script prints it. */
  ar?: string
}

export const events: FloorEvent[] = [
  {
    title: 'Floor meeting',
    start: '2026-08-24T19:00',
    end: '2026-08-24T19:30',
    where: 'Chandler 1 lounge',
    blurb: 'First meeting of the year.',
  },
  {
    title: 'Movie night',
    start: '2026-08-29T21:00',
    where: 'Chandler 1 lounge',
    blurb: 'Projector, the good popcorn, and a vote on what we watch when everyone gets there.',
  },
]

const TWO_HOURS = 2 * 60 * 60 * 1000

// The strings above are Elon time. The server renders in UTC, so parsing them
// naively would put every event four hours off and drop it from the page early.
// ponytail: resolve the offset from the date itself, so EST/EDT both work.
function etOffsetMs(t: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'longOffset',
  }).format(t)
  const m = parts.match(/GMT([+-])(\d{2}):(\d{2})/)
  if (!m) return 0
  const sign = m[1] === '-' ? -1 : 1
  return sign * (Number(m[2]) * 3600000 + Number(m[3]) * 60000)
}

export function toInstant(local: string): number {
  const asUtc = Date.parse(`${local}:00Z`)
  return asUtc - etOffsetMs(asUtc)
}

export const endOf = (e: FloorEvent) =>
  e.end ? toInstant(e.end) : toInstant(e.start) + TWO_HOURS

/** Next (or currently running) event first, then what's after it, then the archive. */
export function splitEvents(list: FloorEvent[], now = Date.now()) {
  const sorted = [...list].sort((a, b) => toInstant(a.start) - toInstant(b.start))
  const live = sorted.filter((e) => endOf(e) > now)
  const past = sorted.filter((e) => endOf(e) <= now).reverse()
  return { next: live[0] ?? null, later: live.slice(1), past }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function clock(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h < 12 ? 'am' : 'pm'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')}${suffix}`
}

/** 'Mon, Aug 24 · 7:00pm to 7:30pm'. Built from the string, so server and phone agree. */
export function formatWhen(e: FloorEvent) {
  const [date, time] = e.start.split('T')
  const [y, mo, d] = date.split('-').map(Number)
  const day = DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()]
  const span = e.end ? `${clock(time)} to ${clock(e.end.split('T')[1])}` : clock(time)
  return `${day}, ${MONTHS[mo - 1]} ${d} · ${span}`
}

export function calendarUrl(e: FloorEvent) {
  const stamp = (s: string) => `${s.replace(/[-:]/g, '')}00`
  const end = e.end ?? formatLocal(endOf(e))
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${stamp(e.start)}/${stamp(end)}`,
    ctz: 'America/New_York',
    location: e.where,
    details: e.blurb ?? '',
  })
  return `https://calendar.google.com/calendar/render?${q}`
}

/** Instant back to an Elon-local 'YYYY-MM-DDTHH:MM' string. */
function formatLocal(t: number) {
  return new Date(t + etOffsetMs(t)).toISOString().slice(0, 16)
}
