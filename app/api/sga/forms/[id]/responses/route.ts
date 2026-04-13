import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getFormResponses, deleteFormResponse } from '@/lib/google-sheets'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * Helper to extract user role from session cookie
 */
async function getUserRole(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('sga-session')

  if (!sessionCookie?.value) return null

  try {
    const sessionData = JSON.parse(sessionCookie.value)
    return sessionData.role || null
  } catch {
    return null
  }
}

/**
 * GET /api/sga/forms/[id]/responses - Get all responses for a form (admin only)
 * DELETE /api/sga/forms/[id]/responses - Delete specific response (admin only)
 */

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const role = await getUserRole()
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    const responses = await getFormResponses(id)
    return NextResponse.json(responses)
  } catch (error) {
    console.error('Error fetching form responses:', error)
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const role = await getUserRole()
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const responseId = searchParams.get('responseId')

    if (!responseId) {
      return NextResponse.json(
        { error: 'Missing responseId query parameter' },
        { status: 400 }
      )
    }

    await deleteFormResponse(responseId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting form response:', error)
    return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 })
  }
}
