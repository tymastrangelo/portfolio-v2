'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaLinkedin, FaInstagram, FaTiktok, FaFileAlt } from 'react-icons/fa'
import { HiInformationCircle, HiRocketLaunch } from 'react-icons/hi2'

export default function MobileLinktree() {
  const links = [
    { name: 'Resume', href: '/files/Tyler%20Mastrangelo%20Resume.pdf', icon: FaFileAlt, color: 'text-blue-400' },
    { name: 'GitHub', href: 'https://github.com/tymastrangelo', icon: FaGithub, color: 'text-gray-300' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/tymastrangelo', icon: FaLinkedin, color: 'text-blue-500' },
    { name: 'Instagram', href: 'https://instagram.com/tymastrangelo', icon: FaInstagram, color: 'text-pink-500' },
    { name: 'TikTok', href: 'https://tiktok.com/@tymastrangelo', icon: FaTiktok, color: 'text-white' },
    { name: 'Projects', href: '/projects', icon: HiRocketLaunch, color: 'text-orange-400' },
    { name: 'About', href: '/about', icon: HiInformationCircle, color: 'text-cyan-400' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-primary to-slate-800 flex flex-col items-center justify-center px-6 py-12">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Profile Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="https://media.licdn.com/dms/image/v2/D4E03AQGsKo8DBGQkfw/profile-displayphoto-scale_400_400/B4EZzYp.a7J4Ak-/0/1773161415395?e=1775088000&v=beta&t=yo-0m0wt6diKKrkuWSGbYlnjKNLUqH2uhtj3xYJvDPo"
            alt="Tyler Mastrangelo"
            width={80}
            height={80}
            className="w-20 h-20 mx-auto mb-6 rounded-full object-cover shadow-lg"
              priority
          />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
            Tyler Mastrangelo
          </h1>
            <p className="text-gray-300 text-base mb-4">
              Founder · CS Student · Builder
          </p>
            <p className="text-gray-400 text-sm">
              Student at core. Founder by instinct.
          </p>
        </motion.div>

        {/* Links Grid */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {links.map((link) => {
            const IconComponent = link.icon
            return (
            <motion.div key={link.name} variants={linkVariants}>
              <motion.a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block w-full px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-xl transition-all backdrop-blur-sm group cursor-hover"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`text-2xl ${link.color}`} />
                    <span className="text-white font-medium text-base">{link.name}</span>
                  </div>
                  <span className="text-gray-400 text-lg group-hover:text-white transition-colors">→</span>
                </div>
              </motion.a>
            </motion.div>
            )
          })}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center text-gray-500 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>© {new Date().getFullYear()} Tyler Mastrangelo</p>
          <p className="mt-1">All rights reserved</p>
        </motion.div>
      </div>
    </main>
  )
}
