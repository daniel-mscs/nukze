import { site, linkWhatsapp } from '../data/site'
import Reveal from './Reveal'
import FotoAscii from './FotoAscii'
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

  return (
    <section className="secao container" id="quem-faz">
      <Reveal className="quem">
        <div className="quem__foto">
          <FotoAscii src={dono.foto} alt={`Foto de ${dono.nome}`} />
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
