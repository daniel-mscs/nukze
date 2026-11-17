import './Faixa.css'

const nichos = [
  'Barbearias',
  'Tatuagem',
  'Manicures',
  'Salões',
  'Estética',
  'Massagem',
]

// A lista é repetida pra animação dar a volta sem "pulo"
export default function Faixa() {
  const itens = [...nichos, ...nichos, ...nichos, ...nichos]
  return (
    <div className="faixa" aria-hidden="true">
      <div className="faixa__trilho">
        {itens.map((n, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span>{n}</span>
            <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  )
}
