import { site, linkWhatsapp } from '../data/site'
import Reveal from './Reveal'
import './Orcamento.css'

export default function Orcamento() {
  return (
    <div className="container">
      <section className="orcamento" id="orcamento">
        <Reveal as="span" className="tag">
          Orçamento sem compromisso
        </Reveal>
        <Reveal as="h2">
          Bora colocar seu
          <br />
          negócio <span className="grad">no ar?</span>
        </Reveal>
        <Reveal as="p" className="muted">
          Me chama no WhatsApp, conta um pouco do seu negócio e eu te passo um
          orçamento.
        </Reveal>
        <Reveal className="botoes">
          <a
            className="btn btn--principal"
            href={linkWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chamar no WhatsApp
          </a>
          <a
            className="btn"
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Seguir @nukze.empresas ↗
          </a>
        </Reveal>
      </section>
    </div>
  )
}
