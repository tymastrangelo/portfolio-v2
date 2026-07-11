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
          {/* Lights off in the darkroom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#16130e]/60 backdrop-blur-sm z-[80]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none">
            {/* The card develops in like a print coming up in the tray.
                `filmy` is on the card itself so the tokens resolve even when
                the modal mounts outside a .filmy page (e.g. from Navigation). */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10, filter: 'sepia(0.5) contrast(0.75) brightness(1.15)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'sepia(0) contrast(1) brightness(1)' }}
              exit={{ opacity: 0, scale: 0.97, y: 10, filter: 'sepia(0.3) contrast(0.85) brightness(1.1)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="filmy contact-print w-full max-w-md pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Contact options"
            >
              <span className="tape" aria-hidden />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="mono mb-3">Contact sheet · {contactOptions.length} frames</p>
                  <h2 className="text-2xl font-display font-semibold tracking-tight">
                    Let&apos;s connect
                  </h2>
                  <p className="voice mt-1 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
                    Pick whatever&apos;s easiest. I answer all of them.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-9 h-9 rounded-full border border-[#1b1813]/20 hover:border-[#1b1813] flex items-center justify-center transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                {contactOptions.map((option, i) => {
                  const Icon = option.icon
                  const external = option.href.startsWith('http')
                  return (
                    <a
                      key={option.label}
                      href={option.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="contact-row group"
                    >
                      <span className="mono w-8 shrink-0" style={{ color: 'var(--safelight)' }}>
                        0{i + 1}A
                      </span>
                      <Icon className="h-4 w-4 shrink-0" style={{ color: 'var(--ink-soft)' }} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{option.label}</span>
                        <span className="block text-xs truncate" style={{ color: 'var(--ink-soft)' }}>
                          {option.detail}
                        </span>
                      </span>
                      <span
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        style={{ color: 'var(--safelight)' }}
                        aria-hidden
                      >
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
