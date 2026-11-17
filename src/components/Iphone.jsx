import VideoAuto from './VideoAuto'
import './Iphone.css'

// Moldura de iPhone. Pode receber uma imagem (src), um vídeo (video) ou qualquer conteúdo (children).
export default function Iphone({
  src,
  video,
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
        {video ? (
          <VideoAuto video={video} alt={alt} />
        ) : src ? (
          <img src={src} alt={alt} loading="lazy" />
        ) : (
          children
        )}
      </div>
    </div>
  )
}
