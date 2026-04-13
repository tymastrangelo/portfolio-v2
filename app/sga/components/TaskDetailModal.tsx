'use client'

import { useEffect, useState } from 'react'
import type { Task } from '@/app/sga/types'

function getTaskStatusButtonClass(status: Task['status'], active: boolean) {
  if (active) {
    if (status === 'pending') return 'bg-amber-600 text-white border-amber-600'
    if (status === 'in_progress') return 'bg-sky-600 text-white border-sky-600'
    return 'bg-emerald-600 text-white border-emerald-600'
  }

  if (status === 'pending') return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
  if (status === 'in_progress') return 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
  return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
}

interface TaskDetailModalProps {
  task: Task
  onClose: () => void
  onTaskUpdated?: (task: Task) => void
  canEdit?: boolean
  teamMembers?: Array<{ username: string; name: string }>
  contentRequests?: Array<{ id: string; name: string }>
}

export default function TaskDetailModal({
  task,
  onClose,
  onTaskUpdated,
  canEdit = false,
  teamMembers = [],
  contentRequests = [],
}: TaskDetailModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [savingEdits, setSavingEdits] = useState(false)
  const [error, setError] = useState('')
  const [editData, setEditData] = useState({
    name: task.name,
    description: task.description,
    due_date: task.due_date,
    assigned_to: task.assigned_to,
    content_request_id: task.content_request_id || '',
  })

  useEffect(() => {
    setEditData({
      name: task.name,
      description: task.description,
      due_date: task.due_date,
      assigned_to: task.assigned_to,
      content_request_id: task.content_request_id || '',
    })
  }, [task])

  const handleStatusChange = async (status: Task['status']) => {
    try {
      setUpdatingStatus(true)
      setError('')

      const response = await fetch('/api/sga/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update task status')
      }

      const updatedTask = (await response.json()) as Task
      onTaskUpdated?.(updatedTask)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const toggleAssignee = (username: string) => {
    setEditData((prev) => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(username)
        ? prev.assigned_to.filter((u) => u !== username)
        : [...prev.assigned_to, username],
    }))
  }

  const handleSaveEdits = async () => {
    try {
      setSavingEdits(true)
      setError('')

      if (!editData.name || !editData.due_date || editData.assigned_to.length === 0) {
        setError('Name, due date, and at least one assignee are required.')
        return
      }

      const response = await fetch('/api/sga/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          name: editData.name,
          description: editData.description,
          due_date: editData.due_date,
          assigned_to: editData.assigned_to,
          content_request_id: editData.content_request_id || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save task changes')
      }

      const updatedTask = (await response.json()) as Task
      onTaskUpdated?.(updatedTask)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task changes')
    } finally {
      setSavingEdits(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-slate-200 shadow-lg w-full max-w-xl">
          <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{task.name}</h2>
              <p className="text-sm text-slate-500 mt-1">Due {new Date(task.due_date).toLocaleDateString()}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-xl leading-none">
              ×
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {canEdit ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Task Name</p>
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</p>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Due Date</p>
                  <input
                    type="date"
                    value={editData.due_date}
                    onChange={(e) => setEditData((prev) => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Assigned To</p>
                  <div className="max-h-32 overflow-y-auto border border-slate-200 rounded p-2 space-y-1">
                    {teamMembers.map((member) => (
                      <label key={member.username} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={editData.assigned_to.includes(member.username)}
                          onChange={() => toggleAssignee(member.username)}
                        />
                        {member.name} ({member.username})
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Linked Content Request</p>
                  <select
                    value={editData.content_request_id}
                    onChange={(e) => setEditData((prev) => ({ ...prev, content_request_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                  >
                    <option value="">None</option>
                    {contentRequests.map((request) => (
                      <option key={request.id} value={request.id}>
                        {request.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              task.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</p>
                  <p className="text-sm text-slate-700 mt-1">{task.description}</p>
                </div>
              )
            )}

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'in_progress', 'completed'] as const).map((status) => (
                  <button
                    key={status}
                    disabled={updatingStatus || task.status === status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1.5 rounded text-sm capitalize border transition ${getTaskStatusButtonClass(status, task.status === status)} disabled:opacity-60`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {canEdit && (
              <div className="pt-2">
                <button
                  onClick={handleSaveEdits}
                  disabled={savingEdits}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingEdits ? 'Saving...' : 'Save Task Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
