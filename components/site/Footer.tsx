export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-line py-10 text-sm text-mist">
          <p>Built and photographed by me.</p>
          <p>© {new Date().getFullYear()} Tyler Mastrangelo</p>
        </div>
      </div>
    </footer>
  )
}
