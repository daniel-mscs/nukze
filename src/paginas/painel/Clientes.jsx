import { useEffect, useState } from 'react'
import { db, reais, fone, zap, nomePlano, hoje } from './util'

const MODULOS = [
  ['clientes', 'Clientes (CRM)'],
  ['caixa', 'Caixa'],
  ['estoque', 'Estoque'],
]

// Formulário de cliente (novo, editar, ou vindo de um pedido do site)
export function FormCliente({ cliente, pedido, onFechar, onSalvo }) {
  const [f, setF] = useState(() => ({
    nome: cliente?.nome ?? pedido?.nome ?? '',
    negocio: cliente?.negocio ?? pedido?.negocio ?? '',
    whatsapp: (cliente?.whatsapp ?? pedido?.whatsapp ?? '').replace(/^55/, ''),
    plano: cliente?.plano ?? pedido?.plano ?? 'agenda',
    modulos: cliente?.modulos ?? pedido?.modulos ?? [],
    valor_mensal: cliente?.valor_mensal ?? pedido?.valor_mensal ?? '',
    dia_vencimento: cliente?.dia_vencimento ?? 10,
    ativo: cliente?.ativo ?? true,
    observacao: cliente?.observacao ?? '',
  }))
  const [taxa, setTaxa] = useState({
    criar: Boolean(pedido?.taxa_criacao),
    valor: pedido?.taxa_criacao ?? '',
    vencimento: hoje(),
  })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const muda = (k) => (e) =>
    setF((x) => ({
      ...x,
      [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    const whatsapp = '55' + f.whatsapp.replace(/\D/g, '')
    if (!/^55\d{10,11}$/.test(whatsapp))
      return setErro('WhatsApp precisa ter DDD + número (10 ou 11 dígitos).')
    const linha = {
      nome: f.nome.trim(),
      negocio: f.negocio.trim(),
      whatsapp,
      plano: f.plano,
      modulos: f.modulos,
      valor_mensal: Number(f.valor_mensal) || 0,
      dia_vencimento: Number(f.dia_vencimento),
      ativo: f.ativo,
      observacao: f.observacao.trim() || null,
    }
    if (pedido) linha.solicitacao_id = pedido.id
    setSalvando(true)
    const q = cliente
      ? db.from('nukze_clientes').update(linha).eq('id', cliente.id)
      : db.from('nukze_clientes').insert(linha)
    const { data, error } = await q.select().single()
    if (error) {
      setSalvando(false)
      return setErro('Não deu pra salvar. Confere os campos.')
    }
    // Cobrança da taxa de criação (opcional, só ao criar)
    if (!cliente && taxa.criar && Number(taxa.valor) > 0) {
      await db.from('nukze_cobrancas').insert({
        cliente_id: data.id,
        referencia: taxa.vencimento.slice(0, 7) + '-01',
        descricao: 'Criação do site',
        valor: Number(taxa.valor),
        vencimento: taxa.vencimento,
      })
    }
    setSalvando(false)
    onSalvo(data)
  }

  return (
    <div className="pn-modal" onClick={onFechar}>
      <form
        className="pn-cartao pn-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={salvar}
      >
        <h2>{cliente ? 'Editar cliente' : 'Novo cliente'}</h2>
        <div className="pn-campos">
          <label>
            Nome
            <input
              value={f.nome}
              onChange={muda('nome')}
              minLength={2}
              maxLength={60}
              required
            />
          </label>
          <label>
            Negócio
            <input
              value={f.negocio}
              onChange={muda('negocio')}
              minLength={2}
              maxLength={80}
              required
            />
          </label>
          <label>
            WhatsApp (DDD + número)
            <input
              value={f.whatsapp}
              onChange={muda('whatsapp')}
              inputMode="tel"
              placeholder="55999999999"
              required
            />
          </label>
          <label>
            Plano
            <select value={f.plano} onChange={muda('plano')}>
              {Object.entries(nomePlano).map(([id, n]) => (
                <option key={id} value={id}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label>
            Valor mensal (R$)
            <input
              type="number"
              min="0"
              step="0.01"
              value={f.valor_mensal}
              onChange={muda('valor_mensal')}
            />
          </label>
          <label>
            Dia do vencimento
            <input
              type="number"
              min="1"
              max="28"
              value={f.dia_vencimento}
              onChange={muda('dia_vencimento')}
            />
          </label>
        </div>

        <div className="pn-checks">
          {MODULOS.map(([id, n]) => (
            <label key={id}>
              <input
                type="checkbox"
                checked={f.modulos.includes(id)}
                onChange={() =>
                  setF((x) => ({
                    ...x,
                    modulos: x.modulos.includes(id)
                      ? x.modulos.filter((m) => m !== id)
                      : [...x.modulos, id],
                  }))
                }
              />
              {n}
            </label>
          ))}
          <label>
            <input type="checkbox" checked={f.ativo} onChange={muda('ativo')} />
            Cliente ativo
          </label>
        </div>

        <label>
          Anotações
          <textarea
            value={f.observacao}
            onChange={muda('observacao')}
            maxLength={1000}
          />
        </label>

        {!cliente && (
          <div className="pn-taxa">
            <label>
              <input
                type="checkbox"
                checked={taxa.criar}
                onChange={(e) =>
                  setTaxa((t) => ({ ...t, criar: e.target.checked }))
                }
              />
              Criar cobrança da taxa de criação
            </label>
            {taxa.criar && (
              <div className="pn-campos">
                <label>
                  Valor (R$)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={taxa.valor}
                    onChange={(e) =>
                      setTaxa((t) => ({ ...t, valor: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Vencimento
                  <input
                    type="date"
                    value={taxa.vencimento}
                    onChange={(e) =>
                      setTaxa((t) => ({ ...t, vencimento: e.target.value }))
                    }
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {erro && <p className="pn-erro">{erro}</p>}
        <div className="pn-form__bts">
          <button type="button" className="pn-bt" onClick={onFechar}>
            Cancelar
          </button>
          <button className="pn-bt pn-bt--pri" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function Clientes({ dono }) {
  const [lista, setLista] = useState(null)
  const [editando, setEditando] = useState(null) // {} = novo
  const [busca, setBusca] = useState('')

  // O leitor (Guilherme) lê a "visão" sem os valores
  const carrega = () =>
    db
      .from(dono ? 'nukze_clientes' : 'nukze_clientes_resumo')
      .select('*')
      .order('negocio')
      .then(({ data }) => setLista(data || []))
  useEffect(() => {
    carrega()
  }, [dono])

  if (!lista) return <p className="pn-carregando">Carregando…</p>
  const t = busca.toLowerCase()
  const visiveis = lista.filter(
    (c) => !t || `${c.nome} ${c.negocio}`.toLowerCase().includes(t),
  )

  return (
    <>
      <header className="pn-cab">
        <h1>Clientes</h1>
        <p>
          {lista.filter((c) => c.ativo).length} ativo(s) de {lista.length}
        </p>
        {dono && (
          <button className="pn-bt pn-bt--pri" onClick={() => setEditando({})}>
            + Novo cliente
          </button>
        )}
      </header>

      <input
        className="pn-busca"
        placeholder="Buscar por nome ou negócio…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {!visiveis.length && <p className="pn-vazio">Nenhum cliente ainda.</p>}

      <div className="pn-grade">
        {visiveis.map((c) => (
          <article
            key={c.id}
            className={`pn-cartao pn-cliente ${c.ativo ? '' : 'off'}`}
          >
            <div className="pn-pedido__topo">
              <div>
                <b>{c.negocio}</b>
                <span>{c.nome}</span>
              </div>
              <span
                className={`pn-st ${c.ativo ? 'pn-st--fechada' : 'pn-st--descartada'}`}
              >
                {c.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <dl className="pn-dados">
              <dt>Plano</dt>
              <dd>
                {nomePlano[c.plano]}
                {c.modulos?.length > 0 && ` + ${c.modulos.join(', ')}`}
              </dd>
              {dono && (
                <>
                  <dt>Mensal</dt>
                  <dd>
                    {reais(c.valor_mensal)} · vence dia {c.dia_vencimento}
                  </dd>
                </>
              )}
              {dono && c.observacao && (
                <>
                  <dt>Notas</dt>
                  <dd>{c.observacao}</dd>
                </>
              )}
            </dl>
            <div className="pn-pedido__acoes">
              <a
                className="pn-bt pn-bt--zap"
                href={zap(c.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 {fone(c.whatsapp)}
              </a>
              {dono && (
                <button className="pn-bt" onClick={() => setEditando(c)}>
                  Editar
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {editando && (
        <FormCliente
          cliente={editando.id ? editando : null}
          onFechar={() => setEditando(null)}
          onSalvo={() => {
            setEditando(null)
            carrega()
          }}
        />
      )}
    </>
  )
}
