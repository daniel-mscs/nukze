import { useEffect, useRef, useState } from 'react'
import Navegador from './Navegador'
import './VitrinePremium.css'

// Pinturas do carro (nome, cor clara, cor escura)
const CORES = [
  ['Prata Corrida', '#e5e7eb', '#6b7280'],
  ['Azul Elétrico', '#38bdf8', '#1d4ed8'],
  ['Vermelho Pista', '#f43f5e', '#9f1239'],
]

// Converte o progresso geral (0..1) no progresso de um trecho [ini, fim] (0..1)
const trecho = (p, ini, fim) =>
  Math.min(Math.max((p - ini) / (fim - ini), 0), 1)
const suave = (t) => 1 - Math.pow(1 - t, 3)

// Mockup de "site premium" que se monta conforme a página rola:
// o scroll vira a "linha do tempo" de um vídeo (equipe fictícia VOLTA Racing).
// medirDe: no PC, o progresso vem da seção inteira (o card todo fica grudado);
// no celular, vem da própria área alta do mockup.
export default function VitrinePremium({ medirDe }) {
  const area = useRef(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    let quadro = 0
    const mede = () => {
      quadro = 0
      const pc = matchMedia('(min-width: 900px)').matches
      const alvo = (pc && medirDe?.current) || area.current
      const r = alvo.getBoundingClientRect()
      const total = r.height - innerHeight
      setP(Math.min(Math.max(-r.top / total, 0), 1))
    }
    const pede = () => {
      if (!quadro) quadro = requestAnimationFrame(mede)
    }
    addEventListener('scroll', pede, { passive: true })
    addEventListener('resize', pede)
    mede()
    return () => {
      removeEventListener('scroll', pede)
      removeEventListener('resize', pede)
      cancelAnimationFrame(quadro)
    }
  }, [medirDe])

  // Cada cena ocupa um pedaço do scroll
  const t1 = suave(trecho(p, 0.02, 0.22)) // título + carro entrando
  const t2 = suave(trecho(p, 0.25, 0.45)) // aceleração
  const t3 = trecho(p, 0.48, 0.72) // velocidade + pinturas
  const t4 = suave(trecho(p, 0.75, 0.95)) // corrida noturna + ingresso
  const cor =
    CORES[Math.min(CORES.length - 1, Math.floor(t3 * CORES.length * 0.999))]
  const giro = p * 3600 // graus das rodas
  const pista = p * 4000 // px da pista andando
  const vel = Math.min(t3 * 1.5, 1)

  return (
    <div className="vp" ref={area}>
      <div className="vp__fixo">
        <Navegador url="voltaracing.com.br" className="vp__nav">
          <div
            className="vp__cena"
            style={{
              '--noite': t4,
              '--carro': cor[1],
              '--carro2': cor[2],
              '--pista': `${-pista}px`,
            }}
          >
            <div className="vp__ceu" />
            <div
              className="vp__arquibancada"
              style={{ transform: `translateX(${-p * 25}%)` }}
              aria-hidden="true"
            >
              {Array.from({ length: 7 }, (_, i) => (
                <i
                  key={i}
                  className="vp__torre"
                  style={{ left: `${6 + i * 15}%` }}
                />
              ))}
            </div>
            <div className="vp__pista" />

            <header className="vp__menu">
              <b>VOLTA RACING</b>
              <span>Equipe</span>
              <span>Calendário</span>
              <em>Ingressos</em>
            </header>

            {/* Cena 1: título */}
            <div
              className="vp__titulo"
              style={{
                opacity: t1 * (1 - t2),
                transform: `translateY(${(1 - t1) * 30}px)`,
              }}
            >
              <small>GP DE SANTA MARIA · TEMPORADA 2027</small>
              <h4>
                VOLTA <span>VR-07</span>
              </h4>
            </div>

            {/* Cena 2: entra pela esquerda */}
            <div
              className="vp__info vp__info--esq"
              style={{
                opacity: t2 * (1 - t3 * 2),
                transform: `translateX(${(1 - t2) * -120}%)`,
              }}
            >
              <b>{(2.6 + (1 - t2) * 5.4).toFixed(1)}s</b>
              <span>de 0 a 100 km/h</span>
            </div>

            {/* Cena 3: entra pela direita */}
            <div
              className="vp__info vp__info--dir"
              style={{
                opacity: Math.min(t3 * 3, 1) * (1 - t4),
                transform: `translateX(${(1 - Math.min(t3 * 2, 1)) * 120}%)`,
              }}
            >
              <b>{Math.round(350 * vel)} km/h</b>
              <span>de velocidade máxima</span>
              <div className="vp__barra">
                <i style={{ width: `${vel * 100}%` }} />
              </div>
              <small>
                Pintura: <em style={{ color: cor[1] }}>{cor[0]}</em>
              </small>
            </div>

            {/* Cena 4: chamada final */}
            <div
              className="vp__final"
              style={{ opacity: t4, transform: `scale(${0.9 + t4 * 0.1})` }}
            >
              <h4>A próxima volta é sua.</h4>
              <span>Garanta seu ingresso →</span>
            </div>

            {/* Linhas de velocidade atrás do carro */}
            <div
              className="vp__vento"
              style={{ opacity: Math.max(t2, vel) * (1 - t4 * 0.5) }}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </div>

            {/* Carro de corrida (SVG desenhado à mão, equipe fictícia) */}
            <svg
              className="vp__carro"
              viewBox="0 0 640 170"
              style={{ transform: `translateX(${(1 - t1) * 80 - t4 * 6}%)` }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="vp-lataria" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--carro)" />
                  <stop offset="1" stopColor="var(--carro2)" />
                </linearGradient>
              </defs>
              <ellipse
                cx="320"
                cy="152"
                rx="300"
                ry="8"
                fill="#000"
                opacity="0.55"
              />
              {/* luz traseira (acende à noite) */}
              <rect
                x="20"
                y="96"
                width="10"
                height="7"
                rx="2"
                fill="#ef4444"
                opacity={0.4 + t4 * 0.6}
              />
              {/* assoalho */}
              <rect
                x="60"
                y="126"
                width="530"
                height="7"
                rx="3"
                fill="#111827"
              />
              {/* asa traseira */}
              <rect x="30" y="40" width="9" height="80" rx="2" fill="#111827" />
              <rect
                x="24"
                y="38"
                width="82"
                height="12"
                rx="3"
                fill="url(#vp-lataria)"
              />
              <rect x="30" y="55" width="68" height="7" rx="3" fill="#111827" />
              <path d="M74 62 L96 106" stroke="#111827" strokeWidth="6" />
              {/* carroceria, do motor até o bico */}
              <path
                d="M78 126 L78 98 C120 92 170 86 220 84 L268 80 C300 76 330 78 352 84 L470 104 C520 110 560 114 600 118 L606 126 Z"
                fill="url(#vp-lataria)"
              />
              {/* sidepod */}
              <path
                d="M180 126 C190 104 230 98 300 98 C330 98 350 104 360 126 Z"
                fill="var(--carro2)"
                opacity="0.6"
              />
              {/* tomada de ar acima do piloto */}
              <path
                d="M206 86 C222 52 264 50 286 80 Z"
                fill="url(#vp-lataria)"
              />
              <path d="M226 72 C236 62 252 62 262 72" fill="#0b0b0f" />
              {/* capacete e halo */}
              <circle cx="312" cy="72" r="13" fill="#fde047" />
              <rect
                x="314"
                y="66"
                width="12"
                height="6"
                rx="2"
                fill="#0b0b0f"
              />
              <path
                d="M286 82 Q314 52 352 84"
                stroke="#111827"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              {/* número e faixa */}
              <text
                x="140"
                y="114"
                fontFamily="Unbounded, sans-serif"
                fontWeight="800"
                fontSize="22"
                fill="#0b0b0f"
                opacity="0.85"
              >
                07
              </text>
              <path
                d="M360 100 L600 120"
                stroke="#fff"
                strokeWidth="2"
                opacity="0.5"
              />
              {/* asa dianteira */}
              <rect
                x="540"
                y="128"
                width="96"
                height="6"
                rx="3"
                fill="#111827"
              />
              <rect
                x="630"
                y="112"
                width="6"
                height="22"
                rx="2"
                fill="url(#vp-lataria)"
              />
              {/* rodas (traseira maior) com a faixa colorida do pneu de corrida */}
              {[
                [140, 40],
                [500, 34],
              ].map(([x, r]) => (
                <g key={x} transform={`translate(${x} ${152 - r})`}>
                  <circle r={r} fill="#0b0b0f" />
                  <circle
                    r={r - 7}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                  />
                  <circle r={r - 14} fill="#1f2937" />
                  <g
                    transform={`rotate(${giro})`}
                    stroke="#9ca3af"
                    strokeWidth="3"
                  >
                    <line x1={-(r - 15)} y1="0" x2={r - 15} y2="0" />
                    <line x1="0" y1={-(r - 15)} x2="0" y2={r - 15} />
                    <line
                      x1={-(r - 20)}
                      y1={-(r - 20)}
                      x2={r - 20}
                      y2={r - 20}
                    />
                    <line
                      x1={-(r - 20)}
                      y1={r - 20}
                      x2={r - 20}
                      y2={-(r - 20)}
                    />
                  </g>
                  <circle r="5" fill="#e5e7eb" />
                </g>
              ))}
            </svg>

            <span className="vp__selo">Exemplo fictício · role pra ver ↓</span>
            <div className="vp__progresso">
              <i style={{ width: `${p * 100}%` }} />
            </div>
          </div>
        </Navegador>
      </div>
    </div>
  )
}
