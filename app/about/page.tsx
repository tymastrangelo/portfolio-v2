'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ContactModal from '@/components/ContactModal'
import FadeImage from '@/components/FadeImage'

const facts = [
  'Elon University ’28 — B.A. Computer Science, minors in Cybersecurity & Psychology',
  'Presidential Scholar',
  'Innovation Grant recipient for Quad (Elon Innovation Council, 2025)',
  'Former D1 athlete — Cross Country & Track',
  'SGA Senator · Maker Hub consultant',
  '2M+ views creating content for Brainly and Hulu campaigns',
]

export default function About() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight mb-16">
            About
          </h1>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
            <div className="space-y-6 text-slate-700 leading-relaxed text-[17px]">
              <p>
                I&apos;m Tyler — a CS student at Elon who would rather build the thing
                than talk about building it.
              </p>
              <p>
                Right now that means{' '}
                <a href="/quad" className="font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors">
                  Quad
                </a>
                , a campus events app in beta at Elon, and{' '}
                <a href="https://bufferbros.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors">
                  Buffer Bros
                </a>
                , the detailing company I co-founded and wrote all the software for.
              </p>
              <p>
                The rest of my time goes to student government, helping people
                prototype at the Maker Hub, filming short-form video, and whatever
                project is currently taking over my desk — a chess board, an Iron
                Man helmet, a Pong clone.
              </p>

              <ul className="pt-4 space-y-2.5 text-[15px] text-slate-600">
                {facts.map((fact) => (
                  <li key={fact} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" aria-hidden />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Get in touch
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>

            <div>
              <div className="relative overflow-hidden rounded-xl shadow-lg h-[400px] gradient-placeholder">
                <FadeImage
                  src="/images/about-img.JPG"
                  alt="Tyler with his parents"
                  fill
                  className="object-cover object-[50%_15%]"
                  priority
                />
              </div>
              <p className="text-center text-sm text-slate-500 mt-4 italic">
                With my parents — my biggest supporters
              </p>
            </div>
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <Footer />
    </main>
  )
}
