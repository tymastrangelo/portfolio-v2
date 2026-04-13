import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('sga-session')
  return Response.json({ success: true })
}
