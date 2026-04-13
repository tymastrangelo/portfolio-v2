import { cookies } from 'next/headers'
import { dashboardUsers } from '@/app/sga/data'
import { getTeamMembers } from '@/lib/google-sheets'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return Response.json({ error: 'Username and password required' }, { status: 400 })
    }

    let user = null as null | {
      username: string
      password: string
      role: 'admin' | 'team'
      name: string
    }

    try {
      const members = await getTeamMembers(true)
      const matchedMember = members.find(
        (m) => m.active && m.username === username && m.password === password
      )

      if (matchedMember) {
        user = {
          username: matchedMember.username,
          password: matchedMember.password,
          role: matchedMember.userRole,
          name: matchedMember.name,
        }
      }
    } catch (error) {
      // Fall back to seed users if TeamMembers sheet is unavailable.
      console.warn('Team member auth lookup failed, using seed users fallback')
    }

    // Fall back to bootstrap admin credentials from environment variables
    if (!user) {
      const bootstrapUsername = process.env.SGA_BOOTSTRAP_USERNAME
      const bootstrapPassword = process.env.SGA_BOOTSTRAP_PASSWORD
      const bootstrapName = process.env.SGA_BOOTSTRAP_NAME || 'Admin'

      if (
        bootstrapUsername &&
        bootstrapPassword &&
        username === bootstrapUsername &&
        password === bootstrapPassword
      ) {
        user = {
          username: bootstrapUsername,
          password: bootstrapPassword,
          role: 'admin',
          name: bootstrapName,
        }
      }
    }

    // Fallback to hardcoded array (kept for backwards compatibility)
    if (!user) {
      user =
        dashboardUsers.find((u) => u.username === username && u.password === password) ?? null
    }

    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Set secure session cookie
    const cookieStore = await cookies()
    cookieStore.set('sga-session', JSON.stringify({ username: user.username, role: user.role, name: user.name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
