'use client'

import { useState, useEffect } from 'react'
import { Form, FormResponse } from '@/app/sga/types'

interface FormDetailsModalProps {
  form: Form
  onBack: () => void
}

export default function FormDetailsModal({ form, onBack }: FormDetailsModalProps) {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedResponseId, setExpandedResponseId] = useState<string | null>(null)

  useEffect(() => {
    loadResponses()
  }, [form.id])

  async function loadResponses() {
    try {
      const response = await fetch(`/api/sga/forms/${form.id}/responses`)
      if (response.ok) {
        const data = await response.json()
        setResponses(data)
      }
    } catch (error) {
      console.error('Error loading responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteResponse = async (responseId: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return

    try {
      const response = await fetch(`/api/sga/forms/${form.id}/responses?responseId=${responseId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setResponses(responses.filter((r) => r.id !== responseId))
      }
    } catch (error) {
      console.error('Error deleting response:', error)
    }
  }

  const handleExportCSV = () => {
    if (responses.length === 0) return

    // Parse all response data to get column headers
    const allKeys = new Set<string>()
    responses.forEach((r) => {
      try {
        const data = JSON.parse(r.response_data)
        Object.keys(data).forEach((k) => allKeys.add(k))
      } catch {}
    })

    const headers = ['ID', 'Submitted At', 'Submitter Name', 'Submitter Email', ...Array.from(allKeys)]
    const rows = responses.map((r) => {
      try {
        const data = JSON.parse(r.response_data)
        return [r.id, r.submitted_at, r.submitter_name || '', r.submitter_email || '', ...Array.from(allKeys).map((k) => data[k] || '')]
      } catch {
        return [r.id, r.submitted_at, r.submitter_name || '', r.submitter_email || '']
      }
    })

    const csv = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((v) => `"${v}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.slug}_responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-500">Loading responses...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold">{form.name} - Responses</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">{responses.length} response(s)</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={responses.length === 0}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Back
          </button>
        </div>
      </div>

      {/* Responses List */}
      <div className="divide-y divide-gray-200">
        {responses.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No responses yet</p>
          </div>
        ) : (
          responses.map((response) => {
            const isExpanded = expandedResponseId === response.id
            let responseData: Record<string, any> = {}
            try {
              responseData = JSON.parse(response.response_data)
            } catch {}

            return (
              <div key={response.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <button
                      onClick={() =>
                        setExpandedResponseId(isExpanded ? null : response.id)
                      }
                      className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600"
                    >
                      <span>{isExpanded ? '▼' : '▶'}</span>
                      <span>
                        {response.submitter_name || response.submitter_email || 'Anonymous'}
                      </span>
                    </button>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      {new Date(response.submitted_at).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteResponse(response.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 ml-6 space-y-3 bg-gray-50 p-4 rounded border border-gray-200">
                    {Object.entries(responseData).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          {key}
                        </label>
                        <div className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-200">
                          {Array.isArray(value) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {value.map((v, i) => (
                                <li key={i}>{v}</li>
                              ))}
                            </ul>
                          ) : typeof value === 'object' ? (
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          ) : (
                            <span>{String(value)}</span>
                          )}
                        </div>
                      </div>
                    ))}

                    {response.submitter_email && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                          Email
                        </label>
                        <p className="text-sm text-gray-900">{response.submitter_email}</p>
                      </div>
                    )}

                    {response.ip_address && (
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                        IP: {response.ip_address}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
