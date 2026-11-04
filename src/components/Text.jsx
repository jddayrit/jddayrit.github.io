export const isTodo = (v) => typeof v === 'string' && v.startsWith('TODO')

// Renders content, highlighting "TODO:" placeholders so they're easy to find.
export function Text({ value }) {
  if (isTodo(value)) {
    return <span className="todo" title="Placeholder: edit src/data.js">{value.replace(/^TODO:\s*/, '')}</span>
  }
  // Date ranges like "2017 → now" get a styled arrow.
  if (typeof value === 'string' && value.includes(' → ')) {
    const [from, to] = value.split(' → ')
    return (
      <span className="range">
        {from}
        <span className="range-arrow" aria-label="to">→</span>
        {to}
      </span>
    )
  }
  return value
}
