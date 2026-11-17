import { useEffect, useRef } from 'react'

// Devolve uma ref; quando o elemento entra na tela, ganha a classe "on".
// IntersectionObserver avisa quando algo aparece, sem ficar checando a cada scroll.
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.classList.add('on')
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
