import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getFormById, updateForm, deleteForm } from '@/lib/google-sheets'

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
 * GET /api/sga/forms/[id] - Get single form (admin only)
 * PATCH /api/sga/forms/[id] - Update form (admin only)
 * DELETE /api/sga/forms/[id] - Delete form (admin only)
 */

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const role = await getUserRole()
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    const form = await getFormById(id)

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const role = await getUserRole()
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()

    const form = await updateForm(id, body)

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const role = await getUserRole()
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params
    await deleteForm(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 })
  }
}
