'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Form, FormField, FormResponse, FormContactSettings, SerializedFormConfig } from '@/app/sga/types'
import FormRenderer from './FormRenderer'

export default function PublicFormPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [fields, setFields] = useState<FormField[]>([])
  const [contactSettings, setContactSettings] = useState<FormContactSettings>({
    name: 'optional',
    email: 'optional',
  })

  useEffect(() => {
    loadForm()
  }, [slug])

  async function loadForm() {
    try {
      const publicResponse = await fetch(`/api/forms/${slug}`, {
        cache: 'no-store',
      })

      if (publicResponse.ok) {
        const foundForm = await publicResponse.json()

        if (!foundForm) {
          setError('Form not found')
          return
        }

        if (!foundForm.is_active) {
          setError('This form is no longer accepting responses')
          return
        }

        setForm(foundForm)
        try {
          const parsedConfig = JSON.parse(foundForm.fields_json) as FormField[] | SerializedFormConfig

          if (Array.isArray(parsedConfig)) {
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
          setError('Error loading form fields')
        }
      } else {
        const data = await publicResponse.json().catch(() => null)
        setError(data?.error || 'Form not found')
      }
    } catch (err) {
      setError('Error loading form')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(formData: Record<string, any>, email?: string, name?: string) {
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: form?.id,
          response_data: formData,
          submitter_email: email,
          submitter_name: name,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setFields([])
        }, 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit form')
      }
    } catch (err) {
      setError('Error submitting form')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 font-semibold mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-gray-600">Form not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{form.name}</h1>
            {form.description && <p className="text-blue-100">{form.description}</p>}
          </div>

          {/* Content */}
          <div className="p-8">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">✓</div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Thank you for your submission!
                </h2>
                <p className="text-green-700">
                  We&apos;ve received your response and will review it shortly.
                </p>
              </div>
            ) : (
              <FormRenderer
                fields={fields}
                contactSettings={contactSettings}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>Powered by SGA Communications</p>
        </div>
      </div>
    </div>
  )
}
