'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa'

const contactOptions = [
  {
    label: 'Email me',
    detail: 'mastrangelo.tyler@gmail.com',
    href: 'mailto:mastrangelo.tyler@gmail.com',
    icon: FaEnvelope,
  },
  {
    label: 'Connect on LinkedIn',
    detail: 'in/tymastrangelo',
    href: 'https://linkedin.com/in/tymastrangelo',
    icon: FaLinkedin,
  },
  {
    label: 'GitHub',
    detail: '@tymastrangelo',
    href: 'https://github.com/tymastrangelo',
    icon: FaGithub,
  },
  {
    label: 'Instagram',
    detail: '@tymastrangelo',
    href: 'https://instagram.com/tymastrangelo',
    icon: FaInstagram,
  },
  {
    label: 'TikTok',
    detail: '@tymastrangelo',
    href: 'https://tiktok.com/@tymastrangelo',
    icon: FaTiktok,
  },
]

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Contact options"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-semibold tracking-tight">
                    Let&apos;s connect
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Pick whatever&apos;s easiest. I answer all of them.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                {contactOptions.map((option) => {
                  const Icon = option.icon
                  const external = option.href.startsWith('http')
                  return (
                    <a
                      key={option.label}
                      href={option.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 rounded-2xl border border-gray-200 px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary shrink-0">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-gray-900">
                          {option.label}
                        </span>
                        <span className="block text-xs text-gray-500 truncate">
                          {option.detail}
                        </span>
                      </span>
                      <span className="ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform">
                        →
                      </span>
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
