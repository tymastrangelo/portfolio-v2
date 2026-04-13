'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/sga-session'
import type { Idea, IdeaCategory, IdeaStatus } from '@/app/sga/types'

export default function IdeasPage() {
  const { user } = useSession()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loadingIdeas, setLoadingIdeas] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    idea_text: '',
    category: 'one-off' as IdeaCategory,
  })

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        setLoadingIdeas(true)
        setError('')
        const res = await fetch('/api/sga/ideas', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to load ideas')
        }
        const data = (await res.json()) as Idea[]
        setIdeas(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ideas')
      } finally {
        setLoadingIdeas(false)
      }
    }

    loadIdeas()
  }, [])

  const handleAddIdea = async () => {
    if (!formData.idea_text.trim()) {
      alert('Please enter an idea')
      return
    }

    try {
      setError('')
      const response = await fetch('/api/sga/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_text: formData.idea_text,
          category: formData.category,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create idea')
      }

      const newIdea = (await response.json()) as Idea
      setIdeas((prev) => [newIdea, ...prev])
      setFormData({
        idea_text: '',
        category: 'one-off',
      })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create idea')
    }
  }

  const handleStatusChange = async (id: string, newStatus: IdeaStatus) => {
    try {
      setError('')
      const response = await fetch('/api/sga/ideas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update idea')
      }

      const updated = (await response.json()) as Idea
      setIdeas((prev) => prev.map((idea) => (idea.id === updated.id ? updated : idea)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update idea')
    }
  }

  const handleDeleteIdea = async (id: string) => {
    const target = ideas.find((idea) => idea.id === id)
    if (!target || target.submitted_by !== user?.username) {
      return
    }

    try {
      setError('')
      const response = await fetch(`/api/sga/ideas?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete idea')
      }

      setIdeas((prev) => prev.filter((idea) => idea.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete idea')
    }
  }

  const categoryIcons: Record<IdeaCategory, string> = {
    seasonal: '❄️',
    recurring: '🔄',
    'one-off': '✨',
    event: '📅',
  }

  const categoryLabels: Record<IdeaCategory, string> = {
    seasonal: 'Seasonal',
    recurring: 'Recurring Series',
    'one-off': 'One-Off',
    event: 'Event',
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Ideas Bank</h1>
          <p className="text-slate-600">Brainstorm and track content ideas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          {showForm ? 'Cancel' : '+ Add Idea'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h3 className="font-semibold text-slate-900">New Idea</h3>

          <textarea
            placeholder="Describe your content idea..."
            value={formData.idea_text}
            onChange={(e) => setFormData({ ...formData, idea_text: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as IdeaCategory })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="one-off">One-Off</option>
              <option value="seasonal">Seasonal</option>
              <option value="recurring">Recurring Series</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddIdea}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            >
              Add Idea
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ideas List */}
      <div className="space-y-3">
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        {loadingIdeas ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">Loading ideas...</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600">No ideas yet. Start brainstorming!</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              categoryIcon={categoryIcons[idea.category]}
              categoryLabel={categoryLabels[idea.category]}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteIdea}
              submitterName={idea.submitted_by}
              canDelete={user?.role === 'admin' || idea.submitted_by === user?.username}
            />
          ))
        )}
      </div>
    </div>
  )
}

function IdeaCard({
  idea,
  categoryIcon,
  categoryLabel,
  onStatusChange,
  onDelete,
  submitterName,
  canDelete,
}: {
  idea: Idea
  categoryIcon: string
  categoryLabel: string
  onStatusChange: (id: string, status: IdeaStatus) => void
  onDelete: (id: string) => void
  submitterName: string
  canDelete: boolean
}) {
  const statusColor: Record<IdeaStatus, string> = {
    new: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    used: 'bg-green-100 text-green-700',
  }

  const statusLabel: Record<IdeaStatus, string> = {
    new: 'New',
    in_progress: 'In Progress',
    used: 'Used',
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <span className="text-2xl">{categoryIcon}</span>
            <div className="flex-1">
              <p className="text-slate-900 font-medium">{idea.idea_text}</p>
              <p className="text-xs text-slate-500 mt-1">Submitted by {submitterName}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
              {categoryLabel}
            </span>
            <select
              value={idea.status}
              onChange={(e) => onStatusChange(idea.id, e.target.value as IdeaStatus)}
              className={`px-2 py-1 rounded text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                statusColor[idea.status]
              }`}
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="used">Used</option>
            </select>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => onDelete(idea.id)}
            className="p-2 hover:bg-slate-100 rounded transition"
          >
            <svg className="w-5 h-5 text-slate-400 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="text-xs text-slate-500">
        {new Date(idea.submitted_date).toLocaleDateString()}
      </div>
    </div>
  )
}
