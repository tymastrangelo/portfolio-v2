'use client'

import { useState, useEffect } from 'react'
import { Form, FormField, FormFieldType, FormContactSettings, SerializedFormConfig } from '@/app/sga/types'

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'phone', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'url', label: 'URL' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'rating', label: 'Rating' },
  { value: 'file', label: 'File Upload' },
  { value: 'section', label: 'Section Header' },
]

interface FormBuilderProps {
  initialForm?: Form | null
  onSave: () => void
  onCancel: () => void
}

export default function FormBuilder({
  initialForm,
  onSave,
  onCancel,
}: FormBuilderProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [fields, setFields] = useState<FormField[]>([])
  const [contactSettings, setContactSettings] = useState<FormContactSettings>({
    name: 'optional',
    email: 'optional',
  })
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)

  useEffect(() => {
    if (initialForm) {
      setName(initialForm.name)
      setDescription(initialForm.description)
      setSlug(initialForm.slug)
      setIsActive(initialForm.is_active)
      try {
        const parsedConfig = JSON.parse(initialForm.fields_json) as FormField[] | SerializedFormConfig

        if (Array.isArray(parsedConfig)) {
          // Backward compatibility for older forms stored as plain field arrays.
          setFields(parsedConfig)
          setContactSettings({ name: 'optional', email: 'optional' })
        } else {
          setFields(Array.isArray(parsedConfig.fields) ? parsedConfig.fields : [])
          setContactSettings({
            name: parsedConfig.contact?.name ?? 'optional',
            email: parsedConfig.contact?.email ?? 'optional',
          })
        }
      } catch {
        console.error('Failed to parse form fields')
      }
    }
  }, [initialForm])

  const handleAddField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      order: fields.length,
    }
    setFields([...fields, newField])
  }

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((f) =>
        f.id === id
          ? { ...f, ...updates }
          : f
      )
    )
  }

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
  }

  const handleMoveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex((f) => f.id === id)
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < fields.length - 1)
    ) {
      const newFields = [...fields]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      ;[newFields[index], newFields[targetIndex]] = [
        newFields[targetIndex],
        newFields[index],
      ]
      setFields(newFields.map((f, i) => ({ ...f, order: i })))
    }
  }

  const handleSave = async () => {
    setError('')

    if (!name.trim()) {
      setError('Form name is required')
      return
    }

    if (!slug.trim()) {
      setError('Form slug is required')
      return
    }

    const slugRegex = /^[a-z0-9_-]+$/
    if (!slugRegex.test(slug)) {
      setError('Slug must contain only lowercase letters, numbers, hyphens, and underscores')
      return
    }

    if (fields.length === 0) {
      setError('Add at least one field to the form')
      return
    }

    setSaving(true)

    try {
      const payload = {
        name,
        description,
        slug,
        fields_json: JSON.stringify({
          fields,
          contact: contactSettings,
        }),
        created_by: 'admin',
        is_active: isActive,
      }

      const url = initialForm ? `/api/sga/forms/${initialForm.id}` : '/api/sga/forms'
      const method = initialForm ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSave()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save form')
      }
    } catch (err) {
      setError('Error saving form')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{initialForm ? 'Edit Form' : 'Create New Form'}</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Form Settings */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Form Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Communications Team Interest Form"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description shown to form respondents"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Form Slug *
          </label>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">/forms/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="team-interest-form"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Public URL: https://yoursite.com/forms/{slug}
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 border border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Active (Accept Responses)</span>
          </label>
        </div>

        <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800">Respondent Contact Fields</h4>
          <p className="text-xs text-gray-600">
            Configure the default Name and Email fields shown above your custom questions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name Field</label>
              <select
                value={contactSettings.name}
                onChange={(e) =>
                  setContactSettings((prev) => ({
                    ...prev,
                    name: e.target.value as FormContactSettings['name'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="off">Off</option>
                <option value="optional">Optional</option>
                <option value="required">Required</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Field</label>
              <select
                value={contactSettings.email}
                onChange={(e) =>
                  setContactSettings((prev) => ({
                    ...prev,
                    email: e.target.value as FormContactSettings['email'],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="off">Off</option>
                <option value="optional">Optional</option>
                <option value="required">Required</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Form Fields</h3>
          <button
            onClick={handleAddField}
            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm"
          >
            + Add Field
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-3">No fields yet</p>
            <button
              onClick={handleAddField}
              className="inline-block px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Add First Field
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          handleUpdateField(field.id, { label: e.target.value })
                        }
                        placeholder="Field label"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleUpdateField(field.id, { type: e.target.value as FormFieldType })
                        }
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {field.type !== 'section' && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            handleUpdateField(field.id, { required: e.target.checked })
                          }
                          className="w-3 h-3"
                        />
                        Required
                      </label>
                    )}
                  </div>

                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => handleMoveField(field.id, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveField(field.id, 'down')}
                      disabled={index === fields.length - 1}
                      className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Field Options Editor */}
                {(field.type === 'checkbox' || field.type === 'radio' || field.type === 'dropdown') && (
                  <div className="mt-3 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Options
                    </label>
                    {field.options?.map((option, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])]
                            newOptions[idx].label = e.target.value
                            handleUpdateField(field.id, { options: newOptions })
                          }}
                          placeholder="Option label"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => {
                            const newOptions = field.options?.filter((_, i) => i !== idx) || []
                            handleUpdateField(field.id, { options: newOptions })
                          }}
                          className="px-2 py-1 text-sm text-red-600 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newOptions = [...(field.options || [])]
                        newOptions.push({
                          label: `Option ${newOptions.length + 1}`,
                          value: `option_${newOptions.length + 1}`,
                        })
                        handleUpdateField(field.id, { options: newOptions })
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : `${initialForm ? 'Update' : 'Create'} Form`}
        </button>
      </div>
    </div>
  )
}
