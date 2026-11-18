import { useState } from 'react'
import { useTiltGlobal } from './hooks/useTiltGlobal'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Faixa from './components/Faixa'
import Demo from './components/demo/Demo'
import Projetos from './components/Projetos'
import ComoFunciona from './components/ComoFunciona'
import Planos from './components/Planos'
import MontePlano from './components/MontePlano'
import SitesPremium from './components/SitesPremium'
import BotaoZap from './components/BotaoZap'
import QuemFaz from './components/QuemFaz'
import ParaDevs from './components/ParaDevs'
import Orcamento from './components/Orcamento'
import Rodape from './components/Rodape'

export default function App() {
  useTiltGlobal()
  // O plano escolhido fica aqui em cima ("levantar o estado") porque
  // duas seções usam: Planos (botões) e MontePlano (formulário).
  const [plano, setPlano] = useState('agenda')
  const [escolhidos, setEscolhidos] = useState([]) // módulos extras
  const [modo, setModo] = useState('sistema') // 'sistema' ou 'premium'
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Faixa />
        <Demo />
        <Projetos />
        <ComoFunciona />
        <Planos
          escolhidos={escolhidos}
          setEscolhidos={setEscolhidos}
          onEscolher={(id) => {
            setPlano(id)
            setModo('sistema')
          }}
        />
        <SitesPremium onPedir={() => setModo('premium')} />
        <MontePlano
          plano={plano}
          setPlano={setPlano}
          escolhidos={escolhidos}
          setEscolhidos={setEscolhidos}
          modo={modo}
          setModo={setModo}
        />
        <QuemFaz />
        <ParaDevs />
        <Orcamento />
      </main>
      <Rodape />
      <BotaoZap />
    </>
  )
}
