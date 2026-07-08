'use client'

import { useState } from 'react'
import ContactModal from '@/components/ContactModal'

export default function AnimatedConnectButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-24 h-24 rounded-full flex items-center justify-center overflow-hidden group"
        aria-label="Open contact options"
      >
        <div className="connect-spin absolute inset-0 rounded-full" />
        <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-md border border-white/20 group-hover:border-white/40 group-hover:bg-black/50 transition-all" />
        <span className="text-xs text-white font-medium uppercase tracking-wider relative">
          Connect
        </span>
      </button>
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
