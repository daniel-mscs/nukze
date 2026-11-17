import { useEffect, useRef, useState } from 'react'

// Vídeo que toca sozinho, sem som e em loop, igual um GIF (só que bem mais leve).
// - Só toca quando está visível na tela (economiza bateria e dados).
// - Quem ativou "reduzir movimento" no celular vê só a imagem de capa.
// video = { mp4, webm, capa }
export default function VideoAuto({ video, alt = '' }) {
  const ref = useRef(null)
  const [calmo] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      {
        threshold: 0.2,
      },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (calmo) return <img src={video.capa} alt={alt} />

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster={video.capa}
      aria-label={alt}
    >
      <source src={video.webm} type="video/webm" />
      <source src={video.mp4} type="video/mp4" />
    </video>
  )
}
