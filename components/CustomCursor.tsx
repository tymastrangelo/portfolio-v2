'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const CURSOR_STORAGE_KEY = 'cursor-style'

const CURSOR_OPTIONS = [
  {
    id: 'orbit',
    name: 'Orbit Ring',
    description: 'Soft ring with glow and hover bloom.',
    className: 'cursor-orbit',
    previewClassName: 'cursor-preview-orbit',
  },
  {
    id: 'ember',
    name: 'Ember Dot',
    description: 'Tight dot with a warm halo.',
    className: 'cursor-ember',
    previewClassName: 'cursor-preview-ember',
  },
  {
    id: 'halo',
    name: 'Halo Pulse',
    description: 'Bright ring with a subtle pulse.',
    className: 'cursor-halo',
    previewClassName: 'cursor-preview-halo',
  },
  {
    id: 'glitch',
    name: 'Glitch Pixel',
    description: 'Pixel square with a neon outline.',
    className: 'cursor-glitch',
    previewClassName: 'cursor-preview-glitch',
  },
]

type CursorOptionId = (typeof CURSOR_OPTIONS)[number]['id']

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isCtaHover, setIsCtaHover] = useState(false)
  const [selectedCursor, setSelectedCursor] = useState<CursorOptionId>('orbit')
  const [tempCursor, setTempCursor] = useState<CursorOptionId>('orbit')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isPointerFine, setIsPointerFine] = useState(true)
  const hasPromptedRef = useRef(false)
  const closeTimeoutRef = useRef<number | null>(null)

  const selectedClassName = useMemo(() => {
    const activeCursor = isModalOpen ? tempCursor : selectedCursor
    return CURSOR_OPTIONS.find((option) => option.id === activeCursor)?.className ?? 'cursor-orbit'
  }, [isModalOpen, selectedCursor, tempCursor])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(CURSOR_STORAGE_KEY)
    if (stored && CURSOR_OPTIONS.some((option) => option.id === stored)) {
      setSelectedCursor(stored as CursorOptionId)
      setTempCursor(stored as CursorOptionId)
    }

    const pointerQuery = window.matchMedia('(pointer: fine)')
    const updatePointerState = () => setIsPointerFine(pointerQuery.matches)
    updatePointerState()

    const openSelector = () => {
      if (!isPointerFine) return
      setIsClosing(false)
      setTempCursor(selectedCursor)
      setIsModalOpen(true)
    }

    const handleGlobalClick = (event: MouseEvent) => {
      if (!isPointerFine) return
      if (isModalOpen) return
      if (window.localStorage.getItem(CURSOR_STORAGE_KEY)) return
      if (hasPromptedRef.current) return

      const target = event.target as HTMLElement | null
      if (target?.closest('[data-cursor-selector]')) return
      hasPromptedRef.current = true
      setIsClosing(false)
      setTempCursor(selectedCursor)
      setIsModalOpen(true)
    }

    const handleOpenEvent = () => openSelector()

    pointerQuery.addEventListener('change', updatePointerState)
    window.addEventListener('cursor-selector:open', handleOpenEvent)
    document.addEventListener('click', handleGlobalClick, true)

    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
      }
      pointerQuery.removeEventListener('change', updatePointerState)
      window.removeEventListener('cursor-selector:open', handleOpenEvent)
      document.removeEventListener('click', handleGlobalClick, true)
    }
  }, [isModalOpen, isPointerFine])

  useEffect(() => {
    if (!isPointerFine) return

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
  }, [isPointerFine])

  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  const handleCloseModal = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
    }
    setIsClosing(true)
    setTempCursor(selectedCursor)
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsModalOpen(false)
      setIsClosing(false)
    }, 220)
  }

  const handleSelectCursor = (id: CursorOptionId) => {
    setTempCursor(id)
  }

  const handleSaveCursor = () => {
    setSelectedCursor(tempCursor)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CURSOR_STORAGE_KEY, tempCursor)
    }
    handleCloseModal()
  }

  if (!isPointerFine) {
    return null
  }

  return (
    <>
      <div
        className={`custom-cursor ${selectedClassName} ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''} ${isCtaHover ? 'cta-hover' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      {isModalOpen && (
        <div
          className={`cursor-modal-backdrop ${isClosing ? 'cursor-modal-backdrop-exit' : ''}`}
          role="dialog"
          aria-modal="true"
        >
          <div className={`cursor-modal ${isClosing ? 'cursor-modal-exit' : ''}`} data-cursor-selector>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Cursor Lab</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                  Pick your cursor persona
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Choose once and it sticks. You can remix it anytime from the nav orb.
                </p>
              </div>
              <button
                type="button"
                className="cursor-modal-close"
                onClick={handleCloseModal}
                aria-label="Close cursor selector"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {CURSOR_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`cursor-option ${tempCursor === option.id ? 'cursor-option-active' : ''}`}
                  onClick={() => handleSelectCursor(option.id)}
                  data-cursor-selector
                >
                  <span className={`cursor-preview ${option.previewClassName}`} />
                  <span className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-900">{option.name}</span>
                    <span className="text-xs text-slate-500">{option.description}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span>Tip: hover links to see the new behavior.</span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="cursor-modal-secondary"
                  onClick={handleCloseModal}
                  data-cursor-selector
                >
                  Not now
                </button>
                <button
                  type="button"
                  className="cursor-modal-save"
                  onClick={handleSaveCursor}
                  data-cursor-selector
                >
                  Save cursor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
