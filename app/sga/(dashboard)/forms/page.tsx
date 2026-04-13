'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/sga-session'
import { Form } from '@/app/sga/types'
import FormBuilder from './FormBuilder'
import FormDetailsModal from './FormDetailsModal'

export default function FormsPage() {
  const router = useRouter()
  const { user, loading } = useSession()
  const [forms, setForms] = useState<Form[]>([])
  const [loadingForms, setLoadingForms] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [editingForm, setEditingForm] = useState<Form | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) {
      // Only admins can access the forms page
      if (user.role !== 'admin') {
        router.push('/sga')
        return
      }
      loadForms()
    }
  }, [user, loading, router])

  async function loadForms() {
    try {
      const response = await fetch('/api/sga/forms')
      if (response.status === 403) {
        // Not authorized
        router.push('/sga')
        return
      }
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      } else {
        setError('Failed to load forms')
      }
    } catch (error) {
      console.error('Error loading forms:', error)
      setError('Error loading forms')
    } finally {
      setLoadingForms(false)
    }
  }

  const handleCreateForm = async () => {
    setEditingForm(null)
    setShowBuilder(true)
  }

  const handleEditForm = (form: Form) => {
    setEditingForm(form)
    setShowBuilder(true)
  }

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return

    try {
      const response = await fetch(`/api/sga/forms/${formId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setForms(forms.filter((f) => f.id !== formId))
      } else {
        setError('Failed to delete form')
      }
    } catch (error) {
      console.error('Error deleting form:', error)
      setError('Error deleting form')
    }
  }

  const handleViewResponses = (form: Form) => {
    setSelectedForm(form)
    setShowDetails(true)
  }

  const handleFormSaved = () => {
    setShowBuilder(false)
    setEditingForm(null)
    setError('')
    loadForms()
  }

  if (loading || loadingForms) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Forms</h1>
          <p className="text-slate-600">Create and manage forms to collect information from your audience</p>
        </div>
        <button
          onClick={handleCreateForm}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          + New Form
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Builder or Details View */}
      {showBuilder ? (
        <FormBuilder
          initialForm={editingForm}
          onSave={handleFormSaved}
          onCancel={() => {
            setShowBuilder(false)
            setEditingForm(null)
          }}
        />
      ) : showDetails && selectedForm ? (
        <FormDetailsModal
          form={selectedForm}
          onBack={() => {
            setShowDetails(false)
            setSelectedForm(null)
          }}
        />
      ) : (
        <div className="space-y-4">
          {forms.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-500 mb-4">No forms yet</p>
              <button
                onClick={handleCreateForm}
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Create Your First Form
              </button>
            </div>
          ) : (
            forms.map((form) => (
              <div
                key={form.id}
                className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900">{form.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">{form.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-xs bg-slate-100 px-2.5 py-1 rounded font-medium">
                        {form.slug}
                      </span>
                      <span className="text-xs text-slate-500">
                        {form.is_active ? '✓ Active' : '✗ Inactive'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {form.response_count || 0} {form.response_count === 1 ? 'response' : 'responses'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/forms/${form.slug}`}
                      target="_blank"
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleViewResponses(form)}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 font-medium transition"
                    >
                      Responses
                    </button>
                    <button
                      onClick={() => handleEditForm(form)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
