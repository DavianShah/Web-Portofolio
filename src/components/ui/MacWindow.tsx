import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface MacWindowProps {
  title: string
  meta?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

/** The window chrome: three traffic lights, a hairline, a rounded frame.
 *  The lights are decoration, so they are spans, not buttons. */
export function MacWindow({ title, meta, children, className, bodyClassName }: MacWindowProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-line bg-panel shadow-win', className)}>
      <div className="flex items-center gap-3 border-b border-line bg-raise px-4 py-3">
        <span aria-hidden="true" className="flex shrink-0 gap-2">
          <i className="size-3 rounded-full bg-[#ff5f57]" />
          <i className="size-3 rounded-full bg-[#febc2e]" />
          <i className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="min-w-0 truncate font-mono text-xs text-dim">{title}</span>
        {meta ? <span className="ml-auto shrink-0 font-mono text-[11px] text-quiet">{meta}</span> : null}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}
