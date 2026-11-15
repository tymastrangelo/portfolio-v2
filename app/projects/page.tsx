import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import ProjectIndex from '@/components/site/ProjectIndex'
import { projects } from '@/lib/projects'

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main id="content" className="site">
        <ProjectIndex projects={projects} />
        <Footer />
      </main>
    </>
  )
}
