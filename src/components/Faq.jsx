import { faq } from '../data/faq'
import Reveal from './Reveal'
import './Faq.css'

// <details> e <summary> são elementos do próprio HTML que abrem e fecham sozinhos,
// funcionam no teclado e com leitor de tela, sem precisar de JavaScript.
export default function Faq() {
  return (
    <section className="secao container" id="faq">
      <div className="cabecalho">
        <Reveal as="span" className="tag">
          Dúvidas
        </Reveal>
        <Reveal as="h2">
          Perguntas <span className="grad">frequentes.</span>
        </Reveal>
      </div>
      <div className="faq">
        {faq.map(({ p, r }, i) => (
          <Reveal
            as="details"
            key={p}
            className="faq__item"
            atraso={Math.min(i, 4) * 0.05}
          >
            <summary>
              {p}
              <span className="faq__icone" aria-hidden="true" />
            </summary>
            <p>{r}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
