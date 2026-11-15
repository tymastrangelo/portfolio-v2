import { contactOptions, EMAIL, RESUME } from '@/lib/contact'

// The close of the home page: the same ways to reach me as the Say hi dialog,
// laid out on the page so nobody has to open anything.
export default function SayHi() {
  const others = contactOptions.filter((o) => o.label !== 'Email')
  return (
    <section className="wrap section" aria-labelledby="say-hi">
      <div className="say-hi-block surface">
        <h2 id="say-hi" className="display section-title">
          Say hi
        </h2>
        <p className="lead mt-5 max-w-[46ch] text-mist">
          If you want to talk about any of this, or you&apos;re working on something I could help with, email me.
          It&apos;s the fastest way to reach me.
        </p>
        <a href={`mailto:${EMAIL}`} className="link mt-8 inline-block break-all text-[1.5rem] font-medium md:text-[2rem]">
          {EMAIL}
        </a>
        <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
          {others.map((o) => (
            <li key={o.label}>
              <a href={o.href} target="_blank" rel="noopener noreferrer" className="link">
                {o.label}
              </a>
            </li>
          ))}
          <li>
            <a href={RESUME} target="_blank" rel="noopener noreferrer" className="link">
              Resume
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
