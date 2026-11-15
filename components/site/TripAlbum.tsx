'use client'

import Image from 'next/image'
import { useState } from 'react'
import Lightbox from '@/components/site/Lightbox'
import LoopVideo from '@/components/site/LoopVideo'
import type { Frame } from '@/lib/photos'

// A trip as an album: every frame at its own shape in staggered columns, no
// captions. Any frame opens the lightbox, which pages through the rest.
export default function TripAlbum({ frames }: { frames: Frame[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <div className="album-grid">
        {frames.map((frame, i) => (
          <button
            key={frame.src}
            type="button"
            className="album-frame"
            style={{ aspectRatio: frame.ar }}
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1}: ${frame.alt}`}
          >
            {frame.video ? (
              <LoopVideo src={frame.src} label={frame.alt} nested />
            ) : (
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                priority={i < 4}
                draggable={false}
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>
      <Lightbox frames={frames} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  )
}
