import { useCallback, useEffect, useState } from 'react'
import { db, data, diasAte } from './util'

// Confere se um site abre, olhando do navegador de quem está no painel.
// "no-cors": não lê o conteúdo, só descobre se o servidor respondeu.
async function testa(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 9000)
  const ini = performance.now()
  try {
    const u = new URL(url)
    u.searchParams.set('_nukze', Date.now()) // evita resposta guardada (cache)
    await fetch(u, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
    return { ok: true, ms: Math.round(performance.now() - ini) }
  } catch {
    return { ok: false }
  } finally {
    clearTimeout(t)
  }
}

async function testaBanco() {
  const ini = performance.now()
  const { error } = await db.from('nukze_equipe').select('papel').limit(1)
  return error
    ? { ok: false }
    : { ok: true, ms: Math.round(performance.now() - ini) }
}

export function useSites() {
  const [itens, setItens] = useState(null)
  const [verificando, setVerificando] = useState(false)

  const verifica = useCallback(async () => {
    setVerificando(true)
    const { data: clientes } = await db
      .from('nukze_clientes_resumo')
      .select('negocio, site_url, dominio, dominio_vence, ativo')
      .eq('ativo', true)
    const lista = [
      {
        nome: 'Site da Nukze',
        url: 'https://nukze.com.br/',
        teste: () => testa('https://nukze.com.br/'),
      },
      { nome: 'Banco de dados (Supabase)', teste: testaBanco },
      ...(clientes || [])
        .filter((c) => c.site_url || c.dominio_vence)
        .map((c) => ({
          nome: c.negocio,
          url: c.site_url,
          dominio: c.dominio,
          dominio_vence: c.dominio_vence,
          teste: c.site_url ? () => testa(c.site_url) : null,
        })),
    ]
    setItens(lista.map((x) => ({ ...x, r: null })))
    const resultados = await Promise.all(
      lista.map((x) => (x.teste ? x.teste() : null)),
    )
    setItens(lista.map((x, i) => ({ ...x, r: resultados[i] })))
    setVerificando(false)
  }, [])

  useEffect(() => {
    verifica()
  }, [verifica])
  return { itens, verifica, verificando }
}

export function QuadroSites({ itens, verifica, verificando, compacto }) {
  return (
    <section className="pn-cartao">
      <div className="pn-servicos__cab">
        <h2>Sites no ar</h2>
        <button className="pn-bt" onClick={verifica} disabled={verificando}>
          {verificando ? 'Verificando…' : '↻ Verificar agora'}
        </button>
      </div>
      {!itens ? (
        <p className="pn-carregando">Verificando…</p>
      ) : (
        itens.map((x) => {
          const d = x.dominio_vence ? diasAte(x.dominio_vence) : null
          const st = !x.teste ? 'sem' : !x.r ? 'teste' : x.r.ok ? 'ok' : 'er'
          return (
            <div key={x.nome} className="pn-linha pn-site">
              <span className={`pn-bola pn-bola--${st}`} aria-hidden="true" />
              <div>
                <b>{x.nome}</b>
                <span>
                  {x.url ? (
                    <a href={x.url} target="_blank" rel="noopener noreferrer">
                      {x.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  ) : (
                    x.dominio || ''
                  )}
                  {!compacto && x.dominio_vence && (
                    <em className={d <= 30 ? 'pn-am' : ''}>
                      {' '}
                      · domínio vence {data(x.dominio_vence)}
                      {d <= 30 && (d < 0 ? ' ⚠️ vencido' : ` ⚠️ ${d} dia(s)`)}
                    </em>
                  )}
                </span>
              </div>
              <em className={st === 'er' ? 'er' : 'pn-suave'}>
                {st === 'ok'
                  ? `${x.r.ms} ms`
                  : st === 'er'
                    ? 'Fora do ar'
                    : st === 'teste'
                      ? '…'
                      : 'sem site'}
              </em>
            </div>
          )
        })
      )}
      <p className="pn-dica">
        Confere na hora que o painel abre. Um site "fora do ar" aqui pode ser só
        a tua internet: abre o link pra confirmar.
      </p>
    </section>
  )
}

export default function Sites() {
  const s = useSites()
  return (
    <>
      <header className="pn-cab">
        <h1>Sites</h1>
        <p>
          Se os sites dos clientes estão abrindo e quando os domínios vencem.
        </p>
      </header>
      <QuadroSites {...s} />
    </>
  )
}
