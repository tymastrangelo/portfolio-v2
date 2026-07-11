'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

// Makes the shutter transition two-sided: intercepts internal link clicks,
// snaps the blades closed over the outgoing page (see filmy.css), then
// navigates under cover. ShutterBlades opens them again on route change.
// Runs in capture phase so it beats next/link's own click handler.
export default function ShutterNavigator() {
  const router = useRouter()
  const pathname = usePathname()
  const navigating = useRef(false)

  useEffect(() => {
    navigating.current = false
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element | null)?.closest?.('a')
      if (!anchor) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('/') || href.includes('#')) return
      // Same-pathname navigations (incl. query-only changes) would never
      // remount ShutterBlades, so the blades would close and stay closed.
      if (href.split('?')[0] === window.location.pathname) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const blades = document.querySelectorAll('.shutter-blade')
      if (blades.length === 0) return

      e.preventDefault()
      e.stopPropagation()
      if (navigating.current) return
      navigating.current = true
      blades.forEach((blade) => blade.classList.add('shutter-close'))
      window.setTimeout(() => router.push(href), 130)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [router])

  return null
}
