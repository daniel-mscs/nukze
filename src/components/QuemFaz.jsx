import { useRef, useState } from 'react'
import { site, linkWhatsapp } from '../data/site'
import Reveal from './Reveal'
import './QuemFaz.css'

export default function QuemFaz() {
  const { dono, links, cidade } = site
  const lista = [
    ['Portfólio', links.portfolio],
    ['Instagram', links.instagram],
    ['LinkedIn', links.linkedin],
    ['GitHub', links.github],
    ['E-mail', links.email && `mailto:${links.email}`],
  ].filter(([, url]) => url) // só mostra o que estiver preenchido

  // No celular não existe "mouse em cima": um toque dispara o glitch por um instante
  const [glitch, setGlitch] = useState(false)
  const timer = useRef(null)
  function dispara() {
    setGlitch(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setGlitch(false), 1600)
  }

  return (
    <section className="secao container" id="quem-faz">
      <Reveal className="quem">
        <div
          className={`quem__foto ${glitch ? 'quem__foto--glitch' : ''}`}
          onClick={dispara}
        >
          {/* As camadas repetem a foto com cores separadas e são "fatiadas" no CSS */}
          <div className="glitch" style={{ '--foto': `url(${dono.foto})` }}>
            <img
              src={dono.foto}
              alt={`Foto de ${dono.nome}`}
              loading="lazy"
              width="720"
              height="960"
            />
            <span
              className="glitch__camada glitch__camada--r"
              aria-hidden="true"
            />
            <span
              className="glitch__camada glitch__camada--c"
              aria-hidden="true"
            />
            <span className="glitch__linhas" aria-hidden="true" />
            <span className="glitch__txt" aria-hidden="true">
              template_nao_encontrado.exe
            </span>
          </div>
          <span className="quem__selo">📍 {cidade}</span>
        </div>
        <div>
          <span className="tag">Quem faz</span>
          <h2>
            Quem tá <span className="grad">por trás.</span>
          </h2>
          <div className="quem__cargo">
            {dono.nome} · {dono.cargo}
          </div>
          <p className="muted">
            Dev em {cidade}. Cada site eu desenho e programo do zero, sem
            template. O WhatsApp eu configuro e o suporte é comigo, direto no
            meu número. Comecei pela Rezenha Barbearia, que usa o sistema todo
            dia.
          </p>
          <div className="quem__links">
            <a
              className="btn btn--principal"
              href={linkWhatsapp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            {lista.map(([nome, url]) => (
              <a
                key={nome}
                className="btn"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {nome} ↗
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
