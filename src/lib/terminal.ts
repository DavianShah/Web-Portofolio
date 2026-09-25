import { personal } from '@/data/personal'
import { projects } from '@/data/projects'
import { skillGroups } from '@/data/skills'
import { education } from '@/data/education'
import { socialLinks } from '@/data/social'

export type LineKind = 'out' | 'ok' | 'warn' | 'bad' | 'echo' | 'note'

export interface OutLine {
  text: string
  kind?: LineKind
  /** when present the whole line becomes a real link */
  href?: string
  /** PS1 rendered before an echoed command */
  prompt?: string
}

export interface Exec {
  lines: OutLine[]
  /** absolute working directory after the command; omit to leave it alone */
  cwd?: string
}

export interface Command {
  name: string
  summary: string
  run: (args: string, cwd: string) => Exec
}

export const USER = 'davian'
export const HOST = 'portfolio'
export const HOME = '/home/davian'

const out = (text = ''): OutLine => ({ text })
const ok = (text: string): OutLine => ({ text, kind: 'ok' })
const note = (text: string): OutLine => ({ text, kind: 'note' })
const bad = (text: string): OutLine => ({ text, kind: 'bad' })

const pad = (value: string, width: number) =>
  value.length >= width ? value : value + ' '.repeat(width - value.length)

/** Tux, by hjm. Kept as ASCII only — box-drawing glyphs are missing from the
 *  web font subset and fall back to a second font with a different advance. */
export const TUX = [
  "         _nnnn_",
  "        dGGGGMMb",
  "       @p~qp~~qMb",
  "       M|@||@) M|",
  "       @,----.JM|",
  "      JS^\\__/  qKL",
  "     dZP        qKRb",
  "    dZP          qKKb",
  "   fZP            SMMb",
  "   HZM            MMMM",
  "   FqM            MMMM",
  " __| \".        |\\dS\"qML",
  " |    `.       | `' \\Zq",
  "_)      \\.___.,|     .'",
  "\\____   )MMMMMP|   .'",
  "     `-'       `--'",
]

export const LOCK = [
  '      ______',
  '     /      \\',
  '    |        |',
  '    | +----+ |',
  '    | | () | |',
  '    | +----+ |',
  '    |        |',
  '    +--------+',
]

/* ── virtual filesystem ───────────────────────────────────────────── */

type FileNode = { kind: 'file'; lines: OutLine[]; mode?: string }
type DirNode = { kind: 'dir'; children: Record<string, FsNode> }
type FsNode = FileNode | DirNode

const file = (...lines: OutLine[]): FileNode => ({ kind: 'file', lines })
const dir = (children: Record<string, FsNode>): DirNode => ({ kind: 'dir', children })

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const README = file(
  out(personal.name),
  out(personal.title),
  out(),
  out(personal.bio),
  out(),
  out(`location : ${personal.origin} · ${personal.major}`),
  out(`goal     : ${personal.careerGoals.join(' / ')}`),
  out(),
  note('type help for the command list.'),
)

const SHELL: FileNode = {
  kind: 'file',
  mode: '-rwxr-xr-x',
  lines: [
    out('#!/bin/zsh'),
    out('# portfolio shell: the only file executed here.'),
    out(),
    out(`echo "hello, this is ${personal.shortName}."`),
    out('./shell.sh   # shortcut to the interactive shell below'),
  ],
}

const ROOT = dir({
  about: dir({
    'bio.txt': file(
      out(`${personal.name}  ·  ${personal.title}`),
      out(personal.faculty),
      out(`${personal.major} · Batch ${personal.batch} · ${personal.university}`),
      out(),
      out(personal.bio),
      out(),
      note('goal: ' + personal.careerGoals.join(' / ')),
    ),
    'contact.txt': file(
      ...socialLinks.map((s) => ({
        text: `${pad(s.label, 10)}${s.href.replace(/^mailto:/, '')}`,
        href: s.href,
      })),
    ),
  }),
  projects: dir(
    Object.fromEntries(
      projects.map((p) => [
        `${slug(p.title)}.md`,
        file(
          ok(`${p.title}  [${p.status}]`),
          out(),
          out(p.description),
          out(),
          out(`tech  : ${p.tech.join(', ')}`),
          ...(p.role ? [out(`role  : ${p.role}`)] : []),
          ...(p.note ? [out(), note('> ' + p.note)] : []),
        ),
      ]),
    ),
  ),
  skills: dir(
    Object.fromEntries(
      skillGroups.map((g) => [
        `${slug(g.category)}.txt`,
        file(ok(g.category), out(), out('  ' + g.items.join('\n  '))),
      ]),
    ),
  ),
  education: dir({
    'timeline.txt': file(
      ...education.flatMap((e) => [
        ok(`${e.school}  ·  ${e.period}`),
        out(`  ${e.level}${e.detail ? '  ·  ' + e.detail : ''}`),
        out(),
      ]),
    ),
  }),
  'README.md': README,
  'shell.sh': SHELL,
})

const inside = (path: string) => path === HOME || path.startsWith(HOME + '/')

function normalize(path: string): string {
  const stack: string[] = []
  for (const seg of path.split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') stack.pop()
    else stack.push(seg)
  }
  return '/' + stack.join('/')
}

export function resolvePath(cwd: string, arg: string): string {
  if (!arg || arg === '~') return HOME
  if (arg.startsWith('~/')) return normalize(HOME + '/' + arg.slice(2))
  if (arg.startsWith('/')) return normalize(arg)
  return normalize(cwd + '/' + arg)
}

function lookup(path: string): FsNode | null {
  if (path === HOME) return ROOT
  if (!inside(path)) return null
  let node: FsNode = ROOT
  for (const seg of path.slice(HOME.length + 1).split('/').filter(Boolean)) {
    if (node.kind !== 'dir') return null
    const next: FsNode | undefined = node.children[seg]
    if (!next) return null
    node = next
  }
  return node
}

export function displayPath(path: string): string {
  if (path === HOME) return '~'
  if (inside(path)) return '~' + path.slice(HOME.length)
  return path
}

export function promptFor(cwd: string): string {
  return `${USER}@${HOST}:${displayPath(cwd)}$`
}

/** Tab completion: commands when typing a bare word, paths after the first space. */
export function complete(input: string, cwd: string): string[] {
  if (!input.trim()) return []
  const sp = input.search(/\s/)
  if (sp < 0) return COMMAND_NAMES.filter((n) => n.startsWith(input.toLowerCase()))

  const head = input.slice(0, sp + 1)
  const token = input.slice(sp + 1)
  const slash = token.lastIndexOf('/')
  const dirPart = slash < 0 ? '' : token.slice(0, slash + 1)
  const namePart = slash < 0 ? token : token.slice(slash + 1)

  const node = lookup(resolvePath(cwd, dirPart || '.'))
  if (!node || node.kind !== 'dir') return []
  return Object.keys(node.children)
    .filter((n) => n.startsWith(namePart))
    .sort()
    .map((n) => `${head}${dirPart}${n}${node.children[n].kind === 'dir' ? '/' : ''}`)
}

/* ── commands ─────────────────────────────────────────────────────── */

const HELP_BODY = [
  'help        list these commands',
  'ls [path]   show a directory',
  'cd [path]   change directory',
  'cat <file>  print a file',
  'pwd         print the working directory',
  'whoami      short identity summary',
  'about       brief background',
  'projects    list projects',
  'skills      skills by group',
  'education   education history',
  'contact     contact links',
  'neofetch    system summary',
  'date        current date and time',
  'hire-me     how to reach me',
  'clear       clear the screen',
]

const EASTER_EGGS = ['matrix', 'sudo']

export const commands: Record<string, Command> = {
  help: {
    name: 'help',
    summary: 'list commands',
    run: () => ({
      lines: [
        out('Available commands:'),
        out(),
        ...HELP_BODY.map((l) => out('  ' + l)),
        out(),
        note('Easter eggs: ' + EASTER_EGGS.join(', ')),
      ],
    }),
  },

  whoami: {
    name: 'whoami',
    summary: 'short identity',
    run: () => ({
      lines: [
        ok(personal.name),
        out(`${personal.title} · ${personal.university}`),
        out(`${personal.faculty}`),
        out(`${personal.major} · Batch ${personal.batch} · ${personal.origin}`),
        out(),
        note('goal: ' + personal.careerGoals.join(' / ')),
      ],
    }),
  },

  about: {
    name: 'about',
    summary: 'brief background',
    run: () => ({ lines: [out(personal.bio)] }),
  },

  projects: {
    name: 'projects',
    summary: 'list projects',
    run: () => {
      const lines: OutLine[] = []
      projects.forEach((p, i) => {
        lines.push(ok(`${String(i + 1).padStart(2, '0')}  ${p.title}  [${p.status}]`))
        lines.push(out(`     tech : ${p.tech.join(', ')}`))
        if (p.role) lines.push(out(`     role : ${p.role}`))
        lines.push(out(`     ${p.description}`))
        if (p.note) lines.push(note(`     > ${p.note}`))
        if (i < projects.length - 1) lines.push(out())
      })
      return { lines }
    },
  },

  skills: {
    name: 'skills',
    summary: 'skills by group',
    run: () => {
      const lines: OutLine[] = []
      skillGroups.forEach((g) => {
        lines.push(ok(g.category))
        lines.push(out('  ' + g.items.join(' · ')))
        lines.push(out())
      })
      return { lines }
    },
  },

  education: {
    name: 'education',
    summary: 'education history',
    run: () => {
      const lines: OutLine[] = []
      education.forEach((e) => {
        lines.push(ok(`${e.school}  ·  ${e.period}`))
        lines.push(out(`  ${e.level}${e.detail ? '  ·  ' + e.detail : ''}`))
      })
      return { lines }
    },
  },

  contact: {
    name: 'contact',
    summary: 'contact links',
    run: () => ({
      lines: socialLinks.map((s) => ({
        text: `${pad(s.label, 10)}${s.href.replace(/^mailto:/, '')}`,
        href: s.href,
      })),
    }),
  },

  'hire-me': {
    name: 'hire-me',
    summary: 'how to reach me',
    run: () => ({
      lines: [
        out('Open to collaborations, internships, and freelance work.'),
        out(),
        ok(`  ${personal.email}`),
        note('  or run contact for the other links'),
      ],
    }),
  },

  pwd: {
    name: 'pwd',
    summary: 'current directory',
    run: (_args, cwd) => ({ lines: [out(cwd)] }),
  },

  cd: {
    name: 'cd',
    summary: 'change directory',
    run: (args, cwd) => {
      const raw = resolvePath(cwd, args)
      const target = HOME === raw || HOME.startsWith(raw + '/') ? HOME : raw
      const node = lookup(target)
      if (!node) return { lines: [bad(`cd: ${args}: No such file or directory`)] }
      if (node.kind !== 'dir') return { lines: [bad(`cd: ${args}: Not a directory`)] }
      return { lines: [], cwd: target }
    },
  },

  ls: {
    name: 'ls',
    summary: 'directory contents',
    run: (args, cwd) => {
      const path = args ? resolvePath(cwd, args) : cwd
      const node = inside(path) ? lookup(path) : null
      if (!node) return { lines: [bad(`ls: cannot access '${args}': No such file or directory`)] }
      if (node.kind === 'file') return { lines: [out(args)] }
      const names = Object.keys(node.children).sort((a, b) => a.localeCompare(b))
      return {
        lines: names.map((n) => {
          const child = node.children[n]
          const mode = child.kind === 'dir' ? 'drwxr-xr-x' : (child.mode ?? '-rw-r--r--')
          return out(`${mode}  ${n}${child.kind === 'dir' ? '/' : ''}`)
        }),
      }
    },
  },

  cat: {
    name: 'cat',
    summary: 'print a file',
    run: (args, cwd) => {
      if (!args) return { lines: [bad('cat: missing operand')] }
      const lines: OutLine[] = []
      for (const arg of args.split(/\s+/)) {
        const path = resolvePath(cwd, arg)
        const node = inside(path) ? lookup(path) : null
        if (!node) {
          lines.push(bad(`cat: ${arg}: No such file or directory`))
          break
        }
        if (node.kind === 'dir') {
          lines.push(bad(`cat: ${arg}: Is a directory`))
          break
        }
        lines.push(...node.lines)
      }
      return { lines }
    },
  },

  date: {
    name: 'date',
    summary: 'current date and time',
    run: () => ({
      lines: [
        out(
          new Date().toLocaleString('en-GB', {
            timeZone: 'Asia/Jakarta',
            dateStyle: 'full',
            timeStyle: 'medium',
          }) + ' WIB',
        ),
      ],
    }),
  },

  neofetch: {
    name: 'neofetch',
    summary: 'system summary',
    run: () => {
      const kv: Array<[string, string]> = [
        ['Name', personal.name],
        ['Title', personal.title],
        ['University', personal.university],
        ['Faculty', personal.faculty],
        ['Major', `${personal.major} (Batch ${personal.batch})`],
        ['Origin', personal.origin],
        ['Focus', personal.heroBadges.join(', ')],
        ['Locale', 'Tangerang, ID (WIB / UTC+7)'],
      ]
      const width = Math.max(...kv.map(([k]) => k.length))
      const rows = kv.map(([k, v]) => `${pad(k, width)}  ${v}`)
      const height = Math.max(rows.length, LOCK.length)

      return {
        lines: Array.from({ length: height }, (_, i) =>
          out(`${LOCK[i] ?? ' '.repeat(22)}  ${rows[i] ?? ''}`),
        ),
      }
    },
  },

  clear: {
    name: 'clear',
    summary: 'clear the screen',
    run: () => ({ lines: [] }),
  },

  matrix: {
    name: 'matrix',
    summary: '',
    run: () => ({
      lines: [
        out('01001000 01100101 01101100 01110000'),
        out('01101101 01100001 01110100 01110010 01101001 01111000'),
        out(),
        note('There is no spoon in this repo.'),
      ],
    }),
  },

  sudo: {
    name: 'sudo',
    summary: '',
    run: () => ({
      lines: [
        { text: '[sudo] password for visitor: ', kind: 'warn' },
        { text: 'visitor is not in the /etc/sudoers file. This incident has been reported.', kind: 'bad' },
      ],
    }),
  },
}

export const COMMAND_NAMES = Object.keys(commands)
