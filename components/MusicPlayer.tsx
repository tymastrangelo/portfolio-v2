'use client'

import { useEffect, useRef, useState } from 'react'

// Corner music player. Lives in the root layout so the <audio> element never
// unmounts and the song keeps playing across page navigations. Files come
// from public/music, named "Title (Artist).mp3"; the layout reads the folder
// at build time and passes the list in. The bar opens on hover (click works
// for touch) and closes when the pointer leaves.

const PAPER = '#f5f2ea'
const CORAL = '#ff5e42'

const mono: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
}

const voice: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: 'italic',
  letterSpacing: '-0.01em',
}

function parseTrack(file: string) {
  const base = file.replace(/\.mp3$/i, '')
  const m = base.match(/^(.*?)\s*\((.+)\)$/)
  return { title: m ? m[1] : base, artist: m ? m[2] : '' }
}

export default function MusicPlayer({ files }: { files: string[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
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

  const iconBtn =
    'p-1.5 transition-colors text-[#f5f2ea]/75 hover:text-[#ff5e42] focus:outline-none'

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

      <div className="fixed bottom-5 right-5 z-[80] hidden md:flex flex-col items-end gap-3">
        {/* First-visit offer */}
        {prompt && (
          <div
            className="music-pop w-[230px] border p-4 shadow-lg"
            style={{
              background: PAPER,
              borderColor: 'rgba(27, 24, 19, 0.18)',
              borderRadius: 'var(--r-4)',
            }}
          >
            <p className="text-[15px] leading-snug" style={{ ...voice, color: '#1b1813' }}>
              if you want music while you look around, here&apos;s a few of my favorites.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => {
                  markSeen()
                  setPlaying(true)
                }}
                className="rounded-full px-4 py-1.5 text-xs font-medium transition-opacity hover:opacity-85"
                style={{ background: '#16130e', color: PAPER }}
              >
                play
              </button>
              <button
                onClick={markSeen}
                className="underline underline-offset-4 transition-colors hover:text-[#1b1813]"
                style={{ ...mono, color: '#6e685c' }}
              >
                not now
              </button>
            </div>
          </div>
        )}

        {/* Hover opens the bar, leaving closes it; click covers touch.
            Hidden until the first-visit offer has been answered. */}
        {answered && (
        <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          {open ? (
            <div
              className="music-pop glass-dark flex w-[340px] items-center gap-3 px-3 py-2.5"
              style={{ borderRadius: 'var(--r-4)' }}
            >
              <span className={`music-vinyl ${playing ? '' : 'is-paused'}`} aria-hidden />

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[13px] font-semibold leading-tight" style={{ color: PAPER }}>
                  {title}
                </p>
                {artist && (
                  <p className="truncate text-[11px]" style={{ ...voice, color: 'rgba(245, 242, 234, 0.65)' }}>
                    {artist}
                  </p>
                )}
                {/* The rail is 2px; the target around it is not. */}
                <div
                  className="-mt-0.5 -mb-2 cursor-pointer py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5e42]"
                  onClick={seek}
                  onKeyDown={seekKeys}
                  role="slider"
                  tabIndex={0}
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={Math.floor(dur)}
                  aria-valuenow={Math.floor(time)}
                >
                  <div
                    className="h-[2px] w-full rounded-full"
                    style={{ background: 'rgba(245, 242, 234, 0.18)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ background: CORAL, width: dur ? `${(time / dur) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <button onClick={() => skip(-1)} aria-label="Previous song" className={iconBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M11.5 12 20 6v12l-8.5-6Z" />
                    <path d="M3.5 12 12 6v12l-8.5-6Z" />
                  </svg>
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="mx-0.5 flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:border-[#ff5e42]"
                  style={{ borderColor: 'rgba(245, 242, 234, 0.3)', color: PAPER }}
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
                <button onClick={() => skip(1)} aria-label="Next song" className={iconBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12.5 12 4 18V6l8.5 6Z" />
                    <path d="M20.5 12 12 18V6l8.5 6Z" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                markSeen()
                setOpen(true)
              }}
              aria-label="Open music player"
              className="music-pop glass-dark flex h-11 w-11 items-center justify-center rounded-full hover:scale-105"
            >
              {playing ? (
                <span className="music-eq" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill={CORAL} aria-hidden>
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              )}
            </button>
          )}
        </div>
        )}
      </div>
    </>
  )
}
