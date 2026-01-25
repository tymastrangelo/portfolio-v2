'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function OrgBetaForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      orgName: (formData.get('orgName') as string)?.trim(),
      leaderName: (formData.get('leaderName') as string)?.trim(),
      role: (formData.get('role') as string)?.trim() || 'N/A',
      elonEmail: (formData.get('elonEmail') as string)?.trim(),
      appleEmail: (formData.get('appleEmail') as string)?.trim(),
      value: (formData.get('value') as string)?.trim(),
    }

    const newErrors: Record<string, string> = {}

    if (!data.orgName) newErrors.orgName = 'This field is required.'
    if (!data.leaderName) newErrors.leaderName = 'This field is required.'
    if (!data.elonEmail) {
      newErrors.elonEmail = 'This field is required.'
    } else if (!validateEmail(data.elonEmail) || !data.elonEmail.toLowerCase().endsWith('@elon.edu')) {
      newErrors.elonEmail = 'Please use your @elon.edu email.'
    }
    if (!data.appleEmail) {
      newErrors.appleEmail = 'This field is required.'
    } else if (!validateEmail(data.appleEmail)) {
      newErrors.appleEmail = 'Enter a valid email address.'
    }
    if (!data.value) newErrors.value = 'This field is required.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setMessage('Please fix the errors above.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('https://n8n.tymastrangelo.com/webhook/0cd1eae0-511c-4bda-b1a2-00062770819a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Network error')

      setMessage('Thanks! You will receive a TestFlight invite soon.')
      setTimeout(() => router.push('/quad/thank-you'), 900)
    } catch {
      setMessage('There was a problem submitting the form. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="form-container">
      <div className="container">
        <h1>🏫 Quad for Organizations – Early Access Signup</h1>
        <p className="lead">
          Thank you for your interest in <strong>Quad</strong>, a new student-built app that helps Elon organizations
          share events, manage members, and reach more students. By joining the early access group, your organization
          will be among the <strong>first to post events</strong> on Quad and help shape a tool built to increase
          student engagement across campus.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div>
              <label htmlFor="orgName">
                Organization Name <span className="small">*</span>
              </label>
              <input id="orgName" name="orgName" type="text" required aria-invalid={!!errors.orgName} />
              {errors.orgName && (
                <div className="error" aria-live="polite">
                  {errors.orgName}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="leaderName">
                Your Name <span className="small">*</span>
              </label>
              <input id="leaderName" name="leaderName" type="text" required aria-invalid={!!errors.leaderName} />
              {errors.leaderName && (
                <div className="error" aria-live="polite">
                  {errors.leaderName}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="role">Your Role/Position</label>
              <input id="role" name="role" type="text" placeholder="President, Advisor, etc." />
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
              <div className="note">(Used only for TestFlight access — not shared.)</div>
            </div>

            <div>
              <label htmlFor="value">
                What&apos;s one thing that would make Quad most valuable for your organization? <span className="small">*</span>
              </label>
              <textarea
                id="value"
                name="value"
                rows={4}
                placeholder="Your ideas help shape the app..."
                required
                aria-invalid={!!errors.value}
              />
              {errors.value && (
                <div className="error" aria-live="polite">
                  {errors.value}
                </div>
              )}
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
          By submitting, you agree to receive a TestFlight invite for early access. Your Apple ID email is only used
          for this purpose and will not be shared.
        </div>
      </div>

      <style jsx>{`
        .form-container {
          --accent: #0b7285;
          --muted: #6b7280;
          --danger: #d53f3f;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          background: #f8fafc;
          color: #0f172a;
          padding: 18px;
          min-height: 100vh;
        }

        .container {
          max-width: 760px;
          margin: 0 auto;
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
        }

        h1 {
          font-size: 20px;
          margin: 0 0 8px;
        }

        .lead {
          color: var(--muted);
          margin: 0 0 18px;
        }

        form {
          display: grid;
          gap: 12px;
          width: 100%;
        }

        label {
          font-size: 13px;
          color: #111827;
          display: block;
          margin-bottom: 6px;
        }

        input[type='text'],
        input[type='email'],
        select,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e6eef5;
          border-radius: 8px;
          font-size: 15px;
          background: #fff;
          box-sizing: border-box;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(11, 114, 133, 0.08);
          border-color: var(--accent);
        }

        .row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .small {
          font-size: 13px;
          color: var(--muted);
        }

        .actions {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 6px;
        }

        button[type='submit'] {
          background: var(--accent);
          color: #fff;
          border: none;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        button[disabled] {
          opacity: 0.6;
          cursor: default;
        }

        .note {
          font-size: 13px;
          color: var(--muted);
          margin-top: 6px;
        }

        .error {
          color: var(--danger);
          font-size: 13px;
        }

        .success {
          color: green;
          font-size: 14px;
        }

        @media (min-width: 720px) {
          .row.two {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </main>
  )
}
