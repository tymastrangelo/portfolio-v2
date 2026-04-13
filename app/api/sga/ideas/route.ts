import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createIdea,
  deleteIdea,
  getIdeaById,
  getIdeas,
  updateIdea,
} from '@/lib/google-sheets'
import type { IdeaCategory, IdeaStatus } from '@/app/sga/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('sga-session')
  if (!sessionCookie?.value) return null

  try {
    return JSON.parse(sessionCookie.value) as {
      username: string
      role: 'admin' | 'team'
      name: string
    }
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const ideas = await getIdeas(false)
    return NextResponse.json(ideas, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()

    if (!body.idea_text || !String(body.idea_text).trim()) {
      return NextResponse.json({ error: 'Idea text is required' }, { status: 400 })
    }

    const idea = await createIdea({
      idea_text: String(body.idea_text).trim(),
      category: (body.category || 'one-off') as IdeaCategory,
      submitted_by: session.username,
      status: 'new',
    })

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const id = body.id as string | undefined

    if (!id) {
      return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 })
    }

    const existing = await getIdeaById(id)
    if (!existing || existing.archived) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    const updated = await updateIdea(id, {
      idea_text: body.idea_text,
      category: body.category as IdeaCategory | undefined,
      status: body.status as IdeaStatus | undefined,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating idea:', error)
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 })
    }

    const existing = await getIdeaById(id)
    if (!existing || existing.archived) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    // Only admins can delete other users' ideas. Members can only delete their own.
    if (session.role !== 'admin' && existing.submitted_by !== session.username) {
      return NextResponse.json({ error: 'You can only delete your own ideas' }, { status: 403 })
    }

    await deleteIdea(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json({ error: 'Failed to delete idea' }, { status: 500 })
  }
}
