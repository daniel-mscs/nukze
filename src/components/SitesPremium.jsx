import { useEffect, useState } from 'react'
import { premium } from '../data/planos'
import Navegador from './Navegador'
import Reveal from './Reveal'
import './SitesPremium.css'

// Endereços que vão sendo "digitados" na barra do navegador
const DOMINIOS = premium.nichos.map(
  (n) =>
    `${n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}dosonhos.com.br`,
)

// Efeito de máquina de escrever: digita, espera, apaga, troca
function useDigitando(lista) {
  const [texto, setTexto] = useState('')
  const [indice, setIndice] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTexto(lista[0])
      return
    }
    let i = 0
    let pos = 0
    let apagando = false
    let t
    const passo = () => {
      const alvo = lista[i]
      pos += apagando ? -1 : 1
      setTexto(alvo.slice(0, pos))
      let espera = apagando ? 30 : 70
      if (!apagando && pos === alvo.length) {
        apagando = true
        espera = 1600
      } else if (apagando && pos === 0) {
        apagando = false
        i = (i + 1) % lista.length
        setIndice(i)
        espera = 300
      }
      t = setTimeout(passo, espera)
    }
    t = setTimeout(passo, 600)
    return () => clearTimeout(t)
  }, [lista])
  return [texto, indice]
}

export default function SitesPremium({ onPedir }) {
  const [url, indice] = useDigitando(DOMINIOS)
  const nicho = premium.nichos[indice]

  return (
    <section className="secao container" id="premium">
      <div className="premium">
        <Reveal className="premium__texto">
          <span className="tag">Sites premium</span>
          <h2>
            Só precisa de um <span className="grad">site que impressiona?</span>
          </h2>
          <p className="muted">
            Nem todo negócio precisa de agenda. Pra quem quer uma presença
            online de respeito, faço sites premium sob medida, pra qualquer
            área.
          </p>
          <ul>
            {premium.inclui.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <div className="botoes" style={{ justifyContent: 'flex-start' }}>
            <a
              className="btn btn--principal"
              href="#monte-seu-plano"
              onClick={onPedir}
            >
              Pedir orçamento de site premium
            </a>
          </div>
        </Reveal>

        <Reveal className="premium__visual" atraso={0.15} aria-hidden="true">
          <Navegador url={url || ' '}>
            <div className="premium__tela">
              <span className="premium__nicho" key={nicho}>
                {nicho}
              </span>
              <b>Seu negócio,</b>
              <b className="grad">do jeito que ele merece.</b>
              <div className="premium__blocos">
                <i />
                <i />
                <i />
              </div>
            </div>
          </Navegador>
          <div className="premium__chips">
            {premium.nichos.map((n) => (
              <span key={n} className={n === nicho ? 'on' : ''}>
                {n}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
