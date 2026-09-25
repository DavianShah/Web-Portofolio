interface SectionHeadingProps {
  /** command shown after the prompt, e.g. `cat ~/about.md` */
  command: string
  /** right-aligned hint, e.g. `3 entries` */
  hint?: string
}

export function SectionHeading({ command, hint }: SectionHeadingProps) {
  return (
    <h2 className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-3 font-mono text-base font-medium text-hi sm:text-lg">
      <span aria-hidden="true" className="text-accent">
        &gt;
      </span>
      <span>{command}</span>
      {hint ? (
        <span className="ml-auto font-mono text-[11px] font-normal text-quiet">{hint}</span>
      ) : null}
    </h2>
  )
}
