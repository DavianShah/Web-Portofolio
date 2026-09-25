import { useEffect, useState } from 'react'

function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Types `text` once, character by character.
 *  Under prefers-reduced-motion the whole string is there from the first
 *  paint: the sentence is content, so it is never withheld from anyone.
 *
 *  ponytail: `text` is read once, on mount. Remount the caller if the
 *  sentence itself has to change; every current caller passes a constant. */
export function useTypewriter(text: string, speed = 38) {
  const [out, setOut] = useState(() => (prefersReduced() ? text : ''))

  useEffect(() => {
    if (out === text) return

    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, speed)

    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed])

  return out
}
