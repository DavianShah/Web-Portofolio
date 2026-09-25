/* ───────────────────────────────────────────────
   Central data types for all portfolio content.
   Every data file imports from here so interfaces
   stay in one place and stay consistent.
   ─────────────────────────────────────────────── */

/* ── Projects ── */

export interface Project {
  /** Stable identifier (kebab-case). Use as React key and anchor. */
  id: string
  title: string
  slug: string
  description: string
  /** One extra line of context shown with the project. */
  note?: string
  tech: string[]
  role?: string
  /** External project URL. */
  href?: string
  /** Path to thumbnail image relative to public/. Null until assets are added. */
  image: string | null
  /** GitHub repository URL. */
  github?: string
  /** Live demo URL. */
  demo?: string
  /** Whether this project appears in the featured bento grid. */
  featured: boolean
  status: 'completed' | 'in-progress' | 'planned'
}

/* ── Skills ── */

export interface SkillGroup {
  id: string
  category: string
  items: string[]
}

/* ── Education ── */

export interface EducationEntry {
  id: string
  school: string
  level: string
  period: string
  detail?: string
}

/* ── Social ── */

export interface SocialLink {
  id: string
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'instagram' | 'mail'
  username: string
}

/* ── Personal ── */

export interface PersonalInfo {
  name: string
  shortName: string
  title: string
  university: string
  faculty: string
  major: string
  batch: number
  origin: string
  careerGoals: string[]
  bio: string
  heroBadges: string[]
  email: string
}

/* ── Future: Blog ── */

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  tags: string[]
  readingTime?: number
  image: string | null
}

/* ── Future: Certifications ── */

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
  credentialId?: string
}

/* ── Future: Work Experience ── */

export interface WorkExperience {
  id: string
  company: string
  role: string
  period: string
  description: string
  tech?: string[]
}
