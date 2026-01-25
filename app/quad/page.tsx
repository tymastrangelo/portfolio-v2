'use client'
import { useRef } from 'react'

export default function QuadLanding() {
  const feedbackRef = useRef<HTMLParagraphElement>(null)
  let feedbackTimeoutId: NodeJS.Timeout | null = null

  const handleShare = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const shareData = {
      title: 'Quad • Campus clubs made easy',
      text: 'Check out Quad — the campus events app keeping students connected.',
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    const showFeedback = (message: string) => {
      const el = feedbackRef.current
      if (!el) {
        alert(message)
        return
      }
      el.textContent = message
      el.classList.add('is-visible')
      if (feedbackTimeoutId) clearTimeout(feedbackTimeoutId)
      feedbackTimeoutId = setTimeout(() => {
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
    <>
      <header>
        <nav>
          <div className="brand">
            <img src="/images/quad-icon.png" alt="Quad icon" width={48} height={48} />
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
            <img className="app-preview" src="/images/quad-preview.png" alt="Quad mobile app preview" />
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
      <style jsx>{`
        :root {
          color-scheme: light dark;
          --bg: #1f0810;
          --bg-soft: #260913;
          --surface: rgba(255, 255, 255, 0.05);
          --primary: #6a041b;
          --primary-soft: rgba(106, 4, 27, 0.14);
          --accent: #f25f4c;
          --accent-soft: rgba(242, 95, 76, 0.18);
          --text: #f8f5f5;
          --text-soft: rgba(255, 235, 238, 0.72);
          --max-width: 1120px;
          font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        }
        * { box-sizing: border-box; }
        header {
          padding: clamp(2rem, 6vw, 4rem);
          padding-bottom: clamp(2rem, 5vw, 3.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        nav {
          width: 100%;
          max-width: var(--max-width);
          margin-bottom: clamp(3rem, 6vw, 5rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          color: inherit;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .brand img {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
        }
        .cta-button {
          padding: 0.75rem 1.4rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-decoration: none;
          color: inherit;
          font-weight: 600;
          transition: transform 0.2s ease, background-color 0.2s ease;
          background: rgba(255, 255, 255, 0.08);
        }
        .cta-button:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.18);
        }
        .hero {
          max-width: var(--max-width);
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: center;
          gap: clamp(2rem, 6vw, 4.8rem);
          position: relative;
        }
        .hero-copy {
          display: grid;
          gap: 1.6rem;
        }
        .hero-copy > * {
          opacity: 0;
          transform: translateY(28px);
          animation: fadeUp 0.75s ease-out forwards;
        }
        .hero-copy > *:nth-child(1) { animation-delay: 0.1s; }
        .hero-copy > *:nth-child(2) { animation-delay: 0.22s; }
        .hero-copy > *:nth-child(3) { animation-delay: 0.34s; }
        .hero-copy > *:nth-child(4) { animation-delay: 0.46s; }
        .hero-copy > *:nth-child(5) { animation-delay: 0.58s; }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.75rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: rgba(139, 29, 65, 0.4);
          color: rgba(255, 235, 240, 0.9);
          border: 1px solid rgba(242, 95, 76, 0.3);
          width: fit-content;
        }
        .eyebrow::before {
          content: "★";
          font-size: 0.9rem;
          color: #ffe3eb;
        }
        h1 {
          font-size: clamp(2.4rem, 6vw, 3.6rem);
          margin: 0;
          font-weight: 700;
        }
        h1 span {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #ff8b9a 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        .tagline {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-soft);
          max-width: 38rem;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1.1rem;
          align-items: center;
        }
        .primary {
          background: #8b1d41;
          color: #fff;
          border: none;
          box-shadow: 0 12px 32px rgba(139, 29, 65, 0.4);
        }
        .secondary {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .accent {
          background: #f25f4c;
          color: #fff;
          border: none;
          box-shadow: 0 12px 32px rgba(242, 95, 76, 0.4);
        }
        .share-feedback {
          display: none;
          font-size: 0.85rem;
          color: rgba(255, 235, 240, 0.72);
          margin: -0.2rem 0 0;
          min-height: 1.2rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .share-feedback.is-visible { opacity: 1; }
        .app-preview-container {
          position: relative;
          display: flex;
          justify-content: center;
          perspective: 1200px;
        }
        .app-preview {
          width: min(100%, 360px);
          filter: drop-shadow(0 40px 70px rgba(28, 6, 12, 0.55));
          display: block;
          transform-origin: center;
          animation: phoneIntro 1.1s ease-out 0.2s both;
        }
        @keyframes phoneIntro {
          0% { opacity: 0; transform: translateY(70px) rotateY(-26deg) rotateX(12deg) scale(0.9); }
          55% { opacity: 1; transform: translateY(-6px) rotateY(6deg) rotateX(-3deg) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) rotateY(0) rotateX(0) scale(1); }
        }
        .app-preview-container::before {
          content: "";
          position: absolute;
          inset: auto;
          width: 80%;
          max-width: 320px;
          height: 48px;
          background: radial-gradient(circle, rgba(255, 118, 144, 0.32) 0%, transparent 70%);
          bottom: -28px;
          filter: blur(6px);
          opacity: 0.6;
        }
        .meta {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          color: rgba(255, 240, 244, 0.72);
          font-size: 0.85rem;
        }
        .meta span {
          padding: 0.55rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(20, 4, 9, 0.55);
        }
        .mobile-banner { display: none; }
        .founder-credit {
          margin: clamp(3.4rem, 7vw, 5.2rem) auto clamp(2.2rem, 6vw, 3.6rem);
          max-width: var(--max-width);
          width: 100%;
          text-align: center;
          font-size: 0.88rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 235, 240, 0.62);
        }
        .mobile-contact-cta { display: none; }
        @media (max-width: 900px) {
          header {
            padding: clamp(1.4rem, 5vw, 2.4rem) clamp(1.1rem, 6vw, 2.2rem);
          }
          nav {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          nav .cta-button {
            justify-content: center;
            align-self: center;
            display: none;
          }
          .hero {
            grid-template-columns: 1fr;
            text-align: left;
            gap: clamp(1.6rem, 7vw, 2.4rem);
            padding: 0;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
            position: static;
          }
          .hero-copy {
            padding: 0;
            border-radius: 0;
            background: none;
            border: none;
            box-shadow: none;
            gap: 1.2rem;
            text-align: left;
            align-items: start;
            justify-items: start;
          }
          .hero-copy .eyebrow { margin-bottom: 0.3rem; }
          .hero-actions { display: none; }
          .tagline {
            font-size: 1rem;
            line-height: 1.65;
            text-align: left;
          }
          .app-preview { width: min(68vw, 320px); }
          .app-preview-container { margin: 0 auto; padding-top: 0.6rem; }
          .app-preview-container::before { max-width: 240px; }
          .meta { display: none; }
          .mobile-banner {
            display: grid;
            gap: 0.8rem;
            text-align: left;
            padding: 1.2rem 1.15rem 1.35rem;
            margin-top: 1.6rem;
            border-radius: 20px;
            background: linear-gradient(150deg, rgba(242, 95, 76, 0.88), rgba(106, 4, 27, 0.86));
            box-shadow: 0 20px 36px rgba(18, 3, 8, 0.4);
          }
          .share-feedback { display: block; }
          .mobile-banner h2 {
            margin: 0;
            font-size: 1.42rem;
            letter-spacing: -0.01em;
          }
          .mobile-banner p {
            margin: 0;
            font-size: 0.98rem;
            line-height: 1.55;
            color: rgba(255, 246, 248, 0.92);
          }
          .mobile-banner__pill {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.4rem 0.9rem;
            border-radius: 999px;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            background: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.82);
          }
          .mobile-banner__pill::before { content: "⚡"; }
          .mobile-banner__actions { display: grid; gap: 0.75rem; }
          .mobile-banner__button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            padding: 0.8rem 1rem;
            border-radius: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.2s ease;
          }
          .mobile-banner__button:hover { transform: translateY(-2px); }
          .mobile-banner__button--primary {
            color: #6a041b;
            background: #fff;
            box-shadow: 0 14px 26px rgba(255, 255, 255, 0.28);
          }
          .mobile-banner__button--ghost {
            color: #fff;
            background: rgba(255, 255, 255, 0.16);
            border: 1px solid rgba(255, 255, 255, 0.35);
            box-shadow: 0 14px 26px rgba(12, 2, 6, 0.28);
          }
          .founder-credit { margin: 2.6rem auto 1.6rem; font-size: 0.78rem; }
          .mobile-contact-cta {
            display: grid;
            gap: 0.9rem;
            margin: 1.8rem auto 0;
            justify-items: center;
          }
          .mobile-contact-cta a {
            display: inline-flex;
            align-items: center;
            gap: 0.55rem;
            padding: 0.85rem 1.6rem;
            border-radius: 18px;
            font-weight: 600;
            text-decoration: none;
            justify-content: center;
            width: min(100%, 320px);
            transition: transform 0.2s ease;
          }
          .mobile-contact-cta__chat {
            color: rgba(255, 246, 248, 0.96);
            background: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.28);
            box-shadow: 0 18px 30px rgba(12, 2, 6, 0.32);
          }
          .mobile-contact-cta__share {
            color: #fff;
            background: linear-gradient(135deg, rgba(242, 95, 76, 0.96), rgba(255, 140, 160, 0.92));
            border: 1px solid rgba(255, 206, 215, 0.6);
            box-shadow: 0 20px 34px rgba(242, 95, 76, 0.36);
            letter-spacing: 0.04em;
            text-shadow: 0 4px 16px rgba(12, 2, 6, 0.35);
          }
          .mobile-contact-cta a:hover { transform: translateY(-2px); }
        }
      `}</style>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #1a0611;
          background-image: 
            radial-gradient(ellipse at top left, rgba(242, 95, 76, 0.15), transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(139, 29, 65, 0.2), transparent 50%),
            linear-gradient(180deg, #1a0611 0%, #2d0a1a 50%, #1a0611 100%);
          background-attachment: fixed;
          color: #f8f5f5;
          min-height: 100vh;
          font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </>
  )
}
