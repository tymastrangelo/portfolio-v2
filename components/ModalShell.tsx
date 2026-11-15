'use client'

import { useEffect, useRef } from 'react'

// Every overlay on the site (Say hi, the phone menu, the game, the lightbox)
// mounts inside this. A native <dialog> opened with showModal() is what the
// browser already knows how to do properly: it moves focus in, keeps Tab from
// wandering onto the page behind, makes that page inert to clicks and screen
// readers, and turns Escape into a `cancel` event. The overlay's own markup and
// motion live inside unchanged; .modal-shell in app/site.css clears the dialog's
// default box so it draws nothing of its own.
//
// Mount it only while open (inside AnimatePresence). It is left open while an
// exit animation runs and leaves the top layer when React unmounts it, and
// focus goes back to whatever opened it.
export default function ModalShell({
  label,
  onClose,
  fallbackFocus,
  children,
}: {
  label: string
  onClose: () => void
  /** where focus goes if the element that opened this has left the page
      (Say hi opened from the phone menu, which closes as it opens) */
  fallbackFocus?: React.RefObject<HTMLElement>
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  // Captured once, before showModal moves focus inside. A ref rather than a
  // local so React's dev-mode rehearsal (mount, unmount, mount again) cannot
  // overwrite it with the dialog's own close button.
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (!openerRef.current) openerRef.current = document.activeElement as HTMLElement | null
    // Read now: the fallback (e.g. the nav's Say hi) is already on the page
    const fallback = fallbackFocus?.current
    if (!dialog.open) dialog.showModal()
    return () => {
      const opener = openerRef.current
      // Wait a tick: on the rehearsal unmount the dialog is still on the page
      // and still modal, so there is nothing to hand focus back to yet. On a
      // real close it has gone, and the opener is reachable again.
      setTimeout(() => {
        if (dialog.isConnected) return
        const target = opener?.isConnected ? opener : fallback
        target?.focus?.({ preventScroll: true })
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per open
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className="modal-shell"
      onCancel={(e) => {
        // Let React close it, so the exit animation still plays
        e.preventDefault()
        onClose()
      }}
    >
      {children}
    </dialog>
  )
}
