import './Iphone.css'

// Moldura de iPhone. Pode receber uma imagem (src) ou qualquer conteúdo (children).
export default function Iphone({
  src,
  alt = '',
  children,
  className = '',
  ...resto
}) {
  return (
    <div className={`iphone ${className}`} {...resto}>
      <span className="iphone__lado iphone__lado--1" />
      <span className="iphone__lado iphone__lado--2" />
      <span className="iphone__lado iphone__lado--3" />
      <span className="iphone__lado iphone__lado--4" />
      <div className="iphone__vidro">
        <span className="iphone__ilha" />
        <span className="iphone__reflexo" />
        {src ? <img src={src} alt={alt} loading="lazy" /> : children}
      </div>
    </div>
  )
}
