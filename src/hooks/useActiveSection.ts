import { useEffect, useState } from 'react'
import { NAV_IDS } from '@/lib/nav'

/** Which section the reading line is inside.
 *  Reading line = 40% of the viewport, capped so the last section can still
 *  light up when the page ends right after it. */
export function useActiveSection() {
  const [active, setActive] = useState(NAV_IDS[0])

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.scrollY + Math.min(window.innerHeight * 0.4, 360)
      let current = NAV_IDS[0]

      for (const id of NAV_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= line) current = id
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atBottom) current = NAV_IDS[NAV_IDS.length - 1]

      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return active
}
