'use client'

import { CSSProperties } from 'react'

interface PlaceholderProps {
  aspectRatio?: string
  gradient?: string
  className?: string
  animate?: boolean
}

export default function Placeholder({
  aspectRatio = '16/9',
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  className = '',
  animate = true,
}: PlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className} ${
        animate ? 'gradient-placeholder' : ''
      }`}
      style={
        {
          aspectRatio,
          background: gradient,
        } as CSSProperties
      }
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}
