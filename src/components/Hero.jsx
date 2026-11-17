import Iphone from './Iphone'
import Navegador from './Navegador'
import './Hero.css'

// Quebra o texto em palavras pra cada uma entrar com um pequeno atraso
function Palavras({ texto, inicio = 0, className = '' }) {
  return texto.split(' ').map((p, i) => (
    <span key={i}>
      <span
        className={`hero__palavra ${className}`}
        style={{ animationDelay: `${(inicio + i) * 0.1}s` }}
      >
        {p}
      </span>{' '}
    </span>
  ))
}

export default function Hero() {
  return (
    <header className="hero" id="topo">
      <div className="hero__aurora" aria-hidden="true">
        <i />
        <i />
      </div>
      <div className="hero__grade" aria-hidden="true" />

      <div className="container hero__conteudo">
        <div className="hero__texto">
          <span className="tag">Site + agenda + painel</span>
          <h1>
            <Palavras texto="Seu negócio" />
            <Palavras texto="no automático." inicio={2} className="grad" />
          </h1>
          <p className="hero__sub muted">
            Site sob medida, agendamento online e painel de gestão para
            barbearias, estúdios de tatuagem, manicures e salões. Seus clientes
            marcam sozinhos e você acompanha tudo pelo celular.
          </p>
          <div className="botoes">
            <a className="btn btn--principal" href="#demo">
              ▶ Testar a demo
            </a>
            <a className="btn" href="#orcamento">
              Pedir orçamento
            </a>
          </div>
          <div className="hero__provas">
            <span>
              ✦ <b>Sem app</b> pra baixar
            </span>
            <span>
              ✦ <b>Agenda 24h</b>
            </span>
            <span>
              ✦ <b>Já em uso</b> todo dia
            </span>
          </div>
        </div>

        <div className="hero__palco">
          <div className="tilt" style={{ '--forca': 6 }}>
            <Navegador
              url="barbeariarezenha.com.br"
              src="/projetos/rezenha/desktop-inicio.webp"
              alt="Site da Rezenha Barbearia no computador"
            />
          </div>
          <div className="hero__cel flutua">
            <div className="tilt" style={{ '--forca': 14 }}>
              <Iphone
                src="/projetos/rezenha/celular-painel.webp"
                alt="Painel do dono no celular"
              />
            </div>
          </div>
          <div className="hero__cel hero__cel--2 flutua flutua--lento">
            <div className="tilt" style={{ '--forca': 14 }}>
              <Iphone
                src="/projetos/rezenha/celular-agendamento.webp"
                alt="Agendamento no celular"
              />
            </div>
          </div>
          <div className="hero__aviso" aria-hidden="true">
            <span className="pingo" />
            <div>
              <b>Novo agendamento</b>
              <span>Corte + Barba · hoje 14:30</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
