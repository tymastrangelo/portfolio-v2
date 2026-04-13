import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createTeamMember,
  getTeamMembers,
  transferAssignedRequests,
  updateTeamMemberByUsername,
} from '@/lib/google-sheets'
import type { TeamMember } from '@/app/sga/types'

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

function sanitizeMember(member: TeamMember, includeSecrets = false) {
  return {
    ...member,
    password: includeSecrets ? member.password : '',
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const includeSecrets = searchParams.get('includeSecrets') === '1' && session.role === 'admin'

    const members = await getTeamMembers(false)
    return NextResponse.json(members.map((member) => sanitizeMember(member, includeSecrets)), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
  } catch (error) {
    console.error('Error loading team members:', error)
    return NextResponse.json({ error: 'Failed to load team members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const phone = String(body.phone || '').trim()
    const username = String(body.username || '').trim()
    const password = String(body.password || '').trim()
    const roles = Array.isArray(body.roles) ? body.roles : []
    const userRole = body.userRole === 'admin' ? 'admin' : 'team'

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const created = await createTeamMember({
      name,
      email,
      phone,
      username,
      password,
      roles,
      userRole,
    })

    return NextResponse.json(sanitizeMember(created), { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create team member' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const username = String(body.username || '').trim()

    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 })
    }

    const updated = await updateTeamMemberByUsername(username, {
      name: typeof body.name === 'string' ? body.name : undefined,
      email: typeof body.email === 'string' ? body.email : undefined,
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      password: typeof body.password === 'string' && body.password.length > 0 ? body.password : undefined,
      roles: Array.isArray(body.roles) ? body.roles : undefined,
      active: typeof body.active === 'boolean' ? body.active : undefined,
      userRole: body.userRole === 'admin' || body.userRole === 'team' ? body.userRole : undefined,
    })

    return NextResponse.json(sanitizeMember(updated))
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const username = String(body.username || '').trim()
    const transferTo = String(body.transferTo || '').trim()

    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 })
    }

    await updateTeamMemberByUsername(username, { active: false })
    await transferAssignedRequests(username, transferTo)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to remove team member' }, { status: 500 })
  }
}
