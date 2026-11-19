import { useLayoutEffect, useRef, useState } from 'react'

// Botões tipo "pílula" com uma bolinha que desliza até a opção ativa.
// useLayoutEffect mede a posição do botão antes da tela ser pintada.
export default function Segmentado({ opcoes, valor, onChange, rotulo }) {
  const caixa = useRef(null)
  const [bola, setBola] = useState({ left: 0, width: 0, top: 0, height: 0 })

  useLayoutEffect(() => {
    const mede = () => {
      const ativo = caixa.current?.querySelector('[aria-pressed="true"]')
      if (ativo)
        setBola({
          left: ativo.offsetLeft,
          width: ativo.offsetWidth,
          top: ativo.offsetTop,
          height: ativo.offsetHeight,
        })
    }
    mede()
    addEventListener('resize', mede)
    return () => removeEventListener('resize', mede)
  }, [valor])

  return (
    <div className="seg" ref={caixa} role="group" aria-label={rotulo}>
      <span className="seg__bola" style={bola} />
      {opcoes.map(([id, texto]) => (
        <button
          key={id}
          aria-pressed={valor === id}
          onClick={() => onChange(id)}
        >
          {texto}
        </button>
      ))}
    </div>
  )
}
