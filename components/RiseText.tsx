import { Fragment } from 'react'

// Each word rises out of its own mask, staggered. CSS only (see .rise-* in
// app/site.css), so it runs on first paint with no hydration wait, and reduced
// motion swaps the rise for a plain fade. Spaces stay real text nodes, so the
// heading reads and copies as one sentence.
export default function RiseText({
  text,
  delay = 0,
  step = 0.06,
}: {
  text: string
  /** seconds before the first word moves */
  delay?: number
  /** seconds between words */
  step?: number
}) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="rise-mask">
            <span className="rise-word" style={{ animationDelay: `${delay + i * step}s` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  )
}
