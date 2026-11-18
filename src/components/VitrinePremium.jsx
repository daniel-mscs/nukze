import { useEffect, useRef, useState } from 'react'
import Navegador from './Navegador'
import './VitrinePremium.css'

const CORES = [
  ['Branco Polar', '#e8edf2', '#9aa7b4'],
  ['Azul Volt', '#38bdf8', '#1d4ed8'],
  ['Vermelho Brasa', '#fb7185', '#be123c'],
]

// Converte o progresso geral (0..1) no progresso de um trecho [ini, fim] (0..1)
const trecho = (p, ini, fim) =>
  Math.min(Math.max((p - ini) / (fim - ini), 0), 1)
const suave = (t) => 1 - Math.pow(1 - t, 3)

// Mockup de "site premium" que se monta conforme a página rola:
// o scroll vira a "linha do tempo" de um vídeo (carro fictício VOLTA E1).
export default function VitrinePremium() {
  const area = useRef(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    let quadro = 0
    const mede = () => {
      quadro = 0
      const r = area.current.getBoundingClientRect()
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
  }, [])

  // Cada cena ocupa um pedaço do scroll
  const t1 = suave(trecho(p, 0.02, 0.22)) // título + carro entrando
  const t2 = suave(trecho(p, 0.25, 0.45)) // aceleração
  const t3 = trecho(p, 0.48, 0.72) // autonomia + cores
  const t4 = suave(trecho(p, 0.75, 0.95)) // noite + reserva
  const cor =
    CORES[Math.min(CORES.length - 1, Math.floor(t3 * CORES.length * 0.999))]
  const giro = p * 2400 // graus das rodas
  const estrada = p * 3000 // px da faixa andando

  return (
    <div className="vp" ref={area}>
      <div className="vp__fixo">
        <Navegador url="volta-e1.com.br" className="vp__nav">
          <div
            className="vp__cena"
            style={{
              '--noite': t4,
              '--carro': cor[1],
              '--carro2': cor[2],
              '--estrada': `${-estrada}px`,
            }}
          >
            <div className="vp__ceu" />
            <div
              className="vp__cidade"
              style={{ transform: `translateX(${-p * 18}%)` }}
              aria-hidden="true"
            >
              {Array.from({ length: 22 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${30 + ((i * 37) % 60)}%`,
                    left: `${i * 6}%`,
                  }}
                />
              ))}
            </div>
            <div className="vp__estrada" />

            <header className="vp__menu">
              <b>VOLTA</b>
              <span>Modelos</span>
              <span>Tecnologia</span>
              <em>Reservar</em>
            </header>

            {/* Cena 1: título */}
            <div
              className="vp__titulo"
              style={{
                opacity: t1 * (1 - t2),
                transform: `translateY(${(1 - t1) * 30}px)`,
              }}
            >
              <small>NOVO 100% ELÉTRICO</small>
              <h4>
                VOLTA <span>E1</span>
              </h4>
            </div>

            {/* Cena 2: vem da esquerda */}
            <div
              className="vp__info vp__info--esq"
              style={{
                opacity: t2 * (1 - t3 * 2),
                transform: `translateX(${(1 - t2) * -120}%)`,
              }}
            >
              <b>{(3.8 + (1 - t2) * 6.2).toFixed(1)}s</b>
              <span>de 0 a 100 km/h</span>
            </div>

            {/* Cena 3: vem da direita */}
            <div
              className="vp__info vp__info--dir"
              style={{
                opacity: Math.min(t3 * 3, 1) * (1 - t4),
                transform: `translateX(${(1 - Math.min(t3 * 2, 1)) * 120}%)`,
              }}
            >
              <b>{Math.round(520 * Math.min(t3 * 1.5, 1))} km</b>
              <span>de autonomia</span>
              <div className="vp__bateria">
                <i style={{ width: `${Math.min(t3 * 1.5, 1) * 100}%` }} />
              </div>
              <small>
                Cor: <em style={{ color: cor[1] }}>{cor[0]}</em>
              </small>
            </div>

            {/* Cena 4: chamada final */}
            <div
              className="vp__final"
              style={{ opacity: t4, transform: `scale(${0.9 + t4 * 0.1})` }}
            >
              <h4>A cidade à noite é sua.</h4>
              <span>Reserve o seu →</span>
            </div>

            {/* O carro (SVG desenhado à mão, marca fictícia) */}
            <svg
              className="vp__carro"
              viewBox="0 0 600 200"
              style={{ transform: `translateX(${(1 - t1) * 70 - t4 * 8}%)` }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="vp-lataria" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--carro)" />
                  <stop offset="1" stopColor="var(--carro2)" />
                </linearGradient>
                <radialGradient id="vp-farol">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="1" stopColor="#fff0" />
                </radialGradient>
              </defs>
              <ellipse
                cx="300"
                cy="172"
                rx="250"
                ry="10"
                fill="#000"
                opacity="0.5"
              />
              {/* facho do farol, aparece à noite */}
              <path
                d="M560 112 L760 80 L760 160 Z"
                fill="url(#vp-farol)"
                opacity={t4 * 0.6}
              />
              <path
                d="M40 140 C50 112 92 102 160 96 L240 62 C290 44 380 42 440 62 L520 96 C560 104 578 120 576 140 L572 152 L40 152 Z"
                fill="url(#vp-lataria)"
              />
              <path
                d="M250 70 C300 54 370 54 425 68 L470 96 L215 98 Z"
                fill="#0b1220"
                opacity="0.85"
              />
              <path
                d="M340 58 L336 98"
                stroke="var(--carro2)"
                strokeWidth="5"
              />
              <rect
                x="548"
                y="108"
                width="26"
                height="7"
                rx="3.5"
                fill="#fff"
                opacity={0.5 + t4 * 0.5}
              />
              <rect
                x="40"
                y="114"
                width="16"
                height="6"
                rx="3"
                fill="#f43f5e"
              />
              <path d="M70 140 H540" stroke="#ffffff33" strokeWidth="1.5" />
              {[150, 460].map((x) => (
                <g key={x} transform={`translate(${x} 150)`}>
                  <circle r="34" fill="#0b0b0f" />
                  <circle
                    r="22"
                    fill="#1f2937"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                  <g
                    transform={`rotate(${giro})`}
                    stroke="#d1d5db"
                    strokeWidth="3"
                  >
                    <line x1="-20" y1="0" x2="20" y2="0" />
                    <line x1="0" y1="-20" x2="0" y2="20" />
                    <line x1="-14" y1="-14" x2="14" y2="14" />
                    <line x1="-14" y1="14" x2="14" y2="-14" />
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
