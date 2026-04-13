'use client'

import { useState } from 'react'
import type { ContentRequest, RequestStatus, TeamMember } from '@/app/sga/types'
import { useSession } from '@/lib/sga-session'

interface RequestDetailDrawerProps {
  isOpen: boolean
  request: ContentRequest
  teamMembers: TeamMember[]
  isAdmin: boolean
  onClose: () => void
  onSave: (request: ContentRequest) => void
  onDelete: (id: string) => void
}

export default function RequestDetailDrawer({
  isOpen,
  request,
  teamMembers,
  isAdmin,
  onClose,
  onSave,
  onDelete,
}: RequestDetailDrawerProps) {
  const { user } = useSession()
  const [editedRequest, setEditedRequest] = useState(request)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))
    onSave(editedRequest)
    setIsSaving(false)
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Archive this request?')) {
      onDelete(request.id)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-lg z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{editedRequest.event_topic}</h2>
              <p className="text-sm text-slate-600 mt-1">Request ID: {editedRequest.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Requestor Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Submitted By</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-600">Name:</span> <span className="font-medium">{editedRequest.requestor_name}</span>
              </p>
              <p>
                <span className="text-slate-600">Email:</span> <span className="font-mono text-xs">{editedRequest.requestor_email}</span>
              </p>
              <p>
                <span className="text-slate-600">Role:</span> <span className="font-medium">{editedRequest.requestor_role}</span>
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <Field label="Role" value={editedRequest.requestor_role || '—'} readOnly />

            <Field
              label="Organization / Committee Name"
              value={editedRequest.organization_name || '—'}
              readOnly
            />

            <Field label="Content Goal" value={editedRequest.content_goal || editedRequest.description || '—'} readOnly multiline />

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {(editedRequest.requested_content_types?.length
                  ? editedRequest.requested_content_types
                  : editedRequest.content_types).map((ct) => (
                  <span key={ct} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {ct}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Deadlines</label>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-slate-600">Preferred Post Date/Time:</span>{' '}
                  <span className="font-medium">{editedRequest.preferred_post_datetime || '—'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-slate-600">Hard Deadline:</span>{' '}
                  <span className="font-medium">{editedRequest.hard_deadline || editedRequest.posting_deadline || '—'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-slate-600">Event Date/Time:</span>{' '}
                  <span className="font-medium">{editedRequest.event_datetime || editedRequest.event_date || '—'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-slate-600">Event Location:</span>{' '}
                  <span className="font-medium">{editedRequest.event_location || '—'}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Priority</label>
              <div className="flex gap-2">
                {(['urgent', 'high', 'normal', 'low'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setEditedRequest({ ...editedRequest, priority: p })}
                    className={`px-3 py-2 rounded text-xs font-medium transition ${
                      editedRequest.priority === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    disabled={!isAdmin}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Admin Controls</h3>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Status</label>
                <select
                  value={editedRequest.status}
                  onChange={(e) =>
                    setEditedRequest({ ...editedRequest, status: e.target.value as RequestStatus })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="submitted">Submitted</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="posted">Posted</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Assign To</label>
                <select
                  value={editedRequest.assigned_to}
                  onChange={(e) =>
                    setEditedRequest({ ...editedRequest, assigned_to: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((member) => (
                    <option key={member.username} value={member.username}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Approval Status</label>
                <div className="flex gap-2">
                  {(['pending', 'approved', 'needs_edits'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        setEditedRequest({ ...editedRequest, approval_status: status })
                      }
                      className={`px-3 py-2 rounded text-xs font-medium transition ${
                        editedRequest.approval_status === status
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {status === 'pending' && 'Pending'}
                      {status === 'approved' && '✅ Approved'}
                      {status === 'needs_edits' && '📝 Needs Edits'}
                    </button>
                  ))}
                </div>
              </div>

              <Field
                label="VP Notes"
                value={editedRequest.vp_notes}
                onChange={(e) =>
                  setEditedRequest({ ...editedRequest, vp_notes: e.target.value })
                }
                multiline
                placeholder="Add admin notes here..."
              />

              {editedRequest.status === 'posted' && (
                <>
                  <Field
                    label="Post Link"
                    value={editedRequest.post_link}
                    onChange={(e) =>
                      setEditedRequest({ ...editedRequest, post_link: e.target.value })
                    }
                    placeholder="https://..."
                  />
                  <Field
                    label="Posted Date"
                    value={
                      editedRequest.posted_date
                        ? editedRequest.posted_date.split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setEditedRequest({ ...editedRequest, posted_date: e.target.value })
                    }
                    type="date"
                  />
                </>
              )}

              <div className="bg-red-50 p-3 rounded-lg">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition"
                >
                  Archive Request
                </button>
              </div>
            </div>
          )}

          {/* Team Member Section */}
          {!isAdmin && editedRequest.assigned_to === user?.username && (
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Your Work</h3>

              <Field
                label="Draft Link"
                value={editedRequest.draft_link}
                onChange={(e) =>
                  setEditedRequest({ ...editedRequest, draft_link: e.target.value })
                }
                placeholder="Link to your draft/working file..."
              />

              {editedRequest.approval_status && (
                <div className={`p-3 rounded-lg ${
                  editedRequest.approval_status === 'approved'
                    ? 'bg-green-50 text-green-700'
                    : editedRequest.approval_status === 'needs_edits'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-slate-50 text-slate-700'
                }`}>
                  <p className="text-sm font-medium capitalize">
                    {editedRequest.approval_status === 'pending' && '⏳ Awaiting approval'}
                    {editedRequest.approval_status === 'approved' && '✅ Approved!'}
                    {editedRequest.approval_status === 'needs_edits' && '📝 Needs edits'}
                  </p>
              {editedRequest.vp_notes && (
                    <p className="text-xs mt-2">{editedRequest.vp_notes}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Save / Cancel */}
          <div className="border-t border-slate-200 pt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            {(isAdmin || editedRequest.assigned_to === user?.username) && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function Field({
  label,
  value,
  onChange,
  readOnly,
  multiline,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  readOnly?: boolean
  multiline?: boolean
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
          disabled={readOnly}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
          disabled={readOnly}
        />
      )}
    </div>
  )
}
