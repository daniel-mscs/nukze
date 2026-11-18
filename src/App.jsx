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
          onEscolher={setPlano}
          escolhidos={escolhidos}
          setEscolhidos={setEscolhidos}
        />
        <MontePlano
          plano={plano}
          setPlano={setPlano}
          escolhidos={escolhidos}
          setEscolhidos={setEscolhidos}
        />
        <QuemFaz />
        <ParaDevs />
        <Orcamento />
      </main>
      <Rodape />
    </>
  )
}
