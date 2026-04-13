import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByAssignee,
  getTeamMemberByUsername,
} from '@/lib/google-sheets'
import { notifyTask, notifyTaskUpdated } from '@/lib/slack'
import type { Task } from '@/app/sga/types'

export const dynamic = 'force-dynamic'

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

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('id')
    const assignee = searchParams.get('assignee')
    const includeCompleted = searchParams.get('includeCompleted') === '1'

    if (taskId) {
      const task = await getTaskById(taskId)
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
      return NextResponse.json(task)
    }

    if (assignee) {
      const tasks = await getTasksByAssignee(assignee, includeCompleted)
      return NextResponse.json(tasks)
    }

    // List all tasks (admin only)
    if (session.role !== 'admin') {
      const tasks = await getTasksByAssignee(session.username, includeCompleted)
      return NextResponse.json(tasks)
    }

    const tasks = await getTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin only' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.due_date || !body.assigned_to || body.assigned_to.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name, due_date, assigned_to' },
        { status: 400 }
      )
    }

    const task = await createTask({
      name: body.name,
      description: body.description || '',
      created_by: session.username,
      due_date: body.due_date,
      assigned_to: body.assigned_to,
      content_request_id: body.content_request_id || undefined,
      status: 'pending',
      archived: false,
    })

    // Send Slack notification
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL
      if (webhookUrl) {
        const creatorMember = await getTeamMemberByUsername(session.username)
        await notifyTask(task, webhookUrl, creatorMember?.name)
      }
    } catch (slackError) {
      console.error('Error sending Slack notification for task:', slackError)
      // Don't fail the request if Slack notification fails
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // Verify user is admin or assigned to the task
    const task = await getTaskById(id)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (
      session.role !== 'admin' &&
      !task.assigned_to.includes(session.username)
    ) {
      return NextResponse.json(
        { error: 'Unauthorized - can only update own tasks' },
        { status: 403 }
      )
    }

    const updated = await updateTask(id, updates)

    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL
      if (webhookUrl) {
        const updaterMember = await getTeamMemberByUsername(session.username)
        await notifyTaskUpdated(updated, webhookUrl, updaterMember?.name || session.name)
      }
    } catch (slackError) {
      console.error('Error sending Slack notification for task update:', slackError)
      // Do not fail request if Slack fails
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin only' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    await deleteTask(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
