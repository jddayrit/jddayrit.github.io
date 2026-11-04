// All portfolio content lives here. Edit this file to update the site.
// Any string starting with "TODO:" is shown on the page as a highlighted placeholder,
// so missing details are easy to spot. Replace them with real content.

export const profile = {
  name: 'Jermaine Dayrit',
  handle: 'jermaine',
  role: 'Full-Stack Software Engineer',
  bio: "I'm a full-stack software engineer with 9 years of experience building web and mobile applications. I work mostly in Java Spring Boot on the backend and React / React Native on the frontend, and I'm comfortable with Laravel PHP too. These days I lead a Scrum team at Twist Resources, working directly with clients while staying hands-on with the code.",
  experienceSince: '2017 → now',
  location: 'Mabalacat City, Philippines',
  focus: 'Spring Boot · React · React Native',
  email: 'jdleondayrit@gmail.com',
  links: {
    github: 'https://github.com/jddayrit',
    linkedin: 'https://www.linkedin.com/in/jermaine-dayrit-11608b15a/',
    upwork: 'https://www.upwork.com/freelancers/~01b43ae00270db4ab6',
  },
}

// Work history, newest first. Each project id matches an entry in `projects`.
export const experience = [
  {
    company: 'Twist Resources',
    tag: 'current',
    role: 'Software Engineer',
    period: 'Mar 2019 → Present',
    summary:
      'Lead a Scrum team and work directly with clients to gather and size requirements, break them into clear tasks and delegate across the team, while staying hands-on with the technical stories.',
    highlights: [
      'Contribute to application architecture and technical design',
      'Build new features for web and mobile apps',
      'Run code reviews to keep quality high',
      'Write unit and automation tests',
      'Manage and improve CI/CD pipelines',
      'Mentor and guide junior developers',
    ],
    projects: ['valconnect', 'goval'],
  },
  {
    company: 'Nextvation',
    tag: 'past',
    role: 'Web Developer',
    period: 'Feb 2018 → Feb 2019',
    summary:
      'Designed, built and maintained client websites end to end, from layout and visual design to front-end and back-end functionality, with a focus on clear navigation and a smooth user experience.',
    highlights: [
      'Worked with clients and stakeholders from requirements through delivery',
      'Shared regular updates and folded feedback into each release',
    ],
    projects: ['tpc-raffle', 'dentist-cms'],
  },
  {
    company: 'Web2Rank',
    tag: 'past',
    role: 'Web Developer',
    period: 'Apr 2017 → Feb 2018',
    summary:
      'Built reliable, well-structured features from project requirements, with a focus on clean, maintainable code.',
    highlights: [
      'Integrated third-party APIs and plugins to connect with external services',
      'Collaborated on development, code reviews and problem-solving',
    ],
    projects: ['lookna'],
  },
]

export const projects = [
  {
    id: 'valconnect',
    name: 'ValConnect',
    company: 'Twist Resources',
    kind: 'Web application',
    summary: 'A valuation fulfilment platform that streamlines both desktop and onsite inspections.',
    contributions: [],
    stack: ['React', 'Spring Boot'],
    link: '',
  },
  {
    id: 'goval',
    name: 'goVal',
    company: 'Twist Resources',
    kind: 'iOS mobile application',
    summary: 'A mobile app built for property valuers to complete residential valuation reports directly from the field.',
    contributions: [],
    stack: ['React', 'React Native'],
    link: '',
  },
  {
    id: 'tpc-raffle',
    name: 'TPC Raffle System',
    company: 'Nextvation',
    client: 'TPC Energy Corporation',
    kind: 'Web application',
    summary: "A web app for the client's nationwide holiday promo that runs the raffle draw and provides reports.",
    contributions: ['Built from scratch: user management, CMS, report generation and the draw functionality'],
    stack: ['PHP', 'Laravel', 'jQuery'],
    link: '',
  },
  {
    id: 'dentist-cms',
    name: 'Dental Clinic CMS',
    company: 'Nextvation',
    client: 'dentist clients',
    kind: 'Web application',
    summary: 'A web app for dental clinics to digitally manage patient records, appointments and report generation.',
    contributions: [],
    stack: ['PHP', 'Laravel', 'jQuery'],
    link: '',
  },
  {
    id: 'lookna',
    name: 'Lookna',
    company: 'Web2Rank',
    kind: 'Web application',
    summary: 'A hyperlocal search and discovery platform for businesses.',
    contributions: [],
    stack: ['PHP', 'CodeIgniter', 'jQuery'],
    link: '',
  },
]

// Skills grouped by area. `status`: "current" (using now) or "past".
// `note` shows when a skill is hovered or tapped; leave it empty to show nothing extra.
export const skills = [
  {
    group: 'frontend',
    items: [
      { name: 'React', status: 'current', note: 'core frontend stack' },
      { name: 'JavaScript', status: 'current', note: '' },
    ],
  },
  {
    group: 'mobile',
    items: [{ name: 'React Native', status: 'current', note: 'core mobile stack' }],
  },
  {
    group: 'backend',
    items: [
      { name: 'Java', status: 'current', note: '' },
      { name: 'Spring Boot', status: 'current', note: 'core backend stack' },
      { name: 'PHP', status: 'current', note: '' },
      { name: 'Laravel', status: 'current', note: '' },
      { name: 'API integration', status: 'current', note: '' },
    ],
  },
  {
    group: 'delivery',
    items: [
      { name: 'Scrum leadership', status: 'current', note: 'leading a team at Twist Resources' },
      { name: 'Code review', status: 'current', note: '' },
      { name: 'Unit & automation tests', status: 'current', note: '' },
      { name: 'CI/CD', status: 'current', note: '' },
      { name: 'Mentoring', status: 'current', note: '' },
    ],
  },
  {
    group: 'ai tools',
    items: [
      { name: 'Claude', status: 'current', note: '' },
      { name: 'Claude Code', status: 'current', note: '' },
      { name: 'GitHub Copilot', status: 'current', note: '' },
    ],
  },
  {
    group: 'tools',
    items: [{ name: 'Git / GitHub', status: 'current', note: 'on GitHub since 2016' }],
  },
]

// "How I work" principles shown as cards.
export const principles = [
  ['APIs that read like docs', 'Clear, consistent Spring Boot endpoints that the next developer can use without asking.'],
  ['Tested before it ships', 'Unit and automation tests on the paths that matter, so releases are boring.'],
  ['Pipelines that stay green', 'CI/CD that catches problems early and gets features to users without drama.'],
  ['Teams that grow', 'Code reviews and mentoring that make juniors faster and the codebase healthier.'],
]

// Short note on how AI tools fit into the workflow.
export const aiNote =
  'I use Claude, Claude Code and GitHub Copilot to explore ideas, draft boilerplate and speed up routine work. I stay in charge of the design, review every change, and back it with tests before it ships.'

export const education = [
  {
    school: 'Mabalacat College',
    degree: 'Bachelor of Science in Information Technology',
    period: '2013 → 2017',
  },
]
