'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import './styles.css'

export default function TestFlightForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [updatesOptIn, setUpdatesOptIn] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      fullName: (formData.get('fullName') as string)?.trim(),
      elonEmail: (formData.get('elonEmail') as string)?.trim(),
      appleEmail: (formData.get('appleEmail') as string)?.trim(),
      year: (formData.get('year') as string) || null,
      orgs: (formData.get('orgs') as string)?.trim() || null,
      why: (formData.get('why') as string)?.trim() || null,
      updatesOptIn,
    }

    const newErrors: Record<string, string> = {}

    if (!data.fullName) newErrors.fullName = 'Please enter your full name.'
    if (!data.elonEmail) {
      newErrors.elonEmail = 'Please enter your Elon email.'
    } else if (!validateEmail(data.elonEmail) || !data.elonEmail.toLowerCase().endsWith('@elon.edu')) {
      newErrors.elonEmail = 'Please enter a valid Elon email ending with @elon.edu.'
    }
    if (!data.appleEmail) {
      newErrors.appleEmail = 'Please enter your Apple ID email for TestFlight.'
    } else if (!validateEmail(data.appleEmail)) {
      newErrors.appleEmail = 'Please enter a valid email address.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setMessage('Please fix the errors above.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('https://n8n.tymastrangelo.com/webhook/c2942e75-de52-4056-a1ca-2a049bce5799', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Network error')

      setMessage('Thanks! You should receive a TestFlight invite if selected.')
      setTimeout(() => router.push('/quad/thank-you'), 900)
    } catch {
      setMessage('There was a problem submitting the form. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="form-container">
      <div className="container">
        <h1>🧩 Join the Quad Beta Team – Winter 2025</h1>
        <p className="lead">
          Thank you for your interest in helping test Quad, a new student-built app for discovering and sharing Elon
          campus events. By joining the beta, you&apos;ll get early access via Apple TestFlight and can share feedback that
          directly shapes the final version before our full launch in Fall 2026.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div>
              <label htmlFor="fullName">
                Full Name <span className="small">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <div className="error" aria-live="polite">
                  {errors.fullName}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="elonEmail">
                Elon Email Address <span className="small">*</span>
              </label>
              <input
                id="elonEmail"
                name="elonEmail"
                type="email"
                placeholder="you@elon.edu"
                autoComplete="email"
                required
                aria-invalid={!!errors.elonEmail}
              />
              {errors.elonEmail && (
                <div className="error" aria-live="polite">
                  {errors.elonEmail}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="appleEmail">
                Apple ID (or Android) Email <span className="small">*</span>
              </label>
              <input
                id="appleEmail"
                name="appleEmail"
                type="email"
                placeholder="appleid@example.com"
                required
                aria-invalid={!!errors.appleEmail}
              />
              {errors.appleEmail && (
                <div className="error" aria-live="polite">
                  {errors.appleEmail}
                </div>
              )}
              <div className="note">(Only used to send your TestFlight invite — it won&apos;t be shared.)</div>
            </div>

            <div>
              <label htmlFor="year">Year at Elon</label>
              <select id="year" name="year">
                <option value="">Select year</option>
                <option>First-Year</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
              </select>
            </div>

            <div>
              <label htmlFor="orgs">
                Are you involved in any student organizations or clubs? <span className="small">(optional)</span>
              </label>
              <input id="orgs" name="orgs" type="text" placeholder="Club names or roles" />
            </div>

            <div>
              <label htmlFor="why">
                Why are you interested in testing Quad? <span className="small">(optional)</span>
              </label>
              <textarea id="why" name="why" rows={4} placeholder="A short note..." />
            </div>

            <div>
              <label>Would you like to receive updates about Quad&apos;s launch?</label>
              <div className="toggle" role="group" aria-label="Receive updates">
                <div
                  className={`switch ${updatesOptIn ? 'on' : ''}`}
                  role="switch"
                  aria-checked={updatesOptIn}
                  tabIndex={0}
                  onClick={() => setUpdatesOptIn(!updatesOptIn)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setUpdatesOptIn(!updatesOptIn)
                    }
                  }}
                >
                  <div className="knob" />
                </div>
                <div>{updatesOptIn ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : message.includes('Thanks') ? 'Submitted ✓' : '🚀 Join the Beta'}
            </button>
            {message && <div className={message.includes('problem') ? 'error' : 'success'}>{message}</div>}
          </div>
        </form>

        <div className="note" style={{ marginTop: '14px' }}>
          By submitting you agree to receive a TestFlight invite if selected. Your Apple ID email is only used for
          invites and will not be shared.
        </div>
      </div>
    </main>
  )
}
