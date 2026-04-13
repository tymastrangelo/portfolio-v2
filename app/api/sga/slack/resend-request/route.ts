import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getContentRequestsFromFormSlug } from '@/lib/google-sheets'
import { notifyContentRequest } from '@/lib/slack'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const CONTENT_REQUEST_FORM_SLUG = process.env.CONTENT_REQUEST_FORM_SLUG || 'sga-content-request'
const SLACK_CONTENT_REQUEST_CHANNEL_URL = process.env.SLACK_CONTENT_REQUEST_CHANNEL_URL

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

export async function POST() {
  const role = await getSessionRole()
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  if (!SLACK_CONTENT_REQUEST_CHANNEL_URL) {
    return NextResponse.json(
      { error: 'Slack webhook not configured' },
      { status: 500 }
    )
  }

  try {
    const requests = await getContentRequestsFromFormSlug(CONTENT_REQUEST_FORM_SLUG)

    if (requests.length === 0) {
      return NextResponse.json(
        { error: 'No content requests found' },
        { status: 404 }
      )
    }

    const mostRecent = requests[0]
    console.log('Resending to Slack:', {
      requestId: mostRecent.id,
      requestor: mostRecent.requestor_name,
      goal: mostRecent.content_goal,
      types: mostRecent.requested_content_types,
    })

    await notifyContentRequest(mostRecent, SLACK_CONTENT_REQUEST_CHANNEL_URL)

    return NextResponse.json({
      success: true,
      message: 'Slack notification resent',
      request_id: mostRecent.id,
      requestor: mostRecent.requestor_name,
      submitted: mostRecent.submitted_date,
      debugInfo: {
        contentGoal: mostRecent.content_goal,
        contentTypes: mostRecent.requested_content_types,
        organization: mostRecent.organization_name,
        deadline: mostRecent.hard_deadline,
      },
    })
  } catch (error) {
    console.error('Error resending Slack notification:', error)
    return NextResponse.json(
      { 
        error: 'Failed to resend Slack notification',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  const role = await getSessionRole()
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const requests = await getContentRequestsFromFormSlug(CONTENT_REQUEST_FORM_SLUG)

    if (requests.length === 0) {
      return NextResponse.json({
        info: 'No content requests to resend',
        instructions: 'Submit a content request form first at /forms/sga-content-request',
      })
    }

    const mostRecent = requests[0]
    return NextResponse.json({
      info: 'To resend the most recent request to Slack, POST to this endpoint',
      mostRecent: {
        id: mostRecent.id,
        requestor: mostRecent.requestor_name,
        submitted: mostRecent.submitted_date,
        contentGoal: mostRecent.content_goal,
        contentTypes: mostRecent.requested_content_types,
      },
      instructions: {
        browser: 'Use curl or a tool like Postman to POST to this endpoint',
        curl: 'curl -X POST http://localhost:3000/api/sga/slack/resend-request',
      },
    })
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
