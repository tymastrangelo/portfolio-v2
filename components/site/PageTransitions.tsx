'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

type AppRouter = ReturnType<typeof useRouter>
type VTDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => { ready: Promise<void>; finished: Promise<void> }
}

// Resolved by <PageTransitions> once the new route has rendered and its
// shared photos are decoded, which is the moment the browser takes its
// "after" picture
let pending: (() => void) | null = null
// Opening an album zooms its cover into the album page; going back to /photos
// zooms the hero back into that album's tile, if the tile is on screen
let zoomBackTo: string | null = null
// Only the newest transition may clean up: a click mid-transition skips the
// running one, and its late callbacks must not wipe the new one's state
let current = 0

// The zoom name lives on at most one tile at a time. A tile keeps it after a
// zoom back lands; left there, the next tile clicked would share the name,
// and the browser cancels a transition with duplicate names.
function clearZoomNames() {
  document.querySelectorAll<HTMLElement>('[data-vt-zoom]').forEach((el) => {
    el.style.viewTransitionName = ''
  })
}

// The one name the album zoom uses, on both ends: the tile's cover (set at
// click time, so only the tapped one carries it) and the album page's hero
export const ALBUM_ZOOM = 'album-hero'

// Navigate inside a view transition. A normal page change: the old page sinks
// away and the new one materializes, its title first, and a project's photo
// travels between them. A zoom (data-vt-zoom on something inside the link):
// that element grows into its counterpart on the next page while everything
// else just fades, like opening an album in Photos. Text never travels.
// Falls back to a plain navigation without the API or with reduced motion.
export function transitionTo(router: AppRouter, href: string, zoomFrom?: HTMLElement | null) {
  const doc = document as VTDocument
  if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    router.push(href)
    return
  }

  const root = document.documentElement
  const id = ++current
  clearZoomNames()
  delete root.dataset.vt
  zoomBackTo = null
  const fromAlbum = location.pathname.match(/^\/photos\/([^/]+)$/)
  if (zoomFrom?.dataset.vtZoom) {
    // Only the tapped tile carries the name, so it is unique on the page
    zoomFrom.style.viewTransitionName = zoomFrom.dataset.vtZoom
    root.dataset.vt = 'zoom-open'
  } else if (fromAlbum && href === '/photos') {
    zoomBackTo = fromAlbum[1]
    root.dataset.vt = 'zoom-close'
  }

  let navigated = false
  const go = () => {
    if (navigated) return
    navigated = true
    router.push(href)
  }
  const done = () => {
    if (id !== current) return
    delete root.dataset.vt
    zoomBackTo = null
    clearZoomNames()
  }
  try {
    const vt = doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          pending = resolve
          go()
          // never hold the page hostage if the route takes a while
          setTimeout(resolve, 1500)
        })
    )
    // A second click mid-transition skips the first one; that's expected
    vt.ready.catch(done)
    vt.finished.then(done, done)
  } catch {
    done()
    // a transition that cannot start still navigates below
  }
  // If the browser skipped the transition without calling back, still go
  setTimeout(go, 250)
}

// Before the "after" picture: on the way back to /photos, give the album's
// tile the zoom name (only when it is on screen; flying to an off-screen tile
// looks wrong), then wait briefly for every shared photo to decode, so a photo
// never zooms or travels into an empty box
async function prepareArrival() {
  if (zoomBackTo) {
    const tile = document.querySelector<HTMLElement>(`[data-album="${zoomBackTo}"] [data-vt-zoom]`)
    const box = tile?.getBoundingClientRect()
    if (tile && box && box.bottom > 0 && box.top < innerHeight) tile.style.viewTransitionName = ALBUM_ZOOM
  }
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('.vt-media img, [data-vt-zoom] img'))
  await Promise.race([
    Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
    new Promise((r) => setTimeout(r, 350)),
  ])
}

// Mounted once in the root layout. Catches clicks on same-site links before
// next/link does, and runs them through transitionTo. Links that need to
// decide for themselves can opt out with data-vt-manual.
export default function PageTransitions() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!pending) return
    const resolve = pending
    pending = null
    prepareArrival().then(resolve)
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || !a.href || a.hasAttribute('data-vt-manual')) return
      if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname === location.pathname) return
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return // files and the games, not routes
      if (url.pathname.startsWith('/floor') || location.pathname.startsWith('/floor')) return // its own world
      e.preventDefault()
      transitionTo(router, url.pathname + url.search + url.hash, a.querySelector<HTMLElement>('[data-vt-zoom]'))
    }
    window.addEventListener('click', onClick, true)
    return () => window.removeEventListener('click', onClick, true)
  }, [router])

  return null
}
