import './ColumnNumbers.css'

export function ColumnNumbers() {
  return (
    <div className="column-numbers">
      {'987654321'.split('').map((num) => (
        <span key={num}>{num}</span>
      ))}
    </div>
  )
}
