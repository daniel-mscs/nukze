import { useState } from 'react'
import './BannerCookies.css'

const CHAVE = 'nukze-aviso-privacidade'

function jaViu() {
  try {
    return localStorage.getItem(CHAVE) === '1'
  } catch {
    return false
  }
}

// O site não usa cookies de propaganda nem de rastreamento.
// O aviso existe pra deixar claro o que é guardado e linkar a política (LGPD).
export default function BannerCookies() {
  const [visivel, setVisivel] = useState(() => !jaViu())
  if (!visivel) return null

  function ok() {
    setVisivel(false)
    try {
      localStorage.setItem(CHAVE, '1')
    } catch {
      // sem armazenamento: o aviso só volta na próxima visita
    }
  }

  return (
    <div className="cookies" role="region" aria-label="Aviso de privacidade">
      <p>
        🍪 Aqui não tem cookie de propaganda nem rastreamento. Só guardo no seu
        navegador o essencial pro site funcionar.{' '}
        <a href="/privacidade/">Saiba mais</a>
      </p>
      <button className="btn btn--principal" onClick={ok}>
        Entendi
      </button>
    </div>
  )
}
