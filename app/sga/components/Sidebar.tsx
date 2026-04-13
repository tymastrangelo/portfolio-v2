'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SessionUser } from '@/lib/sga-session'

interface SidebarProps {
  user: SessionUser | null
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    { href: '/sga', label: 'Dashboard' },
    ...(user?.role === 'admin' ? [{ href: '/sga/requests', label: 'Content Requests' }] : []),
    { href: '/sga/tasks', label: 'Tasks' },
    { href: '/sga/calendar', label: 'Calendar' },
    ...(user?.role === 'admin' ? [{ href: '/sga/team', label: 'Team' }] : []),
    { href: '/sga/ideas', label: 'Ideas Bank' },
    ...(user?.role === 'admin' ? [{ href: '/sga/forms', label: 'Forms' }] : []),
    { href: '/sga/analytics', label: 'Analytics' },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await fetch('/api/sga/auth/logout', { method: 'POST' })
    router.push('/sga/login')
  }

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50 transform transition-transform md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold">SGA Comms</h2>
          <p className="text-xs text-slate-400 mt-1">Communications Hub</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block px-4 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white text-sm font-medium rounded-lg transition"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}
