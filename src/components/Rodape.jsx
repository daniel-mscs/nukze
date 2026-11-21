import { site, linkWhatsapp } from '../data/site'
import './Rodape.css'

export default function Rodape() {
  const { links } = site
  const redes = [
    ['Instagram @nukze.empresas', site.instagram],
    ['Portfólio', links.portfolio],
    ['Instagram do Daniel', links.instagram],
    ['LinkedIn', links.linkedin],
    ['GitHub', links.github],
  ].filter(([, url]) => url)

  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape__grade">
          <div>
            <div className="rodape__logo">
              nukze<span>.</span>
            </div>
            <p style={{ maxWidth: 340, marginTop: 8 }}>
              Site, agenda e painel para negócios de serviço. Feito em{' '}
              {site.cidade}.
            </p>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li>
                <a href="#planos">Planos</a>
              </li>
              <li>
                <a href="#faq">Perguntas frequentes</a>
              </li>
              <li>
                <a href="/privacidade/">Política de privacidade</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li>
                <a
                  href={linkWhatsapp()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="/suporte/">Suporte (já sou cliente)</a>
              </li>
              {links.email && (
                <li>
                  <a href={`mailto:${links.email}`}>{links.email}</a>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h4>Redes</h4>
            <ul>
              {redes.map(([nome, url]) => (
                <li key={nome}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rodape__fim">
          © {new Date().getFullYear()} {site.nome} · {site.dono.nome}
        </div>
      </div>
    </footer>
  )
}
