'use client'

import { useEffect, useRef, useState } from 'react'

// A muted clip that loops like a live photo. There is no autoplay attribute:
// the markup is the same on the server and the client, and play() is only
// called after the browser says motion is fine. With reduced motion the clip
// holds on its first frame and, unless it sits inside a link or a button
// (`nested`), shows controls so it can still be played on purpose.
export default function LoopVideo({
  src,
  label,
  poster,
  nested = false,
  className = 'absolute inset-0 h-full w-full object-cover',
}: {
  src: string
  label: string
  poster?: string
  /** inside an <a> or <button>: never show controls (no controls inside controls) */
  nested?: boolean
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      const video = ref.current
      setStill(query.matches)
      if (!video) return
      if (query.matches) video.pause()
      else video.play().catch(() => {})
    }
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      controls={still && !nested}
      preload="metadata"
      disablePictureInPicture
      controlsList="nodownload noplaybackrate noremoteplayback"
      className={className}
    />
  )
}
