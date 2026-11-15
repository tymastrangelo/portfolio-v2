import { notFound } from 'next/navigation'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import ProjectHeader, { headerOverrides } from '@/components/site/project/ProjectHeader'
import {
  ProjectClosing,
  ProjectGallery,
  ProjectLearned,
  ProjectStack,
  ProjectStory,
} from '@/components/site/project/sections'
import HelmetGuide from '@/components/site/project/HelmetGuide'
import { ChessBuild, ChordsMission, ContentReels, OnbyWhat } from '@/components/site/project/extras'
import { getProject, projects } from '@/lib/projects'

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug)
  if (!project) notFound()

  const slug = project.slug
  // The header shows the first photo unless it has its own video, so the
  // gallery starts after whatever the header already used
  const gallery = (project.media ?? []).slice(headerOverrides.has(slug) ? 0 : 1)
  // The chess board's facts get their own section instead of a list of lessons
  const learned = slug === 'chess-board-clock' ? [] : project.highlights ?? []
  const next = projects[(projects.indexOf(project) + 1) % projects.length]

  return (
    <>
      <Nav />
      <main id="content" className="site">
        <ProjectHeader project={project} />
        <ProjectStory project={project} />
        {slug === 'onby' && <OnbyWhat />}
        {slug === 'chords-of-hope' && <ChordsMission />}
        {slug === 'chess-board-clock' && <ChessBuild />}
        {slug === 'content-creation' && <ContentReels />}
        {learned.length > 0 && <ProjectLearned items={learned} />}
        {slug === 'iron-man-mk3-helmet' && <HelmetGuide />}
        <ProjectStack project={project} />
        {gallery.length > 0 && <ProjectGallery items={gallery} />}
        <ProjectClosing project={project} next={next} />
        <Footer />
      </main>
    </>
  )
}
