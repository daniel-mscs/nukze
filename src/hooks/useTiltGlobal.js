import { useEffect } from 'react'

// Guarda a posição do mouse (no PC) ou do scroll (no celular) em duas
// variáveis CSS, --px e --py, de -1 a 1. Os mockups usam essas variáveis
// pra inclinar em 3D, sem precisar de estado do React (mais leve).
export function useTiltGlobal() {
  useEffect(() => {
    const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calmo) return
    const raiz = document.documentElement
    const define = (x, y) => {
      raiz.style.setProperty('--px', x.toFixed(3))
      raiz.style.setProperty('--py', y.toFixed(3))
    }
    const temMouse = matchMedia('(hover: hover)').matches
    const noMouse = (e) =>
      define(
        (e.clientX / innerWidth) * 2 - 1,
        (e.clientY / innerHeight) * 2 - 1,
      )
    const noScroll = () =>
      define(Math.sin(scrollY / 300) * 0.8, Math.cos(scrollY / 400) * 0.5)
    const evento = temMouse ? 'pointermove' : 'scroll'
    const funcao = temMouse ? noMouse : noScroll
    addEventListener(evento, funcao, { passive: true })
    return () => removeEventListener(evento, funcao)
  }, [])
}
