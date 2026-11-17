import { useReveal } from '../hooks/useReveal'

// Envolve qualquer coisa que deve "aparecer subindo" ao rolar.
// as = qual tag usar (div, h2, p...), atraso = segundos de espera.
export default function Reveal({
  as = 'div',
  atraso = 0,
  className = '',
  children,
  ...resto
}) {
  const Tag = as
  const ref = useReveal()
  return (
    <Tag
      ref={ref}
      className={`rev ${className}`}
      style={{ transitionDelay: `${atraso}s` }}
      {...resto}
    >
      {children}
    </Tag>
  )
}
