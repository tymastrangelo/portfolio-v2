'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/sga-session'
import Link from 'next/link'
import type { Task } from '@/app/sga/types'
import TaskDetailModal from '@/app/sga/components/TaskDetailModal'

function getTaskStatusBadgeClass(status: Task['status']) {
  if (status === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200'
  if (status === 'in_progress') return 'bg-sky-100 text-sky-800 border-sky-200'
  return 'bg-emerald-100 text-emerald-800 border-emerald-200'
}

export default function TasksPage() {
  const { user } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    due_date: '',
    assigned_to: [] as string[],
    content_request_id: '',
  })

  const [teamMembers, setTeamMembers] = useState<Array<{ username: string; name: string }>>([])
  const [contentRequests, setContentRequests] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Load tasks for all users; members will only receive their own from the API.
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoadingTasks(true)
        const includeCompletedParam = user?.role !== 'admin' && showCompleted ? '?includeCompleted=1' : ''
        const res = await fetch(`/api/sga/tasks${includeCompletedParam}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as Task[]
        setTasks(data.filter((t) => !t.archived))
      } catch (err) {
        console.error('Failed to load tasks:', err)
      } finally {
        setLoadingTasks(false)
      }
    }

    loadTasks()
  }, [user?.role, showCompleted])

  // Admin-only dependencies for task creation form.
  useEffect(() => {
    if (user?.role !== 'admin') return

    const fetchAdminData = async () => {
      try {
        const [teamRes, requestsRes] = await Promise.all([
          fetch('/api/sga/team', { cache: 'no-store' }),
          fetch('/api/sga/requests', { cache: 'no-store' }),
        ])

        if (teamRes.ok) {
          const team = await teamRes.json()
          setTeamMembers(team)
        }

        if (requestsRes.ok) {
          const requests = await requestsRes.json()
          setContentRequests(requests.map((r: any) => ({ id: r.id, name: r.name })))
        }
      } catch (err) {
        console.error('Failed to load admin task form data:', err)
      }
    }

    fetchAdminData()
  }, [user?.role])

  const handleAssigneeToggle = (username: string) => {
    setFormData((prev) => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(username)
        ? prev.assigned_to.filter((u) => u !== username)
        : [...prev.assigned_to, username],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name || !formData.due_date || formData.assigned_to.length === 0) {
        setError('Please fill in all required fields and select at least one assignee')
        setLoading(false)
        return
      }

      const response = await fetch('/api/sga/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create task')
      }

      const taskFromResponse = (await response.json()) as Task

      setSuccess(true)
      setTasks((prev) => [taskFromResponse, ...prev])
      setFormData({
        name: '',
        description: '',
        due_date: '',
        assigned_to: [],
        content_request_id: '',
      })

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (user.role !== 'admin') {
    const memberTasks = tasks
      .filter((task) => task.assigned_to.includes(user.username) && !task.archived)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
            <p className="text-slate-600 mt-1">All tasks assigned to you</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              Show completed
            </label>
            <Link href="/sga" className="text-sm text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {loadingTasks ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-sm text-slate-600">
            Loading tasks...
          </div>
        ) : memberTasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-sm text-slate-600">
            No tasks assigned to you yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="text-left bg-white rounded-lg border border-slate-200 p-4 hover:bg-slate-50 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-900">{task.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded border capitalize ${getTaskStatusBadgeClass(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-slate-600 mt-2">{task.description}</p>
                )}
                <div className="mt-3 text-xs text-slate-500">
                  <p>
                    Due:{' '}
                    <span className="text-slate-700 font-medium">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </button>
            ))}
          </div>
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
      </div>
    )
  }

  const adminAssignedTasks = tasks
    .filter((task) => task.created_by === user.username && task.assigned_to.length > 0 && !task.archived)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create Task</h1>
        <Link href="/sga" className="text-sm text-gray-600 hover:text-gray-900">
          Back to Dashboard
        </Link>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✓ Task created successfully
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          ✗ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Task Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Task Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Create Instagram post for event"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Add details about the task..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">Due Date *</label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Assign To */}
        <div>
          <label className="block text-sm font-semibold mb-2">Assign To *</label>
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <label key={member.username} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.assigned_to.includes(member.username)}
                    onChange={() => handleAssigneeToggle(member.username)}
                    className="mr-2 w-4 h-4 rounded"
                  />
                  <span className="text-sm">
                    {member.name} ({member.username})
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No team members found</p>
            )}
          </div>
          {formData.assigned_to.length === 0 && (
            <p className="text-xs text-red-600 mt-1">Select at least one assignee</p>
          )}
        </div>

        {/* Link to Content Request */}
        <div>
          <label className="block text-sm font-semibold mb-2">Link to Content Request (optional)</label>
          <select
            value={formData.content_request_id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content_request_id: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">None</option>
            {contentRequests.map((request) => (
              <option key={request.id} value={request.id}>
                {request.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                name: '',
                description: '',
                due_date: '',
                assigned_to: [],
                content_request_id: '',
              })
            }
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Assigned Tasks</h2>
        <p className="text-sm text-slate-600 mb-4">Tasks you created and assigned to team members</p>

        {loadingTasks ? (
          <p className="text-sm text-slate-600">Loading assigned tasks...</p>
        ) : adminAssignedTasks.length === 0 ? (
          <p className="text-sm text-slate-600">No assigned tasks yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminAssignedTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="text-left bg-white rounded-lg border border-slate-200 p-4 hover:bg-slate-50 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">{task.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded border capitalize ${getTaskStatusBadgeClass(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-slate-600 mt-2">{task.description}</p>
                )}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p>
                    Due:{' '}
                    <span className="text-slate-700 font-medium">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    Assigned to:{' '}
                    <span className="text-slate-700 font-medium">{task.assigned_to.join(', ')}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          canEdit
          teamMembers={teamMembers}
          contentRequests={contentRequests}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={(updatedTask) => {
            setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
            setSelectedTask(updatedTask)
          }}
        />
      )}
    </div>
  )
}


