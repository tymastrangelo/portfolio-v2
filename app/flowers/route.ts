import { readFile } from 'fs/promises'
import path from 'path'

// /flowers is the short link to the lily bouquet. The page itself is a standalone
// file in public/flowers so it carries none of the site's nav or styles.
export const dynamic = 'force-static'

export async function GET() {
  const html = await readFile(path.join(process.cwd(), 'public/flowers/index.html'), 'utf8')
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
