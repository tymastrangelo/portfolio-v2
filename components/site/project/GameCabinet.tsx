'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import ModalShell from '@/components/ModalShell'

export type Game = {
  src: string
  title: string
  /** the shape of the play field, as CSS aspect-ratio */
  aspect: string
  /** the same shape as a number, for sizing math */
  ratio: number
  maxWidth: number
  /** the postMessage type the game listens for to mute, if it has one */
  mute?: string
}

// One round control, so the three read as a set
function CabinetButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="icon-btn cabinet-btn">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  )
}

type FullscreenDoc = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

// "Play it here": the button, and the game in a dialog once it is pressed.
// Controls sit above the frame so nothing covers the score or the mute icon
// a game draws in its own corners.
export default function GameCabinet({ game, className = 'button' }: { game: Game; className?: string }) {
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const cabinetRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  const focusGame = () => {
    frameRef.current?.focus()
    frameRef.current?.contentWindow?.focus()
  }

  useEffect(() => {
    const onChange = () => {
      const doc = document as FullscreenDoc
      const el = cabinetRef.current
      setFullscreen(!!el && (document.fullscreenElement === el || doc.webkitFullscreenElement === el))
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  // The page underneath stays put while the game is open
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(focusGame, 50)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [open])

  const toggleMute = () => {
    const next = !muted
    if (game.mute) {
      frameRef.current?.contentWindow?.postMessage({ type: game.mute, muted: next }, window.location.origin)
    }
    setMuted(next)
    focusGame()
  }

  const toggleFullscreen = () => {
    const el = cabinetRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null
    const doc = document as FullscreenDoc
    if (!el) return
    if (document.fullscreenElement === el || doc.webkitFullscreenElement === el) {
      if (document.exitFullscreen) void document.exitFullscreen().catch(() => {})
      else doc.webkitExitFullscreen?.()
      return
    }
    if (el.requestFullscreen) {
      void el
        .requestFullscreen()
        .then(() => setTimeout(focusGame, 50))
        .catch(() => {})
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen()
      setTimeout(focusGame, 50)
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Play it here
      </button>

      <AnimatePresence>
        {open && (
          <ModalShell label={`${game.title}, playable`} onClose={() => setOpen(false)}>
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 md:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 bg-night/80 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <motion.div
                ref={cabinetRef}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="game-cabinet"
                // Width follows the game's own shape, so a tall game and a
                // wide one both fill the window without a letterbox
                style={{ width: `min(96vw, ${game.maxWidth}px, calc((100dvh - 96px) * ${game.ratio}))` }}
              >
                <div className="game-cabinet-controls">
                  {game.mute && (
                    <CabinetButton label={muted ? 'Unmute game audio' : 'Mute game audio'} onClick={toggleMute}>
                      <path d="M11.5 5.5 7.5 9H4.5v6h3l4 3.5z" />
                      {muted ? (
                        <>
                          <path d="M16 10l4 4" />
                          <path d="M20 10l-4 4" />
                        </>
                      ) : (
                        <>
                          <path d="M15.2 9.4a3.6 3.6 0 0 1 0 5.2" />
                          <path d="M17.9 6.9a7.2 7.2 0 0 1 0 10.2" />
                        </>
                      )}
                    </CabinetButton>
                  )}
                  <CabinetButton label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={toggleFullscreen}>
                    {fullscreen ? (
                      <>
                        <path d="M4.5 9.5H9V5" />
                        <path d="M19.5 9.5H15V5" />
                        <path d="M4.5 14.5H9V19" />
                        <path d="M19.5 14.5H15V19" />
                      </>
                    ) : (
                      <>
                        <path d="M9 4.5H4.5V9" />
                        <path d="M15 4.5h4.5V9" />
                        <path d="M9 19.5H4.5V15" />
                        <path d="M15 19.5h4.5V15" />
                      </>
                    )}
                  </CabinetButton>
                  <CabinetButton label="Close game" onClick={() => setOpen(false)}>
                    <path d="M6.75 6.75 17.25 17.25" />
                    <path d="M17.25 6.75 6.75 17.25" />
                  </CabinetButton>
                </div>
                <div className="game-cabinet-stage">
                  <iframe
                    ref={frameRef}
                    src={game.src}
                    title={game.title}
                    className="game-cabinet-frame"
                    style={{ aspectRatio: game.aspect }}
                    tabIndex={-1}
                    // Keys go to the game while it has focus, so the dialog
                    // never hears Escape. The game is same-origin: listen in it.
                    onLoad={() =>
                      frameRef.current?.contentWindow?.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') setOpen(false)
                      })
                    }
                  />
                </div>
              </motion.div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>
    </>
  )
}
