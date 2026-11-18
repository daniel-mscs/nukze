import { premium } from '../data/planos'
import VitrinePremium from './VitrinePremium'
import Reveal from './Reveal'
import './SitesPremium.css'

export default function SitesPremium({ onPedir }) {
  return (
    <section className="secao container" id="premium">
      <div className="premium">
        <Reveal className="premium__texto">
          <span className="tag">Sites premium</span>
          <h2>
            Só precisa de um <span className="grad">site que impressiona?</span>
          </h2>
          <p className="muted">
            Nem todo negócio precisa de agenda. Pra quem quer uma presença
            online de respeito, faço sites premium sob medida, pra qualquer
            área.
          </p>
          <ul>
            {premium.inclui.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <div className="botoes" style={{ justifyContent: 'flex-start' }}>
            <a
              className="btn btn--principal"
              href="#monte-seu-plano"
              onClick={onPedir}
            >
              Pedir orçamento de site premium
            </a>
          </div>
        </Reveal>

        <Reveal className="premium__lado" atraso={0.15}>
          <p className="premium__nichos-titulo">Faço pra qualquer área:</p>
          <div className="premium__chips">
            {premium.nichos.map((n) => (
              <span key={n}>{n}</span>
            ))}
            <span>e o seu</span>
          </div>
          <p className="premium__dica">
            Rola a página pra ver um exemplo de site premium ganhando vida ↓
          </p>
        </Reveal>
      </div>
      <VitrinePremium />
    </section>
  )
}
