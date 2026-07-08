'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

// next/image that fades in once loaded, so images never pop/glitch in.
// The parent container keeps its gradient background until the image is ready.
export default function FadeImage({ className = '', ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt comes through props
    <Image
      {...props}
      ref={(img) => {
        // Handle images already complete before hydration (onLoad won't fire)
        if (img?.complete) setLoaded(true)
      }}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-500 ease-out ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}
