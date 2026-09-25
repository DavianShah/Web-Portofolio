import { education } from '@/data/education'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Education() {
  return (
    <section id="education" className="mb-16 sm:mb-24">
      <SectionHeading command="cat ~/education.log" hint={`${education.length} entries`} />

      <ol className="border-t border-line">
        {education.map((entry) => {
          const current = entry.period.includes('Present')
          return (
            <li
              key={entry.id}
              className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-8"
            >
              <span className="w-40 shrink-0 font-mono text-xs text-quiet">{entry.period}</span>
              <div className="min-w-0">
                <div
                  className={`font-medium ${current ? 'text-accent' : 'text-hi'}`}
                >
                  {entry.school}
                </div>
                <div className="text-sm text-dim">
                  {entry.level}
                  {entry.detail ? <span className="text-quiet"> · {entry.detail}</span> : null}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
