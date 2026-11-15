'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { House, Images, LayoutGrid, UserRound } from 'lucide-react'
import ContactModal from '@/components/ContactModal'

const links = [
  { href: '/', label: 'Home', icon: House },
  { href: '/projects', label: 'Projects', icon: LayoutGrid },
  { href: '/photos', label: 'Photos', icon: Images },
  { href: '/about', label: 'About', icon: UserRound },
]

// The aperture from the site icon, drawn in the nav's metal
function Aperture() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
      <line x1="27" y1="16" x2="15.44" y2="19.15" />
      <line x1="21.5" y1="25.53" x2="12.99" y2="17.09" />
      <line x1="10.5" y1="25.53" x2="13.55" y2="13.94" />
      <line x1="5" y1="16" x2="16.56" y2="12.85" />
      <line x1="10.5" y1="6.47" x2="19.01" y2="14.91" />
      <line x1="21.5" y1="6.47" x2="18.45" y2="18.06" />
    </svg>
  )
}

// The one nav (styles in app/site.css under Nav). On a wide screen the links
// sit in a glass channel in the middle; on a phone they move to a floating
// tab bar at the bottom. The raised pill behind the current page carries a
// view-transition-name, so it slides to the next link when the page changes.
export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const sayHi = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const current = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  // Only one of the two bars is ever displayed, so the shared names are unique
  // among what is on screen. The labels carry names too, so during a page
  // change they stay above the pill as it slides under them.
  const currentPill = <span className="nav-current" style={{ viewTransitionName: 'nav-current' }} aria-hidden />
  const labelName = (href: string) => ({ viewTransitionName: `nav-label-${href === '/' ? 'home' : href.slice(1)}` })

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <header className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="wrap nav-row">
          <Link href="/" className="nav-brand">
            <Aperture />
            <span className="nav-brand-text">Tyler Mastrangelo</span>
          </Link>

          <nav aria-label="Main" className="nav-pill glass-well">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="nav-item" aria-current={current(l.href) ? 'page' : undefined}>
                {current(l.href) && currentPill}
                <span className="nav-label" style={labelName(l.href)}>
                  {l.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="nav-cta glass-well">
            <button ref={sayHi} type="button" className="nav-cta-btn" onClick={() => setContactOpen(true)}>
              Say hi
            </button>
          </div>
        </div>
      </header>

      <nav aria-label="Main" className="tabbar glass-well">
        {links.map((l) => {
          const Icon = l.icon
          return (
            <Link key={l.href} href={l.href} className="tab-item" aria-current={current(l.href) ? 'page' : undefined}>
              {current(l.href) && currentPill}
              <span className="nav-label" style={labelName(l.href)}>
                <Icon aria-hidden />
                {l.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} fallbackFocus={sayHi} />
    </>
  )
}
