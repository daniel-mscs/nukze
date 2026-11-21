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
  mensagemCobranca,
  hoje,
} from './util'

const NOME_SIT = { pago: 'Pago', atrasado: 'Atrasado', pendente: 'Pendente' }

export default function Cobrancas() {
  const [mes, setMes] = useState(mesAtual())
  const [lista, setLista] = useState(null)
  const [clientes, setClientes] = useState([])
  const [config, setConfig] = useState(null)
  const [avulsa, setAvulsa] = useState(false)
  const [msg, setMsg] = useState('')

  const carrega = () => {
    setLista(null)
    db.from('nukze_cobrancas')
      .select('*, cliente:nukze_clientes(nome, negocio, whatsapp)')
      .eq('referencia', `${mes}-01`)
      .order('vencimento')
      .then(({ data }) => setLista(data || []))
  }
  useEffect(carrega, [mes])
  useEffect(() => {
    db.from('nukze_clientes')
      .select('id, nome, negocio, valor_mensal, dia_vencimento, ativo')
      .order('negocio')
      .then(({ data }) => setClientes(data || []))
    db.from('nukze_config')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => setConfig(data))
  }, [])

  // Cria a mensalidade do mês pra cada cliente ativo (se ainda não existir)
  async function gerar() {
    const ativos = clientes.filter((c) => c.ativo && Number(c.valor_mensal) > 0)
    if (!ativos.length) return setMsg('Nenhum cliente ativo com valor mensal.')
    const linhas = ativos.map((c) => ({
      cliente_id: c.id,
      referencia: `${mes}-01`,
      descricao: 'Mensalidade',
      valor: c.valor_mensal,
      vencimento: `${mes}-${String(c.dia_vencimento).padStart(2, '0')}`,
    }))
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
        ? `${data.length} mensalidade(s) criada(s).`
        : 'As mensalidades desse mês já existiam.',
    )
    carrega()
  }

  async function pagar(c, pago) {
    const campos = pago
      ? { pago_em: new Date().toISOString(), forma: 'pix' }
      : { pago_em: null, forma: null }
    const { error } = await db
      .from('nukze_cobrancas')
      .update(campos)
      .eq('id', c.id)
    if (error) return alert('Não deu pra salvar.')
    setLista((l) => l.map((x) => (x.id === c.id ? { ...x, ...campos } : x)))
  }

  async function apagar(c) {
    if (
      !confirm(`Apagar a cobrança "${c.descricao}" de ${c.cliente?.negocio}?`)
    )
      return
    await db.from('nukze_cobrancas').delete().eq('id', c.id)
    setLista((l) => l.filter((x) => x.id !== c.id))
  }

  const total = (f) =>
    (lista || []).filter(f).reduce((t, c) => t + Number(c.valor), 0)

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

      {!config?.chave_pix && (
        <p className="pn-alerta pn-alerta--am">
          ⚠️ Cadastra a chave Pix em Ajustes pra ela ir na mensagem de cobrança.
        </p>
      )}

      <div className="pn-barra">
        <button className="pn-bt pn-bt--pri" onClick={gerar}>
          Gerar mensalidades do mês
        </button>
        <button className="pn-bt" onClick={() => setAvulsa(true)}>
          + Cobrança avulsa
        </button>
        {msg && <span className="pn-msg">{msg}</span>}
      </div>

      {lista && (
        <div className="pn-kpis pn-kpis--3">
          <div className="ok">
            <small>Recebido</small>
            <b>{reais(total((c) => c.pago_em))}</b>
          </div>
          <div className="am">
            <small>Pendente</small>
            <b>{reais(total((c) => situacao(c) === 'pendente'))}</b>
          </div>
          <div className="er">
            <small>Atrasado</small>
            <b>{reais(total((c) => situacao(c) === 'atrasado'))}</b>
          </div>
        </div>
      )}

      {!lista ? (
        <p className="pn-carregando">Carregando…</p>
      ) : !lista.length ? (
        <p className="pn-vazio">
          Nenhuma cobrança nesse mês. Clica em "Gerar mensalidades do mês".
        </p>
      ) : (
        <div className="pn-grade">
          {lista.map((c) => {
            const sit = situacao(c)
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
                {c.pago_em && (
                  <small className="pn-cob__pago">
                    Pago em {new Date(c.pago_em).toLocaleDateString('pt-BR')}
                  </small>
                )}
                <div className="pn-pedido__acoes">
                  {!c.pago_em ? (
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
                        💬 Cobrar
                      </a>
                      <button
                        className="pn-bt pn-bt--pri"
                        onClick={() => pagar(c, true)}
                      >
                        ✓ Marcar pago
                      </button>
                    </>
                  ) : (
                    <button className="pn-bt" onClick={() => pagar(c, false)}>
                      Desfazer pagamento
                    </button>
                  )}
                  <button className="pn-bt pn-bt--x" onClick={() => apagar(c)}>
                    Apagar
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {avulsa && (
        <FormAvulsa
          clientes={clientes}
          mes={mes}
          onFechar={() => setAvulsa(false)}
          onSalvo={(m) => {
            setAvulsa(false)
            if (m === mes) carrega()
            else setMes(m)
          }}
        />
      )}
    </>
  )
}

// Cobrança fora da mensalidade (ex.: parcela da criação, um serviço extra)
function FormAvulsa({ clientes, mes, onFechar, onSalvo }) {
  const [f, setF] = useState({
    cliente_id: clientes[0]?.id || '',
    descricao: 'Criação do site',
    valor: '',
    vencimento: mes === mesAtual() ? hoje() : `${mes}-10`,
  })
  const [erro, setErro] = useState('')
  const muda = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  async function salvar(e) {
    e.preventDefault()
    const { error } = await db.from('nukze_cobrancas').insert({
      ...f,
      descricao: f.descricao.trim(),
      valor: Number(f.valor),
      referencia: f.vencimento.slice(0, 7) + '-01',
    })
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
        <h2>Cobrança avulsa</h2>
        <div className="pn-campos">
          <label>
            Cliente
            <select value={f.cliente_id} onChange={muda('cliente_id')}>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.negocio}
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
