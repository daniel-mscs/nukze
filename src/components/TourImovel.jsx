import { useState } from 'react'
import Iphone from './Iphone'
import VideoAuto from './VideoAuto'
import './TourImovel.css'

// Exemplo de site premium: imobiliária fictícia com tour 3D dentro do imóvel.
// O vídeo foi gerado por IA; a interface por cima é feita em código.
const video = {
  mp4: '/premium/tour.mp4',
  webm: '/premium/tour.webm',
  capa: '/premium/tour-capa.webp',
}

// cômodo que aparece em cada trecho do vídeo (segundos)
const comodos = [
  [0, 'Entrada'],
  [3.2, 'Sala de estar'],
  [7.4, 'Cozinha'],
  [11, 'Varanda'],
]

export default function TourImovel() {
  const [comodo, setComodo] = useState(comodos[0][1])
  const [progresso, setProgresso] = useState(0)

  const atualiza = (e) => {
    const t = e.currentTarget.currentTime
    const atual = comodos.filter(([s]) => t >= s).pop()[1]
    if (atual !== comodo) setComodo(atual)
    setProgresso(t / (e.currentTarget.duration || 15))
  }

  return (
    <div className="tour flutua">
      <Iphone>
        <div className="tour__tela">
          <VideoAuto
            video={video}
            alt="Tour 3D por dentro de um apartamento"
            onTimeUpdate={atualiza}
          />

          <div className="tour__topo">
            <span className="tour__marca">
              alto<b>vista</b>
            </span>
            <span className="tour__selo">● Tour 3D</span>
          </div>

          {/* setas no chão, tipo Street View */}
          <div className="tour__seta" aria-hidden="true">
            <span />
          </div>

          <div className="tour__info">
            <span className="tour__comodo" key={comodo}>
              {comodo}
            </span>
            <b>Cobertura com vista</b>
            <small>3 quartos · 180 m² · 2 vagas</small>
            <i className="tour__barra">
              <i style={{ transform: `scaleX(${progresso})` }} />
            </i>
          </div>
        </div>
      </Iphone>
      <span className="tour__legenda">Exemplo fictício · imobiliária</span>
    </div>
  )
}
