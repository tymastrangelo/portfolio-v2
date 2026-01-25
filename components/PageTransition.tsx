'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState, useRef } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    // Only animate if pathname actually changed
    if (prevPathname.current !== pathname) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsAnimating(false)
      }, 150)
      prevPathname.current = pathname
      return () => clearTimeout(timer)
    } else {
      // If pathname didn't change, just update children immediately
      setDisplayChildren(children)
    }
  }, [pathname, children])

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isAnimating ? 0 : 1 }}
      transition={{
        duration: 0.15,
        ease: 'easeInOut',
      }}
    >
      {displayChildren}
    </motion.div>
  )
}
