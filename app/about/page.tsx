'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { FaGithub, FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function About() {
  return (
    <main className="relative min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              About Me
            </h1>
          </div>

          {/* Bio Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-8">Overview</h2>
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div className="space-y-4 text-slate-700 leading-relaxed text-[17px]">
                <p>
                  I&apos;m a Computer Science student at Elon University with minors in Cybersecurity and Psychology. I focus on building real-world solutions that bridge technical innovation with practical user needs.
                </p>
                <p>
                  Currently, I&apos;m developing <a href="/quad" className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"><strong>Quad</strong></a>, a mobile app that helps students discover campus events and connect with organizations. Built with React Native and AWS, Quad is in beta testing at Elon and has been awarded the Innovation Grant from the Elon Innovation Council.
                </p>
                <p>
                  I also co-founded <a href="https://bufferbros.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"><strong>Buffer Bros Mobile Detailing</strong></a>, where I built our entire tech stack from the ground up—including automated scheduling, CRM systems, and workflow tools—while running day-to-day operations and building strong customer relationships.
                </p>
                <p>
                  Beyond my main projects, I serve as a Senator in <a href="https://www.elon.edu/u/sga/executive-council/" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 hover:text-slate-700 transition-colors">Elon&apos;s Student Government</a>, work as a <a href="https://www.elon.edu/u/fa/technology/makerhub/our-team/" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 hover:text-slate-700 transition-colors">Maker Hub Consultant</a> helping students bring their ideas to life, and create educational content as a <a href="https://www.tiktok.com/@studywithtyler?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 hover:text-slate-700 transition-colors">UGC creator for Brainly</a> with hundreds of thousands of views across campaigns.
                </p>
              </div>

              {/* Family Photo */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl shadow-lg group h-[420px]">
                  <Image
                    src="/images/about-img.JPG"
                    alt="Ty with family"
                    fill
                    className="object-cover object-[50%_15%]"
                    priority
                  />
                </div>
                <p className="text-center text-sm text-slate-500 mt-4 italic">
                  With my parents—my biggest supporters
                </p>
              </div>
            </div>
          </section>

          {/* Current Focus */}
          <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-6">What I&apos;m Working On</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <h3 className="text-xl font-semibold mb-3">Quad Development</h3>
                <p className="text-slate-600 leading-relaxed">
                  Leading beta testing, shipping UI/UX improvements, and preparing for campus-wide rollout of the events platform.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <h3 className="text-xl font-semibold mb-3">Buffer Bros Automation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Building and refining internal tools for job management, pricing automation, and business analytics.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Skills */}
          <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-6">Technical Expertise</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-slate-900">Mobile Development</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• React Native</li>
                  <li>• iOS Development</li>
                  <li>• Push Notifications</li>
                  <li>• TestFlight Beta Testing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-slate-900">Backend & Cloud</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• AWS (Lambda, DynamoDB, Amplify)</li>
                  <li>• Node.js</li>
                  <li>• PostgreSQL / Supabase</li>
                  <li>• RESTful APIs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-slate-900">Full-Stack</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Next.js / TypeScript</li>
                  <li>• Python / Java</li>
                  <li>• Tailwind CSS</li>
                  <li>• Git / GitHub</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Education & Leadership */}
          <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-6">Education & Involvement</h2>
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">Elon University</h3>
                  <span className="text-slate-500 text-sm">2024 - 2028</span>
                </div>
                <p className="text-slate-700 font-medium mb-2">B.A. Computer Science</p>
                <p className="text-slate-600 mb-3">Minors in Cybersecurity & Psychology</p>
                <p className="text-sm text-slate-500">Presidential Scholar</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a href="https://www.elon.edu/u/sga/executive-council/" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
                  <h4 className="font-semibold mb-1">Student Government</h4>
                  <p className="text-sm text-slate-600">Senator of Arts & Sciences</p>
                </a>
                <a href="https://www.elon.edu/u/fa/technology/makerhub/our-team/" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
                  <h4 className="font-semibold mb-1">Maker Hub</h4>
                  <p className="text-sm text-slate-600">Consultant & Workshop Leader</p>
                </a>
                <a href="https://www.instagram.com/elon_apa/?hl=en" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
                  <h4 className="font-semibold mb-1">Animal Protection Alliance</h4>
                  <p className="text-sm text-slate-600">Treasurer</p>
                </a>
                <a href="https://elonphoenix.com/sports/mens-cross-country/roster/tyler-mastrangelo/10979" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
                  <h4 className="font-semibold mb-1">Former D1 Athlete</h4>
                  <p className="text-sm text-slate-600">Cross Country & Track</p>
                </a>
              </div>
            </div>
          </section>

          {/* Recognition */}
          <section className="mb-20">
            <h2 className="text-3xl font-semibold mb-6">Recognition & Impact</h2>
            <div className="space-y-4">
              <a href="https://www.elon.edu/u/elon-innovates/innovation-grants/" target="_blank" rel="noopener noreferrer" className="block p-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">Innovation Grant Recipient</h3>
                <p className="text-slate-700">Awarded by Elon Innovation Council for Quad development (2025)</p>
              </a>
              <a href="https://www.tiktok.com/@tymastrangelo" target="_blank" rel="noopener noreferrer" className="block p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">Content Creator</h3>
                <p className="text-slate-700">2M+ total views across TikTok and Instagram, partnerships with Hulu and Brainly</p>
              </a>
            </div>
          </section>

          {/* Connect */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">Let&apos;s Connect</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              I&apos;m always interested in connecting with fellow builders, discussing new ideas, or exploring opportunities to collaborate. Feel free to reach out through any of these platforms.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://github.com/tymastrangelo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-lg border-l-4 border-slate-700 hover:border-slate-400 hover:bg-slate-800 transition-all duration-300"
              >
                <FaGithub size={20} />
                <span>GitHub</span>
              </a>
              <a 
                href="https://linkedin.com/in/tymastrangelo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-lg border-l-4 border-blue-600 hover:border-blue-400 hover:bg-slate-800 transition-all duration-300"
              >
                <FaLinkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://instagram.com/tymastrangelo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-lg border-l-4 border-pink-500 hover:border-pink-400 hover:bg-slate-800 transition-all duration-300"
              >
                <FaInstagram size={20} />
                <span>Instagram</span>
              </a>
              <a 
                href="https://tiktok.com/@tymastrangelo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-lg border-l-4 border-cyan-400 hover:border-cyan-300 hover:bg-slate-800 transition-all duration-300"
              >
                <FaTiktok size={20} />
                <span>TikTok</span>
              </a>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}

