import { useMemo, useState } from 'react'
import './Massagem.css'

const PERIODOS = {
  Manhã: ['08:00', '09:30', '11:00'],
  Tarde: ['13:30', '15:00', '16:30'],
  Noite: ['18:00', '19:30'],
}
const SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

// Monta o mês atual em semanas (com espaços vazios antes do dia 1)
function mesAtual() {
  const hoje = new Date()
  const primeiro = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const total = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate()
  const dias = Array(primeiro.getDay()).fill(null)
  for (let d = 1; d <= total; d++)
    dias.push(new Date(hoje.getFullYear(), hoje.getMonth(), d))
  return {
    dias,
    hoje: hoje.getDate(),
    nome: hoje.toLocaleDateString('pt-BR', { month: 'long' }),
  }
}

// Site fictício 3: massoterapia, clara e calma. Um quiz recomenda a terapia,
// depois um calendário do mês e uma tela final de "respira".
export default function Massagem({ cfg, onEnviar, verPainel }) {
  const [etapa, setEtapa] = useState('quiz')
  const [marcados, setMarcados] = useState([])
  const [escolha, setEscolha] = useState(null)
  const [dia, setDia] = useState(null)
  const [periodo, setPeriodo] = useState('Tarde')
  const [hora, setHora] = useState(null)
  const [quem, setQuem] = useState(cfg.terapeutas[0])
  const [nome, setNome] = useState('')
  const [pedido, setPedido] = useState(null)
  const mes = useMemo(mesAtual, [])

  // A terapia mais "votada" pelos sintomas marcados
  const recomendada = useMemo(() => {
    const votos = {}
    cfg.sintomas
      .filter((s) => marcados.includes(s.id))
      .forEach((s) => (votos[s.t] = (votos[s.t] || 0) + 1))
    return (
      Object.entries(votos).sort((a, b) => b[1] - a[1])[0]?.[0] || 'relaxante'
    )
  }, [marcados, cfg.sintomas])
  const t = cfg.terapias[escolha || recomendada]

  const alterna = (id) =>
    setMarcados((m) =>
      m.includes(id) ? m.filter((x) => x !== id) : [...m, id],
    )

  function confirmar(e) {
    e.preventDefault()
    const p = onEnviar({
      nome: nome.trim() || 'Beatriz',
      titulo: t.n,
      detalhe: `com ${quem}`,
      quando: `${dia.getDate()}/${dia.getMonth() + 1} ${hora}`,
      valor: t.p,
      st: 'pendente',
    })
    setPedido(p)
    setEtapa('feito')
  }

  return (
    <div className="lt">
      <div className="lt-bolhas" aria-hidden="true">
        <i />
        <i />
      </div>
      <header className="lt-topo">
        <span className="lt-logo">
          lótus<em>terapias</em>
        </span>
        <span>🪷</span>
      </header>

      {etapa === 'quiz' && (
        <section className="lt-sec lt-entra">
          <small className="lt-sobre">Antes de agendar</small>
          <h3>
            Como você está <em>hoje?</em>
          </h3>
          <p>Marque o que sentir. A gente indica a terapia ideal pra você.</p>
          <div className="lt-sintomas">
            {cfg.sintomas.map((s) => (
              <button
                key={s.id}
                className={marcados.includes(s.id) ? 'on' : ''}
                onClick={() => alterna(s.id)}
              >
                {s.n}
              </button>
            ))}
          </div>
          <button
            className="lt-bt"
            disabled={!marcados.length}
            onClick={() => setEtapa('indicacao')}
          >
            Ver minha indicação
          </button>
        </section>
      )}

      {etapa === 'indicacao' && (
        <section className="lt-sec lt-entra">
          <small className="lt-sobre">Indicado pra você</small>
          <div className="lt-card">
            <span className="lt-card__selo">✦ Combina com você</span>
            <h3>{t.n}</h3>
            <p>{t.porque}</p>
            <div className="lt-card__info">
              <span>{t.min} min</span>
              <b>R$ {t.p}</b>
            </div>
          </div>
          <small className="lt-sobre">Ou escolha outra</small>
          <div className="lt-outras">
            {Object.entries(cfg.terapias).map(([id, x]) => (
              <button
                key={id}
                className={(escolha || recomendada) === id ? 'on' : ''}
                onClick={() => setEscolha(id)}
              >
                {x.n}
                <span>R$ {x.p}</span>
              </button>
            ))}
          </div>
          <button className="lt-bt" onClick={() => setEtapa('agenda')}>
            Escolher dia e horário
          </button>
          <button className="lt-link" onClick={() => setEtapa('quiz')}>
            ← voltar
          </button>
        </section>
      )}

      {etapa === 'agenda' && (
        <form className="lt-sec lt-entra" onSubmit={confirmar}>
          <small className="lt-sobre">{t.n}</small>
          <h3 className="lt-mes">{mes.nome}</h3>
          <div className="lt-cal">
            {SEMANA.map((d, i) => (
              <span key={i} className="lt-cal__sem">
                {d}
              </span>
            ))}
            {mes.dias.map((d, i) =>
              d ? (
                <button
                  type="button"
                  key={i}
                  disabled={d.getDate() < mes.hoje || d.getDay() === 0}
                  className={dia?.getDate() === d.getDate() ? 'on' : ''}
                  onClick={() => {
                    setDia(d)
                    setHora(null)
                  }}
                >
                  {d.getDate()}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>
          {dia && (
            <div className="lt-entra">
              <div className="lt-periodos">
                {Object.keys(PERIODOS).map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={periodo === p ? 'on' : ''}
                    onClick={() => setPeriodo(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="lt-horas">
                {PERIODOS[periodo].map((h) => (
                  <button
                    type="button"
                    key={h}
                    className={hora === h ? 'on' : ''}
                    onClick={() => setHora(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <div className="lt-quem">
                Com
                {cfg.terapeutas.map((q) => (
                  <button
                    type="button"
                    key={q}
                    className={quem === q ? 'on' : ''}
                    onClick={() => setQuem(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <input
                className="lt-input"
                maxLength={20}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                aria-label="Seu nome"
              />
            </div>
          )}
          <button className="lt-bt" type="submit" disabled={!hora}>
            Agendar{' '}
            {hora ? `· ${dia.getDate()}/${dia.getMonth() + 1} às ${hora}` : ''}
          </button>
          <button
            type="button"
            className="lt-link"
            onClick={() => setEtapa('indicacao')}
          >
            ← voltar
          </button>
        </form>
      )}

      {etapa === 'feito' && (
        <section className="lt-sec lt-feito lt-entra">
          <div className="lt-respira" aria-hidden="true">
            <span />
          </div>
          <p className="lt-respira__txt">inspire… e solte</p>
          <h3>
            Seu momento está <em>reservado</em>, {pedido.nome}.
          </h3>
          <p>
            {t.n} com {quem}, dia {pedido.quando.replace(' ', ' às ')}. A
            confirmação chega no seu WhatsApp.
          </p>
          <button className="demo-chama" onClick={verPainel}>
            👀 Ver como a terapeuta recebe →
          </button>
        </section>
      )}
    </div>
  )
}
