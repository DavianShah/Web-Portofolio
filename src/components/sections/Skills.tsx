import { skillGroups } from '@/data/skills'
import { TUX } from '@/lib/terminal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Skills() {
  return (
    <section id="skills" className="mb-16 sm:mb-24">
      <SectionHeading
        command="neofetch --skills"
        hint={`${skillGroups.length} groups`}
      />

      <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14">
        <pre
          aria-hidden="true"
          className="overflow-x-auto font-mono text-[13px] leading-[1.45] text-accent sm:text-sm"
        >
          {TUX.join('\n')}
        </pre>

        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.id}>
              <dt className="font-mono text-xs text-accent">{group.category}</dt>
              <dd className="mt-2 font-mono text-[11px] text-dim">
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true" className="text-quiet">
                        -{' '}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
