'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import ModalShell from '@/components/ModalShell'
import { contactOptions } from '@/lib/contact'

// The Say hi dialog, opened from the nav. Email first, then everything else.
export default function ContactModal({
  open,
  onClose,
  fallbackFocus,
}: {
  open: boolean
  onClose: () => void
  fallbackFocus?: React.RefObject<HTMLElement>
}) {
  // Escape, the focus trap and handing focus back to the opener all come from
  // ModalShell. This only stops the page scrolling underneath.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <ModalShell label="Say hi" onClose={onClose} fallbackFocus={fallbackFocus}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overlay-backdrop"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="say-hi-panel pointer-events-auto"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="display text-[2rem]">Say hi</h2>
                  <p className="mt-3 text-mist">Email is usually fastest, but all of these reach me.</p>
                </div>
                <button type="button" onClick={onClose} aria-label="Close" className="icon-btn">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <ul className="mt-6">
                {contactOptions.map((option) => {
                  const Icon = option.icon
                  const external = option.href.startsWith('http')
                  return (
                    <li key={option.label}>
                      <a
                        href={option.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="say-hi-row"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-mist" aria-hidden />
                        <span className="font-semibold">{option.label}</span>
                        <span className="ml-auto min-w-0 truncate text-mist">{option.detail}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          </div>
        </ModalShell>
      )}
    </AnimatePresence>
  )
}
