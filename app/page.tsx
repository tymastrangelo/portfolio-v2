import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import Cover from '@/components/site/Cover'
import SayHi from '@/components/site/SayHi'
import WorkCard, { OnbyCard } from '@/components/site/WorkCard'
import RiseText from '@/components/RiseText'
import { getProject, projects, type Project } from '@/lib/projects'
import { coverFrames, trips } from '@/lib/photos'
import { RESUME } from '@/lib/contact'

// What I do for people outside of code, in my own words, one line per role.
const roles = [
  {
    title: 'VP of Communications',
    org: 'Elon Student Government Association',
    text: "I turned SGA communications from a one-person job into a content team, with a shared calendar and an owner for posters, graphics, photos and posting. I run our Instagram, the website and our relationships with campus media, and Michael's Monday Minute is the series people watch most.",
  },
  {
    title: 'CS1 Teaching Assistant',
    org: 'Elon Computer Science',
    text: 'I help students get through their first programming course.',
  },
  {
    title: "President's Student Leadership Advisory Council",
    org: 'Elon University',
    text: "I'm one of the student leaders advising the president on Elon's ten year plan.",
  },
  {
    title: 'Student Media Board',
    org: 'Elon Student Media',
    text: "I'm SGA's representative to Elon's student media: ENN, WSOE, ESTV and Limelight.",
  },
  {
    title: 'Communications Manager',
    org: 'Phoenix Give Back',
    text: 'I help write our alumni emails and our outreach to donors, seniors and alumni, working directly with the program’s lead.',
  },
]

const clients = [
  {
    title: 'CoastMate',
    org: 'OceanComm Labs, since October 2026',
    text: "CoastMate is a boating safety app with a voice assistant, float plans and overdue alerts. I work on the backend: I moved the API keys off the phone and into Supabase Edge Functions, and I built the usage limits, the row level security and the backend for the live trip page.",
  },
  {
    title: 'Firestone Roofing and Restoration',
    org: 'Contract software engineer, summer 2026',
    text: 'I worked on their roofing CRM, a React, FastAPI and Supabase app with Stripe, Twilio and SendGrid wired in and more than 45,000 lines of code.',
  },
]

// Three projects on the home page, onby first; everything else lives on /projects
const selected = ['onby', 'buffer-bros-crm', 'iron-man-mk3-helmet']
  .map(getProject)
  .filter((p): p is Project => Boolean(p))

// onby's pilot lives in its card below (the intro already names onby), so
// this list is the rest of what's current
const now = [
  'Running communications for Elon SGA as VP of Communications',
  'Doing contract backend work on CoastMate, a boating safety app',
]


function SectionHead({ id, title, link }: { id: string; title: string; link?: { href: string; label: string } }) {
  return (
    <div className="section-head">
      <h2 id={id} className="display section-title">
        {title}
      </h2>
      {link && (
        <Link href={link.href} className="link">
          {link.label}
        </Link>
      )}
    </div>
  )
}

function Roles({ items }: { items: typeof roles }) {
  return (
    <ul className="roles">
      {items.map((r) => (
        <li key={r.title} className="role">
          <h3>
            {r.title}
            <span>{r.org}</span>
          </h3>
          <p>{r.text}</p>
        </li>
      ))}
    </ul>
  )
}

export default function Home() {
  const photoRow = trips.slice(0, 5).map((t) => ({
    trip: t,
    frame: t.frames.find((f) => f.src === t.cover) ?? t.frames[0],
  }))

  return (
    <>
      <Nav />
      <main id="content" className="site">
        <Cover frames={coverFrames}>
          <h1 className="display cover-name">
            <RiseText text="Tyler" delay={0.1} />
            <br />
            <RiseText text="Mastrangelo" delay={0.19} />
          </h1>
          <p className="lead cover-line">
            I build software people use and things you can hold. I grew up on Marco Island and I&apos;m studying
            computer science and cybersecurity at Elon.
          </p>
        </Cover>

        <section className="wrap section" aria-labelledby="hello">
          <div className="intro">
            <div className="intro-photo surface">
              <Image
                src="/images/headshot.jpg"
                alt="Tyler Mastrangelo"
                width={1060}
                height={1484}
                sizes="(min-width: 900px) 30vw, 90vw"
              />
            </div>
            <div className="min-w-0">
              <h2 id="hello" className="display section-title">
                Hi, I’m Tyler
              </h2>
              <p className="lead mt-6 max-w-[52ch]">
                Most of my time goes to onby, the campus events app I&apos;m building, and the rest goes to contract
                development, student government, and the software behind the detailing business I co-founded back home.
              </p>
              <div className="now surface">
                <h3>Right now</h3>
                <ul>
                  {now.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                  <li className="is-open">
                    Looking for a summer 2027 internship in software, security, product or consulting
                  </li>
                </ul>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href="/about" className="button button-quiet">
                  More about me
                </Link>
                <a href={RESUME} target="_blank" rel="noopener noreferrer" className="link">
                  Resume
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap section" aria-labelledby="work">
          <SectionHead id="work" title="Selected work" link={{ href: '/projects', label: `All ${projects.length} projects` }} />
          <div className="work-grid">
            <OnbyCard project={selected[0]} />
            {selected.slice(1).map((p) => (
              <WorkCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        {/* Paid work right after the projects, where someone hiring looks */}
        <section className="wrap section" aria-labelledby="client-work">
          <SectionHead id="client-work" title="Client work" />
          <Roles items={clients} />
        </section>

        <section className="wrap section" aria-labelledby="on-campus">
          <SectionHead id="on-campus" title="On campus" />
          <Roles items={roles} />
        </section>

        <section className="wrap section" aria-labelledby="photos">
          <SectionHead id="photos" title="Photos" link={{ href: '/photos', label: 'See all the photos' }} />
          <div className="photo-row">
            {photoRow.map(({ trip, frame }) => (
              <Link key={trip.slug} href={`/photos/${trip.slug}`} className="photo-row-item">
                <span className="photo-row-img">
                  <Image src={frame.src} alt={frame.alt} fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover" />
                </span>
                <span className="photo-row-place">{frame.place}</span>
              </Link>
            ))}
          </div>
        </section>

        <SayHi />
        <Footer />
      </main>
    </>
  )
}
