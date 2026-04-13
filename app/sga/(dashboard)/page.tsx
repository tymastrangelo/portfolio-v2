'use client'

import { useEffect, useState } from 'react'
import { dashboardSettings } from '@/app/sga/data'
import { useSession } from '@/lib/sga-session'
import type { ContentRequest, TeamMember, Task } from '@/app/sga/types'
import TaskDetailModal from '@/app/sga/components/TaskDetailModal'

export default function DashboardHome() {
  const { user } = useSession()
  const [requests, setRequests] = useState<ContentRequest[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedRequest, setSelectedRequest] = useState<(ContentRequest & { type: 'request' }) | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/sga/requests', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as ContentRequest[]
        setRequests(data)
      } catch (error) {
        console.error('Failed to load requests for dashboard:', error)
      }
    }

    load()

    const loadTeam = async () => {
      try {
        const res = await fetch('/api/sga/team', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as TeamMember[]
        setTeamMembers(data)
      } catch (error) {
        console.error('Failed to load team members for dashboard:', error)
      }
    }

    loadTeam()

    const loadTasks = async () => {
      try {
        const res = await fetch('/api/sga/tasks', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as Task[]
        setTasks(data)
      } catch (error) {
        console.error('Failed to load tasks for dashboard:', error)
      }
    }

    loadTasks()
  }, [])

  const activeRequests = requests.filter((r) => !r.archived)

  // For team members, show only their assigned requests
  // For admins, show all requests
  const relevantRequests = user?.role === 'admin' 
    ? activeRequests 
    : activeRequests.filter((r) => r.assigned_to === user?.username)

  // For team members, show only their assigned tasks
  // For admins, show all tasks
  const relevantTasks = user?.role === 'admin'
    ? tasks.filter((t) => !t.archived && t.status !== 'completed')
    : tasks.filter((t) => t.assigned_to.includes(user?.username || '') && !t.archived && t.status !== 'completed')

  // Count statistics based on user role
  const submittedCount = relevantRequests.filter((r) => r.status === 'submitted').length
  const inProgressCount = relevantRequests.filter((r) => r.status === 'in_progress').length
  const approvedCount = relevantRequests.filter((r) => r.status === 'approved').length
  const postedCount = relevantRequests.filter((r) => r.status === 'posted').length

  // Upcoming deadlines - merge tasks and requests
  type DeadlineItem = 
    | ({ type: 'request' } & ContentRequest)
    | ({ type: 'task' } & Task)

  const now = new Date()
  const upcomingDeadlines: DeadlineItem[] = [
    ...relevantRequests
      .filter((r) => !r.archived && r.status !== 'posted')
      .map((r) => ({ ...r, type: 'request' as const })),
    ...relevantTasks.map((t) => ({ ...t, type: 'task' as const })),
  ]
    .sort((a, b) => {
      const dateA = new Date(a.type === 'request' ? a.posting_deadline : a.due_date).getTime()
      const dateB = new Date(b.type === 'request' ? b.posting_deadline : b.due_date).getTime()
      return dateA - dateB
    })
    .slice(0, 5)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Communications team overview and quick stats</p>
      </div>

      {/* Stats Grid (admin only) */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Submitted"
            value={submittedCount}
            color="bg-slate-100 text-slate-700"
            icon="📬"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            color="bg-yellow-100 text-yellow-700"
            icon="⚙️"
          />
          <StatCard label="Approved" value={approvedCount} color="bg-green-100 text-green-700" icon="✅" />
          <StatCard label="Posted" value={postedCount} color="bg-blue-100 text-blue-700" icon="📤" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AnalyticsCard
          label="Total Followers"
          value={dashboardSettings.analytics.totalFollowers.toLocaleString()}
          icon="👥"
        />
        <AnalyticsCard
          label="Weekly Engagement"
          value={dashboardSettings.analytics.weeklyEngagement.toLocaleString()}
          icon="💬"
        />
        <AnalyticsCard
          label="Posts This Month"
          value={dashboardSettings.analytics.postsThisMonth.toString()}
          icon="📰"
        />
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h2>
            {user?.role !== 'admin' && (
              <p className="text-xs text-slate-500 mt-1">Tasks and requests assigned to you</p>
            )}
          </div>
        </div>
        {upcomingDeadlines.length === 0 ? (
          <p className="text-slate-500 text-sm">
            {user?.role === 'admin' ? 'No upcoming deadlines' : 'No tasks or requests assigned to you'}
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {upcomingDeadlines.map((item) => (
                <DeadlineItemComponent
                  key={`${item.type}-${item.id}`}
                  item={item}
                  showAssignee={user?.role === 'admin'}
                  onClick={() => {
                    if (item.type === 'task') {
                      setSelectedTask(item)
                    } else {
                      setSelectedRequest(item)
                    }
                  }}
                />
              ))}
            </div>
            {selectedRequest && (
              <DeadlineDetailModal item={selectedRequest} onClose={() => setSelectedRequest(null)} />
            )}
            {selectedTask && (
              <TaskDetailModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onTaskUpdated={(updatedTask) => {
                  setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
                  setSelectedTask(updatedTask)
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Team Quick View */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-medium text-slate-900">{member.name}</p>
              <p className="text-xs text-slate-500">{member.roles.join(', ')}</p>
              <div className="text-xs text-slate-600 mt-2">
                Active assigned:{' '}
                <span className="font-bold">
                  {activeRequests.filter((r) => r.assigned_to === member.username && r.status !== 'posted').length +
                    tasks.filter(
                      (t) =>
                        t.assigned_to.includes(member.username) &&
                        !t.archived &&
                        t.status !== 'completed'
                    ).length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: number
  color: string
  icon: string
}) {
  return (
    <div className={`${color} rounded-lg p-4 border border-slate-200`}>
      <p className="text-3xl font-bold mb-1">{icon}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-75">{label}</p>
    </div>
  )
}

function AnalyticsCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function DeadlineItem({ request, showAssignee = false }: { request: ContentRequest; showAssignee?: boolean }) {
  const deadline = new Date(request.posting_deadline)
  const now = new Date()
  const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  let urgencyColor = 'text-slate-600'
  if (daysUntil < 0) urgencyColor = 'text-red-600 font-bold'
  else if (daysUntil <= 1) urgencyColor = 'text-red-600'
  else if (daysUntil <= 3) urgencyColor = 'text-yellow-600'

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
      <div className="flex-1">
        <p className="font-medium text-slate-900">{request.event_topic}</p>
        <p className="text-xs text-slate-600">{request.requestor_name}</p>
        {showAssignee && request.assigned_to && (
          <p className="text-xs text-slate-500 mt-1">
            Assigned to: <span className="font-medium">{request.assigned_to}</span>
          </p>
        )}
      </div>
      <div className={`text-right text-sm font-medium ${urgencyColor}`}>
        {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
      </div>
    </div>
  )
}

function DeadlineItemComponent({
  item,
  showAssignee = false,
  onClick,
}: {
  item: ({ type: 'request' } & ContentRequest) | ({ type: 'task' } & Task)
  showAssignee?: boolean
  onClick?: () => void
}) {
  const deadline = new Date(item.type === 'request' ? item.posting_deadline : item.due_date)
  const now = new Date()
  const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  let urgencyColor = 'text-slate-600'
  if (daysUntil < 0) urgencyColor = 'text-red-600 font-bold'
  else if (daysUntil <= 1) urgencyColor = 'text-red-600'
  else if (daysUntil <= 3) urgencyColor = 'text-yellow-600'

  const title = item.type === 'request' ? item.event_topic : item.name
  const subtitle = item.type === 'request' ? item.requestor_name : `Task • ${item.status}`
  const assignee = item.type === 'request' ? item.assigned_to : item.assigned_to.join(', ')

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
    >
      <div className="flex-1">
        <p className="font-medium text-slate-900">
          {item.type === 'task' && '✓ '}{title}
        </p>
        <p className="text-xs text-slate-600">{subtitle}</p>
        {showAssignee && (
          <p className="text-xs text-slate-500 mt-1">
            Assigned to: <span className="font-medium">{assignee}</span>
          </p>
        )}
      </div>
      <div className={`text-right text-sm font-medium ${urgencyColor}`}>
        {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
      </div>
    </button>
  )
}

function DeadlineDetailModal({
  item,
  onClose,
}: {
  item: ContentRequest & { type: 'request' }
  onClose: () => void
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {item.event_topic}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Content Request • {item.status}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Deadline</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(item.posting_deadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">{item.status}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Requestor</p>
                  <p className="text-sm font-medium text-slate-900">{item.requestor_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-900">{item.requestor_email}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            )}

            {/* Request Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Request Details</h3>
              <div className="space-y-2 text-sm">
                {item.requestor_role && (
                  <p>
                    <span className="text-slate-500">Role:</span>{' '}
                    <span className="text-slate-900">{item.requestor_role}</span>
                  </p>
                )}
                {item.organization_name && (
                  <p>
                    <span className="text-slate-500">Organization:</span>{' '}
                    <span className="text-slate-900">{item.organization_name}</span>
                  </p>
                )}
                {item.content_goal && (
                  <p>
                    <span className="text-slate-500">Goal:</span>{' '}
                    <span className="text-slate-900">{item.content_goal}</span>
                  </p>
                )}
                {item.requested_content_types && (
                  <p>
                    <span className="text-slate-500">Content Types:</span>{' '}
                    <span className="text-slate-900">{item.requested_content_types}</span>
                  </p>
                )}
                {item.hard_deadline && (
                  <p>
                    <span className="text-slate-500">Hard Deadline:</span>{' '}
                    <span className="text-slate-900">{item.hard_deadline}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="text-xs text-slate-500 pt-4 border-t border-slate-200">
              <p>Submitted: {new Date(item.submitted_date).toLocaleString()}</p>
              {item.assigned_to && (
                <p>Assigned to: {item.assigned_to}</p>
              )}
              <p>Status: {item.status}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
