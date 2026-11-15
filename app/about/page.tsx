import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import SayHiButton from '@/components/site/SayHiButton'

const facts = [
  { label: 'School', value: 'Elon University, class of 2028' },
  { label: 'Study', value: 'Double major in computer science and cybersecurity' },
  { label: 'Work', value: 'Founder of onby, co-founder of Buffer Bros, contract developer on CoastMate' },
  { label: 'Campus', value: 'SGA VP of Communications, RA, CS1 teaching assistant, Maker Hub consultant' },
  { label: 'Councils', value: "President's Student Leadership Advisory Council, Student Media Board" },
  { label: 'Honors', value: 'Presidential Scholar, Elon Innovation Grant, Student Wellness Innovation Grant' },
  { label: 'Before', value: 'Contract software engineer on a roofing CRM, D1 cross country and track' },
  { label: 'Elsewhere', value: 'Over 2 million views on videos about my own life, with brand work for Old Spice, Hulu and Brainly' },
]

export default function About() {
  return (
    <>
      <Nav />
      <main id="content" className="site">
        <div className="wrap project-head">
          <h1 className="display project-title">About</h1>
          <div className="about-grid">
            <div className="about-portrait surface">
              <Image
                src="/images/headshot.jpg"
                alt="Tyler Mastrangelo"
                width={1060}
                height={1484}
                priority
                draggable={false}
                sizes="(min-width: 900px) 30vw, 80vw"
              />
            </div>

            <div className="min-w-0">
              <p className="lead about-lead">
                I&apos;m Tyler. I grew up on Marco Island, Florida, and I&apos;m a junior at Elon studying computer
                science and cybersecurity.
              </p>
              <div className="about-body">
                <p>
                  Most of my time right now goes to{' '}
                  <a href="https://joinonby.com" target="_blank" rel="noopener noreferrer" className="link">
                    onby
                  </a>
                  , a campus events app I started because finding out what was happening at Elon meant digging through
                  group chats and Instagram. Student Involvement approved a spring 2027 pilot with 19 student orgs, and
                  I&apos;m the only one writing the code.
                </p>
                <p>
                  I also build software for real businesses. I co-founded{' '}
                  <a href="https://bufferbros.org" target="_blank" rel="noopener noreferrer" className="link">
                    Buffer Bros
                  </a>
                  , a mobile detailing company back home, and wrote the CRM we run it on. Last summer I worked on a{' '}
                  <a href="https://firestonerestorations.com/" target="_blank" rel="noopener noreferrer" className="link">
                    roofing industry CRM
                  </a>{' '}
                  for Firestone, and this fall I started contract work on CoastMate, a boating safety app.
                </p>
                <p>
                  On campus I run communications for student government, which this semester went from a one-person job
                  to a whole content team. I&apos;m also an RA, a CS1 teaching assistant and a Maker Hub consultant,
                  which is where the chess board and the Iron Man helmet came from.
                </p>
                <p>
                  When I&apos;m not working I&apos;m usually with my friends, at the beach back home, or somewhere with a
                  point-and-shoot in my pocket. The{' '}
                  <Link href="/photos" className="link">
                    photos
                  </Link>{' '}
                  are where that ends up. I&apos;m looking for a summer 2027 internship in software, security, product
                  or consulting, so if that&apos;s you, say hi.
                </p>
              </div>

              <dl className="pairs mt-12">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10">
                <SayHiButton />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
