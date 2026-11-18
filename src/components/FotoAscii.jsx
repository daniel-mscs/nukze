import { useEffect, useRef, useState } from 'react'
import './FotoAscii.css'

// Caracteres do mais "vazio" pro mais "cheio": pixel claro vira caractere denso
const CHARS = ' .:-=+*#%@'
const COLUNAS = 64

// Foto que vira arte em código (ASCII) quando o mouse passa por cima.
// Onde o mouse está, abre uma "lente" mostrando a foto de verdade.
export default function FotoAscii({ src, alt, rotulo = '<daniel />' }) {
  const caixa = useRef(null)
  const tela = useRef(null)
  const mapa = useRef(null) // grade de brilho (0..1) de cada célula
  const [ativo, setAtivo] = useState(false)
  const timer = useRef(null)

  // 1) Lê a foto uma vez e transforma em uma grade de brilho
  useEffect(() => {
    const img = new Image()
    img.src = src
    img.decode().then(() => {
      const largura = caixa.current.clientWidth
      const altura = caixa.current.clientHeight
      const celula = largura / COLUNAS
      const linhas = Math.floor(altura / (celula / 0.6))
      const c = document.createElement('canvas')
      c.width = COLUNAS
      c.height = linhas
      const ctx = c.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0, COLUNAS, linhas)
      const px = ctx.getImageData(0, 0, COLUNAS, linhas).data
      const brilho = []
      for (let i = 0; i < px.length; i += 4) {
        brilho.push(
          (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255,
        )
      }
      // Aumenta o contraste: o mais escuro vira 0, o mais claro vira 1,
      // e a curva (^1.8) deixa o fundo cinza mais "vazio" pra destacar o rosto
      const min = Math.min(...brilho)
      const max = Math.max(...brilho)
      for (let i = 0; i < brilho.length; i++) {
        brilho[i] = Math.pow((brilho[i] - min) / (max - min || 1), 1.8)
      }
      mapa.current = { brilho, linhas }
    })
  }, [src])

  // 2) Quando ativa, desenha o ASCII "decodificando" (letras aleatórias que vão assentando)
  useEffect(() => {
    if (!ativo || !mapa.current) return
    const cv = tela.current
    const largura = caixa.current.clientWidth
    const altura = caixa.current.clientHeight
    const dpr = window.devicePixelRatio || 1
    cv.width = largura * dpr
    cv.height = altura * dpr
    const ctx = cv.getContext('2d')
    ctx.scale(dpr, dpr)
    const { brilho, linhas } = mapa.current
    const celula = largura / COLUNAS
    const alturaLinha = altura / linhas
    ctx.font = `700 ${celula / 0.6}px "Space Mono", ui-monospace, monospace`
    ctx.textBaseline = 'top'
    const grad = ctx.createLinearGradient(0, 0, largura, altura)
    grad.addColorStop(0, '#2dd4bf')
    grad.addColorStop(1, '#8b5cf6')

    const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches
    const duracao = calmo ? 0 : 700
    const t0 = performance.now()
    let quadro
    const desenha = (agora) => {
      const p = duracao ? Math.min((agora - t0) / duracao, 1) : 1
      ctx.fillStyle = '#05050a'
      ctx.fillRect(0, 0, largura, altura)
      ctx.fillStyle = grad
      for (let y = 0; y < linhas; y++) {
        // as linhas de cima assentam primeiro, tipo um scanner descendo
        const pronto = p * 1.4 - (y / linhas) * 0.4
        for (let x = 0; x < COLUNAS; x++) {
          const certo =
            CHARS[
              Math.min(
                CHARS.length - 1,
                Math.floor(brilho[y * COLUNAS + x] * CHARS.length),
              )
            ]
          const ch =
            Math.random() < pronto
              ? certo
              : CHARS[(Math.random() * CHARS.length) | 0]
          if (ch !== ' ') ctx.fillText(ch, x * celula, y * alturaLinha)
        }
      }
      if (p < 1) quadro = requestAnimationFrame(desenha)
    }
    quadro = requestAnimationFrame(desenha)
    return () => cancelAnimationFrame(quadro)
  }, [ativo])

  // Lente segue o mouse (ou o dedo)
  function move(e) {
    const r = caixa.current.getBoundingClientRect()
    caixa.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    caixa.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  // No celular: toque liga por 2,5s com a lente onde tocou
  function toque(e) {
    move(e)
    setAtivo(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAtivo(false), 2500)
  }

  return (
    <div
      ref={caixa}
      className={`ascii ${ativo ? 'ascii--on' : ''}`}
      onPointerEnter={(e) =>
        e.pointerType === 'mouse' && (move(e), setAtivo(true))
      }
      onPointerLeave={(e) => e.pointerType === 'mouse' && setAtivo(false)}
      onPointerMove={move}
      onClick={(e) => e.nativeEvent.pointerType !== 'mouse' && toque(e)}
    >
      <img src={src} alt={alt} loading="lazy" width="720" height="960" />
      <canvas ref={tela} aria-hidden="true" />
      <span className="ascii__dica" aria-hidden="true">
        {rotulo}
      </span>
    </div>
  )
}
