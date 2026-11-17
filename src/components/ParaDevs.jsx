import { site, linkWhatsapp } from '../data/site'
import Reveal from './Reveal'
import './ParaDevs.css'

export default function ParaDevs() {
  return (
    <section className="secao container" id="devs">
      <div className="devs">
        <Reveal>
          <span className="tag">É dev também?</span>
          <h2>
            Bora construir <span className="grad">junto.</span>
          </h2>
          <p className="muted">
            Se você programa e quer tocar um projeto comigo, dividir um freela
            ou trocar ideia sobre a stack, me chama. Tô sempre aberto a
            parceria.
          </p>
          <ul>
            <li>Parceria em projetos de clientes (front, back ou design)</li>
            <li>Indicação de clientes com comissão</li>
            <li>Projetos open source e estudos em grupo</li>
          </ul>
          <div className="botoes" style={{ justifyContent: 'flex-start' }}>
            <a
              className="btn btn--principal"
              href={linkWhatsapp(
                'Oi Daniel! Sou dev e queria fazer um projeto contigo.',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chamar pra parceria
            </a>
            {site.links.github && (
              <a
                className="btn"
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                Meu GitHub ↗
              </a>
            )}
          </div>
        </Reveal>

        <Reveal className="devs__codigo" atraso={0.15} aria-hidden="true">
          <header>
            <i />
            <i />
            <i />
            <span style={{ marginLeft: 8 }}>parceria.js</span>
          </header>
          <pre>
            <span className="c">{'// stack que uso no dia a dia'}</span>
            {'\n'}
            <span className="k">const</span> stack = [
            <span className="s">'React'</span>,{' '}
            <span className="s">'Vite'</span>,{' '}
            <span className="s">'Supabase'</span>,{'\n'}{' '}
            <span className="s">'Java'</span>,{' '}
            <span className="s">'WhatsApp API'</span>,{' '}
            <span className="s">'Vercel'</span>]{'\n\n'}
            <span className="k">const</span> parceria = {'{'}
            {'\n'} voce: <span className="s">'dev'</span>,{'\n'} eu:{' '}
            <span className="s">'{site.dono.nome}'</span>,{'\n'} objetivo:{' '}
            <span className="s">'entregar coisa boa'</span>,{'\n'}
            {'}'}
            {'\n\n'}
            <span className="k">await</span> bora(parceria){' '}
            <span className="devs__cursor" />
          </pre>
        </Reveal>
      </div>
    </section>
  )
}
