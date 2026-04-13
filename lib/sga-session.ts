'use client'

import { useEffect, useState } from 'react'

export interface SessionUser {
  username: string
  role: 'admin' | 'team'
  name: string
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/sga/auth/session')
        const data = await res.json()
        setUser(data.user)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const logout = async () => {
    await fetch('/api/sga/auth/logout', { method: 'POST' })
    setUser(null)
    // Redirect is handled by the component
  }

  return { user, loading, logout }
}
