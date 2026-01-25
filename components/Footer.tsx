'use client'

export default function Footer() {
  const socials = [
    { name: 'GitHub', href: 'https://github.com/tymastrangelo' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/tymastrangelo' },
    { name: 'Instagram', href: 'https://instagram.com/tymastrangelo' },
    { name: 'TikTok', href: 'https://tiktok.com/@tymastrangelo' },
  ]

  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">Tyler Mastrangelo</p>
            <p className="text-xs text-gray-600">
              Building real systems and products
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-primary transition-colors link-hover cursor-hover"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Tyler Mastrangelo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
