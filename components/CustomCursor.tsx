'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isCtaHover, setIsCtaHover] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList?.contains('cursor-hover')
      ) {
        setIsHovering(true)
      }

      // Specific CTA detection - check if target is an Element first
      if (target instanceof Element) {
        const closestLink = (target.closest('a') || target) as HTMLElement
        if (closestLink?.id === 'get-in-touch-cta') {
          setIsCtaHover(true)
        }
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList?.contains('cursor-hover')
      ) {
        setIsHovering(false)
      }

      // Specific CTA detection - check if target is an Element first
      if (target instanceof Element) {
        const closestLink = (target.closest('a') || target) as HTMLElement
        if (closestLink?.id === 'get-in-touch-cta') {
          setIsCtaHover(false)
        }
      }
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''} ${isCtaHover ? 'cta-hover' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  )
}
