export default function Footer() {
  return (
    // Carries .filmy itself so the tokens/mono styling hold on any page
    <footer className="filmy border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-10 space-y-2">
        <p className="mono">
          Shot on a Kodak Pixpro FZ55 <span style={{ color: 'var(--safelight)' }} aria-hidden>·</span> Elon, NC
        </p>
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          © {new Date().getFullYear()} Tyler Mastrangelo. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
