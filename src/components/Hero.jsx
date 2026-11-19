import Iphone from './Iphone'
import Navegador from './Navegador'
import { projetos } from '../data/projetos'
import { useEffect, useRef, useState } from 'react'
import './Hero.css'

// Quebra o texto em palavras pra cada uma entrar com um pequeno atraso
function Palavras({ texto, inicio = 0, className = '', fixa = false }) {
  return texto.split(' ').map((p, i) => (
    <span key={i}>
      <span
        className={fixa ? '' : `hero__palavra ${className}`}
        style={fixa ? undefined : { animationDelay: `${(inicio + i) * 0.1}s` }}
      >
        {p}
      </span>{' '}
    </span>
  ))
}

// Textura de caracteres (tipo ASCII) gerada uma vez num canvas
let textura = null
function texturaAscii() {
  if (textura) return textura
  const c = document.createElement('canvas')
  c.width = c.height = 240
  const g = c.getContext('2d')
  const chars = '01#@%&*+=<>/{}$'
  g.font = 'bold 13px "Space Mono", monospace'
  g.textBaseline = 'top'
  for (let y = 0; y < 240; y += 12)
    for (let x = 0; x < 240; x += 8) {
      g.fillStyle = Math.random() > 0.5 ? '#2dd4bf' : '#a78bfa'
      g.fillText(chars[(Math.random() * chars.length) | 0], x, y)
    }
  textura = `url(${c.toDataURL()})`
  return textura
}

// Título com uma "lente" que mostra as palavras feitas de caracteres,
// igual ao efeito das fotos do Quem faz e do marketing
function Titulo() {
  const caixa = useRef(null)
  const [ativo, setAtivo] = useState(false)
  const tempo = useRef(0)

  useEffect(() => {
    caixa.current.style.setProperty('--textura', texturaAscii())
    return () => clearTimeout(tempo.current)
  }, [])

  const move = (e) => {
    const r = caixa.current.getBoundingClientRect()
    caixa.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    caixa.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  // no celular: toca e a lente aparece por 2,5 s
  const toque = (e) => {
    move(e)
    setAtivo(true)
    clearTimeout(tempo.current)
    tempo.current = setTimeout(() => setAtivo(false), 2500)
  }

  const linhas = (fixa) => (
    <>
      <Palavras texto="Seu negócio" fixa={fixa} />
      <Palavras
        texto="no automático."
        inicio={2}
        fixa={fixa}
        className="grad"
      />
    </>
  )

  return (
    <h1
      ref={caixa}
      className={`hero__titulo ${ativo ? 'hero__titulo--on' : ''}`}
      onPointerEnter={(e) =>
        e.pointerType === 'mouse' && (move(e), setAtivo(true))
      }
      onPointerLeave={(e) => e.pointerType === 'mouse' && setAtivo(false)}
      onPointerMove={move}
      onClick={(e) => e.nativeEvent.pointerType !== 'mouse' && toque(e)}
    >
      <span className="hero__base">{linhas(false)}</span>
      <span className="hero__ascii" aria-hidden="true">
        {linhas(true)}
      </span>
    </h1>
  )
}

export default function Hero() {
  const rezenha = projetos[0]
  return (
    <header className="hero" id="topo">
      <div className="hero__aurora" aria-hidden="true">
        <i />
        <i />
      </div>
      <div className="hero__grade" aria-hidden="true" />

      <div className="container hero__conteudo">
        <div className="hero__texto">
          <span className="tag">Site + agenda + painel</span>
          <Titulo />
          <p className="hero__sub muted">
            Site sob medida, agendamento online e painel de gestão para
            barbearias, estúdios de tatuagem, manicures e salões. Seus clientes
            marcam sozinhos e você acompanha tudo pelo celular.
          </p>
          <div className="botoes">
            <a className="btn btn--principal" href="#demo">
              ▶ Testar a demo
            </a>
            <a className="btn" href="#orcamento">
              Pedir orçamento
            </a>
          </div>
          <div className="hero__provas">
            <span>
              ✦ <b>Sem app</b> pra baixar
            </span>
            <span>
              ✦ <b>Agenda 24h</b>
            </span>
            <span>
              ✦ <b>Já em uso</b> todo dia
            </span>
          </div>
        </div>

        <div className="hero__palco">
          <div className="tilt" style={{ '--forca': 6 }}>
            <Navegador
              url="barbeariarezenha.com.br"
              video={rezenha.videoDesktop}
              alt="Site da Rezenha Barbearia no computador"
            />
          </div>
          <div className="hero__cel flutua">
            <div className="tilt" style={{ '--forca': 14 }}>
              <Iphone
                video={rezenha.videoCelular}
                alt="Site da Rezenha rolando no celular"
              />
            </div>
          </div>
          <div className="hero__cel hero__cel--2 flutua flutua--lento">
            <div className="tilt" style={{ '--forca': 14 }}>
              <Iphone
                src="/projetos/rezenha/celular-painel.webp"
                alt="Painel do dono no celular"
              />
            </div>
          </div>
          <div className="hero__aviso" aria-hidden="true">
            <span className="pingo" />
            <div>
              <b>Novo agendamento</b>
              <span>Corte + Barba · hoje 14:30</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
