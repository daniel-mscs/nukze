import { parceiro, linkWhatsapp } from '../data/site'
import Reveal from './Reveal'
import './Marketing.css'

const servicos = [
  [
    'Tráfego pago',
    'Anúncios no Instagram e Facebook (Meta Ads) mirando quem mora perto.',
  ],
  ['Campanhas', 'Ele pega as artes do seu negócio e coloca pra rodar.'],
  ['Marca do zero', 'Paleta de cores e tom de voz, pra quem tá começando.'],
]

export default function Marketing() {
  const iniciais = parceiro.nome
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <section className="secao container" id="marketing">
      <Reveal className="mkt">
        <div>
          <span className="tag">Parceiro de marketing</span>
          <h2>
            Site pronto. <span className="grad">Agora, clientes.</span>
          </h2>
          <p className="muted">
            Eu faço o site e a agenda. O {parceiro.nome.split(' ')[0]} cuida de
            levar gente até eles. Dá pra contratar junto do plano Automático, e
            o valor você combina direto com ele, conforme o que o seu negócio
            precisa.
          </p>
          <ul className="mkt__lista">
            {servicos.map(([t, d]) => (
              <li key={t}>
                <b>{t}</b>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <a
            className="btn btn--principal"
            href={linkWhatsapp(
              'Oi! Vi no site da Nukze e quero saber do marketing e tráfego pago.',
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quero saber do marketing
          </a>
        </div>

        <div className="mkt__cartao">
          <div className="mkt__foto">
            {parceiro.foto ? (
              <img
                src={parceiro.foto}
                alt={`Foto de ${parceiro.nome}`}
                loading="lazy"
              />
            ) : (
              <span aria-hidden="true">{iniciais}</span>
            )}
          </div>
          <b>{parceiro.nome}</b>
          <small>{parceiro.cargo}</small>
          {parceiro.instagram && (
            <a
              className="btn"
              href={parceiro.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>
          )}
          <em>Valor a combinar</em>
        </div>
      </Reveal>
    </section>
  )
}
