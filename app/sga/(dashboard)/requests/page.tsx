'use client'

import { useState, useMemo, useEffect } from 'react'
import type { ContentRequest, RequestStatus, RequestPriority, ContentType, TeamMember } from '@/app/sga/types'
import { useSession } from '@/lib/sga-session'
import RequestDetailDrawer from '@/components/dashboard/RequestDetailDrawer'

type FilterStatus = RequestStatus | 'all'
type FilterPriority = RequestPriority | 'all'
type FilterContentType = ContentType | 'all'

export default function RequestsPage() {
  const { user } = useSession()
  const [requests, setRequests] = useState<ContentRequest[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoadingRequests(true)
        const res = await fetch('/api/sga/requests', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to load requests')
        }
        const data = (await res.json()) as ContentRequest[]
        setRequests(data)
      } catch (err) {
        console.error(err)
        setError('Could not load content requests right now.')
      } finally {
        setLoadingRequests(false)
      }
    }

    loadRequests()

    const loadTeam = async () => {
      try {
        const res = await fetch('/api/sga/team', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as TeamMember[]
        setTeamMembers(data)
      } catch (err) {
        console.error('Failed to load team members:', err)
      }
    }

    loadTeam()
  }, [])

  // Filters
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<FilterContentType>('all')
  const [assignedFilter, setAssignedFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Detail drawer
  const [selectedRequest, setSelectedRequest] = useState<ContentRequest | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Preset views
  const [presetView, setPresetView] = useState<string | null>(null)

  // Filter logic
  const filtered = useMemo(() => {
    let result = requests.filter((r) => !r.archived)

    // Preset views
    if (presetView === 'attention') {
      result = result.filter(
        (r) => r.status === 'in_review' || r.priority === 'urgent'
      )
    } else if (presetView === 'week') {
      const weekFromNow = new Date()
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      result = result.filter((r) => new Date(r.posting_deadline) <= weekFromNow)
    } else if (presetView === 'myTasks') {
      result = result.filter((r) => r.assigned_to === user?.username)
    } else if (presetView === 'completed') {
      result = result.filter((r) => r.status === 'posted')
    } else {
      // Regular filters
      if (statusFilter !== 'all') result = result.filter((r) => r.status === statusFilter)
      if (priorityFilter !== 'all') result = result.filter((r) => r.priority === priorityFilter)
      if (contentTypeFilter !== 'all')
        result = result.filter((r) => r.content_types.includes(contentTypeFilter))
      if (assignedFilter !== 'all' && assignedFilter !== 'unassigned')
        result = result.filter((r) => r.assigned_to === assignedFilter)
      if (assignedFilter === 'unassigned') result = result.filter((r) => !r.assigned_to)
    }

    // Search
    if (searchTerm) {
      result = result.filter(
        (r) =>
          r.event_topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.requestor_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return result
  }, [requests, statusFilter, priorityFilter, contentTypeFilter, assignedFilter, searchTerm, presetView, user?.username])

  const handleSaveRequest = async (updated: ContentRequest) => {
    try {
      const response = await fetch('/api/sga/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updated.id,
          status: updated.status,
          priority: updated.priority,
          assigned_to: updated.assigned_to,
          approval_status: updated.approval_status,
          vp_notes: updated.vp_notes,
          draft_link: updated.draft_link,
          posted_date: updated.posted_date,
          post_link: updated.post_link,
          additional_notes: updated.additional_notes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update request')
      }

      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      setSelectedRequest(updated)
    } catch (err) {
      console.error(err)
      setError('Failed to save changes. Please try again.')
    }
  }

  const handleDeleteRequest = async (id: string) => {
    try {
      const response = await fetch('/api/sga/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, archived: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to archive request')
      }

      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, archived: true } : r)))
      setIsDrawerOpen(false)
      setSelectedRequest(null)
    } catch (err) {
      console.error(err)
      setError('Failed to archive request. Please try again.')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Requests</h1>
        <p className="text-slate-600">Live submissions from your content request form</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        <PresetButton
          active={presetView === 'attention'}
          onClick={() => setPresetView(presetView === 'attention' ? null : 'attention')}
          label="🔥 Need My Attention"
        />
        <PresetButton
          active={presetView === 'week'}
          onClick={() => setPresetView(presetView === 'week' ? null : 'week')}
          label="📅 This Week"
        />
        <PresetButton
          active={presetView === 'myTasks'}
          onClick={() => setPresetView(presetView === 'myTasks' ? null : 'myTasks')}
          label="👤 My Tasks"
        />
        <PresetButton
          active={presetView === 'completed'}
          onClick={() => setPresetView(presetView === 'completed' ? null : 'completed')}
          label="✅ Completed"
        />
      </div>

      {/* Filters */}
      {!presetView && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by topic or requestor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Status: All</option>
              <option value="submitted">Submitted</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="posted">Posted</option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as FilterPriority)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Priority: All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            {/* Content Type */}
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value as FilterContentType)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Content: All</option>
              <option value="video">Video</option>
              <option value="graphic">Graphic</option>
              <option value="story">Story</option>
              <option value="post">Post</option>
              <option value="reel">Reel</option>
              <option value="carousel">Carousel</option>
            </select>

            {/* Assigned */}
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Assigned: All</option>
              <option value="unassigned">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.username} value={member.username}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {(statusFilter !== 'all' ||
            priorityFilter !== 'all' ||
            contentTypeFilter !== 'all' ||
            assignedFilter !== 'all' ||
            searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('all')
                setPriorityFilter('all')
                setContentTypeFilter('all')
                setAssignedFilter('all')
                setSearchTerm('')
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loadingRequests ? (
          <div className="p-8 text-center text-slate-600">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600 mb-2">No requests found</p>
            <p className="text-xs text-slate-500">Submit your content request form to populate this table</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">Topic</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">Content</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">Assigned To</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">Deadline</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">Priority</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => (
                  <tr key={req.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{req.event_topic}</p>
                      <p className="text-xs text-slate-500">{req.requestor_name}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {req.content_types.length > 0 ? (
                        req.content_types.map((ct) => (
                          <span
                            key={ct}
                            className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded mr-1 mb-1"
                          >
                            {ct}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {req.assigned_to ? (
                        <span className="text-slate-900 font-medium">
                          {teamMembers.find((m) => m.username === req.assigned_to)?.name ||
                            req.assigned_to}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <DeadlineDisplay deadline={req.posting_deadline} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedRequest(req)
                          setIsDrawerOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedRequest && (
        <RequestDetailDrawer
          isOpen={isDrawerOpen}
          request={selectedRequest}
          teamMembers={teamMembers}
          isAdmin={user?.role === 'admin'}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveRequest}
          onDelete={handleDeleteRequest}
        />
      )}

      {/* Results counter */}
      <div className="text-xs text-slate-600">
        Showing <span className="font-bold">{filtered.length}</span> of{' '}
        <span className="font-bold">{requests.filter((r) => !r.archived).length}</span> requests
      </div>
    </div>
  )
}

function PresetButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  )
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const statusConfig: Record<RequestStatus, { bg: string; text: string; label: string }> = {
    submitted: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Submitted' },
    assigned: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Assigned' },
    in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress' },
    in_review: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    scheduled: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Scheduled' },
    posted: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Posted' },
  }

  const config = statusConfig[status]
  return <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>
}

function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const priorityConfig: Record<RequestPriority, string> = {
    urgent: '🔴 Urgent',
    high: '🟠 High',
    normal: '🔵 Normal',
    low: '⚪ Low',
  }

  return <span className="text-xs">{priorityConfig[priority]}</span>
}

function DeadlineDisplay({ deadline }: { deadline: string }) {
  const date = new Date(deadline)
  const now = new Date()
  const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  let color = 'text-slate-600'
  if (daysUntil < 0) color = 'text-red-600 font-bold'
  else if (daysUntil <= 1) color = 'text-red-600'
  else if (daysUntil <= 3) color = 'text-yellow-600'

  return (
    <span className={color}>
      {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d left`}
    </span>
  )
}
