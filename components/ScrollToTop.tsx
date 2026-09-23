'use client'

import { useEffect } from 'react'

// Browsers restore your scroll position on reload. On a page whose sections
// reveal on scroll, that means a refresh lands you mid-page with every reveal
// below already fired and settled, so the animations look broken or absent.
//
// Mounted once in the root layout, so this runs on load and not on route
// changes: the App Router handles those itself.
export default function ScrollToTop() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  return null
}
