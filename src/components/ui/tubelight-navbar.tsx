import { useState } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  /** Label of the section the reading line is in. Falls back to the last click. */
  active?: string
  className?: string
}

export function NavBar({ items, active, className }: NavBarProps) {
  const [pressed, setPressed] = useState(items[0].name)
  const activeTab = active ?? pressed

  return (
    <div
      className={cn(
        'fixed bottom-0 left-1/2 z-50 mb-6 -translate-x-1/2 sm:bottom-auto sm:top-0 sm:mb-0 sm:pt-6',
        className,
      )}
    >
      <nav
        aria-label="Page sections"
        className="flex items-center gap-2 rounded-full border border-line bg-panel/85 px-1 py-1 shadow-lg backdrop-blur-lg md:gap-3"
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={() => setPressed(item.name)}
              className={cn(
                'relative flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-colors',
                'text-dim hover:text-accent',
                isActive && 'bg-accent text-accent-ink',
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute inset-0 -z-10 w-full rounded-full bg-accent/10"
                >
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-accent">
                    <div className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-accent/20 blur-md" />
                    <div className="absolute -top-1 h-6 w-8 rounded-full bg-accent/20 blur-md" />
                    <div className="absolute left-2 top-0 h-4 w-4 rounded-full bg-accent/20 blur-sm" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
