import { useEffect, useRef, useState } from 'react'
import { projetos } from '../data/projetos'
import Iphone from './Iphone'
import Navegador from './Navegador'
import './Projetos.css'

function Celular({ src, alt, onAmpliar, lento }) {
  return (
    <div className={`flutua ${lento ? 'flutua--lento' : ''}`}>
      <div className="tilt" data-gira>
        <Iphone src={src} alt={alt} onClick={() => onAmpliar(src)} />
      </div>
    </div>
  )
}

function Slide({ slide, projeto, onAmpliar }) {
  if (slide.tipo === 'celulares') {
    return (
      <div className="slide">
        <div className="slide__aparelhos">
          {slide.imagens.map((src, i) => (
            <div
              key={src}
              className={i === 2 ? 'so-desktop' : ''}
              style={{ height: '100%', display: 'contents' }}
            >
              <Celular
                src={src}
                alt={`${projeto.nome}: tela ${i + 1}`}
                onAmpliar={onAmpliar}
                lento={i % 2}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (slide.tipo === 'destaque') {
    return (
      <div className="slide">
        <div className="slide__info">
          <span className="slide__rotulo">{slide.rotulo}</span>
          <h3>{slide.titulo}</h3>
          <p>{slide.texto}</p>
        </div>
        <div className="slide__aparelhos">
          <Celular
            src={slide.imagem}
            alt={`${projeto.nome}: ${slide.titulo}`}
            onAmpliar={onAmpliar}
          />
        </div>
      </div>
    )
  }
  return (
    <div className="slide">
      <Navegador
        url={slide.url}
        src={slide.imagem}
        alt={`${projeto.nome} no computador`}
        onClick={() => onAmpliar(slide.imagem)}
      />
    </div>
  )
}

export default function Projetos() {
  const secao = useRef(null)
  const trilho = useRef(null)
  const fundo = useRef(null)
  const pct = useRef(null)
  const [ampliada, setAmpliada] = useState(null)

  // Liga o scroll vertical ao movimento horizontal. Mexemos direto no estilo
  // (pelas refs) em vez de usar estado, pra não re-renderizar a cada frame.
  useEffect(() => {
    const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches
    let quadro = 0
    const atualiza = () => {
      quadro = 0
      const r = secao.current.getBoundingClientRect()
      const total = r.height - innerHeight
      const p = Math.min(Math.max((-r.top / total - 0.05) / 0.9, 0), 1)
      const distancia = trilho.current.scrollWidth - innerWidth
      trilho.current.style.transform = `translateX(${-p * distancia}px)`
      fundo.current.style.transform = `translateX(${-p * distancia * 0.4}px)`
      pct.current.textContent = `${Math.round(p * 100)}%`
      if (calmo) return
      // Celulares giram conforme passam pelo centro da tela
      trilho.current.querySelectorAll('[data-gira]').forEach((el) => {
        const b = el.getBoundingClientRect()
        const c = (b.left + b.width / 2 - innerWidth / 2) / innerWidth
        el.style.transform = `perspective(900px) rotateY(${c * -28}deg) rotateZ(${c * 6}deg) translateY(${Math.abs(c) * 30}px)`
      })
    }
    const pede = () => {
      if (!quadro) quadro = requestAnimationFrame(atualiza)
    }
    addEventListener('scroll', pede, { passive: true })
    addEventListener('resize', pede)
    atualiza()
    return () => {
      removeEventListener('scroll', pede)
      removeEventListener('resize', pede)
      cancelAnimationFrame(quadro)
    }
  }, [])

  // Fecha o zoom com Esc
  useEffect(() => {
    if (!ampliada) return
    const fecha = (e) => e.key === 'Escape' && setAmpliada(null)
    addEventListener('keydown', fecha)
    return () => removeEventListener('keydown', fecha)
  }, [ampliada])

  return (
    <section className="projetos" id="projetos" ref={secao}>
      <div className="projetos__fixo">
        <div className="projetos__fundo" ref={fundo} aria-hidden="true">
          {projetos.map((p) => p.nome.split(' ')[0].toUpperCase()).join(' ✦ ')}{' '}
          ✦ SEU NEGÓCIO ✦
        </div>
        <div className="projetos__cab">
          <div>
            <span className="tag">Projetos no ar</span>
            <h2>
              Feito por mim, <span className="grad">em uso de verdade</span>
            </h2>
          </div>
          <span className="projetos__pct" ref={pct}>
            0%
          </span>
        </div>

        <div className="projetos__trilho" ref={trilho}>
          {projetos.map((projeto) => (
            <div key={projeto.id} style={{ display: 'contents' }}>
              <div className="slide">
                <div className="slide__info">
                  <span className="slide__rotulo">{projeto.rotulo}</span>
                  <h3>{projeto.nome}</h3>
                  <p>{projeto.descricao}</p>
                  <div className="slide__chips">
                    {projeto.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                  <div>
                    <a
                      className="btn btn--principal"
                      href={projeto.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver ao vivo ↗
                    </a>
                  </div>
                </div>
                <div className="slide__aparelhos so-desktop">
                  <Celular
                    src={projeto.slides[0].imagens?.[0]}
                    alt={projeto.nome}
                    onAmpliar={setAmpliada}
                  />
                </div>
              </div>
              {projeto.slides.map((s, i) => (
                <Slide
                  key={i}
                  slide={s}
                  projeto={projeto}
                  onAmpliar={setAmpliada}
                />
              ))}
            </div>
          ))}
          <div className="slide slide--seu">
            <div className="slide__mais">+</div>
            <h3>Seu negócio aqui</h3>
            <p style={{ maxWidth: 380 }}>
              O próximo projeto pode ser o seu. Site sob medida, com a sua cara.
            </p>
            <a className="btn btn--principal" href="#orcamento">
              Pedir orçamento
            </a>
          </div>
        </div>
      </div>

      {ampliada && (
        <button
          className="zoom"
          onClick={() => setAmpliada(null)}
          aria-label="Fechar imagem ampliada"
        >
          <img src={ampliada} alt="" />
        </button>
      )}
    </section>
  )
}
