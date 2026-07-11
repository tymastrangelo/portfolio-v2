'use client'

import { usePathname } from 'next/navigation'

// The opening half of the shutter cycle. Keyed to the pathname so the blades
// remount (and replay their open animation) on EVERY route change, including
// same-segment ones like /projects -> /projects/[slug], where a root
// template.tsx would not remount and the blades would stay closed.
export default function ShutterBlades() {
  const pathname = usePathname()
  return (
    <div key={pathname} aria-hidden>
      <div className="shutter-blade shutter-top" />
      <div className="shutter-blade shutter-bottom" />
    </div>
  )
}
