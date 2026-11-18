import './Nav.css'

const links = [
  ['#demo', 'Demo'],
  ['#projetos', 'Projetos'],
  ['#como-funciona', 'Como funciona'],
  ['#planos', 'Planos'],
  ['#premium', 'Sites premium'],
  ['#quem-faz', 'Quem faz'],
]

export default function Nav() {
  return (
    <nav className="nav" aria-label="Principal">
      <a className="nav__logo" href="#topo">
        nukze<span>.</span>
      </a>
      <div className="nav__links">
        {links.map(([href, texto]) => (
          <a key={href} href={href}>
            {texto}
          </a>
        ))}
      </div>
      <a className="btn btn--principal" href="#monte-seu-plano">
        Monte seu plano
      </a>
    </nav>
  )
}
