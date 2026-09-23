"use client"

/* eslint-disable @next/next/no-img-element --
   The gallery measures frames itself and swaps CSS filters on the <img>. Images
   are already web-sized and next.config sets images.unoptimized, so next/image
   would add a wrapper and change nothing about what ships. */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FilmstripImage {
  src: string
  /** Real alt text: what is in the picture. It names the frame button and captions the print. */
  alt: string
  /** Shown under the strip for the frame in the gate, and under the print. */
  caption?: string
  /** CSS object-position for the crop, e.g. `"50% 35%"`. Needed whenever the
      source images are not all the frame's aspect ratio. */
  position?: string
}

export interface FilmstripGalleryProps extends Omit<React.ComponentProps<"section">, "children"> {
  images: FilmstripImage[]
  /** Frame in the gate at first paint. */
  defaultIndex?: number
  /** Controlled frame in the gate. */
  index?: number
  /** Called once per settled change, never per scroll frame. */
  onIndexChange?: (index: number) => void
  /** Width of one frame in CSS pixels. Height follows `aspect`. */
  frameWidth?: number
  /** CSS aspect ratio of a frame, e.g. `"3 / 2"`, `"1 / 1"`, `"4 / 5"`. */
  aspect?: string
  /** Show frames away from the gate as colour negatives. The signature; off = dimmed positives. */
  negative?: boolean
  /** Strength of the orange film mask on the negatives, 0–1. */
  mask?: number
  /**
   * Frames on each side of the gate that catch the light: shown as dimmed positives, so the visitor can
   * see what Next and Back will bring. `0` (the default) keeps every frame outside the gate a negative.
   */
  lit?: number
  /** The print comes up from paper white when it opens or changes. */
  develop?: boolean
  /** Text printed along the edge of the strip, the way film stock is. */
  film?: string
  /** Colour of the film base. A physical property, so it does not follow the theme. */
  stripColor?: string
  /** Colour of the edge printing, the sprocket rims and the gate light. Physical too: pale lab ink. */
  inkColor?: string
  /** Colour shown through the sprocket holes. Defaults to the site's paper. */
  holeColor?: string
  /** Show the caption and counter under the strip. */
  showCaption?: boolean
  /** Previous / next buttons. */
  showControls?: boolean
  /** Open the print (a native dialog) when the frame in the gate is clicked. */
  lightbox?: boolean
  /** Advance on its own every N ms. 0 (the default) leaves it still. Pauses on
      hover, on focus, while the print is open, and for reduced motion. */
  autoplay?: number
}

function useReducedMotion() {
  const subscribe = React.useCallback((notify: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    mq.addEventListener("change", notify)
    return () => mq.removeEventListener("change", notify)
  }, [])
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/** `"3 / 2"` → 1.5, so the image element can carry real `width`/`height` attributes. */
function ratioOf(aspect: string) {
  const [w, h] = aspect.split("/").map((v) => Number(v.trim()))
  return w && h ? w / h : 1.5
}

/**
 * Every look a frame can have is the same six functions in the same order, so the browser can
 * interpolate between any two of them. Two different filter lists do not animate — they snap.
 */
const look = (
  invert: number,
  sepia: number,
  saturate: number,
  hue: number,
  contrast: number,
  brightness: number
) =>
  `invert(${invert}) sepia(${sepia}) saturate(${saturate}) hue-rotate(${hue}deg) contrast(${contrast}) brightness(${brightness})`
const POSITIVE = look(0, 0, 1, 0, 1, 1)
const DIMMED = look(0, 0, 0.8, 0, 1, 0.72)

/** How long a programmatic scroll may take before the gate is committed wherever the strip stopped. */
const TRAVEL_LIMIT_MS = 1500

const STYLE_ID = "filmstrip-gallery-keyframes"
const KEYFRAMES = `@keyframes fsg-develop{from{opacity:1}to{opacity:0}}`

function useKeyframes() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement("style")
    style.id = STYLE_ID
    style.textContent = KEYFRAMES
    document.head.appendChild(style)
  }, [])
}

/** Sprocket holes: an SVG pattern of rounded rectangles that show the page through the strip. */
function Perforation({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("block h-4 w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width="22" height="16" patternUnits="userSpaceOnUse">
          <rect
            x="5"
            y="4"
            width="12"
            height="8"
            rx="2"
            /* Tailwind v4's --color-background does not exist in v3; the hole
               shows the page through the strip, so it takes the paper colour. */
            fill="var(--fsg-hole)"
            stroke="var(--fsg-ink)"
            strokeOpacity="0.28"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

const controlClass =
  "grid size-11 cursor-pointer place-items-center rounded-full border border-[#1b1813]/25 bg-transparent text-[#1b1813] transition-colors hover:border-[#1b1813] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5e42] disabled:cursor-default disabled:opacity-30"

interface Travel {
  target: number
  until: number
}

/**
 * Filmstrip Gallery — a horizontal gallery that scrolls like a strip of 35 mm negatives. The frame
 * that snaps into the gate develops into the positive image; every other frame stays a negative.
 * Click any frame to bring it to the gate, click the gate to open the print. Arrow keys move the
 * strip; the print is a native `<dialog>` with its own arrows and Escape.
 */
export function FilmstripGallery({
  images,
  defaultIndex = 0,
  index: controlledIndex,
  onIndexChange,
  frameWidth = 280,
  aspect = "3 / 2",
  negative = true,
  mask = 0.6,
  lit = 0,
  develop = true,
  film = "35MM · ISO 400 · 36 EXP",
  stripColor = "#241d14",
  inkColor = "#d9b779",
  holeColor = "#f5f2ea",
  showCaption = true,
  showControls = true,
  lightbox = true,
  autoplay = 0,
  className,
  style,
  "aria-label": ariaLabel = "Filmstrip gallery",
  ...rest
}: FilmstripGalleryProps) {
  useKeyframes()
  const reduce = useReducedMotion()
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const count = images.length
  const last = Math.max(0, count - 1)
  const [internalIndex, setInternalIndex] = React.useState(clamp(defaultIndex, 0, last))
  const active = clamp(controlledIndex ?? internalIndex, 0, last)
  const activeRef = React.useRef(active)
  const trackRef = React.useRef(null as HTMLUListElement | null)
  const frameRefs = React.useRef([] as (HTMLLIElement | null)[])
  const dialogRef = React.useRef(null as HTMLDialogElement | null)
  /** A programmatic scroll in flight: the gate waits for it to land. */
  const travel = React.useRef(null as Travel | null)
  const settleRef = React.useRef(() => {})
  const [open, setOpen] = React.useState(false)
  const [printIndex, setPrintIndex] = React.useState(active)
  const [printSeq, setPrintSeq] = React.useState(0)
  const [announced, setAnnounced] = React.useState("")
  /** Autoplay stops for good once the visitor takes the strip over. */
  const [paused, setPaused] = React.useState(false)
  const [taken, setTaken] = React.useState(false)

  // Callbacks and the latest index live in refs so the scroll engine never re-subscribes.
  const onIndexChangeRef = React.useRef(onIndexChange)
  const reported = React.useRef(active)
  React.useLayoutEffect(() => {
    onIndexChangeRef.current = onIndexChange
    activeRef.current = active
  })
  React.useEffect(() => {
    frameRefs.current.length = count
  }, [count])

  /** One settled change: state, one callback, one announcement. */
  const commit = React.useCallback(
    (next: number) => {
      const i = clamp(next, 0, last)
      if (controlledIndex === undefined) setInternalIndex(i)
      if (reported.current !== i) {
        reported.current = i
        onIndexChangeRef.current?.(i)
      }
    },
    [controlledIndex, last]
  )

  /** The frame the strip is heading to, or the one in the gate. */
  const intent = () => travel.current?.target ?? activeRef.current

  /**
   * Bring frame `i` into the gate. The look changes only once the strip has landed there (or has
   * stopped anywhere else). A scroll of zero distance fires no event, so it commits at once.
   */
  const goTo = React.useCallback(
    (i: number, behavior: ScrollBehavior = reduce ? "auto" : "smooth") => {
      const target = clamp(i, 0, last)
      const li = frameRefs.current[target]
      const track = trackRef.current
      if (!li || !track) return
      const left = li.offsetLeft - (track.clientWidth - li.offsetWidth) / 2
      if (Math.abs(track.scrollLeft - left) < 1) {
        travel.current = null
        commit(target)
        return
      }
      const until = performance.now() + TRAVEL_LIMIT_MS
      travel.current = { target, until }
      track.scrollTo({ left, behavior })
      // If the scroll stops short and stays quiet, land wherever the strip is.
      window.setTimeout(() => {
        if (travel.current?.target === target && travel.current.until === until) settleRef.current()
      }, TRAVEL_LIMIT_MS + 50)
    },
    [commit, last, reduce]
  )

  // Advances on its own, wrapping at the end. Refs feed it so the interval is
  // set once rather than re-created on every settled frame.
  React.useEffect(() => {
    if (!autoplay || reduce || paused || taken || open || count < 2) return
    const id = window.setInterval(() => {
      const next = activeRef.current >= last ? 0 : activeRef.current + 1
      goTo(next)
    }, autoplay)
    return () => window.clearInterval(id)
  }, [autoplay, reduce, paused, taken, open, count, last, goTo])

  // Land on the starting frame without animating, and again whenever the geometry changes.
  React.useLayoutEffect(() => {
    goTo(activeRef.current, "auto")
  }, [goTo, frameWidth, aspect, count])
  React.useEffect(() => {
    const track = trackRef.current
    if (!track || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => goTo(intent(), "auto"))
    ro.observe(track)
    return () => ro.disconnect()
  }, [goTo])

  // A controlled index that differs from the frame in the gate scrolls the strip.
  React.useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex !== reported.current) goTo(controlledIndex)
  }, [controlledIndex, goTo])

  // The strip has stopped: the frame nearest the centre is in the gate.
  React.useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let timer = 0
    const nearest = () => {
      const centre = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDistance = Infinity
      frameRefs.current.forEach((li, i) => {
        if (!li || !li.isConnected) return
        const d = Math.abs(li.offsetLeft + li.offsetWidth / 2 - centre)
        if (d < bestDistance) {
          bestDistance = d
          best = i
        }
      })
      return best
    }
    const settle = () => {
      window.clearTimeout(timer)
      timer = 0
      const here = nearest()
      const trip = travel.current
      // Still on the way to a requested frame: wait, unless the trip has taken too long.
      if (trip && here !== trip.target && performance.now() < trip.until) return
      travel.current = null
      commit(here)
    }
    settleRef.current = settle
    const onScroll = () => {
      // `scrollend` is the real signal; the timer covers browsers without it.
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, 140)
    }
    // The visitor taking over cancels any trip in flight, and stops autoplay
    // for good: once someone is driving, the strip should not fight them.
    const takeOver = () => {
      travel.current = null
      setTaken(true)
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    track.addEventListener("scrollend", settle)
    track.addEventListener("pointerdown", takeOver, { passive: true })
    track.addEventListener("wheel", takeOver, { passive: true })
    track.addEventListener("touchstart", takeOver, { passive: true })
    return () => {
      track.removeEventListener("scroll", onScroll)
      track.removeEventListener("scrollend", settle)
      track.removeEventListener("pointerdown", takeOver)
      track.removeEventListener("wheel", takeOver)
      track.removeEventListener("touchstart", takeOver)
      window.clearTimeout(timer)
    }
  }, [commit])

  // Announce the settled frame once, with its position.
  React.useEffect(() => {
    const image = images[active]
    if (!image) return
    setAnnounced(`${image.caption ?? image.alt}, ${active + 1} of ${count}`)
  }, [active, images, count])

  const focusFrame = (i: number) =>
    frameRefs.current[i]?.querySelector("button")?.focus({ preventScroll: true })

  /** Step from where the strip is heading, so quick repeated presses add up. */
  const step = (delta: number) => {
    const target = clamp(intent() + delta, 0, last)
    goTo(target)
    return target
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    let target: number | null = null
    if (event.key === "ArrowRight") target = step(1)
    else if (event.key === "ArrowLeft") target = step(-1)
    else if (event.key === "Home") target = step(-count)
    else if (event.key === "End") target = step(count)
    if (target === null) return
    event.preventDefault()
    focusFrame(target)
  }

  // --- the print (lightbox) ------------------------------------------------------------------
  const showPrint = (i: number) => {
    setPrintIndex(i)
    setPrintSeq((n) => n + 1)
  }
  const openPrint = (i: number) => {
    if (!lightbox) return
    showPrint(i)
    setOpen(true)
  }
  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const onDialogKey = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight" && printIndex < last) showPrint(printIndex + 1)
    if (event.key === "ArrowLeft" && printIndex > 0) showPrint(printIndex - 1)
  }

  const closePrint = () => {
    setOpen(false)
    goTo(printIndex, "auto")
    focusFrame(printIndex)
  }

  const strength = clamp(mask, 0, 1)
  const NEGATIVE = look(
    1,
    Number((0.3 + 0.45 * strength).toFixed(2)),
    Number((0.9 + 0.5 * strength).toFixed(2)),
    Math.round(-14 * strength),
    0.9,
    0.94
  )
  const reach = Math.max(0, Math.floor(lit))
  const lookFor = (distance: number) => {
    if (distance === 0) return POSITIVE
    if (!negative || distance <= reach) return DIMMED
    return NEGATIVE
  }
  const transition = reduce
    ? "none"
    : "filter 520ms cubic-bezier(.22,1,.36,1), transform 520ms cubic-bezier(.22,1,.36,1)"
  const ratio = ratioOf(aspect)
  const current = images[active]
  const print = images[printIndex] ?? current

  return (
    <section
      data-slot="filmstrip-gallery"
      aria-label={ariaLabel}
      className={cn("relative w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      style={
        {
          "--fsg-strip": stripColor,
          "--fsg-ink": inkColor,
          "--fsg-hole": holeColor,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {/* The strip: perforations, frames, perforations. */}
      <div
        className="relative w-full overflow-hidden"
        style={{ background: "var(--fsg-strip)", borderRadius: "var(--r-2, 7px)" }}
      >
        <Perforation id={`${uid}-top`} className="mt-1" />
        <ul
          ref={trackRef}
          role="list"
          aria-label="Frames"
          onKeyDown={onKeyDown}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-[50%] py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => {
            const distance = Math.abs(i - active)
            const inGate = distance === 0
            return (
              <li
                key={image.src + i}
                ref={(node) => {
                  frameRefs.current[i] = node
                }}
                data-slot="frame"
                data-active={inGate || undefined}
                className="relative shrink-0 snap-center"
                style={{ width: frameWidth }}
              >
                {/* Edge printing: frame number and stock, like the strip came back from the lab. */}
                <div
                  aria-hidden="true"
                  className="flex h-3 items-center justify-between px-0.5 font-mono text-[8px] uppercase tracking-[0.18em] opacity-70"
                  style={{ color: "var(--fsg-ink)" }}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate">{i % 3 === 0 ? film : ""}</span>
                  <span>{String(i + 1).padStart(2, "0")}A</span>
                </div>
                <button
                  type="button"
                  aria-label={inGate ? `${image.alt}. Open the print` : `Show ${image.alt}`}
                  aria-current={inGate ? "true" : undefined}
                  onClick={() => (inGate ? openPrint(i) : goTo(i))}
                  className={cn(
                    "relative block w-full cursor-pointer overflow-hidden rounded-[3px]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5e42]",
                    !inGate && "opacity-85 hover:opacity-100"
                  )}
                  style={{
                    aspectRatio: aspect,
                    transition: reduce ? "none" : "opacity 200ms ease-out",
                  }}
                >
                  <img
                    src={image.src}
                    alt=""
                    width={frameWidth}
                    height={Math.round(frameWidth / ratio)}
                    loading={distance <= 2 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="block h-full w-full object-cover"
                    style={{
                      filter: lookFor(distance),
                      objectPosition: image.position ?? "50% 50%",
                      transform: inGate ? "scale(1)" : "scale(0.97)",
                      transition,
                    }}
                  />
                  {/* The light through the gate. */}
                  {inGate ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[3px] opacity-70"
                      style={{ boxShadow: "inset 0 0 0 2px var(--fsg-ink)" }}
                    />
                  ) : null}
                </button>
                <div aria-hidden="true" className="h-3" />
              </li>
            )
          })}
        </ul>
        <Perforation id={`${uid}-bottom`} className="mb-1" />
        {/* The gate markers. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 h-1.5 w-px -translate-x-1/2"
          style={{ background: "var(--fsg-ink)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2"
          style={{ background: "var(--fsg-ink)" }}
        />
      </div>

      <span className="sr-only" aria-live="polite">
        {announced}
      </span>

      {showCaption || showControls ? (
        <div className="mt-4 flex items-center justify-between gap-4">
          {showCaption ? (
            <p className="min-w-0 text-sm text-pretty">
              <span style={{ color: "var(--ink)" }}>{current?.caption ?? current?.alt}</span>
              <span
                className="ml-3 font-mono text-xs tabular-nums"
                style={{ color: "var(--ink-soft)" }}
              >
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <span />
          )}
          {showControls ? (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                data-slot="prev"
                aria-label="Previous frame"
                disabled={active === 0}
                onClick={() => step(-1)}
                className={controlClass}
              >
                <Arrow dir="left" />
              </button>
              <button
                type="button"
                data-slot="next"
                aria-label="Next frame"
                disabled={active === last}
                onClick={() => step(1)}
                className={controlClass}
              >
                <Arrow dir="right" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The print: a native dialog, so focus, Escape and the backdrop come for free. */}
      {lightbox ? (
        <dialog
          ref={dialogRef}
          data-slot="print"
          aria-label={`${print?.caption ?? print?.alt ?? "Print"}, ${printIndex + 1} of ${count}`}
          onClose={closePrint}
          onKeyDown={onDialogKey}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
          className="m-auto max-h-[100dvh] max-w-[100vw] bg-transparent p-4 backdrop:bg-[#16130e]/92 backdrop:backdrop-blur-sm sm:p-8"
          style={{ color: "var(--ink)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={print?.src}
                alt={print?.alt ?? ""}
                className="max-h-[78dvh] max-w-full rounded-sm object-contain shadow-2xl"
                style={{ background: "var(--paper, #f5f2ea)" }}
              />
              {/* Paper white that clears as the print develops. */}
              {develop && !reduce ? (
                <span
                  key={printSeq}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-sm"
                  style={{
                    background: "var(--paper, #f5f2ea)",
                    animation: "fsg-develop 700ms cubic-bezier(.22,1,.36,1) both",
                  }}
                />
              ) : null}
            </div>
            <div className="flex w-full max-w-3xl items-center justify-between gap-4">
              <p className="min-w-0 text-sm text-pretty">
                <span style={{ color: "#f5f2ea" }}>{print?.caption ?? print?.alt}</span>
                <span
                  className="ml-3 font-mono text-xs tabular-nums"
                  style={{ color: "rgba(245,242,234,0.6)" }}
                >
                  {String(printIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous print"
                  disabled={printIndex === 0}
                  onClick={() => showPrint(printIndex - 1)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-[#f5f2ea]/30 text-[#f5f2ea] transition-colors hover:border-[#f5f2ea] disabled:opacity-25"
                >
                  <Arrow dir="left" />
                </button>
                <button
                  type="button"
                  aria-label="Next print"
                  disabled={printIndex === last}
                  onClick={() => showPrint(printIndex + 1)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-[#f5f2ea]/30 text-[#f5f2ea] transition-colors hover:border-[#f5f2ea] disabled:opacity-25"
                >
                  <Arrow dir="right" />
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="ml-2 grid size-11 cursor-pointer place-items-center rounded-full border border-[#f5f2ea]/30 text-[#f5f2ea] transition-colors hover:border-[#f5f2ea]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </dialog>
      ) : null}
    </section>
  )
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-4", dir === "left" && "rotate-180")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export default FilmstripGallery
