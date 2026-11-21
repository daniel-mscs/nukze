import { MessageCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  db,
  reais,
  data,
  fone,
  zap,
  nomePlano,
  nomeCiclo,
  hoje,
  proximoVencimento,
  porMes,
  diasAte,
  urlSite,
} from './util'

const MODULOS = [
  ['clientes', 'Clientes (CRM)'],
  ['caixa', 'Caixa'],
  ['estoque', 'Estoque'],
]

// Lista e edição dos serviços de um cliente (mensal, anual ou único)
function Servicos({ clienteId }) {
  const [lista, setLista] = useState(null)
  const [novo, setNovo] = useState(null)

  const carrega = () =>
    db
      .from('nukze_servicos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('criado_em')
      .then(({ data }) => setLista(data || []))
  useEffect(() => {
    carrega()
  }, [clienteId])

  async function salva(s) {
    const linha = {
      nome: s.nome.trim(),
      valor: Number(s.valor) || 0,
      ciclo: s.ciclo,
      primeiro_vencimento: s.primeiro_vencimento,
      ativo: s.ativo,
      observacao: s.observacao?.trim() || null,
    }
    const { error } = s.id
      ? await db.from('nukze_servicos').update(linha).eq('id', s.id)
      : await db
          .from('nukze_servicos')
          .insert({ ...linha, cliente_id: clienteId })
    if (error) return alert('Não deu pra salvar o serviço. Confere os campos.')
    setNovo(null)
    carrega()
  }
  async function apaga(s) {
    if (
      !confirm(
        `Apagar o serviço "${s.nome}"? As cobranças já criadas continuam.`,
      )
    )
      return
    await db.from('nukze_servicos').delete().eq('id', s.id)
    carrega()
  }

  if (!lista) return <p className="pn-carregando">Carregando serviços…</p>
  return (
    <div className="pn-servicos">
      <div className="pn-servicos__cab">
        <b>Serviços do cliente</b>
        {!novo && (
          <button
            type="button"
            className="pn-bt"
            onClick={() =>
              setNovo({
                nome: '',
                valor: '',
                ciclo: 'mensal',
                primeiro_vencimento: hoje(),
                ativo: true,
              })
            }
          >
            + Serviço
          </button>
        )}
      </div>
      {!lista.length && !novo && (
        <p className="pn-vazio">Nenhum serviço ainda.</p>
      )}
      {lista.map((s) => (
        <LinhaServico key={s.id} s={s} onSalva={salva} onApaga={apaga} />
      ))}
      {novo && (
        <EditaServico
          s={novo}
          onSalva={salva}
          onCancela={() => setNovo(null)}
        />
      )}
    </div>
  )
}

function LinhaServico({ s, onSalva, onApaga }) {
  const [editando, setEditando] = useState(false)
  if (editando)
    return (
      <EditaServico
        s={s}
        onSalva={(x) => {
          onSalva(x)
          setEditando(false)
        }}
        onCancela={() => setEditando(false)}
      />
    )
  const prox = proximoVencimento(s)
  return (
    <div className={`pn-servico ${s.ativo ? '' : 'off'}`}>
      <div>
        <b>{s.nome}</b>
        <span>
          {nomeCiclo[s.ciclo]} · {reais(s.valor)}
          {prox && ` · próximo ${data(prox)}`}
          {!s.ativo && ' · pausado'}
        </span>
      </div>
      <div className="pn-servico__bts">
        <button type="button" onClick={() => setEditando(true)}>
          Editar
        </button>
        <button type="button" className="x" onClick={() => onApaga(s)}>
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

function EditaServico({ s, onSalva, onCancela }) {
  const [f, setF] = useState(s)
  const muda = (k) => (e) =>
    setF((x) => ({
      ...x,
      [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))
  return (
    <div className="pn-servico-form">
      <div className="pn-campos">
        <label>
          Nome
          <input
            value={f.nome}
            onChange={muda('nome')}
            placeholder="Ex: Manutenção anual"
            maxLength={60}
          />
        </label>
        <label>
          Valor (R$)
          <input
            type="number"
            min="0"
            step="0.01"
            value={f.valor}
            onChange={muda('valor')}
          />
        </label>
        <label>
          Cobrança
          <select value={f.ciclo} onChange={muda('ciclo')}>
            <option value="mensal">Mensal</option>
            <option value="anual">Anual</option>
            <option value="unico">Única vez</option>
          </select>
        </label>
        <label>
          {f.ciclo === 'unico' ? 'Vencimento' : '1º vencimento'}
          <input
            type="date"
            value={f.primeiro_vencimento}
            onChange={muda('primeiro_vencimento')}
          />
        </label>
      </div>
      <label className="pn-check">
        <input type="checkbox" checked={f.ativo} onChange={muda('ativo')} />
        Ativo (entra nas cobranças)
      </label>
      <div className="pn-form__bts">
        <button type="button" className="pn-bt" onClick={onCancela}>
          Cancelar
        </button>
        <button
          type="button"
          className="pn-bt pn-bt--pri"
          disabled={f.nome.trim().length < 2 || !f.primeiro_vencimento}
          onClick={() => onSalva(f)}
        >
          Salvar serviço
        </button>
      </div>
    </div>
  )
}

// Ficha do cliente (novo, editar, ou vindo de um pedido do site)
export function FormCliente({ cliente, pedido, onFechar, onSalvo }) {
  const [atual, setAtual] = useState(cliente || null) // depois de salvar um novo, vira edição
  const base = atual || {}
  const [f, setF] = useState(() => ({
    nome: base.nome ?? pedido?.nome ?? '',
    negocio: base.negocio ?? pedido?.negocio ?? '',
    whatsapp: (base.whatsapp ?? pedido?.whatsapp ?? '').replace(/^55/, ''),
    plano: base.plano ?? pedido?.plano ?? 'agenda',
    modulos: base.modulos ?? pedido?.modulos ?? [],
    ativo: base.ativo ?? true,
    site_url: base.site_url ?? '',
    dominio: base.dominio ?? '',
    dominio_vence: base.dominio_vence ?? '',
    cliente_desde: base.cliente_desde ?? hoje(),
    observacao: base.observacao ?? '',
  }))
  // Ao virar cliente a partir de um pedido: já cria os serviços do plano
  const [inicial, setInicial] = useState({
    mensal: Boolean(pedido?.valor_mensal),
    valorMensal: pedido?.valor_mensal ?? '',
    taxa: Boolean(pedido?.taxa_criacao),
    valorTaxa: pedido?.taxa_criacao ?? '',
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
    const whatsapp =
      '55' + f.whatsapp.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
    if (!/^55\d{10,11}$/.test(whatsapp))
      return setErro('WhatsApp precisa ter DDD + número (10 ou 11 dígitos).')
    const linha = {
      nome: f.nome.trim(),
      negocio: f.negocio.trim(),
      whatsapp,
      plano: f.plano,
      modulos: f.modulos,
      ativo: f.ativo,
      site_url: urlSite(f.site_url),
      dominio: f.dominio.trim() || null,
      dominio_vence: f.dominio_vence || null,
      cliente_desde: f.cliente_desde || null,
      observacao: f.observacao.trim() || null,
    }
    if (pedido && !atual) linha.solicitacao_id = pedido.id
    setSalvando(true)
    const q = atual
      ? db.from('nukze_clientes').update(linha).eq('id', atual.id)
      : db.from('nukze_clientes').insert(linha)
    const { data: salvo, error } = await q.select().single()
    if (error) {
      setSalvando(false)
      return setErro('Não deu pra salvar. Confere os campos.')
    }
    if (pedido && !atual) {
      const servicos = []
      if (inicial.mensal && Number(inicial.valorMensal) > 0)
        servicos.push({
          cliente_id: salvo.id,
          nome: `Plano ${nomePlano[f.plano] || ''}`.trim(),
          valor: Number(inicial.valorMensal),
          ciclo: 'mensal',
          primeiro_vencimento: inicial.vencimento,
        })
      if (inicial.taxa && Number(inicial.valorTaxa) > 0)
        servicos.push({
          cliente_id: salvo.id,
          nome: 'Criação do site',
          valor: Number(inicial.valorTaxa),
          ciclo: 'unico',
          primeiro_vencimento: inicial.vencimento,
        })
      if (servicos.length) await db.from('nukze_servicos').insert(servicos)
    }
    setSalvando(false)
    if (!atual) {
      // novo: continua aberto pra adicionar os serviços
      setAtual(salvo)
      onSalvo?.(salvo, false)
    } else onSalvo?.(salvo, true)
  }

  return (
    <div className="pn-modal">
      <form
        className="pn-cartao pn-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={salvar}
      >
        <h2>{atual ? atual.negocio : 'Novo cliente'}</h2>
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
            Site
            <input
              value={f.site_url}
              onChange={muda('site_url')}
              placeholder="https://www.exemplo.com.br"
              maxLength={200}
            />
          </label>
          <label>
            Cliente desde
            <input
              type="date"
              value={f.cliente_desde}
              onChange={muda('cliente_desde')}
            />
          </label>
          <label>
            Domínio
            <input
              value={f.dominio}
              onChange={muda('dominio')}
              placeholder="exemplo.com.br"
              maxLength={100}
            />
          </label>
          <label>
            Domínio vence em
            <input
              type="date"
              value={f.dominio_vence}
              onChange={muda('dominio_vence')}
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

        {pedido && !atual && (
          <div className="pn-taxa">
            <b>Serviços do pedido</b>
            <label className="pn-check">
              <input
                type="checkbox"
                checked={inicial.mensal}
                onChange={(e) =>
                  setInicial((x) => ({ ...x, mensal: e.target.checked }))
                }
              />
              Mensalidade de {reais(inicial.valorMensal)}
            </label>
            <label className="pn-check">
              <input
                type="checkbox"
                checked={inicial.taxa}
                onChange={(e) =>
                  setInicial((x) => ({ ...x, taxa: e.target.checked }))
                }
              />
              Criação do site de {reais(inicial.valorTaxa)} (única vez)
            </label>
            <label>
              1º vencimento
              <input
                type="date"
                value={inicial.vencimento}
                onChange={(e) =>
                  setInicial((x) => ({ ...x, vencimento: e.target.value }))
                }
              />
            </label>
          </div>
        )}

        {erro && <p className="pn-erro">{erro}</p>}
        <div className="pn-form__bts">
          <button type="button" className="pn-bt" onClick={onFechar}>
            {atual ? 'Fechar' : 'Cancelar'}
          </button>
          <button className="pn-bt pn-bt--pri" disabled={salvando}>
            {salvando
              ? 'Salvando…'
              : atual
                ? 'Salvar dados'
                : 'Salvar e adicionar serviços'}
          </button>
        </div>

        {atual && <Servicos clienteId={atual.id} />}
      </form>
    </div>
  )
}

// Cadastro de cliente pelo Guilherme: só os dados básicos (os valores ficam com o Daniel)
export function FormClienteSimples({ inicial, onFechar, onSalvo }) {
  const [f, setF] = useState({
    nome: inicial?.nome || '',
    negocio: inicial?.negocio || '',
    whatsapp: (inicial?.whatsapp || '').replace(/^55/, ''),
    plano: 'agenda',
    site_url: '',
  })
  const [erro, setErro] = useState('')
  const muda = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  async function salvar(e) {
    e.preventDefault()
    const whatsapp =
      '55' + f.whatsapp.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
    if (!/^55\d{10,11}$/.test(whatsapp))
      return setErro('WhatsApp precisa ter DDD + número.')
    const { error } = await db.rpc('nukze_cadastra_cliente', {
      p_nome: f.nome.trim(),
      p_negocio: f.negocio.trim(),
      p_whatsapp: whatsapp,
      p_plano: f.plano,
      p_site_url: urlSite(f.site_url),
    })
    if (error) return setErro('Não deu pra salvar. Confere os campos.')
    onSalvo()
  }

  return (
    <div className="pn-modal">
      <form
        className="pn-cartao pn-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={salvar}
      >
        <h2>Novo cliente</h2>
        <p className="pn-suave">
          Os valores e as cobranças o Daniel completa depois.
        </p>
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
            WhatsApp
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
            Site (se já tiver)
            <input
              value={f.site_url}
              onChange={muda('site_url')}
              maxLength={200}
              placeholder="https://"
            />
          </label>
        </div>
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

export default function Clientes({ dono }) {
  const [lista, setLista] = useState(null)
  const [editando, setEditando] = useState(null) // {} = novo
  const [busca, setBusca] = useState('')
  const [simples, setSimples] = useState(false) // cadastro rápido do leitor

  // O leitor (Guilherme) lê a "visão" sem valores; o dono vê os serviços
  const carrega = () =>
    (dono
      ? db.from('nukze_clientes').select('*, servicos:nukze_servicos(*)')
      : db.from('nukze_clientes_resumo').select('*')
    )
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
        <button
          className="pn-bt pn-bt--pri"
          onClick={() => (dono ? setEditando({}) : setSimples(true))}
        >
          + Novo cliente
        </button>
      </header>

      <input
        className="pn-busca"
        placeholder="Buscar por nome ou negócio…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {!visiveis.length && <p className="pn-vazio">Nenhum cliente ainda.</p>}

      <div className="pn-grade">
        {visiveis.map((c) => {
          const servicos = (c.servicos || []).filter((s) => s.ativo)
          const dDom = c.dominio_vence ? diasAte(c.dominio_vence) : null
          return (
            <article
              key={c.id}
              className={`pn-cartao pn-cliente ${c.ativo ? '' : 'off'}`}
            >
              <div className="pn-pedido__topo">
                <div>
                  <b>{c.negocio}</b>
                  <span>
                    {c.nome}
                    {c.cliente_desde && ` · desde ${data(c.cliente_desde)}`}
                  </span>
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
                {c.site_url && (
                  <>
                    <dt>Site</dt>
                    <dd>
                      <a
                        href={urlSite(c.site_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {c.site_url.replace(/^https?:\/\//, '')}
                      </a>
                    </dd>
                  </>
                )}
                {(c.dominio || c.dominio_vence) && (
                  <>
                    <dt>Domínio</dt>
                    <dd className={dDom != null && dDom <= 30 ? 'pn-am' : ''}>
                      {c.dominio || '—'}
                      {c.dominio_vence && ` · vence ${data(c.dominio_vence)}`}
                      {dDom != null &&
                        dDom <= 30 &&
                        (dDom < 0 ? ' · vencido' : ` · faltam ${dDom} dia(s)`)}
                    </dd>
                  </>
                )}
                {dono && servicos.length > 0 && (
                  <>
                    <dt>Serviços</dt>
                    <dd>
                      {servicos.map((s) => (
                        <div key={s.id}>
                          {s.nome}: {reais(s.valor)}{' '}
                          {s.ciclo === 'unico'
                            ? '(única)'
                            : `/${s.ciclo === 'mensal' ? 'mês' : 'ano'}`}
                        </div>
                      ))}
                      <small className="pn-suave">
                        ≈ {reais(servicos.reduce((t, s) => t + porMes(s), 0))}
                        /mês
                      </small>
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
                  <MessageCircle
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />{' '}
                  {fone(c.whatsapp)}
                </a>
                {dono && (
                  <button className="pn-bt" onClick={() => setEditando(c)}>
                    Abrir ficha
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {simples && (
        <FormClienteSimples
          onFechar={() => setSimples(false)}
          onSalvo={() => {
            setSimples(false)
            carrega()
          }}
        />
      )}
      {editando && (
        <FormCliente
          cliente={editando.id ? editando : null}
          onFechar={() => {
            setEditando(null)
            carrega()
          }}
          onSalvo={(_c, fechar) => {
            if (fechar) {
              setEditando(null)
              carrega()
            }
          }}
        />
      )}
    </>
  )
}
