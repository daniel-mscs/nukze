import { useState } from 'react'
import { proximosDias } from '../../data/demo'
import './Imobiliaria.css'

const HORAS = ['09:00', '10:30', '14:00', '15:30', '17:00', '18:30']
const foto = (n) => `/demo/imob/${n}.webp`
const reais = (v) => `R$ ${v.toLocaleString('pt-BR')}`

// Site fictício 4: imobiliária. Lista de imóveis, página do imóvel
// (com tour 3D na cobertura) e agendamento de visita com o corretor.
export default function Imobiliaria({ cfg, onEnviar, verPainel }) {
  const [filtro, setFiltro] = useState('Todos')
  const [imovel, setImovel] = useState(null)
  const [fotoAtual, setFotoAtual] = useState(0)
  const [tour, setTour] = useState(false)
  const [agendando, setAgendando] = useState(false)
  const [dia, setDia] = useState(null)
  const [hora, setHora] = useState(null)
  const [nome, setNome] = useState('')
  const [feito, setFeito] = useState(null)
  const dias = proximosDias(5)

  const tipos = ['Todos', ...new Set(cfg.imoveis.map((i) => i.tipo))]
  const lista = cfg.imoveis.filter(
    (i) => filtro === 'Todos' || i.tipo === filtro,
  )
  // corretor "da vez" muda conforme o imóvel
  const corretor = imovel
    ? cfg.corretores[cfg.imoveis.indexOf(imovel) % cfg.corretores.length]
    : ''

  function abrir(i) {
    setImovel(i)
    setFotoAtual(0)
    setTour(false)
    setAgendando(false)
    setDia(null)
    setHora(null)
  }

  function confirmar(e) {
    e.preventDefault()
    const p = onEnviar({
      nome: nome.trim() || 'Paula',
      titulo: imovel.nome,
      detalhe: `${imovel.bairro} · com ${corretor}`,
      quando: `${dia.semana === 'Hoje' ? 'Hoje' : `${dia.semana} ${dia.dia}`} ${hora}`,
      valor: imovel.aluguel,
      st: 'pendente',
    })
    setFeito(p)
  }

  const topo = (
    <header className="av-topo">
      <button className="av-logo" onClick={() => setImovel(null)}>
        alto<b>vista</b>
        <small>imóveis</small>
      </button>
      <span className="av-topo__menu">Alugar</span>
    </header>
  )

  if (feito) {
    return (
      <div className="av">
        {topo}
        <section className="av-feito av-entra">
          <img src={foto(imovel.fotos[0])} alt="" />
          <div>
            <span className="av-selo">Visita pedida ✓</span>
            <h3>Até logo, {feito.nome}!</h3>
            <p>
              {imovel.nome} · {imovel.bairro}
              <br />
              {feito.quando} com {corretor}
            </p>
            <p className="av-dica">
              A confirmação chega no seu WhatsApp, com o endereço.
            </p>
            <button className="demo-chama" onClick={verPainel}>
              👀 Ver como o corretor recebe →
            </button>
          </div>
        </section>
      </div>
    )
  }

  // Página do imóvel
  if (imovel) {
    return (
      <div className="av">
        {topo}
        <section className="av-imovel av-entra" key={imovel.id}>
          <button className="av-voltar" onClick={() => setImovel(null)}>
            ← Imóveis
          </button>
          <div className="av-galeria">
            <div className="av-galeria__principal">
              {tour ? (
                <video
                  src="/premium/tour.mp4"
                  poster="/premium/tour-capa.webp"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={foto(imovel.fotos[fotoAtual])}
                  alt={imovel.nome}
                  key={fotoAtual}
                />
              )}
              {imovel.tour && (
                <button
                  className={`av-tour ${tour ? 'on' : ''}`}
                  onClick={() => setTour((t) => !t)}
                >
                  {tour ? '✕ Fechar tour' : '🎥 Tour 3D'}
                </button>
              )}
            </div>
            <div className="av-galeria__mini">
              {imovel.fotos.map((f, i) => (
                <button
                  key={f}
                  className={!tour && fotoAtual === i ? 'on' : ''}
                  onClick={() => {
                    setTour(false)
                    setFotoAtual(i)
                  }}
                >
                  <img src={foto(f)} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="av-detalhe">
            <small className="av-bairro">
              {imovel.tipo} · {imovel.bairro}
            </small>
            <h3>{imovel.nome}</h3>
            <div className="av-preco">
              {reais(imovel.aluguel)}
              <small>/mês</small>
            </div>
            <ul className="av-carac">
              <li>
                <b>{imovel.m2}</b> m²
              </li>
              <li>
                <b>{imovel.quartos}</b> quarto{imovel.quartos > 1 && 's'}
              </li>
              <li>
                <b>{imovel.vagas}</b> vaga{imovel.vagas > 1 && 's'}
              </li>
            </ul>

            {!agendando ? (
              <button className="av-bt" onClick={() => setAgendando(true)}>
                Agendar visita
              </button>
            ) : (
              <form className="av-agenda av-entra" onSubmit={confirmar}>
                <small className="av-bairro">
                  Visita com {corretor}, corretora
                </small>
                <div className="av-dias">
                  {dias.map((d) => (
                    <button
                      type="button"
                      key={d.chave}
                      className={dia?.chave === d.chave ? 'on' : ''}
                      onClick={() => setDia(d)}
                    >
                      {d.semana}
                      <b>{d.dia}</b>
                    </button>
                  ))}
                </div>
                {dia && (
                  <div className="av-horas av-entra">
                    {HORAS.map((h) => (
                      <button
                        type="button"
                        key={h}
                        className={hora === h ? 'on' : ''}
                        onClick={() => setHora(h)}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}
                {hora && (
                  <div className="av-entra">
                    <input
                      autoFocus
                      maxLength={20}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                    />
                    <button className="av-bt" type="submit">
                      Confirmar visita
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </section>
      </div>
    )
  }

  // Lista de imóveis
  return (
    <div className="av">
      {topo}
      <section className="av-hero">
        <h3>
          Seu próximo lar,
          <br />
          <em>com vista.</em>
        </h3>
        <p>Imóveis selecionados, com fotos reais e tour 3D.</p>
        <div className="av-filtros">
          {tipos.map((t) => (
            <button
              key={t}
              className={filtro === t ? 'on' : ''}
              onClick={() => setFiltro(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <div className="av-lista">
        {lista.map((i) => (
          <button
            key={i.id}
            className="av-card av-entra"
            onClick={() => abrir(i)}
          >
            <div className="av-card__foto">
              <img src={foto(i.fotos[0])} alt={i.nome} loading="lazy" />
              {i.tour && <span className="av-card__selo">🎥 Tour 3D</span>}
            </div>
            <div className="av-card__info">
              <small>
                {i.tipo} · {i.bairro}
              </small>
              <b>{i.nome}</b>
              <span>
                {i.m2} m² · {i.quartos} qto{i.quartos > 1 && 's'} · {i.vagas}{' '}
                vaga{i.vagas > 1 && 's'}
              </span>
              <em>
                {reais(i.aluguel)}
                <small>/mês</small>
              </em>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
