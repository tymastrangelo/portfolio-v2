import { type NextRequest, NextResponse } from 'next/server'
import { getFormBySlug } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface RouteParams {
  params: {
    slug: string
  }
}

/**
 * GET /api/forms/[slug] - Get form by slug (public endpoint)
 * Used to render public form pages
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params
    const form = await getFormBySlug(slug)

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Only return active forms publicly
    if (!form.is_active) {
      return NextResponse.json(
        { error: 'This form is not accepting responses' },
        { status: 403 }
      )
    }

    return NextResponse.json(form, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 })
  }
}
