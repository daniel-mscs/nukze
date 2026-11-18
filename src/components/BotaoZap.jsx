import { useEffect, useRef, useState } from 'react'
import { linkWhatsapp } from '../data/site'
import './BotaoZap.css'

// Balões por seção do site: [texto do balão, mensagem que vai pro WhatsApp]
const MENSAGENS = {
  topo: [
    'Oi! 👋 Quer ver como ficaria o site do seu negócio?',
    'Oi! Quero ver como ficaria o site do meu negócio.',
  ],
  demo: [
    'Gostou da demo? Faço igual pro seu negócio 😉',
    'Oi! Vi a demo e quero uma pro meu negócio.',
  ],
  projetos: [
    'Esse eu fiz. Bora fazer o seu?',
    'Oi! Vi os projetos e quero o meu.',
  ],
  planos: [
    'Ficou na dúvida de qual plano escolher?',
    'Oi! Tô em dúvida sobre qual plano escolher.',
  ],
  'monte-seu-plano': [
    'Travou em alguma coisa? Te ajudo por aqui.',
    'Oi! Preciso de ajuda pra montar meu plano.',
  ],
  premium: [
    'Precisa só de um site bonito? Me chama.',
    'Oi! Quero um orçamento de site premium.',
  ],
}
const GERAL = [
  'Precisa de ajuda? Tô online 🙂',
  'Oi! Vim pelo site da Nukze e quero tirar uma dúvida.',
]
const INTERVALO = 20000 // 20 s entre um balão e outro
const DURACAO = 7000 // quanto tempo o balão fica visível
const MAXIMO = 6 // depois disso, para de insistir

function lerFechado() {
  try {
    return sessionStorage.getItem('zap-calado') === '1'
  } catch {
    return false
  }
}

export default function BotaoZap() {
  const [secao, setSecao] = useState('topo')
  const [balao, setBalao] = useState(null)
  const [calado, setCalado] = useState(lerFechado)
  const [subir, setSubir] = useState(false)
  const vezes = useRef(0)
  const secaoAtual = useRef('topo')

  // Descobre em qual seção a pessoa está (a que ocupa o meio da tela)
  useEffect(() => {
    const ids = ['topo', ...Object.keys(MENSAGENS).filter((k) => k !== 'topo')]
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            secaoAtual.current = e.target.id
            setSecao(e.target.id)
          }
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    // No celular, o botão sobe quando a barra do "Monte seu plano" está na tela
    const form = document.getElementById('monte-seu-plano')
    const io2 = new IntersectionObserver(([e]) => setSubir(e.isIntersecting))
    if (form) io2.observe(form)
    return () => {
      io.disconnect()
      io2.disconnect()
    }
  }, [])

  // Mostra um balão a cada 20 s (o primeiro depois de 8 s)
  useEffect(() => {
    if (calado) return
    let some
    const mostra = () => {
      if (vezes.current >= MAXIMO) return
      vezes.current++
      // alterna: mensagem da seção, depois a geral
      const msg =
        vezes.current % 2 === 0 ? GERAL : MENSAGENS[secaoAtual.current] || GERAL
      setBalao(msg)
      some = setTimeout(() => setBalao(null), DURACAO)
    }
    const primeiro = setTimeout(mostra, 8000)
    const repete = setInterval(mostra, INTERVALO)
    return () => {
      clearTimeout(primeiro)
      clearInterval(repete)
      clearTimeout(some)
    }
  }, [calado])

  function calar() {
    setCalado(true)
    setBalao(null)
    try {
      sessionStorage.setItem('zap-calado', '1')
    } catch {
      // navegador sem armazenamento: só não lembra
    }
  }

  const msgClique = (balao || MENSAGENS[secao] || GERAL)[1]

  return (
    <div className={`zap ${subir ? 'zap--subir' : ''}`}>
      {balao && (
        <div className="zap__balao" role="status">
          <a
            href={linkWhatsapp(balao[1])}
            target="_blank"
            rel="noopener noreferrer"
          >
            {balao[0]}
          </a>
          <button onClick={calar} aria-label="Parar de mostrar mensagens">
            ✕
          </button>
        </div>
      )}
      <a
        className="zap__botao"
        href={linkWhatsapp(msgClique)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar comigo no WhatsApp"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 3C8.8 3 3 8.7 3 15.8c0 2.3.6 4.5 1.7 6.4L3 29l7-1.8c1.8 1 3.9 1.5 6 1.5 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4a10.5 10.5 0 0 1-1.6-5.6C5.3 10 10.1 5.3 16 5.3s10.7 4.7 10.7 10.5S21.9 26.4 16 26.4zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3z"
          />
        </svg>
        {balao && <span className="zap__ponto" aria-hidden="true" />}
      </a>
    </div>
  )
}
