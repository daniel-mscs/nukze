import { useEffect, useRef, useState } from 'react'

// Painel do dono: é o MESMO sistema pra todo negócio (o produto Nukze),
// só muda a cor (tema) e os botões de cada status (fluxo).
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`

export default function Painel({ cfg, pedidos, novos, onAcao }) {
  const [aba, setAba] = useState('pedidos')
  const lista = useRef(null)
  const pago = pedidos.filter((p) => p.st === cfg.pago)
  const ativos = pedidos.filter((p) => p.st !== 'recusado')
  const aguardando = pedidos.filter(
    (p) => cfg.fluxo[p.st] && p.st !== 'confirmado' && p.st !== 'orcado',
  )

  // Rola até o pedido novo quando o painel abre
  useEffect(() => {
    const novo = lista.current?.querySelector('.pd-card--novo')
    if (novo)
      setTimeout(
        () => novo.scrollIntoView({ block: 'center', behavior: 'smooth' }),
        300,
      )
  }, [])

  const abas = [
    ['pedidos', '📥 Pedidos'],
    ['clientes', '👥 Clientes'],
    ['caixa', '💰 Caixa'],
  ]
  const clientes = Object.entries(
    pedidos.reduce((m, p) => ({ ...m, [p.nome]: (m[p.nome] || 0) + 1 }), {}),
  )

  return (
    <div className="pd">
      <aside className="pd__lado">
        <div className="pd__marca">{cfg.nome}</div>
        {abas.map(([id, t]) => (
          <button
            key={id}
            className={aba === id ? 'on' : ''}
            onClick={() => setAba(id)}
          >
            {t}
          </button>
        ))}
        <button className="off" disabled>
          📦 Estoque
        </button>
      </aside>

      <div className="pd__main" ref={lista}>
        <div className="pd__topo">
          <b>Painel · {cfg.nome}</b>
          <small>powered by nukze</small>
        </div>
        <div className="pd__abas">
          {abas.map(([id, t]) => (
            <button
              key={id}
              className={aba === id ? 'on' : ''}
              onClick={() => setAba(id)}
            >
              {t}
            </button>
          ))}
        </div>

        {aba === 'pedidos' && (
          <>
            <div className="pd__kpis">
              <div>
                <small>Pedidos</small>
                <b key={ativos.length}>{ativos.length}</b>
              </div>
              <div className="am">
                <small>Aguardando você</small>
                <b key={'a' + aguardando.length}>{aguardando.length}</b>
              </div>
              <div className="v">
                <small>Concluídos</small>
                <b>{pago.length}</b>
              </div>
              <div>
                <small>Previsto</small>
                <b key={'v' + ativos.length}>
                  {reais(ativos.reduce((t, p) => t + p.valor, 0))}
                </b>
              </div>
            </div>
            {[...pedidos].reverse().map((p) => (
              <div
                key={p.id}
                className={`pd-card ${novos.includes(p.id) ? 'pd-card--novo' : ''}`}
              >
                <div className="pd-card__quando">{p.quando}</div>
                <div className="pd-card__info">
                  <b>{p.nome}</b>
                  <span>
                    {p.titulo} · {p.detalhe}
                  </span>
                  {p.ideia && <i>“{p.ideia}”</i>}
                </div>
                <span className={`pd-st pd-st--${p.st}`}>
                  {cfg.status[p.st] || p.st}
                </span>
                <b className="pd-card__valor">{reais(p.valor)}</b>
                {cfg.fluxo[p.st] && (
                  <div className="pd-card__acoes">
                    {cfg.fluxo[p.st].map((a) => (
                      <button
                        key={a.rotulo}
                        className={a.pri ? 'pri' : a.wa ? 'wa' : ''}
                        onClick={() => onAcao(p, a)}
                      >
                        {a.rotulo}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {aba === 'clientes' &&
          clientes.map(([nome, q]) => (
            <div key={nome} className="pd-linha">
              <div>
                <b>{nome}</b>
                <span>
                  {q} pedido{q > 1 ? 's' : ''} · WhatsApp salvo
                </span>
              </div>
              <span>›</span>
            </div>
          ))}

        {aba === 'caixa' && (
          <>
            <div className="pd-total">
              <span>Entradas</span>
              <b>{reais(pago.reduce((t, p) => t + cfg.caixa(p), 0))}</b>
            </div>
            {pago.map((p) => (
              <div key={p.id} className="pd-linha">
                <div>
                  <b>{p.titulo}</b>
                  <span>{p.nome}</span>
                </div>
                <em>+ {reais(cfg.caixa(p))}</em>
              </div>
            ))}
            {!pago.length && <p className="pd-vazio">Nenhuma entrada ainda.</p>}
          </>
        )}
      </div>
    </div>
  )
}
