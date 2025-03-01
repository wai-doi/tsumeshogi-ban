import './RowNumbers.css'

export function RowNumbers(): JSX.Element {
  return (
    <div className="row-numbers">
      {'一二三四五六七八九'.split('').map((num) => (
        <span key={num}>{num}</span>
      ))}
    </div>
  )
}
