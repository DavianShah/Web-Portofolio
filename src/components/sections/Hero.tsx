import { personal } from '@/data/personal'
import { MacWindow } from '@/components/ui/MacWindow'
import { useTypewriter } from '@/hooks/useTypewriter'

interface Tok {
  t: string
  c?: string
}

const k = (t: string): Tok => ({ t, c: 'syn-k' })
const s = (t: string): Tok => ({ t, c: 'syn-s' })
const str = (value: string): Tok => s(`"${value}"`)
const list = (values: string[]): Tok[] =>
  values.flatMap((v, i) => (i ? [{ t: ', ' }] : []).concat(str(v)))

const SENTENCE = "Hello, World! Let's build something secure."

const CODE: Tok[][] = [
  [k('#include '), s('<stdio.h>')],
  [k('#include '), s('<cybersec.h>')],
  [k('#include '), s('<ai.h>')],
  [],
  [k('int'), { t: ' main() {' }],
  [{ t: '    struct Developer me = {' }],
  [{ t: '        .name   = ' }, str(personal.name), { t: ',' }],
  [{ t: '        .origin = ' }, str(personal.origin), { t: ',' }],
  [{ t: '        .focus  = {' }, ...list(personal.heroBadges), { t: '},' }],
  [{ t: '        .goal   = {' }, ...list(personal.careerGoals), { t: '},' }],
  [{ t: '        .status = ' }, str(personal.title)],
  [{ t: '    };' }],
  [],
  [{ t: '    if (me.is_ready_to_collaborate) {' }],
  [{ t: '        printf(' }, str(SENTENCE), { t: ');' }],
  [{ t: '    }' }],
  [],
  [{ t: '    return' }, { t: ' 0;' }],
  [{ t: '}' }],
]

const GUTTER = Array.from({ length: CODE.length }, (_, i) => i + 1)

export function Hero() {
  const typed = useTypewriter(SENTENCE)

  return (
    <section id="main" className="mb-16 sm:mb-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl leading-[1.05] sm:text-5xl">
            {personal.name.split(' ').map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md text-dim">
            {personal.title} at {personal.university}. Working toward{' '}
            {personal.careerGoals.join(' and ')}.
          </p>

          <a
            href={`mailto:${personal.email}`}
            className="mt-8 inline-flex w-fit min-h-11 items-center gap-2 border border-accent px-4 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-accent-ink"
          >
            <span aria-hidden="true">&gt;</span> contact me
          </a>
        </div>

        <MacWindow
          title="davian@portfolio: ~/main.c"
          meta="focused · C (UTF-8)"
          className="lg:mt-8"
          bodyClassName="flex flex-col"
        >
          <div className="flex overflow-x-auto px-3 py-4 font-mono text-[12.5px] leading-[1.6] sm:px-4 sm:text-[13px]">
            <ol
              aria-hidden="true"
              className="mr-3 shrink-0 select-none border-r border-line pr-3 text-right text-quiet"
            >
              {GUTTER.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
            <code className="block text-text">
              {CODE.map((line, i) => (
                <span key={i} className="block whitespace-pre">
                  {line.length === 0 ? (
                    ' '
                  ) : (
                    line.map((tok, j) => (
                      <span key={j} className={tok.c}>
                        {tok.t}
                      </span>
                    ))
                  )}
                </span>
              ))}
            </code>
          </div>

          <div className="border-t border-line px-3 py-4 font-mono text-[12.5px] sm:px-4 sm:text-[13px]">
            <p className="text-[11px] text-quiet">output</p>
            <p className="mt-2">
              <span className="text-accent">$ </span>
              <span className="text-hi">./main</span>
            </p>
            <p className="mt-1 whitespace-pre-wrap break-words text-ok">
              {typed}
              {typed.length < SENTENCE.length ? (
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-accent"
                />
              ) : null}
            </p>
          </div>
        </MacWindow>
      </div>
    </section>
  )
}
