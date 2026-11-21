import { useEffect, useState } from 'react'
import { db, reais, mesAtual, nomeMes, situacao, data } from './util'

export default function Resumo({ irPara }) {
  const [d, setD] = useState(null)

  useEffect(() => {
    const mes = mesAtual()
    Promise.all([
      db.from('nukze_clientes').select('valor_mensal, ativo'),
      db
        .from('nukze_cobrancas')
        .select('*, cliente:nukze_clientes(nome, negocio)')
        .or(`referencia.eq.${mes}-01,pago_em.is.null`)
        .order('vencimento'),
      db
        .from('solicitacoes_plano')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'nova'),
    ]).then(([cl, co, pe]) => {
      const cobs = co.data || []
      const doMes = cobs.filter((c) => c.referencia.startsWith(mes))
      const atrasadas = cobs.filter((c) => situacao(c) === 'atrasado')
      setD({
        mes,
        mensal: (cl.data || [])
          .filter((c) => c.ativo)
          .reduce((t, c) => t + Number(c.valor_mensal), 0),
        ativos: (cl.data || []).filter((c) => c.ativo).length,
        recebido: doMes
          .filter((c) => c.pago_em)
          .reduce((t, c) => t + Number(c.valor), 0),
        aReceber: doMes
          .filter((c) => !c.pago_em)
          .reduce((t, c) => t + Number(c.valor), 0),
        atrasadas,
        novos: pe.count || 0,
      })
    })
  }, [])

  if (!d) return <p className="pn-carregando">Carregando…</p>

  return (
    <>
      <header className="pn-cab">
        <h1>Resumo</h1>
        <p>{nomeMes(d.mes)}</p>
      </header>

      <div className="pn-kpis">
        <div>
          <small>Entra por mês</small>
          <b>{reais(d.mensal)}</b>
          <span>{d.ativos} cliente(s) ativo(s)</span>
        </div>
        <div className="ok">
          <small>Recebido no mês</small>
          <b>{reais(d.recebido)}</b>
        </div>
        <div className="am">
          <small>Falta receber</small>
          <b>{reais(d.aReceber)}</b>
        </div>
        <div className="er">
          <small>Atrasado</small>
          <b>{reais(d.atrasadas.reduce((t, c) => t + Number(c.valor), 0))}</b>
          <span>{d.atrasadas.length} cobrança(s)</span>
        </div>
      </div>

      {d.novos > 0 && (
        <button className="pn-alerta" onClick={() => irPara('pedidos')}>
          📥 {d.novos} pedido(s) novo(s) esperando contato →
        </button>
      )}

      <section className="pn-cartao">
        <h2>Atrasados</h2>
        {d.atrasadas.length ? (
          d.atrasadas.map((c) => (
            <div key={c.id} className="pn-linha">
              <div>
                <b>{c.cliente?.negocio}</b>
                <span>
                  {c.descricao} · venceu {data(c.vencimento)}
                </span>
              </div>
              <em className="er">{reais(c.valor)}</em>
            </div>
          ))
        ) : (
          <p className="pn-vazio">Ninguém atrasado. 🎉</p>
        )}
        {d.atrasadas.length > 0 && (
          <button className="pn-bt" onClick={() => irPara('cobrancas')}>
            Ir pra cobranças
          </button>
        )}
      </section>
    </>
  )
}
