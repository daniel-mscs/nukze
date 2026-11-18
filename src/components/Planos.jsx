import {
  planos,
  modulos,
  comboModulos,
  taxaCriacao,
  provisorio,
  real,
} from '../data/planos'
import Reveal from './Reveal'
import './Planos.css'

export default function Planos({ onEscolher, escolhidos, setEscolhidos }) {
  const alterna = (id) =>
    setEscolhidos((l) =>
      l.includes(id) ? l.filter((x) => x !== id) : [...l, id],
    )

  return (
    <section className="secao container" id="planos">
      <div className="cabecalho">
        <Reveal as="span" className="tag">
          Planos
        </Reveal>
        <Reveal as="h2">
          Escolha o tamanho <span className="grad">do seu passo.</span>
        </Reveal>
        <Reveal as="p" className="muted">
          Sem fidelidade. Começa no Vitrine e sobe de plano quando quiser.
        </Reveal>
      </div>

      {provisorio && import.meta.env.DEV && (
        <p className="planos__aviso-dev">
          ⚠️ Valores provisórios: edite em src/data/planos.js (aviso só aparece
          no npm run dev)
        </p>
      )}

      <div className="planos__grade">
        {planos.map((p, i) => (
          <Reveal
            key={p.id}
            className={`plano ${p.selo ? 'plano--destaque' : ''}`}
            atraso={i * 0.1}
          >
            {p.selo && <span className="plano__selo">{p.selo}</span>}
            <h3>{p.nome}</h3>
            <p className="plano__resumo">{p.resumo}</p>
            <div className="plano__preco">
              <b>{real(p.preco)}</b>
              <small>/mês</small>
            </div>
            <ul>
              {p.inclui.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {p.nota && <p className="plano__nota">{p.nota}</p>}
            {p.bonus && (
              <a className="plano__bonus" href="#marketing">
                <b>📣 {p.bonus.titulo}</b>
                <span>{p.bonus.texto}</span>
                <em>{p.bonus.preco} →</em>
              </a>
            )}
            <a
              className={`btn ${p.selo ? 'btn--principal' : ''}`}
              href="#monte-seu-plano"
              onClick={() => onEscolher(p.id)}
            >
              Quero o {p.nome}
            </a>
          </Reveal>
        ))}
      </div>

      <div className="planos__extras">
        <Reveal className="extras">
          <h4>Módulos extras do painel</h4>
          <p>
            Somam em qualquer plano. Levando os 3, sai por {real(comboModulos)}
            /mês.
          </p>
          <div className="extras__lista">
            {modulos.map((m) => (
              <div key={m.id} className="extras__item">
                <div>
                  <b>{m.nome}</b>
                  <span>{m.descricao}</span>
                </div>
                <div className="extras__acao">
                  <em>+ {real(m.preco)}/mês</em>
                  <button
                    type="button"
                    className={escolhidos.includes(m.id) ? 'on' : ''}
                    aria-pressed={escolhidos.includes(m.id)}
                    onClick={() => alterna(m.id)}
                  >
                    {escolhidos.includes(m.id) ? '✓ Adicionado' : '+ Adicionar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {escolhidos.length > 0 && (
            <a
              className="btn btn--principal extras__ir"
              href="#monte-seu-plano"
            >
              Ver meu plano com {escolhidos.length} módulo
              {escolhidos.length > 1 ? 's' : ''} →
            </a>
          )}
        </Reveal>

        <Reveal className="extras extras--taxa" atraso={0.1}>
          <span className="extras__rotulo">{taxaCriacao.rotulo}</span>
          <h4>Criação do site sob medida</h4>
          <span className="extras__de">{real(taxaCriacao.de)}</span>
          <span className="extras__valor grad">{real(taxaCriacao.preco)}</span>
          <p
            className="muted"
            style={{ margin: '6px 0 0', fontSize: '0.85rem' }}
          >
            Pagamento único, {taxaCriacao.parcelas}.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
