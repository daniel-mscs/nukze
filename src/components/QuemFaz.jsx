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

  return (
    <section className="secao container" id="quem-faz">
      <Reveal className="quem">
        <div className="quem__foto">
          <img
            src={dono.foto}
            alt={`Foto de ${dono.nome}`}
            loading="lazy"
            width="720"
            height="960"
          />
          <span className="quem__selo">📍 {cidade}</span>
        </div>
        <div>
          <span className="tag">Quem faz</span>
          <h2>
            Oi, eu sou o <span className="grad">{dono.nome.split(' ')[0]}</span>{' '}
            👋
          </h2>
          <div className="quem__cargo">
            {dono.cargo} · {cidade}
          </div>
          <p className="muted">
            Eu desenho e programo cada site do zero, cuido da configuração do
            WhatsApp e do suporte pessoalmente. Comecei com a Rezenha Barbearia,
            que usa o sistema todo dia, e agora levo isso pra outros negócios de
            serviço.
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
