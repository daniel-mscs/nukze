import Reveal from './Reveal'

// Lugar reservado: a demo interativa entra aqui na próxima etapa
export default function DemoEmBreve() {
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
          🚧 Em construção: próxima etapa.
        </Reveal>
      </div>
    </section>
  )
}
