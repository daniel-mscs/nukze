import { useEffect, useState } from 'react'
import { db, data, fone, zap, hoje, diasAte } from './util'
import { FormCliente, FormClienteSimples } from './Clientes'

export const statusLead = {
  novo: 'Novo',
  contatado: 'Contatado',
  interessado: 'Interessado',
  fechado: 'Fechou',
  perdido: 'Não quis',
}
const FILTROS = [
  ['ativos', 'Em andamento'],
  ...Object.entries(statusLead),
  ['todos', 'Todos'],
]

const instaLink = (i) =>
  /^https?:\/\//.test(i) ? i : `https://instagram.com/${i.replace(/^@/, '')}`

// Possíveis clientes (prospecção): o Daniel e o Guilherme cadastram e acompanham
export default function Leads({ dono }) {
  const [lista, setLista] = useState(null)
  const [filtro, setFiltro] = useState('ativos')
  const [editando, setEditando] = useState(null) // {} = novo
  const [virando, setVirando] = useState(null)
  const [busca, setBusca] = useState('')

  const carrega = () =>
    db
      .from('nukze_leads')
      .select('*')
      .order('criado_em', { ascending: false })
      .then(({ data }) => setLista(data || []))
  useEffect(() => {
    carrega()
  }, [])

  async function muda(l, campos) {
    const { error } = await db.from('nukze_leads').update(campos).eq('id', l.id)
    if (error) return alert('Não deu pra salvar.')
    setLista((x) => x.map((y) => (y.id === l.id ? { ...y, ...campos } : y)))
  }
  async function apaga(l) {
    if (!confirm(`Apagar "${l.negocio}" da prospecção?`)) return
    await db.from('nukze_leads').delete().eq('id', l.id)
    setLista((x) => x.filter((y) => y.id !== l.id))
  }

  if (!lista) return <p className="pn-carregando">Carregando…</p>
  const t = busca.toLowerCase()
  const visiveis = lista
    .filter((l) =>
      filtro === 'todos'
        ? true
        : filtro === 'ativos'
          ? !['fechado', 'perdido'].includes(l.status)
          : l.status === filtro,
    )
    .filter(
      (l) =>
        !t ||
        `${l.nome || ''} ${l.negocio} ${l.cidade || ''}`
          .toLowerCase()
          .includes(t),
    )
  const conta = (s) => lista.filter((l) => l.status === s).length
  const paraHoje = lista.filter(
    (l) =>
      l.proximo_contato &&
      l.proximo_contato <= hoje() &&
      !['fechado', 'perdido'].includes(l.status),
  ).length

  return (
    <>
      <header className="pn-cab">
        <h1>Prospecção</h1>
        <p>Possíveis clientes que vocês estão conversando.</p>
        <button className="pn-bt pn-bt--pri" onClick={() => setEditando({})}>
          + Possível cliente
        </button>
      </header>

      {paraHoje > 0 && (
        <p className="pn-alerta pn-alerta--am">
          📞 {paraHoje} contato(s) marcado(s) pra hoje ou atrasado(s).
        </p>
      )}

      <div className="pn-filtros">
        {FILTROS.map(([id, nome]) => (
          <button
            key={id}
            className={filtro === id ? 'on' : ''}
            onClick={() => setFiltro(id)}
          >
            {nome}
            {statusLead[id] && <i>{conta(id)}</i>}
          </button>
        ))}
      </div>
      <input
        className="pn-busca"
        placeholder="Buscar…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {!visiveis.length && (
        <p className="pn-vazio">
          Ninguém aqui ainda. Cadastra o primeiro no "+ Possível cliente".
        </p>
      )}

      <div className="pn-grade">
        {visiveis.map((l) => {
          const d = l.proximo_contato ? diasAte(l.proximo_contato) : null
          return (
            <article key={l.id} className="pn-cartao pn-lead">
              <div className="pn-pedido__topo">
                <div>
                  <b>{l.negocio}</b>
                  <span>
                    {[l.nome, l.tipo, l.cidade].filter(Boolean).join(' · ')}
                  </span>
                </div>
                <span className={`pn-st pn-st--lead-${l.status}`}>
                  {statusLead[l.status]}
                </span>
              </div>
              <dl className="pn-dados">
                {l.origem && (
                  <>
                    <dt>Origem</dt>
                    <dd>{l.origem}</dd>
                  </>
                )}
                {l.proximo_contato && (
                  <>
                    <dt>Retornar</dt>
                    <dd
                      className={
                        d <= 0 && !['fechado', 'perdido'].includes(l.status)
                          ? 'pn-am'
                          : ''
                      }
                    >
                      {data(l.proximo_contato)}
                      {d === 0
                        ? ' · hoje'
                        : d < 0
                          ? ` · atrasado ${-d} dia(s)`
                          : ''}
                    </dd>
                  </>
                )}
                {l.observacao && (
                  <>
                    <dt>Notas</dt>
                    <dd>{l.observacao}</dd>
                  </>
                )}
                <dt>Por</dt>
                <dd>
                  {l.responsavel || '—'} · {data(l.criado_em)}
                </dd>
              </dl>
              <div className="pn-pedido__acoes">
                {l.whatsapp && (
                  <a
                    className="pn-bt pn-bt--zap"
                    href={zap(l.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 {fone(l.whatsapp)}
                  </a>
                )}
                {l.instagram && (
                  <a
                    className="pn-bt"
                    href={instaLink(l.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📸 Instagram
                  </a>
                )}
              </div>
              <div className="pn-pedido__acoes">
                <select
                  value={l.status}
                  onChange={(e) => muda(l, { status: e.target.value })}
                  aria-label="Status"
                >
                  {Object.entries(statusLead).map(([id, n]) => (
                    <option key={id} value={id}>
                      {n}
                    </option>
                  ))}
                </select>
                <button className="pn-bt" onClick={() => setEditando(l)}>
                  Editar
                </button>
                {l.status !== 'fechado' && l.whatsapp && (
                  <button
                    className="pn-bt pn-bt--pri"
                    onClick={() => setVirando(l)}
                  >
                    Virar cliente
                  </button>
                )}
                {dono && (
                  <button className="pn-bt pn-bt--x" onClick={() => apaga(l)}>
                    Apagar
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {editando && (
        <FormLead
          lead={editando.id ? editando : null}
          onFechar={() => setEditando(null)}
          onSalvo={() => {
            setEditando(null)
            carrega()
          }}
        />
      )}
      {virando &&
        (dono ? (
          <FormCliente
            pedido={{
              nome: virando.nome || virando.negocio,
              negocio: virando.negocio,
              whatsapp: virando.whatsapp,
            }}
            onFechar={() => {
              setVirando(null)
              carrega()
            }}
            onSalvo={(_c, fechar) => {
              if (!fechar) muda(virando, { status: 'fechado' })
              else setVirando(null)
            }}
          />
        ) : (
          <FormClienteSimples
            inicial={{
              nome: virando.nome || '',
              negocio: virando.negocio,
              whatsapp: virando.whatsapp,
            }}
            onFechar={() => setVirando(null)}
            onSalvo={() => {
              muda(virando, { status: 'fechado' })
              setVirando(null)
            }}
          />
        ))}
    </>
  )
}

function FormLead({ lead, onFechar, onSalvo }) {
  const [f, setF] = useState({
    negocio: lead?.negocio || '',
    nome: lead?.nome || '',
    tipo: lead?.tipo || '',
    cidade: lead?.cidade || 'Santa Maria',
    whatsapp: (lead?.whatsapp || '').replace(/^55/, ''),
    instagram: lead?.instagram || '',
    origem: lead?.origem || '',
    status: lead?.status || 'novo',
    proximo_contato: lead?.proximo_contato || '',
    observacao: lead?.observacao || '',
  })
  const [erro, setErro] = useState('')
  const muda = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    const num = f.whatsapp.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
    const whatsapp = num ? '55' + num : null
    if (whatsapp && !/^55\d{10,11}$/.test(whatsapp))
      return setErro('WhatsApp precisa ter DDD + número.')
    const linha = {
      negocio: f.negocio.trim(),
      nome: f.nome.trim() || null,
      tipo: f.tipo.trim() || null,
      cidade: f.cidade.trim() || null,
      whatsapp,
      instagram: f.instagram.trim() || null,
      origem: f.origem.trim() || null,
      status: f.status,
      proximo_contato: f.proximo_contato || null,
      observacao: f.observacao.trim() || null,
    }
    const { error } = lead
      ? await db.from('nukze_leads').update(linha).eq('id', lead.id)
      : await db.from('nukze_leads').insert(linha)
    if (error) return setErro('Não deu pra salvar. Confere os campos.')
    onSalvo()
  }

  return (
    <div className="pn-modal" onClick={onFechar}>
      <form
        className="pn-cartao pn-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={salvar}
      >
        <h2>{lead ? 'Editar possível cliente' : 'Novo possível cliente'}</h2>
        <div className="pn-campos">
          <label>
            Negócio *
            <input
              value={f.negocio}
              onChange={muda('negocio')}
              minLength={2}
              maxLength={80}
              required
              placeholder="Ex: Barbearia do Zé"
            />
          </label>
          <label>
            Nome do dono
            <input value={f.nome} onChange={muda('nome')} maxLength={60} />
          </label>
          <label>
            Tipo
            <input
              value={f.tipo}
              onChange={muda('tipo')}
              maxLength={40}
              placeholder="Barbearia, tattoo, salão…"
              list="pn-tipos"
            />
            <datalist id="pn-tipos">
              {[
                'Barbearia',
                'Tatuagem',
                'Manicure',
                'Salão',
                'Estética',
                'Clínica',
                'Restaurante',
                'Imobiliária',
              ].map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </label>
          <label>
            Cidade
            <input value={f.cidade} onChange={muda('cidade')} maxLength={60} />
          </label>
          <label>
            WhatsApp
            <input
              value={f.whatsapp}
              onChange={muda('whatsapp')}
              inputMode="tel"
              placeholder="55999999999"
            />
          </label>
          <label>
            Instagram
            <input
              value={f.instagram}
              onChange={muda('instagram')}
              maxLength={80}
              placeholder="@perfil"
            />
          </label>
          <label>
            Como chegou
            <input
              value={f.origem}
              onChange={muda('origem')}
              maxLength={40}
              placeholder="Anúncio, indicação, Instagram…"
              list="pn-origens"
            />
            <datalist id="pn-origens">
              {[
                'Anúncio Meta',
                'Instagram',
                'Indicação',
                'Visita',
                'Google',
              ].map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </label>
          <label>
            Retornar em
            <input
              type="date"
              value={f.proximo_contato}
              onChange={muda('proximo_contato')}
            />
          </label>
          <label>
            Status
            <select value={f.status} onChange={muda('status')}>
              {Object.entries(statusLead).map(([id, n]) => (
                <option key={id} value={id}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Notas
          <textarea
            value={f.observacao}
            onChange={muda('observacao')}
            maxLength={1000}
            placeholder="O que conversaram, o que ele precisa…"
          />
        </label>
        {erro && <p className="pn-erro">{erro}</p>}
        <div className="pn-form__bts">
          <button type="button" className="pn-bt" onClick={onFechar}>
            Cancelar
          </button>
          <button className="pn-bt pn-bt--pri">Salvar</button>
        </div>
      </form>
    </div>
  )
}
