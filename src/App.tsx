import { MotionConfig } from 'framer-motion'
import {
  Briefcase,
  GraduationCap,
  Home,
  Terminal,
  User,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Education } from '@/components/sections/Education'
import { TerminalSection } from '@/components/sections/TerminalSection'
import { useActiveSection } from '@/hooks/useActiveSection'
import { NAV } from '@/lib/nav'

const ICONS: Record<string, LucideIcon> = {
  main: Home,
  about: User,
  projects: Briefcase,
  skills: Wrench,
  education: GraduationCap,
  cli: Terminal,
}

const NAV_ITEMS = NAV.map((item) => ({
  name: item.label,
  url: `#${item.id}`,
  icon: ICONS[item.id],
}))

export default function App() {
  const active = useActiveSection()
  const activeLabel = NAV.find((item) => item.id === active)?.label

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:border focus:border-accent focus:bg-panel focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:text-accent"
      >
        Skip to content
      </a>

      <NavBar items={NAV_ITEMS} active={activeLabel} />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-24">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Education />
        <TerminalSection />
      </main>

      <Footer />
    </MotionConfig>
  )
}
