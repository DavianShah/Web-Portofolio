import { personal } from '@/data/personal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const FACTS: Array<[string, string]> = [
  ['name', personal.name],
  ['faculty', personal.faculty],
  ['major', personal.major],
  ['batch', String(personal.batch)],
  ['origin', personal.origin],
  ['goal', personal.careerGoals.join(' / ')],
]

export function About() {
  return (
    <section id="about" className="mb-16 sm:mb-24">
      <SectionHeading command="cat ~/about.md" hint="readme" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
        <p className="text-lg leading-relaxed text-hi sm:text-xl">
          {personal.bio}
        </p>

        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-3 self-start border-t border-line pt-5 font-mono text-xs sm:text-[13px] lg:border-t-0 lg:pt-0">
          {FACTS.map(([term, value]) => (
            <div key={term} className="contents">
              <dt className="text-quiet">{term}</dt>
              <dd className="break-words text-dim">{value}</dd>
            </div>
          ))}
          <dt className="text-quiet">email</dt>
          <dd className="min-w-0">
            <a
              href={`mailto:${personal.email}`}
              className="break-all py-3.5 text-accent underline decoration-line-hi underline-offset-4 hover:decoration-accent"
            >
              {personal.email}
            </a>
          </dd>
        </dl>
      </div>
    </section>
  )
}
