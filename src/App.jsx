import { useTiltGlobal } from './hooks/useTiltGlobal'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Faixa from './components/Faixa'
import Demo from './components/demo/Demo'
import Projetos from './components/Projetos'
import ComoFunciona from './components/ComoFunciona'
import Planos from './components/Planos'
import QuemFaz from './components/QuemFaz'
import ParaDevs from './components/ParaDevs'
import Orcamento from './components/Orcamento'
import Rodape from './components/Rodape'

export default function App() {
  useTiltGlobal()
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Faixa />
        <Demo />
        <Projetos />
        <ComoFunciona />
        <Planos />
        <QuemFaz />
        <ParaDevs />
        <Orcamento />
      </main>
      <Rodape />
    </>
  )
}
