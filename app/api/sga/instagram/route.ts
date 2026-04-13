import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getInstagramAnalyticsSnapshot } from '@/lib/instagram'
import { dashboardSettings } from '@/app/sga/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getSessionRole(): Promise<'admin' | 'team' | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('sga-session')
  if (!sessionCookie?.value) return null

  try {
    const session = JSON.parse(sessionCookie.value)
    if (session?.role === 'admin' || session?.role === 'team') return session.role
    return null
  } catch {
    return null
  }
}

export async function GET() {
  const role = await getSessionRole()
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const snapshot = await getInstagramAnalyticsSnapshot()
    return NextResponse.json(
      {
        ...snapshot,
        source: 'instagram',
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Failed to fetch Instagram analytics:', error)

    return NextResponse.json(
      {
        ...dashboardSettings.analytics,
        source: 'fallback',
        warning: 'Using fallback analytics values because Instagram API call failed.',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  }
}
