import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getContentRequestsFromFormSlug, updateContentRequestMeta } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const CONTENT_REQUEST_FORM_SLUG = process.env.CONTENT_REQUEST_FORM_SLUG || 'sga-content-request'

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
  try {
    const role = await getSessionRole()
    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const requests = await getContentRequestsFromFormSlug(CONTENT_REQUEST_FORM_SLUG)
    return NextResponse.json(requests, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching content requests:', error)
    return NextResponse.json({ error: 'Failed to fetch content requests' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const role = await getSessionRole()
    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body as {
      id?: string
      status?: string
      priority?: string
      assigned_to?: string
      approval_status?: string
      archived?: boolean
      vp_notes?: string
      draft_link?: string
      posted_date?: string
      post_link?: string
      additional_notes?: string
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing request id' }, { status: 400 })
    }

    await updateContentRequestMeta(id, updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating content request:', error)
    return NextResponse.json({ error: 'Failed to update content request' }, { status: 500 })
  }
}
