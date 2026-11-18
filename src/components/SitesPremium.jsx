import { useRef } from 'react'
import { premium } from '../data/planos'
import VitrinePremium from './VitrinePremium'
import './SitesPremium.css'

// No PC: a seção é alta e o card fica "grudado" na tela (sticky) com o
// mockup à esquerda; o scroll da seção é que toca a animação do mockup.
// No celular: texto primeiro e o mockup embaixo, com o próprio scroll.
export default function SitesPremium({ onPedir }) {
  const trilho = useRef(null)

  return (
    <section className="secao container" id="premium">
      <div className="premium-trilho" ref={trilho}>
        <div className="premium">
          <div className="premium__mockup">
            <VitrinePremium medirDe={trilho} />
          </div>

          <div className="premium__texto">
            <span className="tag">Sites premium</span>
            <h2>
              Só precisa de um{' '}
              <span className="grad">site que impressiona?</span>
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
            <div className="premium__chips">
              {premium.nichos.map((n) => (
                <span key={n}>{n}</span>
              ))}
              <span>e o seu</span>
            </div>
            <div className="botoes" style={{ justifyContent: 'flex-start' }}>
              <a
                className="btn btn--principal"
                href="#monte-seu-plano"
                onClick={onPedir}
              >
                Pedir orçamento de site premium
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
