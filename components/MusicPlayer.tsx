'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

// Corner music player. Lives in the root layout so the <audio> element never
// unmounts and the song keeps playing across page navigations. Files come
// from public/music, named "Title (Artist).mp3"; the layout reads the folder
// at build time and passes the list in. The bar opens on hover or on a click
// (which puts the keyboard on Play), and closes when the pointer or the focus
// leaves it.

// Apple's default for UI that isn't thrown: critically damped, no overshoot
const spring = { type: 'spring', bounce: 0, duration: 0.4 } as const
// Glass materializes rather than fades: it sharpens, grows and rises into
// place, and leaves the way it came (motion/react drops the movement under
// reduced motion and keeps the fade)
const materialize = {
  initial: { opacity: 0, scale: 0.92, y: 14, filter: 'blur(8px)' },
  // filter goes back to none once it lands: any filter, even blur(0px), makes
  // a backdrop root and the glass inside would stop frosting the page
  animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  exit: { opacity: 0, scale: 0.92, y: 14, filter: 'blur(8px)' },
}
// The bar's contents swap while the glass changes shape around them
const swap = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  exit: { opacity: 0, filter: 'blur(4px)' },
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function parseTrack(file: string) {
  const base = file.replace(/\.mp3$/i, '')
  const m = base.match(/^(.*?)\s*\((.+)\)$/)
  return { title: m ? m[1] : base, artist: m ? m[2] : '' }
}

export default function MusicPlayer({ files }: { files: string[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playRef = useRef<HTMLButtonElement>(null)
  // Set when the bar is opened by a click or key, so focus can follow it in.
  // A hover open leaves focus where it was.
  const focusOnOpen = useRef(false)
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState(false)
  // null until sessionStorage is checked; the player stays hidden meanwhile
  const [answered, setAnswered] = useState<boolean | null>(null)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)

  // First visit this session: the offer shows in place of the player until
  // they pick play or not now.
  useEffect(() => {
    if (files.length === 0) return
    if (sessionStorage.getItem('music-prompt-seen')) {
      setAnswered(true)
      return
    }
    setAnswered(false)
    const t = setTimeout(() => setPrompt(true), 1500)
    return () => clearTimeout(t)
  }, [files.length])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) a.play().catch(() => setPlaying(false))
    else a.pause()
  }, [playing, idx])

  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false
      playRef.current?.focus()
    }
  }, [open])

  if (files.length === 0) return null

  const { title, artist } = parseTrack(files[idx])

  const markSeen = () => {
    setPrompt(false)
    setAnswered(true)
    sessionStorage.setItem('music-prompt-seen', '1')
  }

  const skip = (dir: number) => {
    setIdx((i) => (i + dir + files.length) % files.length)
    setTime(0)
    setDur(0)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current
    if (!a || !dur) return
    const r = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - r.left) / r.width
    a.currentTime = Math.min(dur, Math.max(0, ratio * dur))
  }

  // A slider you cannot reach from the keyboard is not a slider
  const seekKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const a = audioRef.current
    if (!a || !dur) return
    const step = e.shiftKey ? 10 : 5
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      a.currentTime = Math.min(dur, a.currentTime + step)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      a.currentTime = Math.max(0, a.currentTime - step)
    } else if (e.key === 'Home') {
      e.preventDefault()
      a.currentTime = 0
    }
  }

  const iconBtn = 'p-1.5 transition-colors text-mist hover:text-white'

  return (
    <>
      <audio
        ref={audioRef}
        src={`/music/${encodeURIComponent(files[idx])}`}
        preload="none"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onEnded={() => skip(1)}
      />

      {/* z-60: above the page and nav, below every dialog */}
      <div className="player fixed bottom-5 right-5 z-[60] hidden md:flex flex-col items-end gap-3">
        {/* First-visit offer */}
        <AnimatePresence>
          {prompt && (
            <motion.div
              key="offer"
              {...materialize}
              transition={spring}
              style={{ transformOrigin: 'bottom right' }}
              className="music-pop player-glass w-[260px] rounded-[22px] p-4"
            >
              <p className="text-[15px] leading-snug">
                If you want music while you look around, here are a few of my favorites.
              </p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    markSeen()
                    setPlaying(true)
                  }}
                  className="button is-small"
                >
                  Play
                </button>
                <button type="button" onClick={markSeen} className="link text-sm text-mist">
                  Not now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover opens the bar, leaving closes it; click covers touch.
            Hidden until the first-visit offer has been answered. One piece of
            glass changes shape between the round button and the bar, anchored
            to the corner, while what is inside it cross-fades. */}
        <AnimatePresence>
          {answered && (
            <motion.div
              key="player"
              {...materialize}
              transition={spring}
              style={{ transformOrigin: 'bottom right' }}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
              }}
            >
              <motion.div
                layout
                transition={spring}
                style={{ borderRadius: open ? 26 : 22 }}
                className={`player-glass overflow-hidden ${open ? 'w-[320px]' : 'h-11 w-11'}`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {open ? (
                    <motion.div
                      key="bar"
                      {...swap}
                      transition={spring}
                      className="flex w-[320px] items-center gap-3 py-2 pl-5 pr-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold leading-tight">{title}</p>
                        {artist && <p className="truncate text-xs text-mist">{artist}</p>}
                        {/* The rail is 2px; the target around it is not. */}
                        <div
                          className="-mt-0.5 -mb-2 cursor-pointer py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                          onClick={seek}
                          onKeyDown={seekKeys}
                          role="slider"
                          tabIndex={0}
                          aria-label="Seek"
                          aria-valuemin={0}
                          aria-valuemax={Math.floor(dur)}
                          aria-valuenow={Math.floor(time)}
                          aria-valuetext={`${clock(time)} of ${clock(dur)}`}
                        >
                          <div className="h-[2px] w-full rounded-full" style={{ background: 'rgba(245, 245, 247, 0.18)' }}>
                            <div
                              className="h-full rounded-full"
                              style={{ background: 'var(--white)', width: dur ? `${(time / dur) * 100}%` : '0%' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <button type="button" onClick={() => skip(-1)} aria-label="Previous song" className={iconBtn}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M11.5 12 20 6v12l-8.5-6Z" />
                            <path d="M3.5 12 12 6v12l-8.5-6Z" />
                          </svg>
                        </button>
                        <button
                          ref={playRef}
                          type="button"
                          onClick={() => setPlaying((p) => !p)}
                          aria-label={playing ? 'Pause' : 'Play'}
                          className="glass mx-0.5 flex h-9 w-9 items-center justify-center rounded-full"
                        >
                          {playing ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <rect x="6" y="5" width="4" height="14" rx="1" />
                              <rect x="14" y="5" width="4" height="14" rx="1" />
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                            </svg>
                          )}
                        </button>
                        <button type="button" onClick={() => skip(1)} aria-label="Next song" className={iconBtn}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M12.5 12 4 18V6l8.5 6Z" />
                            <path d="M20.5 12 12 18V6l8.5 6Z" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="button"
                      {...swap}
                      transition={spring}
                      type="button"
                      onClick={() => {
                        markSeen()
                        focusOnOpen.current = true
                        setOpen(true)
                      }}
                      aria-label="Open music player"
                      className="flex h-11 w-11 items-center justify-center"
                    >
                      {playing ? (
                        <span className="music-eq" aria-hidden>
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                        </svg>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
