import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function NotFound() {
  return (
    <main className="relative min-h-screen">
      <Navigation />
      
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="text-8xl md:text-9xl font-display font-semibold tracking-tight">
            404
          </h1>
          <p className="text-xl text-gray-600">
            Page not found
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-secondary rounded-full text-sm font-medium hover:bg-accent hover:text-primary transition-all cursor-hover magnetic"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  )
}
