import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { nichos } from '../../data/demo'
import Iphone from '../Iphone'
import Navegador from '../Navegador'
import Reveal from '../Reveal'
import Segmentado from './Segmentado'
import Painel from './Painel'
import Barbearia from './Barbearia'
import Tattoo from './Tattoo'
import Massagem from './Massagem'
import Imobiliaria from './Imobiliaria'
import './Demo.css'
import './Painel.css'

const sites = {
  barbearia: Barbearia,
  tattoo: Tattoo,
  massagem: Massagem,
  imobiliaria: Imobiliaria,
}

// Site pronto (arquivo HTML) mostrado dentro da moldura
function SiteIframe({ cfg }) {
  return (
    <iframe
      className="demo-iframe"
      src={cfg.iframe}
      title={`Site ${cfg.nome}`}
    />
  )
}

// Nicho privado só aparece com o link ?demo=<id> (ex.: pra mostrar a um cliente)
const pedido = new URLSearchParams(location.search).get('demo')
const visiveis = Object.entries(nichos).filter(
  ([id, n]) => !n.privado || id === pedido,
)
const nichoInicial = nichos[pedido] ? pedido : 'barbearia'

// useReducer: guarda os pedidos e decide como cada "ação" muda a lista.
// É como um useState, mas com as regras de mudança num lugar só.
function inicial(nicho) {
  return {
    pedidos: nichos[nicho].seed.map((p, i) => ({ ...p, id: i + 1 })),
    novos: [],
  }
}
function reducer(estado, acao) {
  switch (acao.tipo) {
    case 'novo':
      return {
        pedidos: [...estado.pedidos, acao.pedido],
        novos: [...estado.novos, acao.pedido.id],
      }
    case 'mudar':
      return {
        pedidos: estado.pedidos.map((p) =>
          p.id === acao.id ? { ...p, ...acao.campos } : p,
        ),
        novos: estado.novos.filter((n) => n !== acao.id),
      }
    case 'reset':
      return inicial(acao.nicho)
    default:
      return estado
  }
}

// Acompanha uma media query (ex.: celular em pé ou deitado)
function useMidia(q) {
  const [ok, setOk] = useState(() => matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const f = () => setOk(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [q])
  return ok
}
const CEL_EM_PE = '(max-width: 799px) and (orientation: portrait)'
const CEL_DEITADO = '(max-height: 520px) and (orientation: landscape)'

// Escala o "computador" pra caber na tela sem quebrar o layout
function useEscala(ativo, cheia, deitado) {
  const caixa = useRef(null)
  const [k, setK] = useState(1)
  useLayoutEffect(() => {
    if (!ativo) return
    const mede = () => {
      const largura = caixa.current.clientWidth
      const porAltura = deitado
        ? (innerHeight - 64) / 680
        : cheia
          ? (innerHeight - 170) / 680
          : 1
      setK(Math.min(1, largura / 1060, porAltura))
    }
    mede()
    const ro = new ResizeObserver(mede)
    ro.observe(caixa.current)
    return () => ro.disconnect()
  }, [ativo, cheia, deitado])
  return [caixa, k]
}

export default function Demo() {
  const [nicho, setNicho] = useState(nichoInicial)
  const [aparelho, setAparelho] = useState('celular')
  const [visao, setVisao] = useState('cliente')
  const [cheia, setCheia] = useState(false)
  const [estado, dispatch] = useReducer(reducer, nichoInicial, inicial)
  const [push, setPush] = useState(null)
  const [rodada, setRodada] = useState(0) // muda pra "recomeçar" o site do cliente
  const emPe = useMidia(CEL_EM_PE)
  const deitado = useMidia(CEL_DEITADO) && aparelho === 'computador'
  const [assimMesmo, setAssimMesmo] = useState(false)
  const pedeVirar = aparelho === 'computador' && emPe && !assimMesmo
  const [caixa, k] = useEscala(
    aparelho === 'computador' && !pedeVirar,
    cheia,
    deitado && cheia,
  )

  // Celular deitado na versão de computador: abre em tela cheia sozinho
  useEffect(() => {
    if (deitado) setCheia(true)
  }, [deitado])
  // Voltou a ficar em pé: sai da tela cheia e mostra o aviso de novo
  useEffect(() => {
    if (emPe && aparelho === 'computador') {
      setCheia(false)
      setAssimMesmo(false)
    }
  }, [emPe, aparelho])
  const cfg = nichos[nicho]
  const Site = cfg.iframe ? SiteIframe : sites[nicho]

  // Veio pelo link ?demo=...: já abre na demo
  useEffect(() => {
    if (nichos[pedido])
      setTimeout(() => document.getElementById('demo')?.scrollIntoView(), 300)
  }, [])

  // Notificação some sozinha depois de alguns segundos
  useEffect(() => {
    if (!push) return
    const t = setTimeout(() => setPush(null), 4500)
    return () => clearTimeout(t)
  }, [push])

  // Tela cheia: trava o scroll da página
  useEffect(() => {
    document.body.style.overflow = cheia ? 'hidden' : ''
    const esc = (e) => e.key === 'Escape' && setCheia(false)
    addEventListener('keydown', esc)
    return () => {
      document.body.style.overflow = ''
      removeEventListener('keydown', esc)
    }
  }, [cheia])

  function recomecar(n = nicho) {
    dispatch({ tipo: 'reset', nicho: n })
    setVisao('cliente')
    setPush(null)
    setRodada((r) => r + 1)
  }
  function trocaNicho(n) {
    setNicho(n)
    recomecar(n)
  }

  // O cliente enviou um pedido pelo site
  function enviar(pedido, atraso = 700) {
    const p = { ...pedido, id: Date.now() }
    dispatch({ tipo: 'novo', pedido: p })
    setTimeout(
      () =>
        setPush({
          icone: cfg.icone,
          titulo: 'Novo pedido!',
          texto: `${p.nome} · ${p.titulo} · ${p.quando}`,
          abrir: true,
        }),
      atraso,
    )
    return p
  }

  // O dono clicou num botão do card
  function acao(p, a) {
    const campos = { st: a.para }
    if (a.quando) campos.quando = a.quando
    dispatch({ tipo: 'mudar', id: p.id, campos })
    if (a.push) {
      const [icone, titulo, texto] = a.push
      setPush({ icone, titulo, texto: texto(p) })
    }
  }

  const tela =
    visao === 'cliente' ? (
      <Site
        key={`${nicho}-${rodada}`}
        cfg={cfg}
        onEnviar={enviar}
        verPainel={() => setVisao('dono')}
      />
    ) : (
      <Painel
        cfg={cfg}
        pedidos={estado.pedidos}
        novos={estado.novos}
        onAcao={acao}
      />
    )

  const temaPainel = Object.fromEntries(
    Object.entries(cfg.tema).map(([c, v]) => [`--${c}`, v]),
  )

  const notificacao = (
    <button
      className={`demo-push ${push ? 'on' : ''}`}
      onClick={() => {
        if (push?.abrir) setVisao('dono')
        setPush(null)
      }}
      tabIndex={push ? 0 : -1}
    >
      {push && (
        <>
          <span className="demo-push__ic">{push.icone}</span>
          <span>
            <b>{push.titulo}</b>
            {push.texto}
          </span>
          <small>agora</small>
        </>
      )}
    </button>
  )

  return (
    <section className="secao container" id="demo">
      <div className="cabecalho">
        <Reveal as="span" className="tag">
          Demo interativa
        </Reveal>
        <Reveal as="h2">
          Testa aí, <span className="grad">sem compromisso.</span>
        </Reveal>
        <Reveal as="p" className="muted">
          Quatro negócios fictícios, quatro sites totalmente diferentes. Faça um
          pedido como cliente e veja chegar no painel do dono.
        </Reveal>
      </div>

      <div
        className={`demo ${cheia ? 'demo--cheia' : ''} ${deitado && cheia ? 'demo--deitado' : ''}`}
      >
        <div className="demo__controles">
          <Segmentado
            rotulo="Tipo de negócio"
            valor={nicho}
            onChange={trocaNicho}
            opcoes={visiveis.map(([id, n]) => [id, n.rotulo])}
          />
          <Segmentado
            rotulo="Aparelho"
            valor={aparelho}
            onChange={setAparelho}
            opcoes={[
              ['celular', '📱 Celular'],
              ['computador', '💻 Computador'],
            ]}
          />
          <Segmentado
            rotulo="Visão"
            valor={visao}
            onChange={setVisao}
            opcoes={[
              ['cliente', 'Sou cliente'],
              [
                'dono',
                <>
                  Sou o dono{' '}
                  {estado.novos.length > 0 && (
                    <span className="demo__badge">{estado.novos.length}</span>
                  )}
                </>,
              ],
            ]}
          />
          <button className="demo__cheia" onClick={() => setCheia((c) => !c)}>
            {cheia ? '✕ Fechar' : '⛶ Tela cheia'}
          </button>
        </div>

        <div className="demo__palco" style={temaPainel}>
          {pedeVirar ? (
            <div className="demo-virar">
              <span className="demo-virar__cel" aria-hidden="true" />
              <b>Vira o celular</b>
              <p>Deita o celular pra ver a versão de computador do site.</p>
              <button onClick={() => setAssimMesmo(true)}>
                Ver assim mesmo
              </button>
            </div>
          ) : aparelho === 'celular' ? (
            <div className="demo__cel">
              <Iphone>
                <div className="demo__tela">
                  {notificacao}
                  <div className="demo__app">{tela}</div>
                </div>
              </Iphone>
            </div>
          ) : (
            <div className="demo__desk" ref={caixa}>
              <div
                style={{ width: 1060 * k, height: 680 * k, margin: '0 auto' }}
              >
                <div
                  style={{
                    width: 1060,
                    transform: `scale(${k})`,
                    transformOrigin: '0 0',
                  }}
                >
                  <Navegador
                    url={`${cfg.url}${visao === 'cliente' ? '' : '/painel'}`}
                  >
                    <div className="demo__tela">
                      {notificacao}
                      <div className="demo__app demo__app--desk">{tela}</div>
                    </div>
                  </Navegador>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="demo__rodape">
          <button onClick={() => recomecar()}>↺ Recomeçar demo</button>
        </div>
      </div>
    </section>
  )
}
