// Original pixel-art sprite: a guy with glasses typing on a laptop.
// Each frame is a 22x22 grid; each character maps to a color in PALETTE ('.' = transparent).

const PALETTE = {
  K: '#14141c', // outline
  H: '#3b2a1f', // hair
  S: '#eab48c', // skin
  s: '#c88d65', // skin shade
  G: '#111118', // glasses frame
  W: '#bfe6ff', // lens glare (screen light)
  w: '#7cc4ff', // lens glare, dimmer
  E: '#2a2a3a', // eye
  M: '#9a4f3c', // mouth
  T: '#2f8f5b', // hoodie
  t: '#226c44', // hoodie shade
  L: '#c3c8d2', // laptop lid
  l: '#959cab', // lid shade
  O: '#4ade80', // glowing logo
  B: '#5c6272', // keyboard base
  P: '#2c3654', // jeans
  C: '#f1efe9', // mug
  c: '#c9c5bb', // mug shade
  D: '#6b3e26', // coffee
  V: '#d6dde8', // steam
}

const BASE = [
  '......KKKKKKKKKK......',
  '.....KHHHHHHHHHHK.....',
  '.....KHHHHHHHHHHK.....',
  '.....KHHHSSSSSSHK.....',
  '.....KGGGGGGGGGGK.....',
  '....KSGWEGSSGWEGSK....',
  '....KSGGGGSSGGGGSK....',
  '.....KSSSSssSSSSK.....',
  '.....KSSSSMMSSSSK.....',
  '......KsSSSSSSsK......',
  '.......KKsSSsKK.......',
  '.....KTTTTTTTTTTK.....',
  '....KtTTTTTTTTTTtK....',
  '...KKKKKKKKKKKKKKKK...',
  '..KTKLLLLLLLLLLLLKTK..',
  '..KTKLLLOLLLLOLLLKTK..',
  '..KTKLLOLLLLLLOLLKTK..',
  '..KTKLLLOLLLLOLLLKTK..',
  '..KSKllllllllllllKSK..',
  '.KBBBBBBBBBBBBBBBBBBK.',
  '.KPPPPPPPPPPPPPPPPPPK.',
  '..KKKKKKKKKKKKKKKKKK..',
]

const setPx = (rows, r, c, ch) => {
  rows[r] = rows[r].slice(0, c) + ch + rows[r].slice(c + 1)
}

function variant({ leftUp = false, rightUp = false, glare = 'W', blink = false } = {}) {
  const rows = [...BASE]
  if (leftUp) { setPx(rows, 17, 3, 'S'); setPx(rows, 18, 3, 'T') }
  if (rightUp) { setPx(rows, 17, 18, 'S'); setPx(rows, 18, 18, 'T') }
  if (glare !== 'W') { setPx(rows, 5, 7, glare); setPx(rows, 5, 13, glare) }
  if (blink) { setPx(rows, 5, 8, 'G'); setPx(rows, 5, 14, 'G') }
  return rows
}

// Typing loop alternates hands; screen light flickers on the lenses.
export const TYPING = [
  variant({ leftUp: true }),
  variant({ glare: 'w' }),
  variant({ rightUp: true }),
  variant({ glare: 'w' }),
  variant({ leftUp: true, glare: 'w' }),
  variant({ rightUp: true }),
]
export const BLINK = variant({ blink: true })
export const IDLE = variant()

export const SIZE = 22

export function frameToDataUrl(rows) {
  if (typeof document === 'undefined') return ''
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  rows.forEach((row, y) => {
    ;[...row].forEach((ch, x) => {
      const color = PALETTE[ch]
      if (!color) return
      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    })
  })
  return canvas.toDataURL('image/png')
}

// Walking: standing up, laptop hugged to his chest, two-frame stride.
const WALK_TOP = [
  ...BASE.slice(0, 11),
  '.....KTTTTTTTTTTK.....',
  '....KtTTTTTTTTTTtK....',
  '...KSLLLLLLLLLLLLSK...',
  '...KSllllllllllllSK...',
  '....KtTTTTTTTTTTtK....',
  '.....KTTTTTTTTTTK.....',
  '.....KPPPPPPPPPPK.....',
]
export const WALK = [
  [
    ...WALK_TOP,
    '.....KPPPKKKKPPPK.....',
    '....KPPPK....KPPPK....',
    '....KHHHK....KHHHK....',
    '....KKKKK....KKKKK....',
  ],
  [
    ...WALK_TOP,
    '......KPPPPPPPPK......',
    '......KPPPKKPPPK......',
    '......KHHHKKHHHK......',
    '......KKKKKKKKKK......',
  ],
]

// Coffee break: he lifts a steaming mug off to his right, then takes a sip.
const MUG = ['KDDK', 'KCCK', 'KCcK', 'KKKK']
const MUG_SIDE = ['KDDK.', 'KCCKK', 'KCcKK', 'KKKK.'] // with a handle
function overlay(rows, r0, c0, pattern) {
  pattern.forEach((line, dr) => {
    ;[...line].forEach((ch, dc) => {
      if (ch !== '.') setPx(rows, r0 + dr, c0 + dc, ch)
    })
  })
}
function coffee({ sip = false, steam = 0, eyesClosed = false } = {}) {
  const rows = [...BASE]
  setPx(rows, 18, 18, 'T') // right hand leaves the keyboard
  if (sip) {
    overlay(rows, 7, 11, MUG) // mug up at his mouth
    setPx(rows, 10, 15, 'S')
    setPx(rows, 11, 15, 'S')
    setPx(rows, 11, 16, 'T') // forearm
    setPx(rows, 12, 16, 'T')
  } else {
    overlay(rows, 11, 17, MUG_SIDE) // mug held beside him
    setPx(rows, 12, 16, 'S')
    setPx(rows, 13, 16, 'S')
    const puffs = steam === 0 ? [[8, 18], [9, 19], [10, 18]] : [[8, 19], [9, 18], [10, 19]]
    puffs.forEach(([r, c]) => setPx(rows, r, c, 'V'))
  }
  if (eyesClosed) { setPx(rows, 5, 8, 'G'); setPx(rows, 5, 14, 'G') }
  return rows
}
const HOLD_A = coffee({ steam: 0 })
const HOLD_B = coffee({ steam: 1 })
const SIP = coffee({ sip: true, eyesClosed: true })
// One full coffee break, played once before he goes back to typing.
export const COFFEE = [HOLD_A, HOLD_B, HOLD_A, HOLD_B, SIP, SIP, SIP, SIP, HOLD_A, HOLD_B, HOLD_A, HOLD_B, SIP, SIP, SIP, HOLD_A, HOLD_B]
