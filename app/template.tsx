// Remounts on route change, so every page arrives with the same 200ms fade
// (.page-fade in app/site.css: only where view transitions aren't supported,
// none under reduced motion). If a navigation
// does not remount it, the page simply shows without the fade.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>
}
