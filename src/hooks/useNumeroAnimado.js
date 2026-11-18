import { useEffect, useRef, useState } from 'react'

// Faz um número "rolar" suavemente do valor antigo até o novo.
export function useNumeroAnimado(alvo, duracao = 500) {
  const [valor, setValor] = useState(alvo)
  const atual = useRef(alvo)

  useEffect(() => {
    const inicio = atual.current
    const t0 = performance.now()
    let quadro
    const passo = (agora) => {
      const p = Math.min((agora - t0) / duracao, 1)
      const suave = 1 - Math.pow(1 - p, 3) // começa rápido e freia no final
      atual.current = Math.round(inicio + (alvo - inicio) * suave)
      setValor(atual.current)
      if (p < 1) quadro = requestAnimationFrame(passo)
    }
    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [alvo, duracao])

  return valor
}
