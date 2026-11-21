import { MessageCircle, StickyNote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { db, reais, dataHora, fone, zap, nomePlano, statusPedido } from './util'
import { FormCliente } from './Clientes'

const FILTROS = [['todos', 'Todos'], ...Object.entries(statusPedido)]

export default function Pedidos({ dono }) {
  const [lista, setLista] = useState(null)
  const [filtro, setFiltro] = useState('nova')
  const [virando, setVirando] = useState(null) // pedido que vai virar cliente
  const [erro, setErro] = useState('')

  const carrega = () =>
    db
      .from('solicitacoes_plano')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setErro('Não consegui carregar os pedidos.')
        setLista(data || [])
      })
  useEffect(() => {
    carrega()
  }, [])

  async function muda(p, campos) {
    const { error } = await db
      .from('solicitacoes_plano')
      .update(campos)
      .eq('id', p.id)
    if (error) return alert('Não deu pra salvar. Tenta de novo.')
    setLista((l) => l.map((x) => (x.id === p.id ? { ...x, ...campos } : x)))
  }

  async function apaga(p) {
    if (!confirm(`Apagar o pedido de ${p.nome}? Não dá pra desfazer.`)) return
    const { error } = await db
      .from('solicitacoes_plano')
      .delete()
      .eq('id', p.id)
    if (error) return alert('Não deu pra apagar.')
    setLista((l) => l.filter((x) => x.id !== p.id))
  }

  if (!lista) return <p className="pn-carregando">Carregando…</p>
  const visiveis = lista.filter(
    (p) => filtro === 'todos' || p.status === filtro,
  )
  const conta = (s) => lista.filter((p) => p.status === s).length

  return (
    <>
      <header className="pn-cab">
        <h1>Pedidos</h1>
        <p>Chegam pelo "Monte seu plano" do site.</p>
      </header>
      {erro && <p className="pn-erro">{erro}</p>}

      <div className="pn-filtros">
        {FILTROS.map(([id, nome]) => (
          <button
            key={id}
            className={filtro === id ? 'on' : ''}
            onClick={() => setFiltro(id)}
          >
            {nome}
            {id !== 'todos' && <i>{conta(id)}</i>}
          </button>
        ))}
      </div>

      {!visiveis.length && <p className="pn-vazio">Nenhum pedido aqui.</p>}

      <div className="pn-grade">
        {visiveis.map((p) => (
          <article key={p.id} className="pn-cartao pn-pedido">
            <div className="pn-pedido__topo">
              <div>
                <b>{p.negocio}</b>
                <span>
                  {p.nome} · {p.cidade}
                </span>
              </div>
              <span className={`pn-st pn-st--${p.status}`}>
                {statusPedido[p.status]}
              </span>
            </div>

            <dl className="pn-dados">
              <dt>Plano</dt>
              <dd>
                {nomePlano[p.plano] || p.plano}
                {p.modulos?.length > 0 && ` + ${p.modulos.join(', ')}`}
              </dd>
              {dono && p.valor_mensal != null && (
                <>
                  <dt>Valor</dt>
                  <dd>
                    {reais(p.valor_mensal)}/mês
                    {p.taxa_criacao
                      ? ` + ${reais(p.taxa_criacao)} criação`
                      : ''}
                  </dd>
                </>
              )}
              <dt>Tipo</dt>
              <dd>{p.nicho || p.tipo}</dd>
              {p.descricao && (
                <>
                  <dt>Pediu</dt>
                  <dd>{p.descricao}</dd>
                </>
              )}
              <dt>Chegou</dt>
              <dd>{dataHora(p.created_at)}</dd>
            </dl>

            <a
              className="pn-bt pn-bt--zap"
              href={zap(
                p.whatsapp,
                `Oi, ${p.nome.split(' ')[0]}! Aqui é o Daniel, da Nukze. Recebi teu pedido do plano ${nomePlano[p.plano] || ''} pro ${p.negocio}. Bora conversar?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />{' '}
              {fone(p.whatsapp)}
            </a>

            {dono && (
              <div className="pn-pedido__acoes">
                <select
                  value={p.status}
                  onChange={(e) => muda(p, { status: e.target.value })}
                  aria-label="Status do pedido"
                >
                  {Object.entries(statusPedido).map(([id, nome]) => (
                    <option key={id} value={id}>
                      {nome}
                    </option>
                  ))}
                </select>
                <button
                  className="pn-bt pn-bt--pri"
                  onClick={() => setVirando(p)}
                >
                  Virar cliente
                </button>
                <button className="pn-bt pn-bt--x" onClick={() => apaga(p)}>
                  Apagar
                </button>
                <textarea
                  defaultValue={p.observacao || ''}
                  maxLength={500}
                  placeholder="Anotação interna…"
                  onBlur={(e) =>
                    e.target.value !== (p.observacao || '') &&
                    muda(p, { observacao: e.target.value || null })
                  }
                />
              </div>
            )}
            {!dono && p.observacao && (
              <p className="pn-obs">
                <StickyNote size={14} strokeWidth={1.8} aria-hidden="true" />{' '}
                {p.observacao}
              </p>
            )}
          </article>
        ))}
      </div>

      {virando && (
        <FormCliente
          pedido={virando}
          onFechar={() => setVirando(null)}
          onSalvo={(_c, fechar) => {
            // 1º salvamento: o pedido vira "fechado" e a ficha fica aberta pros serviços
            if (!fechar) muda(virando, { status: 'fechada' })
            else setVirando(null)
          }}
        />
      )}
    </>
  )
}
