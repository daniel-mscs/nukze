import { useState } from 'react'
import './Tattoo.css'

// Áreas clicáveis do "mapa do corpo" (SVG). x, y, largura, altura.
const ZONAS = [
  ['Pescoço', 53, 37, 14, 10],
  ['Peito', 41, 49, 38, 26],
  ['Costela', 41, 77, 38, 24],
  ['Braço', 25, 51, 13, 40],
  ['Braço', 82, 51, 13, 40],
  ['Antebraço', 21, 94, 12, 36],
  ['Antebraço', 87, 94, 12, 36],
  ['Mão', 19, 133, 12, 13],
  ['Mão', 89, 133, 12, 13],
  ['Coxa', 42, 104, 17, 50],
  ['Coxa', 61, 104, 17, 50],
  ['Panturrilha', 43, 158, 15, 48],
  ['Panturrilha', 62, 158, 15, 48],
]

const preco = (base, cm) => Math.round(base + (cm - 5) * 22)

// Site fictício 2: estúdio de tatuagem editorial. Galeria de flashes,
// mapa do corpo clicável, tamanho com preço ao vivo e pedido no WhatsApp.
export default function Tattoo({ cfg, onEnviar, verPainel }) {
  const [etapa, setEtapa] = useState('galeria')
  const [flash, setFlash] = useState(null) // objeto do flash ou 'ideia'
  const [zona, setZona] = useState(null) // índice em ZONAS
  const [cm, setCm] = useState(8)
  const [artista, setArtista] = useState(cfg.artistas[0].n)
  const [ideia, setIdeia] = useState('')
  const [nome, setNome] = useState('')
  const [pedido, setPedido] = useState(null)

  const base = flash === 'ideia' ? 200 : flash?.p || 0
  const valor = preco(base, cm)
  const local = zona !== null ? ZONAS[zona][0] : null

  function enviar(e) {
    e.preventDefault()
    const titulo =
      flash === 'ideia' ? 'Ideia própria' : `Flash #${flash.id} ${flash.nome}`
    const p = onEnviar(
      {
        nome: nome.trim() || 'Camila',
        titulo,
        detalhe: `${local} · ${cm} cm · ${artista}`,
        quando: 'Aguardando',
        valor,
        st: 'novo',
        ideia:
          flash === 'ideia'
            ? ideia.trim() || 'Rosa fineline com o nome da minha mãe'
            : null,
      },
      3400,
    )
    setPedido(p)
    setEtapa('chat')
  }

  if (etapa === 'chat') {
    return (
      <div className="tt-chat">
        <div className="tt-chat__topo">
          <span>{cfg.icone}</span>
          <div>
            Tinta Viva · {artista}
            <small>online</small>
          </div>
        </div>
        <div className="tt-bolha tt-bolha--eu">
          Oi! Quero fazer uma tattoo 🖋️{'\n'}
          {pedido.titulo}
          {'\n'}Local: {local} · {cm} cm{'\n'}
          {pedido.ideia && `Ideia: ${pedido.ideia}\n`}Estimativa do site: R${' '}
          {valor}
          <small>agora ✓✓</small>
        </div>
        <div className="tt-digitando">{artista} está digitando…</div>
        <div className="tt-bolha tt-bolha--d1">
          Opa, {pedido.nome}! Curti demais 🔥 Vou fechar o desenho e já te mando
          o orçamento certinho.
          <small>agora</small>
        </div>
        <button className="demo-chama tt-bolha--d2" onClick={verPainel}>
          👀 Ver como o estúdio recebe →
        </button>
      </div>
    )
  }

  return (
    <div className="tt">
      <header className="tt-topo">
        <span className="tt-logo">
          TINTA<b>●</b>VIVA
        </span>
        <span className="tt-passos">
          {['galeria', 'corpo', 'enviar'].map((e, i) => (
            <i key={e} className={etapa === e ? 'on' : ''}>
              0{i + 1}
            </i>
          ))}
        </span>
      </header>

      {etapa === 'galeria' && (
        <>
          <div className="tt-manchete">
            <h3>
              FLASH
              <br />
              DAY <span>↘</span>
            </h3>
            <p>
              Escolha um desenho disponível ou mande sua ideia. Cada flash é
              tatuado uma vez só.
            </p>
          </div>
          <div className="tt-galeria">
            {cfg.flashes.map((f) => (
              <button
                key={f.id}
                className={flash?.id === f.id ? 'on' : ''}
                onClick={() => setFlash(f)}
              >
                <span className="tt-galeria__arte">{f.emoji}</span>
                <span className="tt-galeria__info">
                  #{String(f.id).padStart(2, '0')} {f.nome.toUpperCase()}
                  <b>R$ {f.p}+</b>
                </span>
                {f.id === 2 && <span className="tt-selo">ÚLTIMO</span>}
              </button>
            ))}
            <button
              className={`tt-galeria__ideia ${flash === 'ideia' ? 'on' : ''}`}
              onClick={() => setFlash('ideia')}
            >
              ✎<span>MINHA IDEIA</span>
            </button>
          </div>
          <div className="tt-barra">
            <button disabled={!flash} onClick={() => setEtapa('corpo')}>
              ONDE VAI SER? →
            </button>
          </div>
        </>
      )}

      {etapa === 'corpo' && (
        <>
          <div className="tt-corpo">
            <svg
              viewBox="0 0 120 215"
              aria-label="Mapa do corpo: toque no local da tatuagem"
            >
              <circle cx="60" cy="20" r="14" className="tt-cabeca" />
              {ZONAS.map(([n, x, y, w, h], i) => (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx="6"
                  className={
                    zona !== null && ZONAS[zona][0] === n
                      ? zona === i
                        ? 'on'
                        : 'par'
                      : ''
                  }
                  onClick={() => setZona(i)}
                  role="button"
                  aria-label={n}
                />
              ))}
            </svg>
            <div className="tt-corpo__info">
              <small>LOCAL</small>
              <b>{local || 'Toque no corpo'}</b>
              <small>TAMANHO</small>
              <b>{cm} cm</b>
              <input
                type="range"
                min="5"
                max="30"
                value={cm}
                onChange={(e) => setCm(+e.target.value)}
                aria-label="Tamanho em centímetros"
              />
              <div className="tt-regua" aria-hidden="true">
                {Array.from({ length: 26 }, (_, i) => (
                  <i key={i} className={i + 5 <= cm ? 'on' : ''} />
                ))}
              </div>
              <small>ESTIMATIVA</small>
              <b className="tt-preco" key={valor}>
                R$ {valor}
              </b>
            </div>
          </div>
          <div className="tt-barra">
            <button className="sec" onClick={() => setEtapa('galeria')}>
              ←
            </button>
            <button disabled={zona === null} onClick={() => setEtapa('enviar')}>
              QUASE LÁ →
            </button>
          </div>
        </>
      )}

      {etapa === 'enviar' && (
        <form className="tt-form" onSubmit={enviar}>
          <h3>Fala de você</h3>
          {flash === 'ideia' && (
            <label>
              Sua ideia
              <textarea
                rows="3"
                maxLength={80}
                value={ideia}
                onChange={(e) => setIdeia(e.target.value)}
                placeholder="Ex: rosa fineline com o nome da minha mãe"
              />
            </label>
          )}
          <label>
            Artista
            <span className="tt-artistas">
              {cfg.artistas.map((a) => (
                <button
                  type="button"
                  key={a.n}
                  className={artista === a.n ? 'on' : ''}
                  onClick={() => setArtista(a.n)}
                >
                  {a.n}
                  <small>{a.esp}</small>
                </button>
              ))}
            </span>
          </label>
          <label>
            Seu nome
            <input
              maxLength={20}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Camila"
            />
          </label>
          <div className="tt-resumo">
            {flash === 'ideia' ? 'Ideia própria' : `#${flash.id} ${flash.nome}`}{' '}
            · {local} · {cm} cm
            <b>~ R$ {valor}</b>
          </div>
          <div className="tt-barra">
            <button
              type="button"
              className="sec"
              onClick={() => setEtapa('corpo')}
            >
              ←
            </button>
            <button type="submit" className="wa">
              ENVIAR NO WHATSAPP 💬
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
