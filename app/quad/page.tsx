'use client'
import { useRef } from 'react'
import Image from 'next/image'
import './quad.css'

export default function QuadLanding() {
  const feedbackRef = useRef<HTMLParagraphElement>(null)
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleShare = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const shareData = {
      title: 'Quad • Campus clubs made easy',
      text: 'Check out Quad — the campus events app keeping students connected.',
      url: window.location.href,
    }
    const showFeedback = (message: string) => {
      const el = feedbackRef.current
      if (!el) {
        alert(message)
        return
      }
      el.textContent = message
      el.classList.add('is-visible')
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = setTimeout(() => {
        el.classList.remove('is-visible')
      }, 2400)
    }
    const copyManually = () => {
      const tempInput = document.createElement('input')
      tempInput.value = shareData.url
      document.body.appendChild(tempInput)
      tempInput.select()
      try {
        document.execCommand('copy')
        showFeedback('Link copied—share it with your friends!')
      } catch (err) {
        showFeedback('Copy this link: ' + shareData.url)
      }
      document.body.removeChild(tempInput)
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        showFeedback('Thanks for sharing Quad!')
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url)
        showFeedback('Link copied—share it with your friends!')
      } else {
        copyManually()
      }
    } catch (error) {
      copyManually()
    }
  }

  return (
    <div className="quad">
      <header>
        <nav>
          <div className="brand">
            <Image src="/images/quad-icon.png" alt="Quad icon" width={48} height={48} />
            <span>Quad</span>
          </div>
          <a className="cta-button secondary" href="mailto:tmastrangelo@elon.edu" target="_blank" rel="noopener">Chat with us</a>
        </nav>

        <div className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Founding campus rollout</span>
            <h1>Campus events, organized in one <span>living feed</span>.</h1>
            <p className="tagline">
              Quad keeps your campus connected with tailored events, effortless RSVPs, and simple tools for every org to reach the right people at the right time.
            </p>
            <div className="hero-actions">
              <a className="cta-button primary" href="/quad/testflight">Join the TestFlight beta</a>
              <a className="cta-button accent" href="/quad/org-beta">For organizations</a>
            </div>
            <p className="share-feedback" aria-live="polite" ref={feedbackRef}></p>
            <div className="meta">
              <span>Built for campus communities</span>
              <span>Early access now open</span>
            </div>
            <div className="mobile-banner">
              <div className="mobile-banner__pill">Limited TestFlight seats</div>
              <h2>Launch Quad with us</h2>
              <p>
                Unlock the beta app in seconds and help shape campus life. Get priority updates, direct feedback channels, and first access to new features as they ship.
              </p>
              <div className="mobile-banner__actions">
                <a className="mobile-banner__button mobile-banner__button--primary" href="/quad/testflight">
                  Join the TestFlight beta
                </a>
                <a className="mobile-banner__button mobile-banner__button--ghost" href="/quad/org-beta">
                  For organizations
                </a>
              </div>
            </div>
          </div>
          <div className="app-preview-container">
            <Image className="app-preview" src="/images/quad-preview.png" alt="Quad mobile app preview" width={400} height={800} priority />
          </div>
        </div>
      </header>
      <div className="mobile-contact-cta">
        <a className="mobile-contact-cta__chat" href="mailto:tmastrangelo@elon.edu" target="_blank" rel="noopener">
          Chat with us
        </a>
        <a className="mobile-contact-cta__share" href="#" onClick={handleShare} data-share>
          Share Quad
        </a>
      </div>
      <div className="founder-credit">Created by Tyler Mastrangelo</div>
    </div>
  )
}
