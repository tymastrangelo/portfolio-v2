import LoopVideo from '@/components/site/LoopVideo'
import { Section } from './sections'

// Sections only one project has. Content carried over from the old pages;
// only the presentation is new.

function FactList({ items }: { items: string[] }) {
  return (
    <ul className="facts">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function ChessBuild() {
  return (
    <>
      <Section id="the-build" title="The build">
        <dl className="pairs">
          <div>
            <dt>Sponsor</dt>
            <dd>Brendan Haggerty, professor in the College of Arts and Sciences</dd>
          </div>
        </dl>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="sub-h3">The board</h3>
            <FactList
              items={[
                'Regulation tournament size, with 2 inch squares and a 16x16 inch playing surface.',
                'Alternating maple and walnut squares with a maple border, raised on an MDF base so it looks like it floats.',
                'Practice cuts on scrap plywood first to dial in the table saw before cutting the expensive hardwood.',
                'Finished with danish oil, which made the colors pop, and built at the Elon Maker Hub as my first serious woodworking project.',
              ]}
            />
          </div>
          <div>
            <h3 className="sub-h3">The clock</h3>
            <FactList
              items={[
                'An Arduino Nano, buttons and an LCD display to keep time cleanly during a game.',
                'A laser-engraved case so it looks finished next to the board.',
                'I used an Instructables wiring guide as the reference for the electronics.',
              ]}
            />
          </div>
        </div>
      </Section>
      <Section id="whats-next" title="What’s next">
        <p className="project-prose">
          It&apos;s the centerpiece of my room now, and I want to keep building more woodworking and Arduino projects
          from here.
        </p>
      </Section>
    </>
  )
}

export function ChordsMission() {
  return (
    <Section id="mission" title="The program">
      <p className="project-prose">
        Chords of Hope gives free guitar, piano and voice lessons to kids whose families can&apos;t afford them. The
        site&apos;s job is to make that easy to find: a page for each instrument, what other families have said, and a
        form to get in touch or donate.
      </p>
      <dl className="pairs mt-10">
        <div>
          <dt>Program founder</dt>
          <dd>
            Brayden Cruz-Diaz, Williams College.{' '}
            <a
              className="link"
              href="https://www.linkedin.com/in/brayden-cruz-diaz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </dd>
        </div>
      </dl>
    </Section>
  )
}

const reels = [
  { title: 'College move-in day', src: '/videos/vlog1.MP4', href: 'https://www.tiktok.com/t/ZThveFFF1/' },
  { title: 'Detailing a car start to finish', src: '/videos/detail1.MP4', href: 'https://www.tiktok.com/t/ZThve9kvv/' },
  { title: 'Dorm upgrade', src: '/videos/vlog2.MP4', href: 'https://www.tiktok.com/t/ZThveS26y/' },
  { title: 'Detail work', src: '/videos/detail2.MP4', href: 'https://www.tiktok.com/t/ZThveSwB4/' },
]

const profiles = [
  { label: 'Instagram', handle: '@tymastrangelo', href: 'https://www.instagram.com/tymastrangelo/' },
  { label: 'TikTok', handle: '@tymastrangelo', href: 'https://www.tiktok.com/@tymastrangelo' },
  { label: 'Brainly on TikTok', handle: '@studywithtyler', href: 'https://www.tiktok.com/@studywithtyler' },
  { label: 'Elon SGA on Instagram', handle: '@elonsga', href: 'https://www.instagram.com/elonsga/' },
]

export function ContentReels() {
  return (
    <>
      <Section id="videos" title="A few videos" wide>
        <div className="reels">
          {reels.map((r) => (
            <a key={r.src} href={r.href} target="_blank" rel="noopener noreferrer" className="reel">
              <span className="reel-media">
                <LoopVideo src={r.src} label={r.title} nested />
              </span>
              <span className="reel-title">{r.title}</span>
              <span className="text-sm text-mist">Watch on TikTok</span>
            </a>
          ))}
        </div>
      </Section>
      <Section id="where" title="Where I post">
        <ul className="facts">
          {profiles.map((p) => (
            <li key={p.label}>
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="link">
                {p.label}
              </a>{' '}
              <span className="text-mist">{p.handle}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

export function OnbyWhat() {
  return (
    <Section id="what-it-does" title="What it does">
      <dl className="pairs">
        <div>
          <dt>For students</dt>
          <dd>Every org&apos;s events land in one feed, you save the ones you want to catch, and onby reminds you before they start.</dd>
        </div>
        <div>
          <dt>For orgs</dt>
          <dd>Post an event once, see who RSVP&apos;d, and get attendance numbers back afterward.</dd>
        </div>
        <div>
          <dt>At Elon</dt>
          <dd>Student Involvement approved a spring 2027 pilot with 19 student organizations.</dd>
        </div>
      </dl>
    </Section>
  )
}
