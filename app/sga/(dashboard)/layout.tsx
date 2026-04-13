'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from '@/app/sga/components/Sidebar'
import Topbar from '@/app/sga/components/Topbar'
import { useSession } from '@/lib/sga-session'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sga/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (loading || !user) return

    const adminOnlyRoutes = ['/sga/forms', '/sga/team']
    const isAdminOnlyRoute = adminOnlyRoutes.some((route) => pathname === route)

    if (isAdminOnlyRoute && user.role !== 'admin') {
      router.push('/sga')
    }
  }, [loading, user, pathname, router])

  // Add body class for cursor override
  useEffect(() => {
    document.body.classList.add('sga-dashboard')
    return () => {
      document.body.classList.remove('sga-dashboard')
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
