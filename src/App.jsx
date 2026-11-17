import { useTiltGlobal } from './hooks/useTiltGlobal'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Faixa from './components/Faixa'
import DemoEmBreve from './components/DemoEmBreve'
import Projetos from './components/Projetos'
import ComoFunciona from './components/ComoFunciona'
import QuemFaz from './components/QuemFaz'
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
        <DemoEmBreve />
        <Projetos />
        <ComoFunciona />
        <QuemFaz />
        <Orcamento />
      </main>
      <Rodape />
    </>
  )
}
