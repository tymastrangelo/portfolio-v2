import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getForms, createForm } from '@/lib/google-sheets'

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
 * GET /api/sga/forms - List all forms (admin only)
 * POST /api/sga/forms - Create new form (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const role = await getUserRole()
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const forms = await getForms()
    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const role = await getUserRole()
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, slug, fields_json, created_by } = body

    if (!name || !slug || !fields_json) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, fields_json' },
        { status: 400 }
      )
    }

    // Validate slug format (alphanumeric, hyphens, underscores, lowercase)
    const slugRegex = /^[a-z0-9_-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use lowercase letters, numbers, hyphens, underscores.' },
        { status: 400 }
      )
    }

    const form = await createForm({
      name,
      description: description || '',
      slug,
      fields_json,
      created_by: created_by || 'admin',
    })

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 })
  }
}
