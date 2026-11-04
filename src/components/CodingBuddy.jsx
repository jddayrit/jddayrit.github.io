import { useEffect, useMemo, useRef, useState } from 'react'
import { TYPING, WALK, COFFEE, BLINK, SIZE, frameToDataUrl } from './sprite.js'

const JOKES = [
  'works on my machine',
  "it's not a bug, it's a feature",
  'one more console.log...',
  'who wrote this? oh. me.',
  'it compiled first try?!',
  'TODO: fix later',
  'deploy on a Friday? bold.',
  'LGTM',
  'have you tried restarting it?',
  'git commit -m "final final v2"',
  'npm install sleep',
  'clearing node_modules...',
]

const COFFEE_JOKES = [
  'coffee.exe loading...',
  'brb, refilling my debugger',
  'fuel for the next bug',
  'caffeine: the real dependency',
  'sip. compile. repeat.',
]

const SCALE = 3
const PX = SIZE * SCALE // rendered sprite size in CSS px
const SPEED = 55 // walking speed, px per second
const MARGIN = 12 // keep this far from the viewport edges
const rand = (min, max) => min + Math.random() * (max - min)

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

// A little pixel-art coder who wanders around the screen on his own,
// stops now and then to type on his laptop, and cracks dev jokes.
export function CodingBuddy() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const roams = !reducedMotion

  const frames = useMemo(
    () => ({ typing: TYPING.map(frameToDataUrl), walk: WALK.map(frameToDataUrl), coffee: COFFEE.map(frameToDataUrl), blink: frameToDataUrl(BLINK) }),
    [],
  )

  const elRef = useRef(null)
  const [walking, setWalking] = useState(false)
  const [facingLeft, setFacingLeft] = useState(false)
  const [frame, setFrame] = useState(0)
  const [blink, setBlink] = useState(false)
  const [joke, setJoke] = useState(null)
  // What he does while sitting: 'typing' or a 'coffee' break.
  const [activity, setActivity] = useState('typing')
  const jokeIdx = useRef(0)

  // Hide while the page is being scrolled; come back shortly after it stops.
  const [scrolling, setScrolling] = useState(false)
  useEffect(() => {
    let timer
    const onScroll = () => {
      setScrolling(true)
      clearTimeout(timer)
      timer = setTimeout(() => setScrolling(false), 700)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [])

  const nextJoke = () => {
    jokeIdx.current = (jokeIdx.current + 1) % JOKES.length
    setJoke(JOKES[jokeIdx.current])
  }

  // Wander: walk to a random spot, sit and type for a while, repeat.
  useEffect(() => {
    if (!roams) return
    jokeIdx.current = Math.floor(Math.random() * JOKES.length)
    const bounds = () => ({
      maxX: Math.max(MARGIN, window.innerWidth - PX - MARGIN),
      maxY: Math.max(MARGIN + 60, window.innerHeight - PX - MARGIN),
    })
    const { maxX, maxY } = bounds()
    const pos = { x: maxX, y: maxY }
    let target = null
    let restUntil = performance.now() + 2500
    let last = performance.now()
    let raf

    const place = () => {
      if (elRef.current) {
        elRef.current.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`
        // Keep the speech bubble on screen near the edges.
        elRef.current.dataset.edge =
          pos.x > window.innerWidth - PX - 120 ? 'right' : pos.x < 110 ? 'left' : ''
      }
    }
    const pickTarget = () => {
      const b = bounds()
      // Short-ish strolls look more natural than crossing the whole screen.
      const reach = Math.min(420, Math.max(b.maxX, b.maxY))
      return {
        x: Math.min(b.maxX, Math.max(MARGIN, pos.x + rand(-reach, reach))),
        // Below the sticky header (60px)
        y: Math.min(b.maxY, Math.max(MARGIN + 60, pos.y + rand(-reach, reach) * 0.6)),
      }
    }

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!target && now >= restUntil) {
        target = pickTarget()
        setFacingLeft(target.x < pos.x)
        setWalking(true)
      }
      if (target) {
        const dx = target.x - pos.x
        const dy = target.y - pos.y
        const dist = Math.hypot(dx, dy)
        const step = SPEED * dt
        if (dist <= step) {
          pos.x = target.x
          pos.y = target.y
          target = null
          restUntil = now + rand(5500, 10000)
          setWalking(false)
          setFrame(0)
          setActivity(Math.random() < 0.45 ? 'coffee' : 'typing')
        } else {
          pos.x += (dx / dist) * step
          pos.y += (dy / dist) * step
        }
      }
      // Stay on screen if the window is resized.
      const b = bounds()
      pos.x = Math.min(pos.x, b.maxX)
      pos.y = Math.min(pos.y, b.maxY)
      place()
      raf = requestAnimationFrame(tick)
    }
    place()
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [roams])

  // Typing animation while sitting, stride while walking.
  useEffect(() => {
    if (reducedMotion) return
    const onCoffee = !walking && activity === 'coffee'
    const id = setInterval(
      () =>
        setFrame((f) => {
          // After one coffee break, set the mug down and get back to typing.
          if (onCoffee && f + 1 >= COFFEE.length) {
            setActivity('typing')
            return 0
          }
          return f + 1
        }),
      walking ? 200 : onCoffee ? 240 : 160,
    )
    return () => clearInterval(id)
  }, [walking, activity, reducedMotion])

  // Occasional blink.
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 140)
    }, 3800)
    return () => clearInterval(id)
  }, [])

  // A joke shortly after he sits down; quiet while walking.
  useEffect(() => {
    if (walking) {
      setJoke(null)
      return
    }
    const first = setTimeout(
      () => (activity === 'coffee' ? setJoke(COFFEE_JOKES[Math.floor(Math.random() * COFFEE_JOKES.length)]) : nextJoke()),
      1200,
    )
    const cycle = reducedMotion ? setInterval(nextJoke, 9000) : null
    return () => {
      clearTimeout(first)
      if (cycle) clearInterval(cycle)
    }
    // Only re-run when he sits down, not when the coffee break ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walking, reducedMotion])

  // Hide the bubble a few seconds after it appears.
  useEffect(() => {
    if (!joke) return
    const id = setTimeout(() => setJoke(null), 3600)
    return () => clearTimeout(id)
  }, [joke])

  const src = walking
    ? frames.walk[frame % WALK.length]
    : activity === 'coffee'
      ? frames.coffee[frame % COFFEE.length]
      : blink
      ? frames.blink
      : frames.typing[frame % TYPING.length]

  return (
    <div
      ref={elRef}
      className={`buddy ${roams ? 'buddy-roam' : 'buddy-parked'} ${walking ? 'is-moving' : ''} ${scrolling ? 'is-hidden' : ''}`}
      style={{ width: PX, height: PX }}
      data-activity={walking ? 'walking' : activity}
      onClick={nextJoke}
      role="button"
      tabIndex={0}
      aria-label="Coding buddy: click for a joke"
      aria-hidden={scrolling || undefined}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), nextJoke())}
    >
      {joke && !scrolling && (
        <span className="buddy-bubble mono" role="status">
          {joke}
        </span>
      )}
      <img
        src={src}
        alt=""
        width={PX}
        height={PX}
        draggable="false"
        className="buddy-sprite"
        style={{ transform: facingLeft ? 'scaleX(-1)' : undefined }}
      />
    </div>
  )
}
