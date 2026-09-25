import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import {
  complete,
  commands,
  displayPath,
  HOME,
  HOST,
  promptFor,
  USER,
  type OutLine,
} from '@/lib/terminal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MacWindow } from '@/components/ui/MacWindow'

const WELCOME: OutLine[] = [
  { text: 'Interactive shell. Type help for the command list, or whoami.', kind: 'note' },
  { text: 'history: ↑ ↓ · complete: Tab · clear: Esc', kind: 'note' },
]

const TONE: Record<NonNullable<OutLine['kind']>, string> = {
  out: 'text-dim',
  ok: 'text-ok',
  warn: 'text-warn',
  bad: 'text-bad',
  note: 'text-quiet',
  echo: 'text-hi',
}

export function TerminalSection() {
  const [log, setLog] = useState<OutLine[]>(WELCOME)
  const [cwd, setCwd] = useState(HOME)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const [tab, setTab] = useState<{ base: string; i: number } | null>(null)

  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  const prompt = promptFor(cwd)

  function run(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return

    const sp = cmd.search(/\s/)
    const key = (sp < 0 ? cmd : cmd.slice(0, sp)).toLowerCase()
    const args = sp < 0 ? '' : cmd.slice(sp).trim()

    const echo: OutLine = { text: cmd, kind: 'echo', prompt }

    if (key === 'clear') {
      setLog([])
    } else if (commands[key]) {
      const exec = commands[key].run(args, cwd)
      if (exec.cwd && exec.cwd !== cwd) setCwd(exec.cwd)
      setLog((prev) => [...prev, echo, ...exec.lines])
    } else {
      setLog((prev) => [
        ...prev,
        echo,
        { text: `command not found: ${cmd}  (type 'help' for a list of commands)`, kind: 'bad' },
      ])
    }

    setHistory((h) => [...h, cmd])
    setHIdx(-1)
    setTab(null)
    setValue('')
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      run(value)
      return
    }
    if (event.key === 'Escape') {
      setValue('')
      setTab(null)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!history.length) return
      const next = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1)
      setHIdx(next)
      setValue(history[next])
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (hIdx < 0) return
      const next = hIdx + 1
      if (next >= history.length) {
        setHIdx(-1)
        setValue('')
      } else {
        setHIdx(next)
        setValue(history[next])
      }
      return
    }
    if (event.key === 'Tab') {
      const base = tab?.base ?? value
      if (!base.trim()) return
      const matches = complete(base, cwd)
      if (!matches.length) return
      const i = tab ? tab.i + 1 : 0
      if (i >= matches.length) return
      if (matches[i] === value) return
      event.preventDefault()
      setTab({ base, i })
      setValue(matches[i])
      return
    }
    setTab(null)
  }

  return (
    <section id="cli" className="mb-16 sm:mb-24">
      <SectionHeading command="./shell.sh" hint="interactive" />

      <MacWindow
        title={`${USER}@${HOST}:${displayPath(cwd)}`}
        meta="zsh · 80x24"
        bodyClassName="flex flex-col"
      >
        <div
          ref={logRef}
          className="h-[42vh] min-h-[260px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-normal sm:px-5"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) return
            inputRef.current?.focus()
          }}
        >
          <div role="log" aria-live="polite" aria-label="Terminal output" tabIndex={0}>
            {log.length === 0 ? (
              <p className="text-quiet">screen cleared.</p>
            ) : (
              log.map((line, i) => {
                if (!line.text) return <p key={i} className="min-h-[1.7em]" />
                const body =
                  line.kind === 'echo' ? (
                    <>
                      <span className="text-accent">{line.prompt ?? prompt} </span>
                      <span className="text-hi">{line.text}</span>
                    </>
                  ) : line.href ? (
                    <a
                      href={line.href}
                      target={line.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noreferrer"
                      className="underline decoration-line-hi underline-offset-4 hover:text-accent"
                    >
                      {line.text}
                    </a>
                  ) : (
                    line.text
                  )

                return (
                  <p key={i} className={`whitespace-pre-wrap break-words ${TONE[line.kind ?? 'out']}`}>
                    {line.kind === 'ok' ? (
                      <span aria-hidden="true" className="text-ok">
                        ✓{' '}
                      </span>
                    ) : null}
                    {body}
                  </p>
                )
              })
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              run(value)
            }}
            className="flex items-baseline"
          >
            <label
              htmlFor="cli-input"
              className="shrink-0 whitespace-pre select-none text-accent"
            >
              {prompt}{' '}
            </label>
            <input
              id="cli-input"
              ref={inputRef}
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                setTab(null)
              }}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="min-h-11 min-w-0 flex-1 bg-transparent text-hi caret-accent outline-none"
            />
          </form>
        </div>
      </MacWindow>
    </section>
  )
}
