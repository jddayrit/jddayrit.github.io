import { useEffect, useState } from 'react'
import { profile, experience, projects, skills, principles, aiNote, education } from './data.js'
import { Text, isTodo } from './components/Text.jsx'
import { CodingBuddy } from './components/CodingBuddy.jsx'

const SECTIONS = [
  ['top', '00', 'Intro'],
  ['experience', '01', 'Experience'],
  ['projects', '02', 'Projects'],
  ['how-i-work', '03', 'How I work'],
  ['skills', '04', 'Skills'],
  ['education', '05', 'Education'],
  ['contact', '06', 'Contact'],
]

function useStored(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? fallback
    } catch {
      return fallback
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* storage unavailable */
    }
  }, [key, value])
  return [value, setValue]
}

function useTheme() {
  const [theme, setTheme] = useStored('theme', 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

function useBuddy() {
  const [on, setOn] = useStored('buddy', 'on')
  return [on !== 'off', () => setOn((v) => (v === 'off' ? 'on' : 'off'))]
}

// Live local time in the Philippines, so clients abroad can see working hours.
function useLocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit' }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return time
}

// Highlights the side-nav item for the section in view.
function useActiveSection() {
  const [active, setActive] = useState('top')
  useEffect(() => {
    const els = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

// Elements below the fold fade up as they scroll in; anything already on screen stays put.
function useReveal() {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal-pending')
        io.observe(el)
      }
    })
    return () => io.disconnect()
  }, [])
}

function Toggles({ theme, toggleTheme, buddyOn, toggleBuddy }) {
  return (
    <>
      <button
        className={`icon-btn mono buddy-toggle ${buddyOn ? 'on' : ''}`}
        onClick={toggleBuddy}
        aria-label={buddyOn ? 'Hide coding buddy' : 'Show coding buddy'}
        aria-pressed={buddyOn}
        title={buddyOn ? 'Hide coding buddy' : 'Show coding buddy'}
      >
        {'</>'}
      </button>
      <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle color theme">
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    </>
  )
}

function Rail({ active, time, ...toggles }) {
  return (
    <aside className="rail">
      <a href="#top" className="logo mono">{profile.handle}<span className="dim">/portfolio</span></a>
      <p className="open-badge mono"><span className="pulse" /> Open to work</p>
      <nav className="rail-nav" aria-label="Sections">
        {SECTIONS.map(([id, num, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'true' : undefined}>
            <span className="mono rail-num">{num}</span>
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="rail-foot">
        <p className="mono small dim local-time">
          Mabalacat, PH · <span className="accent">{time}</span> GMT+8
        </p>
        <div className="rail-actions"><Toggles {...toggles} /></div>
      </div>
    </aside>
  )
}

function MobileBar({ time, ...toggles }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="mobile-bar">
      <a href="#top" className="logo mono">{profile.handle}</a>
      <span className="mono small dim">{time} PH</span>
      <div className="header-actions">
        <Toggles {...toggles} />
        <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>≡</button>
      </div>
      {open && (
        <nav className="mobile-nav" onClick={() => setOpen(false)}>
          {SECTIONS.map(([id, num, label]) => (
            <a key={id} href={`#${id}`}><span className="mono rail-num">{num}</span> {label}</a>
          ))}
        </nav>
      )}
    </header>
  )
}

// "01 / EXPERIENCE" label with a rule running across.
function Section({ id, index, title, children }) {
  return (
    <section id={id} className="section container">
      <header className="label-rule mono reveal">
        <span className="accent">{index}</span>
        <span className="dim">/</span>
        <h2 className="label-title">{title.toUpperCase()}</h2>
        <span className="rule" />
      </header>
      {children}
    </section>
  )
}

function Hero() {
  const current = experience[0]
  return (
    <section className="hero container" id="top">
      <p className="hero-kicker mono">
        <span className="accent">$</span> {profile.name} · {profile.role}
      </p>
      <h1 className="hero-statement">
        Built to be <em>reliable</em>,<br />
        tuned to <em>scale</em>.
      </h1>
      <p className="hero-bio"><Text value={profile.bio} /></p>
      <div className="hero-actions">
        <a href="#experience" className="btn btn-primary">See my work</a>
        <a href="#contact" className="btn btn-ghost">Let's talk</a>
      </div>
      <dl className="facts">
        <div><dt>experience</dt><dd><Text value={profile.experienceSince} /></dd></div>
        <div><dt>focus</dt><dd><Text value={profile.focus} /></dd></div>
        <div><dt>currently at</dt><dd>{current.company}</dd></div>
        <div><dt>based in</dt><dd>{profile.location}</dd></div>
      </dl>
    </section>
  )
}

function Experience() {
  return (
    <Section id="experience" index="01" title="Experience">
      <ol className="timeline">
        {experience.map((job) => (
          <li key={job.company} className="timeline-item reveal">
            <div className="timeline-dot" data-tag={job.tag} />
            <div className="timeline-head">
              <span className={`badge badge-${job.tag}`}>{job.tag}</span>
              <span className="mono dim small"><Text value={job.period} /></span>
            </div>
            <h3 className="timeline-title">
              {job.company} <span className="dim">·</span> <Text value={job.role} />
            </h3>
            <p className="muted"><Text value={job.summary} /></p>
            {job.highlights?.length > 0 && (
              <ul className="card-list job-highlights">
                {job.highlights.map((h, i) => <li key={i}><Text value={h} /></li>)}
              </ul>
            )}
            <div className="chips">
              {job.projects.map((id) => {
                const p = projects.find((x) => x.id === id)
                return <a key={id} href={`#project-${id}`} className="chip chip-link">{p.name} →</a>
              })}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function ProjectCard({ p }) {
  return (
    <article className="card" id={`project-${p.id}`}>
      <div className="card-top">
        <div className="card-icon mono" aria-hidden>{p.name.slice(0, 2).toLowerCase()}</div>
        <div>
          <h3 className="card-title">{p.name}</h3>
          <p className="card-kind mono dim"><Text value={p.kind} />{p.client && <> · for {p.client}</>}</p>
        </div>
      </div>
      <p className="muted"><Text value={p.summary} /></p>
      {p.contributions.length > 0 && (
        <ul className="card-list">
          {p.contributions.map((c, i) => <li key={i}><Text value={c} /></li>)}
        </ul>
      )}
      <div className="chips">
        {p.stack.map((s, i) => <span key={i} className="chip"><Text value={s} /></span>)}
      </div>
      {p.link && <a href={p.link} className="card-link mono" target="_blank" rel="noreferrer">visit ↗</a>}
    </article>
  )
}

function Projects() {
  const companies = [...new Set(projects.map((p) => p.company))]
  return (
    <Section id="projects" index="02" title="Projects">
      {companies.map((c) => (
        <div key={c} className="project-group reveal">
          <h3 className="group-label mono"><span className="accent">./</span>{c.toLowerCase()}</h3>
          <div className="grid">
            {projects.filter((p) => p.company === c).map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        </div>
      ))}
    </Section>
  )
}

function HowIWork() {
  return (
    <Section id="how-i-work" index="03" title="How I work">
      <div className="principles">
        {principles.map(([title, body], i) => (
          <article key={title} className="principle reveal">
            <span className="mono accent">0{i + 1}</span>
            <h3>{title}</h3>
            <p className="muted">{body}</p>
          </article>
        ))}
      </div>
      <div className="ai-note reveal">
        <p className="mono dim small"><span className="accent">$</span> cat ai-workflow.md</p>
        <p>{aiNote}</p>
      </div>
    </Section>
  )
}

function Skills() {
  const [active, setActive] = useState(null)
  const selected = active && skills[active[0]]?.items[active[1]]
  return (
    <Section id="skills" index="04" title="Skills">
      <div className="skills reveal">
        {skills.map((g, gi) => (
          <div key={g.group} className="skill-group">
            <h3 className="group-label mono"><span className="accent">├─</span> {g.group}</h3>
            <div className="chips">
              {g.items.map((s, i) => {
                const isActive = active && active[0] === gi && active[1] === i
                return (
                  <button
                    key={i}
                    className={`chip skill ${isActive ? 'active' : ''}`}
                    onClick={() => setActive(isActive ? null : [gi, i])}
                    onMouseEnter={() => setActive([gi, i])}
                  >
                    <span className="status-dot" data-status={s.status} /> <Text value={s.name} />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="skill-detail mono">
        {selected ? (
          <>
            <span className="accent">{selected.status}</span> · <Text value={selected.name} />
            {selected.note && <> · <Text value={selected.note} /></>}
          </>
        ) : (
          <span className="dim">// hover or tap a skill for details</span>
        )}
      </p>
    </Section>
  )
}

function Education() {
  return (
    <Section id="education" index="05" title="Education">
      <div className="edu-list">
        {education.map((e) => (
          <article key={e.school} className="edu reveal">
            <div className="card-icon mono" aria-hidden>{e.school.split(' ').map((w) => w[0]).join('').slice(0, 2).toLowerCase()}</div>
            <div>
              <h3 className="card-title">{e.school}</h3>
              <p className="muted"><Text value={e.degree} /></p>
              <p className="mono small dim"><Text value={e.period} /></p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

// Brand icons for the contact links (24x24 paths).
const ICONS = {
  upwork:
    'M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z',
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
}

function Contact() {
  const hasEmail = !isTodo(profile.email)
  const links = [
    ['upwork', 'Upwork', profile.links.upwork],
    ['github', 'GitHub', profile.links.github],
    ['linkedin', 'LinkedIn', profile.links.linkedin],
  ].filter(([, , url]) => url && !isTodo(url))
  return (
    <Section id="contact" index="06" title="Contact">
      <div className="contact-grid reveal">
        <div>
          <h2 className="lets-talk">Let's <em>talk</em>.</h2>
          <p className="contact-lead">
            Have a project in mind or need another engineer on your team? I'm open to short-term work and long-term collaboration.
          </p>
          <div className="hero-actions">
            <a
              href={hasEmail ? `mailto:${profile.email}` : profile.links.upwork}
              className="btn btn-primary"
              target={hasEmail ? undefined : '_blank'}
              rel="noreferrer"
            >
              Start a conversation
            </a>
          </div>
          <ul className="social-links">
            {links.map(([key, label, url]) => (
              <li key={key}>
                <a href={url} target="_blank" rel="noreferrer" className="social-link" aria-label={label} title={label}>
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path d={ICONS[key]} fill="currentColor" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <svg className="stamp" viewBox="0 0 200 200" role="img" aria-label="Open for new opportunities">
          <defs>
            <path id="stamp-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
          </defs>
          <circle cx="100" cy="100" r="92" className="stamp-ring" />
          <circle cx="100" cy="100" r="52" className="stamp-ring" />
          <text className="stamp-text">
            <textPath href="#stamp-circle" textLength="446" lengthAdjust="spacing">OPEN FOR NEW OPPORTUNITIES ✦ OPEN TO WORK ✦</textPath>
          </text>
          <text x="100" y="108" textAnchor="middle" className="stamp-center">{'</>'}</text>
        </svg>
      </div>
    </Section>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [buddyOn, toggleBuddy] = useBuddy()
  const active = useActiveSection()
  const time = useLocalTime()
  useReveal()
  const toggles = { theme, toggleTheme, buddyOn, toggleBuddy }
  return (
    <div className="layout">
      <Rail active={active} time={time} {...toggles} />
      <MobileBar time={time} {...toggles} />
      {buddyOn && <CodingBuddy />}
      <main className="main">
        <Hero />
        <Experience />
        <Projects />
        <HowIWork />
        <Skills />
        <Education />
        <Contact />
        <footer className="footer container mono dim">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>EOF</span>
        </footer>
      </main>
    </div>
  )
}
