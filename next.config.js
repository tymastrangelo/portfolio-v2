/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // Quad became onby and lives on its own domain; old /quad/* links are
    // published (App Store, posts), and /projects/quad is on LinkedIn and resumes.
    return [
      {
        source: '/quad/:path*',
        destination: 'https://joinonby.com',
        permanent: true,
      },
      {
        source: '/projects/quad',
        destination: '/projects/onby',
        permanent: true,
      },
      // Moments became Photos. Old roll links (/moments?roll=home) land on the
      // matching album; renamed or retired rolls are mapped here.
      ...[
        ['home', '/photos/marco-island'],
        ['ski', '/photos/colorado'],
        ['greece-italy', '/photos/greece'],
        ['concerts', '/photos'],
      ].map(([roll, to]) => ({
        source: '/moments',
        has: [{ type: 'query', key: 'roll', value: roll }],
        destination: to,
        permanent: true,
      })),
      // Albums renamed when they were rebuilt from the Photos library
      { source: '/photos/vail', destination: '/photos/colorado', permanent: true },
      { source: '/photos/greece-italy', destination: '/photos/greece', permanent: true },
      { source: '/photos/shows', destination: '/photos', permanent: true },
      {
        source: '/moments',
        has: [{ type: 'query', key: 'roll', value: '(?<roll>.+)' }],
        destination: '/photos/:roll',
        permanent: true,
      },
      {
        source: '/moments',
        destination: '/photos',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Static media: cache for 30 days, serve stale while revalidating.
        // Not immutable — filenames stay stable when assets are replaced.
        source: '/:prefix(images|videos|files|games|moments|floor)/:path+',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Project photos and clips live beside the project pages, so match
        // the files only, never /projects/<slug> itself
        source: '/projects/:slug/:file([^/]+\\.(?:jpg|mp4))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
