"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ContactModal from "@/components/ContactModal"

// Aperture shutter mark, drawn in ink with a safelight center
function ShutterMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <g stroke="#1b1813" strokeWidth="2.2" strokeLinecap="round">
        <line x1="27" y1="16" x2="15.44" y2="19.15" />
        <line x1="21.5" y1="25.53" x2="12.99" y2="17.09" />
        <line x1="10.5" y1="25.53" x2="13.55" y2="13.94" />
        <line x1="5" y1="16" x2="16.56" y2="12.85" />
        <line x1="10.5" y1="6.47" x2="19.01" y2="14.91" />
        <line x1="21.5" y1="6.47" x2="18.45" y2="18.06" />
      </g>
      <circle cx="16" cy="16" r="2" fill="#ff5e42" />
    </svg>
  )
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/moments", label: "Moments" },
  ]

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const openContact = () => {
    setIsOpen(false)
    setContactOpen(true)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between px-6 py-3 rounded-full w-full max-w-3xl mx-auto relative border border-[#1b1813]/15 bg-[#fbf9f4]/90 backdrop-blur shadow-[0_8px_24px_rgba(27,24,19,0.08)]">
          <div className="flex items-center">
            <Link
              href="/"
              prefetch={true}
              className="block w-8 h-8 mr-6 transition-transform duration-500 hover:rotate-45"
              aria-label="Home"
            >
              <ShutterMark className="w-8 h-8" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`text-sm transition-colors font-medium text-[#1b1813] hover:text-[#1b1813]/60 ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`))
                    ? 'underline underline-offset-8 decoration-1'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <button
            type="button"
            onClick={openContact}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-sm rounded-full transition-colors border border-[#1b1813] bg-[#1b1813] text-[#f5f2ea] hover:bg-black"
          >
            Connect
            <span className="text-xs">→</span>
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center active:scale-90 transition-transform" onClick={() => setIsOpen(!isOpen)} aria-label="Open menu">
            <Menu className="h-6 w-6 text-[#1b1813]" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[#16130e]/95 backdrop-blur-md z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="absolute top-6 right-6 p-2 active:scale-90 transition-transform"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-[#f5f2ea]" />
            </button>
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className="text-base text-[#f5f2ea] font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-6">
                <button
                  type="button"
                  onClick={openContact}
                  className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 text-base text-[#f5f2ea] rounded-full hover:bg-white/10 transition-all bg-white/5 border border-white/20"
                >
                  Connect
                  <span className="text-xs">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </nav>
  )
}
