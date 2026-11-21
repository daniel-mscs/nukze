import { useRef } from 'react'
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
  // Porta escondida: 5 cliques rápidos no logo abrem o painel interno.
  // (Isso não é a segurança: o painel pede login e o banco só libera a equipe.)
  const cliques = useRef([])
  const contaClique = () => {
    const agora = Date.now()
    cliques.current = [...cliques.current, agora].filter(
      (t) => agora - t < 2500,
    )
    if (cliques.current.length >= 5) location.href = '/painel/'
  }

  return (
    <nav className="nav" aria-label="Principal">
      <a className="nav__logo" href="#topo" onClick={contaClique}>
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
