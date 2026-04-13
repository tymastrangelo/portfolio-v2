import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('sga-session')

    if (!session?.value) {
      return Response.json({ user: null })
    }

    const user = JSON.parse(session.value)
    return Response.json({ user })
  } catch (error) {
    return Response.json({ user: null })
  }
}
