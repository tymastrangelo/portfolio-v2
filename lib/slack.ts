import type { ContentRequest, Task } from '@/app/sga/types'

/**
 * Slack notification helpers for SGA dashboard events
 */

interface SlackMessage {
  channel?: string
  text?: string
  blocks?: Array<Record<string, unknown>>
}

async function sendToSlack(webhookUrl: string, message: SlackMessage): Promise<void> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Slack webhook error:', response.status, err)
      throw new Error(`Slack API error: ${response.status} ${err}`)
    }

    console.log('Slack message sent successfully')
  } catch (error) {
    console.error('Failed to send Slack message:', error)
    throw error
  }
}

function formatFieldValue(value: unknown): string {
  if (typeof value === 'string') return value.trim() || 'Not provided'
  if (Array.isArray(value)) {
    const items = (value as unknown[]).map((v) => formatFieldValue(v))
    return items.length > 0 ? items.join(', ') : 'Not provided'
  }
  if (value === undefined || value === null || value === '') return 'Not provided'
  return String(value)
}

export async function notifyContentRequest(
  request: ContentRequest,
  webhookUrl: string
): Promise<void> {
  if (!webhookUrl) {
    console.warn('Slack webhook URL not set, skipping notification')
    return
  }

  const timestamp = Math.floor(new Date(request.submitted_date).getTime() / 1000)

  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📝 New Content Request Submitted',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Requestor:*\n${request.requestor_name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${request.requestor_email}`,
          },
          {
            type: 'mrkdwn',
            text: `*Role:*\n${formatFieldValue(request.requestor_role)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Organization:*\n${formatFieldValue(request.organization_name)}`,
          },
        ],
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Content Goal:*\n${formatFieldValue(request.content_goal)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Content Types:*\n${formatFieldValue(request.requested_content_types)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Event Topic:*\n${formatFieldValue(request.event_topic)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Hard Deadline:*\n${formatFieldValue(request.hard_deadline)}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description:*\n${formatFieldValue(request.description)}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🕐 Submitted on <!date^${timestamp}^{date_num} {time_secs}|${request.submitted_date}>`,
          },
        ],
      },
    ],
  }

  await sendToSlack(webhookUrl, message)
}

export async function notifyTask(
  task: Task,
  webhookUrl: string,
  createdByName?: string
): Promise<void> {
  if (!webhookUrl) {
    console.warn('Slack webhook URL not set, skipping task notification')
    return
  }

  const timestamp = Math.floor(new Date(task.created_at).getTime() / 1000)

  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '✅ New Task Created',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Task:*\n${task.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Created By:*\n${createdByName || task.created_by}`,
          },
          {
            type: 'mrkdwn',
            text: `*Assigned To:*\n${task.assigned_to.join(', ')}`,
          },
          {
            type: 'mrkdwn',
            text: `*Due Date:*\n${task.due_date}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description:*\n${formatFieldValue(task.description)}`,
        },
      },
      ...(task.content_request_id
        ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Linked Request:*\n${task.content_request_id}`,
              },
            },
          ]
        : []),
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🕐 Created on <!date^${timestamp}^{date_num} {time_secs}|${task.created_at}>`,
          },
        ],
      },
    ],
  }

  await sendToSlack(webhookUrl, message)
}

export async function notifyTaskUpdated(
  task: Task,
  webhookUrl: string,
  updatedByName?: string
): Promise<void> {
  if (!webhookUrl) {
    console.warn('Slack webhook URL not set, skipping task update notification')
    return
  }

  const timestamp = Math.floor(new Date(task.updated_at || new Date().toISOString()).getTime() / 1000)

  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '✏️ Task Updated',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Task:*\n${task.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Updated By:*\n${updatedByName || 'Unknown'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Assigned To:*\n${task.assigned_to.join(', ')}`,
          },
          {
            type: 'mrkdwn',
            text: `*Status:*\n${task.status.replace('_', ' ')}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🕐 Updated on <!date^${timestamp}^{date_num} {time_secs}|${task.updated_at}>`,
          },
        ],
      },
    ],
  }

  await sendToSlack(webhookUrl, message)
}
