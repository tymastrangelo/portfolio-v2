'use client'

import Link from 'next/link'

export default function ThankYou() {
  return (
    <>
      <main className="thank-you-container">
        <div className="container">
          <div className="icon">✓</div>
          <h1>Thank you for joining!</h1>
          <p className="lead">
            We&apos;ve received your submission and you should receive a TestFlight invite soon if selected. Keep an eye on
            your inbox!
          </p>
          <div className="actions">
            <Link href="/quad" className="button primary">
              Back to Quad
            </Link>
            <Link href="/" className="button secondary">
              View Portfolio
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .thank-you-container {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, 'Helvetica Neue', Arial, sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .container {
          max-width: 540px;
          background: #fff;
          border-radius: 16px;
          padding: 48px 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: #fff;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        h1 {
          font-size: 28px;
          margin: 0 0 12px;
          color: #111;
        }

        .lead {
          font-size: 16px;
          line-height: 1.6;
          color: #6b7280;
          margin: 0 0 32px;
        }

        .actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .button {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease;
          display: inline-block;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .secondary {
          background: #f3f4f6;
          color: #111;
          border: 1px solid #e5e7eb;
        }
      `}</style>
    </>
  )
}
