import './Navegador.css'

// Moldura de janela de navegador, com a barra de endereço.
export default function Navegador({
  url,
  src,
  alt = '',
  children,
  className = '',
  ...resto
}) {
  return (
    <div className={`navegador ${className}`} {...resto}>
      <div className="navegador__barra">
        <i />
        <i />
        <i />
        <span className="navegador__url">🔒 {url}</span>
      </div>
      {src ? <img src={src} alt={alt} loading="lazy" /> : children}
    </div>
  )
}
