import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/site/Nav'
import Cover from '@/components/site/Cover'
import { coverFrames } from '@/lib/photos'

export const metadata: Metadata = { title: 'not found' }

// A wrong link still lands on one of my photos, with two ways back
export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="content" className="site">
        <Cover frames={coverFrames}>
          <h1 className="display not-found-title">This page doesn’t exist</h1>
          <p className="lead cover-line">The link might be old, or the page moved.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="button">
              Go home
            </Link>
            <Link href="/projects" className="button button-quiet">
              See the projects
            </Link>
          </div>
        </Cover>
      </main>
    </>
  )
}
