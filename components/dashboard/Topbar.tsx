'use client'

import { SessionUser } from '@/lib/sga-session'

interface TopbarProps {
  user: SessionUser | null
  onMenuToggle: () => void
}

export default function Topbar({ user, onMenuToggle }: TopbarProps) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">SGA Communications Dashboard</h1>
            <p className="text-xs text-slate-500">Team workflow and requests</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
