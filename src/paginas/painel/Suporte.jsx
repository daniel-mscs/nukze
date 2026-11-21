import {
  Bug,
  HelpCircle,
  MessageCircle,
  PencilLine,
  Siren,
  StickyNote,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { db, dataHora, fone, zap, tipoChamado, statusChamado } from './util'

const FILTROS = [
  ['abertos', 'Em aberto'],
  ['resolvido', 'Resolvidos'],
  ['todos', 'Todos'],
]

export default function Suporte({ dono }) {
  const [lista, setLista] = useState(null)
  const [filtro, setFiltro] = useState('abertos')

  useEffect(() => {
    db.from('nukze_chamados')
      .select('*')
      .order('criado_em', { ascending: false })
      .then(({ data }) => setLista(data || []))
  }, [])

  async function muda(c, campos) {
    const { error } = await db
      .from('nukze_chamados')
      .update(campos)
      .eq('id', c.id)
    if (error) return alert('Não deu pra salvar.')
    setLista((l) => l.map((x) => (x.id === c.id ? { ...x, ...campos } : x)))
  }
  async function apaga(c) {
    if (!confirm(`Apagar o chamado de ${c.nome}?`)) return
    await db.from('nukze_chamados').delete().eq('id', c.id)
    setLista((l) => l.filter((x) => x.id !== c.id))
  }

  if (!lista) return <p className="pn-carregando">Carregando…</p>
  const visiveis = lista
    .filter((c) =>
      filtro === 'todos'
        ? true
        : filtro === 'abertos'
          ? c.status !== 'resolvido'
          : c.status === filtro,
    )
    // urgentes primeiro
    .sort((a, b) =>
      a.status !== 'resolvido' && b.status !== 'resolvido'
        ? b.urgente - a.urgente
        : 0,
    )

  return (
    <>
      <header className="pn-cab">
        <h1>Suporte</h1>
        <p>
          Chamados enviados em{' '}
          <a href="/suporte/" target="_blank" rel="noopener noreferrer">
            nukze.com.br/suporte
          </a>
          . Prints chegam pelo WhatsApp.
        </p>
      </header>

      <div className="pn-filtros">
        {FILTROS.map(([id, nome]) => (
          <button
            key={id}
            className={filtro === id ? 'on' : ''}
            onClick={() => setFiltro(id)}
          >
            {nome}
          </button>
        ))}
      </div>

      {!visiveis.length && <p className="pn-vazio">Nenhum chamado aqui.</p>}

      <div className="pn-grade">
        {visiveis.map((c) => (
          <article
            key={c.id}
            className={`pn-cartao pn-chamado ${c.urgente && c.status !== 'resolvido' ? 'pn-chamado--urgente' : ''}`}
          >
            <div className="pn-pedido__topo">
              <div>
                <b>{c.negocio}</b>
                <span>
                  {c.nome} · {dataHora(c.criado_em)}
                </span>
              </div>
              <span className={`pn-st pn-st--ch-${c.status}`}>
                {statusChamado[c.status]}
              </span>
            </div>
            <div className="pn-chamado__tags">
              <span>
                {(() => {
                  const I = {
                    erro: Bug,
                    mudanca: PencilLine,
                    duvida: HelpCircle,
                  }[c.tipo]
                  return I && <I size={13} strokeWidth={2} aria-hidden="true" />
                })()}{' '}
                {tipoChamado[c.tipo]}
              </span>
              {c.urgente && (
                <span className="er">
                  <Siren size={13} strokeWidth={2} aria-hidden="true" /> Urgente
                </span>
              )}
            </div>
            <p className="pn-chamado__txt">{c.descricao}</p>
            {c.pagina && (
              <p className="pn-suave pn-chamado__pag">
                Onde:{' '}
                {/^https?:\/\//.test(c.pagina) ? (
                  <a href={c.pagina} target="_blank" rel="noopener noreferrer">
                    {c.pagina}
                  </a>
                ) : (
                  c.pagina
                )}
              </p>
            )}
            <a
              className="pn-bt pn-bt--zap"
              href={zap(
                c.whatsapp,
                `Oi, ${c.nome.split(' ')[0]}! Aqui é o Daniel, da Nukze. Recebi teu chamado de suporte, já tô vendo. Se tiver um print, me manda aqui.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />{' '}
              {fone(c.whatsapp)}
            </a>
            {dono ? (
              <div className="pn-pedido__acoes">
                <select
                  value={c.status}
                  onChange={(e) => muda(c, { status: e.target.value })}
                  aria-label="Status do chamado"
                >
                  {Object.entries(statusChamado).map(([id, n]) => (
                    <option key={id} value={id}>
                      {n}
                    </option>
                  ))}
                </select>
                <button className="pn-bt pn-bt--x" onClick={() => apaga(c)}>
                  Apagar
                </button>
                <textarea
                  defaultValue={c.observacao || ''}
                  maxLength={500}
                  placeholder="Anotação interna…"
                  onBlur={(e) =>
                    e.target.value !== (c.observacao || '') &&
                    muda(c, { observacao: e.target.value || null })
                  }
                />
              </div>
            ) : (
              c.observacao && (
                <p className="pn-obs">
                  <StickyNote size={14} strokeWidth={1.8} aria-hidden="true" />{' '}
                  {c.observacao}
                </p>
              )
            )}
          </article>
        ))}
      </div>
    </>
  )
}
