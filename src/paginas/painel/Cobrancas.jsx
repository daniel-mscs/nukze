import { AlertTriangle, MessageCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  db,
  reais,
  data,
  zap,
  mesAtual,
  nomeMes,
  somaMes,
  situacao,
  NOME_SIT,
  mensagemCobranca,
  hoje,
  pago,
  saldo,
  vencimentoNoMes,
} from './util'

const FORMAS = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
  outro: 'Outro',
}

export default function Cobrancas() {
  const [mes, setMes] = useState(mesAtual())
  const [lista, setLista] = useState(null)
  const [clientes, setClientes] = useState([])
  const [config, setConfig] = useState(null)
  const [janela, setJanela] = useState(null) // {tipo:'avulsa'|'editar'|'pagar', c}
  const [msg, setMsg] = useState('')

  const carrega = () => {
    setLista(null)
    db.from('nukze_cobrancas')
      .select(
        '*, cliente:nukze_clientes(nome, negocio, whatsapp), pagamentos:nukze_pagamentos(*)',
      )
      .eq('referencia', `${mes}-01`)
      .order('vencimento')
      .then(({ data }) => setLista(data || []))
  }
  useEffect(carrega, [mes])
  useEffect(() => {
    db.from('nukze_clientes')
      .select('id, nome, negocio, ativo')
      .order('negocio')
      .then(({ data }) => setClientes(data || []))
    db.from('nukze_config')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => setConfig(data))
  }, [])

  // Cria as cobranças do mês a partir dos serviços ativos (mensal todo mês,
  // anual no mês de aniversário, único no mês dele). Não duplica.
  async function gerar() {
    setMsg('')
    const { data: servicos, error: e1 } = await db
      .from('nukze_servicos')
      .select('*, cliente:nukze_clientes(ativo)')
      .eq('ativo', true)
    if (e1) return setMsg('Não deu pra ler os serviços.')
    const linhas = (servicos || [])
      .filter((s) => s.cliente?.ativo)
      .map((s) => ({ s, venc: vencimentoNoMes(s, mes) }))
      .filter((x) => x.venc)
      .map(({ s, venc }) => ({
        cliente_id: s.cliente_id,
        servico_id: s.id,
        referencia: `${mes}-01`,
        descricao: s.nome,
        valor: s.valor,
        vencimento: venc,
      }))
    if (!linhas.length) return setMsg('Nenhum serviço vence nesse mês.')
    const { data, error } = await db
      .from('nukze_cobrancas')
      .upsert(linhas, {
        onConflict: 'cliente_id,referencia,descricao',
        ignoreDuplicates: true,
      })
      .select('id')
    if (error) return setMsg('Não deu pra gerar. Tenta de novo.')
    setMsg(
      data?.length
        ? `${data.length} cobrança(s) criada(s).`
        : 'As cobranças desse mês já existiam.',
    )
    carrega()
  }

  async function apagar(c) {
    if (
      !confirm(
        `Apagar a cobrança "${c.descricao}" de ${c.cliente?.negocio}? Os pagamentos dela também somem.`,
      )
    )
      return
    await db.from('nukze_cobrancas').delete().eq('id', c.id)
    setLista((l) => l.filter((x) => x.id !== c.id))
  }

  async function apagaPagamento(p) {
    if (
      !confirm(`Apagar o pagamento de ${reais(p.valor)} de ${data(p.pago_em)}?`)
    )
      return
    await db.from('nukze_pagamentos').delete().eq('id', p.id)
    carrega()
  }

  const soma = (f) => (lista || []).reduce((t, c) => t + f(c), 0)

  return (
    <>
      <header className="pn-cab">
        <h1>Cobranças</h1>
        <div className="pn-mes">
          <button
            onClick={() => setMes((m) => somaMes(m, -1))}
            aria-label="Mês anterior"
          >
            ‹
          </button>
          <b>{nomeMes(mes)}</b>
          <button
            onClick={() => setMes((m) => somaMes(m, 1))}
            aria-label="Próximo mês"
          >
            ›
          </button>
        </div>
      </header>

      {config && !config.chave_pix && (
        <p className="pn-alerta pn-alerta--am">
          <AlertTriangle size={16} strokeWidth={1.8} aria-hidden="true" />{' '}
          Cadastra a chave Pix em Ajustes pra ela ir na mensagem de cobrança.
        </p>
      )}

      <div className="pn-barra">
        <button className="pn-bt pn-bt--pri" onClick={gerar}>
          Gerar cobranças do mês
        </button>
        <button className="pn-bt" onClick={() => setJanela({ tipo: 'avulsa' })}>
          + Cobrança avulsa
        </button>
        {msg && <span className="pn-msg">{msg}</span>}
      </div>

      {lista && (
        <div className="pn-kpis pn-kpis--3">
          <div className="ok">
            <small>Recebido</small>
            <b>{reais(soma(pago))}</b>
          </div>
          <div className="am">
            <small>Falta</small>
            <b>
              {reais(soma((c) => (situacao(c) === 'atrasado' ? 0 : saldo(c))))}
            </b>
          </div>
          <div className="er">
            <small>Atrasado</small>
            <b>
              {reais(soma((c) => (situacao(c) === 'atrasado' ? saldo(c) : 0)))}
            </b>
          </div>
        </div>
      )}

      {!lista ? (
        <p className="pn-carregando">Carregando…</p>
      ) : !lista.length ? (
        <p className="pn-vazio">
          Nenhuma cobrança nesse mês. Clica em "Gerar cobranças do mês".
        </p>
      ) : (
        <div className="pn-grade">
          {lista.map((c) => {
            const sit = situacao(c)
            const pg = pago(c)
            return (
              <article key={c.id} className={`pn-cartao pn-cob pn-cob--${sit}`}>
                <div className="pn-pedido__topo">
                  <div>
                    <b>{c.cliente?.negocio}</b>
                    <span>
                      {c.descricao} · vence {data(c.vencimento)}
                    </span>
                  </div>
                  <span className={`pn-st pn-st--${sit}`}>{NOME_SIT[sit]}</span>
                </div>
                <div className="pn-cob__valor">{reais(c.valor)}</div>
                {pg > 0 && (
                  <div
                    className="pn-cob__barra"
                    title={`${Math.round((pg / c.valor) * 100)}% pago`}
                  >
                    <i
                      style={{
                        width: `${Math.min(100, (pg / c.valor) * 100)}%`,
                      }}
                    />
                  </div>
                )}
                {pg > 0 && sit !== 'pago' && (
                  <small className="pn-cob__pago">
                    Pago {reais(pg)} · falta {reais(saldo(c))}
                  </small>
                )}
                {(c.pagamentos || []).length > 0 && (
                  <ul className="pn-pags">
                    {c.pagamentos
                      .slice()
                      .sort((a, b) => a.pago_em.localeCompare(b.pago_em))
                      .map((p) => (
                        <li key={p.id}>
                          <span>
                            {data(p.pago_em)} · {FORMAS[p.forma]}
                            {p.observacao && ` · ${p.observacao}`}
                          </span>
                          <b>{reais(p.valor)}</b>
                          <button
                            onClick={() => apagaPagamento(p)}
                            aria-label="Apagar pagamento"
                          >
                            <X size={14} strokeWidth={2} />
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
                <div className="pn-pedido__acoes">
                  {sit !== 'pago' && (
                    <>
                      <a
                        className="pn-bt pn-bt--zap"
                        href={zap(
                          c.cliente?.whatsapp,
                          mensagemCobranca(c, c.cliente, config),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle
                          size={16}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />{' '}
                        Cobrar
                      </a>
                      <button
                        className="pn-bt pn-bt--pri"
                        onClick={() => setJanela({ tipo: 'pagar', c })}
                      >
                        + Pagamento
                      </button>
                    </>
                  )}
                  <button
                    className="pn-bt"
                    onClick={() => setJanela({ tipo: 'editar', c })}
                  >
                    Editar
                  </button>
                  <button className="pn-bt pn-bt--x" onClick={() => apagar(c)}>
                    Apagar
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {janela?.tipo === 'pagar' && (
        <FormPagamento
          c={janela.c}
          onFechar={() => setJanela(null)}
          onSalvo={() => {
            setJanela(null)
            carrega()
          }}
        />
      )}
      {(janela?.tipo === 'avulsa' || janela?.tipo === 'editar') && (
        <FormCobranca
          c={janela.c}
          clientes={clientes}
          mes={mes}
          onFechar={() => setJanela(null)}
          onSalvo={(m) => {
            setJanela(null)
            if (m === mes) carrega()
            else setMes(m)
          }}
        />
      )}
    </>
  )
}

// Registrar um pagamento (total ou parcial)
function FormPagamento({ c, onFechar, onSalvo }) {
  const [f, setF] = useState({
    valor: saldo(c),
    pago_em: hoje(),
    forma: 'pix',
    observacao: '',
  })
  const [erro, setErro] = useState('')
  const muda = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  async function salvar(e) {
    e.preventDefault()
    const { error } = await db.from('nukze_pagamentos').insert({
      cobranca_id: c.id,
      valor: Number(f.valor),
      pago_em: f.pago_em,
      forma: f.forma,
      observacao: f.observacao.trim() || null,
    })
    if (error) return setErro('Não deu pra salvar. Confere o valor.')
    onSalvo()
  }
  return (
    <div className="pn-modal" onClick={onFechar}>
      <form
        className="pn-cartao pn-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={salvar}
      >
        <h2>Pagamento · {c.cliente?.negocio}</h2>
        <p className="pn-suave">
          {c.descricao}: {reais(c.valor)} · falta {reais(saldo(c))}
        </p>
        <div className="pn-campos">
          <label>
            Valor pago (R$)
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={f.valor}
              onChange={muda('valor')}
              required
            />
          </label>
          <label>
            Data
            <input
              type="date"
              value={f.pago_em}
              onChange={muda('pago_em')}
              required
            />
          </label>
          <label>
            Forma
            <select value={f.forma} onChange={muda('forma')}>
              {Object.entries(FORMAS).map(([id, n]) => (
                <option key={id} value={id}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label>
            Observação
            <input
              value={f.observacao}
              onChange={muda('observacao')}
              maxLength={200}
              placeholder="Ex: 1ª parcela"
            />
          </label>
        </div>
        {erro && <p className="pn-erro">{erro}</p>}
        <div className="pn-form__bts">
          <button type="button" className="pn-bt" onClick={onFechar}>
            Cancelar
          </button>
          <button className="pn-bt pn-bt--pri">Registrar</button>
        </div>
      </form>
    </div>
  )
}

// Nova cobrança avulsa ou edição de uma existente
function FormCobranca({ c, clientes, mes, onFechar, onSalvo }) {
  const [f, setF] = useState({
    cliente_id: c?.cliente_id || clientes[0]?.id || '',
    descricao: c?.descricao || 'Criação do site',
    valor: c?.valor ?? '',
    vencimento: c?.vencimento || (mes === mesAtual() ? hoje() : `${mes}-10`),
  })
  const [erro, setErro] = useState('')
  const muda = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  async function salvar(e) {
    e.preventDefault()
    const linha = {
      descricao: f.descricao.trim(),
      valor: Number(f.valor),
      vencimento: f.vencimento,
      referencia: f.vencimento.slice(0, 7) + '-01',
    }
    const { error } = c
      ? await db.from('nukze_cobrancas').update(linha).eq('id', c.id)
      : await db
          .from('nukze_cobrancas')
          .insert({ ...linha, cliente_id: f.cliente_id })
    if (error)
      return setErro(
        error.code === '23505'
          ? 'Já existe uma cobrança com essa descrição nesse mês pra esse cliente. Muda a descrição (ex.: "Criação do site 2/3").'
          : 'Não deu pra salvar. Confere os campos.',
      )
    onSalvo(f.vencimento.slice(0, 7))
  }

  if (!clientes.length)
    return (
      <div className="pn-modal" onClick={onFechar}>
        <div className="pn-cartao pn-form">
          <p>Cadastra um cliente primeiro.</p>
          <button className="pn-bt" onClick={onFechar}>
            Ok
          </button>
        </div>
      </div>
    )

  return (
    <div className="pn-modal" onClick={onFechar}>
      <form
        className="pn-cartao pn-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={salvar}
      >
        <h2>{c ? 'Editar cobrança' : 'Cobrança avulsa'}</h2>
        <div className="pn-campos">
          <label>
            Cliente
            <select
              value={f.cliente_id}
              onChange={muda('cliente_id')}
              disabled={Boolean(c)}
            >
              {clientes.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.negocio}
                </option>
              ))}
            </select>
          </label>
          <label>
            Descrição
            <input
              value={f.descricao}
              onChange={muda('descricao')}
              minLength={2}
              maxLength={80}
              required
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
              required
            />
          </label>
          <label>
            Vencimento
            <input
              type="date"
              value={f.vencimento}
              onChange={muda('vencimento')}
              required
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
