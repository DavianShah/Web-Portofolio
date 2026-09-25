import { projects } from '@/data/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ManifestRow } from '@/components/ui/ManifestRow'

export function Projects() {
  return (
    <section id="projects" className="mb-16 sm:mb-24">
      <SectionHeading command="cat ~/projects/manifest.log" hint={`${projects.length} entries`} />

      <div className="border-y border-line">
        {projects.map((project, i) => (
          <ManifestRow key={project.id} index={i + 1} project={project} />
        ))}
      </div>
    </section>
  )
}
