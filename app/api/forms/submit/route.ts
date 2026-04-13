import { type NextRequest, NextResponse } from 'next/server'
import { submitFormResponse, getFormBySlug, getContentRequestsFromFormSlug } from '@/lib/google-sheets'
import { notifyContentRequest } from '@/lib/slack'

/**
 * POST /api/forms/submit - Public form submission endpoint
 * This is accessible without authentication
 */

const CONTENT_REQUEST_FORM_SLUG = process.env.CONTENT_REQUEST_FORM_SLUG || 'sga-content-request'
const SLACK_CONTENT_REQUEST_CHANNEL_URL = process.env.SLACK_CONTENT_REQUEST_CHANNEL_URL

export async function POST(request: NextRequest) {
  try {
    // Only allow POST
    if (request.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }

    const body = await request.json()
    const { form_id, response_data, submitter_name, submitter_email } = body

    if (!form_id || !response_data) {
      return NextResponse.json(
        { error: 'Missing required fields: form_id, response_data' },
        { status: 400 }
      )
    }

    // Get client IP address
    const ip_address =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Get user agent
    const user_agent = request.headers.get('user-agent') || 'unknown'

    // Validate response_data is valid JSON
    let parsedData
    try {
      parsedData =
        typeof response_data === 'string' ? JSON.parse(response_data) : response_data
    } catch {
      return NextResponse.json(
        { error: 'Invalid response_data format. Must be valid JSON.' },
        { status: 400 }
      )
    }

    const response = await submitFormResponse({
      form_id,
      response_data: JSON.stringify(parsedData),
      submitter_name,
      submitter_email,
      ip_address,
      user_agent,
    })

    // Notify Slack if this is a content request form
    if (SLACK_CONTENT_REQUEST_CHANNEL_URL) {
      try {
        const form = await getFormBySlug(CONTENT_REQUEST_FORM_SLUG)
        if (form && form.id === form_id) {
          console.log('Processing content request for Slack notification...')
          // Fetch the newly created request using the same parsing logic as the dashboard
          const requests = await getContentRequestsFromFormSlug(CONTENT_REQUEST_FORM_SLUG)
          const newestRequest = requests[0] // Already sorted by submitted_date descending

          if (newestRequest) {
            console.log('Sending to Slack:', {
              id: newestRequest.id,
              requestor: newestRequest.requestor_name,
              goal: newestRequest.content_goal,
            })
            await notifyContentRequest(newestRequest, SLACK_CONTENT_REQUEST_CHANNEL_URL)
            console.log('Slack notification sent successfully')
          } else {
            console.warn('No request found after submission')
          }
        } else {
          console.log('Form ID mismatch or form not found, skipping Slack')
        }
      } catch (slackError) {
        console.error('Failed to send Slack notification:', slackError)
        // Don't fail the form submission if Slack notification fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully',
        response_id: response.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}

// Only allow POST, reject GET and other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
