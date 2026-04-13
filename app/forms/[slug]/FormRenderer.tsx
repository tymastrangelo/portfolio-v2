'use client'

import { useState } from 'react'
import { FormField, FormContactSettings } from '@/app/sga/types'

interface FormRendererProps {
  fields: FormField[]
  contactSettings?: FormContactSettings
  onSubmit: (formData: Record<string, any>, email?: string, name?: string) => void
}

export default function FormRenderer({
  fields,
  contactSettings = { name: 'optional', email: 'optional' },
  onSubmit,
}: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const showName = contactSettings.name !== 'off'
  const showEmail = contactSettings.email !== 'off'
  const requireName = contactSettings.name === 'required'
  const requireEmail = contactSettings.email === 'required'

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: '',
      }))
    }
  }

  const handleCheckboxChange = (fieldId: string, optionValue: string, checked: boolean) => {
    const currentValues = formData[fieldId] || []
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v: string) => v !== optionValue)
    handleChange(fieldId, newValues)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (requireName && !name.trim()) {
      newErrors.__contact_name = 'Name is required'
    }

    const hasEmailValue = Boolean(email.trim())
    if ((requireEmail && !hasEmailValue) || (hasEmailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      newErrors.__contact_email = requireEmail && !hasEmailValue
        ? 'Email is required'
        : 'Please enter a valid email'
    }

    fields.forEach((field) => {
      if (field.type === 'section') return

      const value = formData[field.id]
      const isEmpty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0)

      if (field.required && isEmpty) {
        newErrors[field.id] = `${field.label} is required`
      }

      // Email validation
      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.id] = 'Please enter a valid email'
      }

      // URL validation
      if (field.type === 'url' && value) {
        try {
          new URL(value)
        } catch {
          newErrors[field.id] = 'Please enter a valid URL'
        }
      }

      // Phone validation (basic)
      if (field.type === 'phone' && value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
        newErrors[field.id] = 'Please enter a valid phone number'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const submitName = showName && name.trim() ? name.trim() : undefined
      const submitEmail = showEmail && email.trim() ? email.trim() : undefined
      onSubmit(formData, submitEmail, submitName)
    } finally {
      setSubmitting(false)
    }
  }

  if (fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No fields configured for this form yet</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(showName || showEmail) && (
        <div className="space-y-4 pb-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Contact Information</h3>

          {showName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
                {requireName ? <span className="text-red-500 ml-1">*</span> : <span className="text-gray-500 ml-1">(Optional)</span>}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.__contact_name) {
                    setErrors((prev) => ({ ...prev, __contact_name: '' }))
                  }
                }}
                placeholder="Your name"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.__contact_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.__contact_name && <p className="text-red-500 text-sm mt-1">{errors.__contact_name}</p>}
            </div>
          )}

          {showEmail && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
                {requireEmail ? <span className="text-red-500 ml-1">*</span> : <span className="text-gray-500 ml-1">(Optional)</span>}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.__contact_email) {
                    setErrors((prev) => ({ ...prev, __contact_email: '' }))
                  }
                }}
                placeholder="your@email.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.__contact_email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.__contact_email && <p className="text-red-500 text-sm mt-1">{errors.__contact_email}</p>}
            </div>
          )}
        </div>
      )}

      {/* Form Fields */}
      {fields.map((field) => {
        const fieldValue = formData[field.id]
        const fieldError = errors[field.id]

        return (
          <div key={field.id}>
            {/* Section Header */}
            {field.type === 'section' && (
              <div className="mt-8 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{field.label}</h3>
                {field.description && (
                  <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                )}
              </div>
            )}

            {/* Text Input */}
            {field.type === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  value={fieldValue || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Email Input */}
            {field.type === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="email"
                  value={fieldValue || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Phone Input */}
            {field.type === 'phone' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="tel"
                  value={fieldValue || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* URL Input */}
            {field.type === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="url"
                  value={fieldValue || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Number Input */}
            {field.type === 'number' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="number"
                  value={fieldValue || ''}
                  onChange={(e) => handleChange(field.id, e.target.value ? Number(e.target.value) : '')}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Date Input */}
            {field.type === 'date' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="date"
                  value={fieldValue || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Textarea */}
            {field.type === 'textarea' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <textarea
                  value={fieldValue || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Radio Buttons */}
            {field.type === 'radio' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name={field.id}
                        value={option.value}
                        checked={fieldValue === option.value}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Checkboxes */}
            {field.type === 'checkbox' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(fieldValue || []).includes(option.value)}
                        onChange={(e) =>
                          handleCheckboxChange(field.id, option.value, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="ml-2 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Dropdown */}
            {field.type === 'dropdown' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                  value={fieldValue || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">-- Select an option --</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* Rating */}
            {field.type === 'rating' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleChange(field.id, rating)}
                      className={`w-10 h-10 rounded-lg border-2 text-lg font-bold transition ${
                        fieldValue === rating
                          ? 'bg-yellow-400 border-yellow-500'
                          : 'bg-gray-100 border-gray-300 hover:border-yellow-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}

            {/* File Upload */}
            {field.type === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="file"
                  onChange={(e) => handleChange(field.id, e.target.files?.[0]?.name || '')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    fieldError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
              </div>
            )}
          </div>
        )
      })}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-8"
      >
        {submitting ? 'Submitting...' : 'Submit Form'}
      </button>
    </form>
  )
}
