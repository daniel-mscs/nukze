import Reveal from './Reveal'
import './ComoFunciona.css'

const passos = [
  [
    'Escolha seu plano',
    'Vitrine, Agenda ou Automático, mais os módulos que quiser.',
  ],
  [
    'Eu crio seu site',
    'Design exclusivo, com a cara do seu negócio. Nada de template genérico.',
  ],
  [
    'Receba clientes',
    'Agendamentos chegando direto no seu celular, 24h por dia.',
  ],
]

// Atualiza a posição da luz do card conforme o mouse
function luz(e) {
  const b = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty(
    '--mx',
    `${((e.clientX - b.left) / b.width) * 100}%`,
  )
  e.currentTarget.style.setProperty(
    '--my',
    `${((e.clientY - b.top) / b.height) * 100}%`,
  )
}

export default function ComoFunciona() {
  return (
    <section className="secao container" id="como-funciona">
      <div className="cabecalho">
        <Reveal as="span" className="tag">
          Como funciona
        </Reveal>
        <Reveal as="h2">
          Três passos e <span className="grad">pronto.</span>
        </Reveal>
      </div>
      <div className="passos">
        {passos.map(([titulo, texto], i) => (
          <Reveal
            key={titulo}
            className="passo"
            atraso={i * 0.12}
            onPointerMove={luz}
          >
            <span className="passo__n">0{i + 1}</span>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
