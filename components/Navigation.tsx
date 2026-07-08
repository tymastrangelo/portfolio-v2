"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ContactModal from "@/components/ContactModal"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const pathname = usePathname()

  // Only enable scroll behavior on home page
  const isHomePage = pathname === '/'
  // Force white background on non-home pages
  const shouldBeWhite = !isHomePage || isScrolled

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/moments", label: "Moments" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      // Consider scrolled if past 100px from top
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        <div className={`flex items-center justify-between px-6 py-3 rounded-full w-full max-w-3xl mx-auto relative border transition-all duration-300 ${
          shouldBeWhite
            ? 'bg-white shadow-lg border-border'
            : 'bg-primary/5 backdrop-blur-md border-border'
        }`}>
        <div className="flex items-center">
          <Link
            href="/"
            prefetch={true}
            className="block w-8 h-8 mr-6 transition-transform duration-300 hover:rotate-12"
            aria-label="Home"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="url(#paint0_linear)" />
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF9966" />
                  <stop offset="1" stopColor="#FF5E62" />
                </linearGradient>
              </defs>
            </svg>
          </Link>
        </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`text-sm transition-colors font-medium ${
                  shouldBeWhite ? 'text-gray-900 hover:text-gray-500' : 'text-white hover:text-white/80'
                } ${pathname === link.href ? 'underline underline-offset-8 decoration-1' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

        {/* Desktop CTA Button */}
        <button
          type="button"
          onClick={openContact}
          className={`hidden md:inline-flex items-center gap-2 px-5 py-2 text-sm rounded-full transition-all border ${
            shouldBeWhite
              ? 'text-white bg-black hover:bg-gray-800 border-black'
              : 'text-white bg-white/5 hover:bg-white/10 border-white/20'
          }`}
        >
          Connect
          <span className="text-xs">→</span>
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center active:scale-90 transition-transform" onClick={toggleMenu} aria-label="Open menu">
          <Menu className={`h-6 w-6 ${shouldBeWhite ? 'text-gray-900' : 'text-white'}`} />
        </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="absolute top-6 right-6 p-2 active:scale-90 transition-transform"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className="text-base text-white font-medium"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-6">
                <button
                  type="button"
                  onClick={openContact}
                  className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 text-base text-white rounded-full hover:bg-white/10 transition-all bg-white/5 border border-white/20"
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
