import type { SkillGroup } from '@/data/types'

export const skillGroups: SkillGroup[] = [
  {
    id: 'programming',
    category: 'Programming',
    items: ['Python', 'C', 'HTML', 'CSS', 'JavaScript', 'SQL'],
  },
  {
    id: 'frontend',
    category: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS'],
  },
  {
    id: 'devops',
    category: 'DevOps & Infrastructure',
    items: ['Linux', 'Ubuntu Server', 'Docker', 'Kubernetes', 'Git'],
  },
  {
    id: 'interests',
    category: 'Interests',
    items: ['Cybersecurity', 'Networking', 'Home Server', 'LLM'],
  },
  {
    id: 'languages',
    category: 'Languages',
    items: ['Indonesian (Native)', 'English (Proficient)'],
  },
]
