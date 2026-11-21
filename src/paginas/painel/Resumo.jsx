import { Globe, Inbox, LifeBuoy } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  db,
  reais,
  data,
  mesAtual,
  nomeMes,
  situacao,
  saldo,
  porMes,
  hoje,
  diasAte,
  proximoVencimento,
} from './util'
import { useSites, QuadroSites } from './Sites'

export default function Resumo({ irPara }) {
  const [d, setD] = useState(null)
  const sites = useSites()

  useEffect(() => {
    const mes = mesAtual()
    Promise.all([
      db
        .from('nukze_clientes')
        .select(
          'id, negocio, ativo, dominio, dominio_vence, servicos:nukze_servicos(*)',
        ),
      db
        .from('nukze_cobrancas')
        .select(
          '*, cliente:nukze_clientes(negocio), pagamentos:nukze_pagamentos(*)',
        )
        .gte('referencia', `${Number(mes.slice(0, 4)) - 1}${mes.slice(4)}-01`)
        .order('vencimento'),
      db
        .from('nukze_pagamentos')
        .select('valor, pago_em')
        .gte('pago_em', `${mes}-01`),
      db
        .from('solicitacoes_plano')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'nova'),
      db
        .from('nukze_chamados')
        .select('id, urgente')
        .neq('status', 'resolvido'),
    ]).then(([cl, co, pg, pe, ch]) => {
      const clientes = (cl.data || []).filter((c) => c.ativo)
      const cobs = co.data || []
      const abertas = cobs.filter((c) => situacao(c) !== 'pago')
      const ate = (n) => (c) => {
        const x = diasAte(c.vencimento)
        return x >= 0 && x <= n
      }
      // Próximos 30 dias: cobranças em aberto + serviços que vão vencer + domínios
      const proximos = [
        ...abertas.filter(ate(30)).map((c) => ({
          quando: c.vencimento,
          nome: c.cliente?.negocio,
          oque: c.descricao,
          valor: saldo(c),
        })),
        ...clientes.flatMap((c) =>
          (c.servicos || [])
            .filter((s) => s.ativo)
            .map((s) => ({ s, v: proximoVencimento(s) }))
            .filter(({ v }) => v && diasAte(v) >= 0 && diasAte(v) <= 30)
            .filter(
              ({ s, v }) =>
                !cobs.some(
                  (c2) => c2.servico_id === s.id && c2.vencimento === v,
                ),
            )
            .map(({ s, v }) => ({
              quando: v,
              nome: c.negocio,
              oque: `${s.nome} (a gerar)`,
              valor: Number(s.valor),
            })),
        ),
        ...clientes
          .filter((c) => c.dominio_vence && diasAte(c.dominio_vence) <= 30)
          .map((c) => ({
            quando: c.dominio_vence,
            nome: c.negocio,
            oque: `Domínio ${c.dominio || ''}`.trim(),
            dominio: true,
          })),
      ].sort((a, b) => a.quando.localeCompare(b.quando))

      setD({
        mes,
        mensal: clientes.reduce(
          (t, c) =>
            t +
            (c.servicos || [])
              .filter((s) => s.ativo)
              .reduce((u, s) => u + porMes(s), 0),
          0,
        ),
        ativos: clientes.length,
        recebido: (pg.data || []).reduce((t, p) => t + Number(p.valor), 0),
        aReceber: abertas
          .filter((c) => c.referencia.startsWith(mes) && c.vencimento >= hoje())
          .reduce((t, c) => t + saldo(c), 0),
        atrasadas: abertas.filter((c) => situacao(c) === 'atrasado'),
        proximos,
        novos: pe.count || 0,
        chamados: ch.data || [],
      })
    })
  }, [])

  if (!d) return <p className="pn-carregando">Carregando…</p>
  const urgentes = d.chamados.filter((c) => c.urgente).length

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
          <span>{d.ativos} cliente(s) · anual ÷ 12</span>
        </div>
        <div className="ok">
          <small>Recebido no mês</small>
          <b>{reais(d.recebido)}</b>
        </div>
        <div className="am">
          <small>Falta receber</small>
          <b>{reais(d.aReceber)}</b>
          <span>no mês</span>
        </div>
        <div className="er">
          <small>Atrasado</small>
          <b>{reais(d.atrasadas.reduce((t, c) => t + saldo(c), 0))}</b>
          <span>{d.atrasadas.length} cobrança(s)</span>
        </div>
      </div>

      {d.chamados.length > 0 && (
        <button
          className={`pn-alerta ${urgentes ? 'pn-alerta--er' : ''}`}
          onClick={() => irPara('suporte')}
        >
          <LifeBuoy size={17} strokeWidth={1.8} aria-hidden="true" />{' '}
          {d.chamados.length} chamado(s) de suporte aberto(s)
          {urgentes > 0 && ` · ${urgentes} urgente(s)`} →
        </button>
      )}
      {d.novos > 0 && (
        <button className="pn-alerta" onClick={() => irPara('pedidos')}>
          <Inbox size={17} strokeWidth={1.8} aria-hidden="true" /> {d.novos}{' '}
          pedido(s) novo(s) esperando contato →
        </button>
      )}

      <div className="pn-duas">
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
                <em className="er">{reais(saldo(c))}</em>
              </div>
            ))
          ) : (
            <p className="pn-vazio">Ninguém atrasado.</p>
          )}
          {d.atrasadas.length > 0 && (
            <button className="pn-bt" onClick={() => irPara('cobrancas')}>
              Ir pra cobranças
            </button>
          )}
        </section>

        <section className="pn-cartao">
          <h2>Próximos 30 dias</h2>
          {d.proximos.length ? (
            d.proximos.map((x, i) => (
              <div key={i} className="pn-linha">
                <div>
                  <b>{x.nome}</b>
                  <span>
                    {data(x.quando)} · {x.oque}
                  </span>
                </div>
                <em className={x.dominio ? 'pn-am' : ''}>
                  {x.dominio ? (
                    <Globe size={16} strokeWidth={1.8} aria-label="Domínio" />
                  ) : (
                    reais(x.valor)
                  )}
                </em>
              </div>
            ))
          ) : (
            <p className="pn-vazio">Nada vencendo nos próximos 30 dias.</p>
          )}
        </section>
      </div>

      <QuadroSites {...sites} compacto />
    </>
  )
}
