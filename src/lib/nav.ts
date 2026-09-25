export interface NavItem {
  id: string
  label: string
}

/** Section order is the page narrative: who I am, what I know, what I built,
 *  what I studied, then a shell you can poke at. */
export const NAV: NavItem[] = [
  { id: 'main', label: 'main' },
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'skills' },
  { id: 'education', label: 'education' },
  { id: 'cli', label: 'terminal' },
]

export const NAV_IDS = NAV.map((n) => n.id)
