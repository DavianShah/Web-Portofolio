import type { Project } from '@/data/types'

interface ManifestRowProps {
  index: number
  project: Project
}

const STATUS_TONE: Record<Project['status'], string> = {
  completed: 'text-ok',
  'in-progress': 'text-warn',
  planned: 'text-quiet',
}

/** A row of a manifest, not a card. The description is behind a native
 *  <details>, so it opens with the keyboard and without JavaScript. */
export function ManifestRow({ index, project }: ManifestRowProps) {
  return (
    <details className="group border-b border-line last:border-b-0">
      <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-x-4 gap-y-1 px-2 py-4 transition-colors hover:bg-raise/70 sm:px-3 [&::-webkit-details-marker]:hidden">
        <span className="w-7 shrink-0 font-mono text-xs text-quiet">
          {String(index).padStart(2, '0')}
        </span>
        <span className="text-base font-medium text-hi transition-colors group-open:text-accent sm:text-lg">
          {project.title}
        </span>
        {project.role && project.role !== project.title ? (
          <span className="hidden font-mono text-[11px] text-quiet md:inline">{project.role}</span>
        ) : null}
        <span className="ml-auto flex flex-wrap items-baseline justify-end gap-x-4 gap-y-1">
          <span className="font-mono text-[11px] text-dim">{project.tech.join(' / ')}</span>
          <span className={`font-mono text-[11px] ${STATUS_TONE[project.status]}`}>
            {project.status}
          </span>
          <span aria-hidden="true" className="font-mono text-xs text-quiet group-open:hidden">
            [+]
          </span>
          <span
            aria-hidden="true"
            className="hidden font-mono text-xs text-accent group-open:inline"
          >
            [-]
          </span>
        </span>
      </summary>
      <div className="max-w-3xl px-2 pb-5 pl-9 text-sm leading-relaxed text-dim sm:px-3 sm:pl-14">
        <p>{project.description}</p>
        {project.note ? (
          <p className="mt-3 flex gap-2 font-mono text-[13px] leading-relaxed text-accent">
            <span aria-hidden="true" className="shrink-0">
              &gt;
            </span>
            <span>{project.note}</span>
          </p>
        ) : null}
      </div>
    </details>
  )
}
