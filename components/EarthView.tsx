'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Halftone globe for the Moments page, adapted from a d3-geo orthographic
// canvas sketch. Two things changed from the original:
//
//  1. The land geometry and the halftone dots are precomputed and served from
//     public/data instead of being fetched from GitHub and re-derived with a
//     point-in-polygon scan on every mount.
//  2. d3-geo is imported dynamically, so none of this reaches a visitor who
//     never opens the Earth view. The Moments page still costs nothing by
//     default, which was the whole point of the canister design.
//
// Marker coordinates are ROLL level and hand-written (see app/moments/page.tsx).
// Photo EXIF is stripped in the pipeline on purpose, and plotting it here would
// undo that: the home roll would put a pin on a house rather than a town.

export type GlobeMarker = {
  id: string
  label: string
  /** [longitude, latitude], town level on purpose */
  coords: [number, number]
}

type Props = {
  markers: GlobeMarker[]
  onSelect: (id: string) => void
}

const PAPER = '#f5f2ea'
const INK = '#1b1813'
const DOT = 'rgba(27, 24, 19, 0.28)'
const CORAL = '#ff5e42'

export default function EarthView({ markers, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  // Kept in refs so the animation loop never restarts on a React re-render
  const rotationRef = useRef<[number, number]>([-20, -15])
  const zoomRef = useRef(1)
  const autoRotateRef = useRef(true)
  const flightRef = useRef<{
    from: [number, number]
    to: [number, number]
    fromZoom: number
    toZoom: number
    start: number
    id: string
  } | null>(null)

  const hoveredRef = useRef<string | null>(null)
  hoveredRef.current = hovered

  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  const markersRef = useRef(markers)
  markersRef.current = markers

  // Markers live on a sphere, so half of them are behind it at any moment.
  // geoDistance against the point currently facing the camera decides which.
  const facing = useCallback((rot: [number, number]): [number, number] => {
    return [-rot[0], -rot[1]]
  }, [])

  useEffect(() => {
    let disposed = false
    let stop: (() => void) | undefined

    async function boot() {
      try {
        const [{ geoOrthographic, geoPath, geoGraticule10, geoDistance }, land, dots] =
          await Promise.all([
            import('d3-geo'),
            fetch('/data/land.json').then((r) => {
              if (!r.ok) throw new Error('land')
              return r.json()
            }),
            fetch('/data/land-dots.json').then((r) => {
              if (!r.ok) throw new Error('dots')
              return r.json()
            }) as Promise<[number, number][]>,
          ])

        if (disposed) return
        const canvas = canvasRef.current
        const wrap = wrapRef.current
        if (!canvas || !wrap) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let w = 0
        let h = 0
        let baseRadius = 0
        const MIN_ZOOM = 1
        const MAX_ZOOM = 5
        const projection = geoOrthographic().clipAngle(90)
        const path = geoPath(projection, ctx)
        const graticule = geoGraticule10()

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          w = wrap.clientWidth
          h = wrap.clientHeight
          baseRadius = Math.min(w, h) / 2.35
          canvas.width = w * dpr
          canvas.height = h * dpr
          canvas.style.width = `${w}px`
          canvas.style.height = `${h}px`
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          projection.translate([w / 2, h / 2])
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(wrap)

        const markerScreen = new Map<string, { x: number; y: number }>()

        const draw = () => {
          const radius = baseRadius * zoomRef.current
          projection.rotate(rotationRef.current).scale(radius)
          ctx.clearRect(0, 0, w, h)

          // Sphere: paper, so the globe belongs to the page rather than sitting
          // on it as a black disc
          ctx.beginPath()
          ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2)
          ctx.fillStyle = PAPER
          ctx.fill()
          ctx.strokeStyle = 'rgba(27, 24, 19, 0.35)'
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.save()
          ctx.beginPath()
          ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2)
          ctx.clip()

          // Graticule, very faint
          ctx.beginPath()
          path(graticule)
          ctx.strokeStyle = 'rgba(27, 24, 19, 0.10)'
          ctx.lineWidth = 0.6
          ctx.stroke()

          // Halftone land
          const center = facing(rotationRef.current)
          ctx.fillStyle = DOT
          for (let i = 0; i < dots.length; i++) {
            const d = dots[i]
            if (geoDistance(d, center) > Math.PI / 2) continue
            const p = projection(d)
            if (!p) continue
            ctx.beginPath()
            ctx.arc(p[0], p[1], 1.15 * Math.min(zoomRef.current, 2.2), 0, Math.PI * 2)
            ctx.fill()
          }

          // Coastlines over the dots
          ctx.beginPath()
          path(land)
          ctx.strokeStyle = 'rgba(27, 24, 19, 0.5)'
          ctx.lineWidth = 0.7 * Math.min(zoomRef.current, 2.2)
          ctx.stroke()
          ctx.restore()

          // Markers, only the ones on this side of the sphere
          markerScreen.clear()
          const t = performance.now() / 1000
          for (const m of markersRef.current) {
            if (geoDistance(m.coords, center) > Math.PI / 2) continue
            const p = projection(m.coords)
            if (!p) continue
            markerScreen.set(m.id, { x: p[0], y: p[1] })

            const isHot = hoveredRef.current === m.id
            // Slow pulse so a pin reads as live without strobing
            const pulse = 0.5 + 0.5 * Math.sin(t * 2 + p[0] * 0.05)

            ctx.beginPath()
            ctx.arc(p[0], p[1], 6 + pulse * 7, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 94, 66, ${0.22 * (1 - pulse)})`
            ctx.fill()

            ctx.beginPath()
            ctx.arc(p[0], p[1], isHot ? 5.5 : 4, 0, Math.PI * 2)
            ctx.fillStyle = CORAL
            ctx.fill()
            ctx.strokeStyle = PAPER
            ctx.lineWidth = 1.5
            ctx.stroke()

            if (isHot) {
              ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace'
              ctx.fillStyle = INK
              ctx.textAlign = 'center'
              ctx.fillText(m.label.toUpperCase(), p[0], p[1] - 16)
            }
          }
        }

        // Flight: ease the rotation so the chosen pin turns to face the camera
        const EASE = (x: number) => 1 - Math.pow(1 - x, 3)
        const FLIGHT_MS = 900

        const frame = () => {
          const flight = flightRef.current
          if (flight) {
            const k = Math.min(1, (performance.now() - flight.start) / FLIGHT_MS)
            const e = EASE(k)
            rotationRef.current = [
              flight.from[0] + (flight.to[0] - flight.from[0]) * e,
              flight.from[1] + (flight.to[1] - flight.from[1]) * e,
            ]
            zoomRef.current = flight.fromZoom + (flight.toZoom - flight.fromZoom) * e
            if (k >= 1) {
              flightRef.current = null
              onSelectRef.current(flight.id)
              // leave auto-rotation off until the modal closes and the user drags
              autoRotateRef.current = false
            }
          } else if (autoRotateRef.current) {
            rotationRef.current = [rotationRef.current[0] + 0.12, rotationRef.current[1]]
          }
          draw()
          raf = requestAnimationFrame(frame)
        }
        let raf = requestAnimationFrame(frame)

        // --- interaction -----------------------------------------------------
        const hit = (ev: PointerEvent) => {
          const r = canvas.getBoundingClientRect()
          const x = ev.clientX - r.left
          const y = ev.clientY - r.top
          // forEach rather than for..of: the tsconfig target predates
          // downlevelIteration for Map entries
          let found: string | null = null
          markerScreen.forEach((p, id) => {
            if (found === null && Math.hypot(p.x - x, p.y - y) < 14) found = id
          })
          return found
        }

        let dragging = false
        let moved = false
        let sx = 0
        let sy = 0
        let srot: [number, number] = [0, 0]

        const onDown = (ev: PointerEvent) => {
          pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY })
          if (pointers.size === 2) {
            pinchFrom = pinchDistance()
            pinchZoom = zoomRef.current
            dragging = false
            return
          }
          dragging = true
          moved = false
          sx = ev.clientX
          sy = ev.clientY
          srot = [...rotationRef.current] as [number, number]
          autoRotateRef.current = false
          canvas.setPointerCapture(ev.pointerId)
        }

        const onMove = (ev: PointerEvent) => {
          if (pointers.has(ev.pointerId)) {
            pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY })
          }
          if (pointers.size === 2 && pinchFrom > 0) {
            const d = pinchDistance()
            if (d > 0) {
              zoomRef.current = Math.min(
                MAX_ZOOM,
                Math.max(MIN_ZOOM, pinchZoom * (d / pinchFrom))
              )
            }
            return
          }
          if (dragging) {
            const dx = ev.clientX - sx
            const dy = ev.clientY - sy
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true
            rotationRef.current = [
              srot[0] + dx * 0.32,
              Math.max(-80, Math.min(80, srot[1] - dy * 0.32)),
            ]
            return
          }
          const id = hit(ev)
          setHovered(id)
          canvas.style.cursor = id ? 'pointer' : 'grab'
        }

        const onUp = (ev: PointerEvent) => {
          pointers.delete(ev.pointerId)
          if (pointers.size < 2) pinchFrom = 0
          const wasDragging = dragging
          dragging = false
          if (wasDragging && !moved) {
            const id = hit(ev)
            if (id) {
              const m = markersRef.current.find((x) => x.id === id)
              if (m) {
                flightRef.current = {
                  from: [...rotationRef.current] as [number, number],
                  to: [-m.coords[0], -m.coords[1]],
                  fromZoom: zoomRef.current,
                  // Fly in as it turns, so the pin arrives magnified
                  toZoom: Math.max(zoomRef.current, 2.4),
                  start: performance.now(),
                  id,
                }
                return
              }
            }
          }
          if (!flightRef.current) autoRotateRef.current = true
        }

        const onWheel = (ev: WheelEvent) => {
          ev.preventDefault()
          autoRotateRef.current = false

          // deltaY is not in the same units everywhere: 0 is pixels, 1 is
          // lines (a mouse wheel notch, roughly 16px), 2 is pages. Normalising
          // first is why a mouse wheel felt almost dead compared to a trackpad.
          const unit = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? 400 : 1
          // Clamped tight: a mouse notch reports deltaY 100 while a trackpad
          // reports 2-10 many times a second. Without a low ceiling one notch
          // crosses most of the zoom range while the trackpad feels dead.
          const delta = Math.max(-50, Math.min(50, ev.deltaY * unit))

          const factor = Math.exp(-delta * 0.005)
          zoomRef.current = Math.min(
            MAX_ZOOM,
            Math.max(MIN_ZOOM, zoomRef.current * factor)
          )
        }

        // Pinch on trackpads and touch screens
        let pinchFrom = 0
        let pinchZoom = 1
        const pointers = new Map<number, { x: number; y: number }>()
        const pinchDistance = () => {
          const pts = Array.from(pointers.values())
          if (pts.length < 2) return 0
          return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        }

        const onDoubleClick = () => {
          flightRef.current = null
          zoomRef.current = 1
          autoRotateRef.current = true
        }

        canvas.addEventListener('dblclick', onDoubleClick)
        canvas.addEventListener('wheel', onWheel, { passive: false })
        canvas.addEventListener('pointerdown', onDown)
        canvas.addEventListener('pointermove', onMove)
        canvas.addEventListener('pointerup', onUp)
        canvas.addEventListener('pointerleave', () => setHovered(null))
        canvas.style.cursor = 'grab'

        setReady(true)
        stop = () => {
          cancelAnimationFrame(raf)
          ro.disconnect()
          canvas.removeEventListener('dblclick', onDoubleClick)
          canvas.removeEventListener('wheel', onWheel)
          canvas.removeEventListener('pointerdown', onDown)
          canvas.removeEventListener('pointermove', onMove)
          canvas.removeEventListener('pointerup', onUp)
        }
      } catch {
        if (!disposed) setError('Could not load the map data.')
      }
    }

    boot()
    return () => {
      disposed = true
      stop?.()
    }
  }, [facing])

  return (
    <div ref={wrapRef} className="earth-stage">
      <canvas ref={canvasRef} aria-hidden />

      {!ready && !error && <p className="earth-note">Loading the map…</p>}
      {error && <p className="earth-note">{error}</p>}

      {/* The globe is a canvas, so these are the accessible way in */}
      <ul className="earth-fallback">
        {markers.map((m) => (
          <li key={m.id}>
            <button type="button" onClick={() => onSelect(m.id)}>
              Open the {m.label} roll
            </button>
          </li>
        ))}
      </ul>

      {ready && !error && (
        <p className="earth-hint" aria-hidden>
          Drag to spin · Scroll to zoom · Double click to reset · Tap a pin to open the roll
        </p>
      )}
    </div>
  )
}
