'use client'

import { useState } from 'react'
import ContactModal from '@/components/ContactModal'

// A "Say hi" button anywhere on a page, opening the same dialog as the nav
export default function SayHiButton({ className = 'button' }: { className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Say hi
      </button>
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
