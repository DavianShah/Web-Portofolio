import type { Project } from '@/data/types'

export const projects: Project[] = [
  {
    id: 'home-server',
    title: 'Home Server',
    slug: 'home-server',
    description:
      'Set up a personal home server running Ubuntu Server, using Tailscale for secure remote access and TMUX for session management. I use it to host development environments, media services, and run networking tests.',
    note: 'Runs my Hermes AI agent.',
    tech: ['Ubuntu Server', 'Tailscale', 'TMUX'],
    role: 'Personal Infrastructure',
    image: null,
    github: undefined,
    demo: undefined,
    featured: true,
    status: 'completed',
  },
  {
    id: 'ctf-platform',
    title: 'CTF Platform',
    slug: 'ctf-platform',
    description:
      'Deployed a Capture The Flag platform using GZCTF on Docker and Kubernetes. We use this for internal university training sessions and weekend CTF competitions.',
    note: 'Built for HackToday, a sub-competition of ITTODAY.',
    tech: ['Docker', 'Kubernetes', 'GZCTF'],
    role: 'CTF Platform',
    image: null,
    github: undefined,
    demo: undefined,
    featured: true,
    status: 'completed',
  },
  {
    id: 'llm-fine-tuning',
    title: 'LLM Fine-Tuning',
    slug: 'llm-fine-tuning',
    description:
      'Fine-tuned an open-source 20B language model using Google Colab and datasets from Hugging Face. Used LoRA adapters to save memory while keeping model accuracy high.',
    note: 'Uses Hugging Face datasets to build a cybersecurity RAG chatbot.',
    tech: ['GPT OSS 20B', 'Google Colab', 'Hugging Face'],
    role: 'LLM Experiment',
    image: null,
    github: undefined,
    demo: undefined,
    featured: true,
    status: 'completed',
  },
]
