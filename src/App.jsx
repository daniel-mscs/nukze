import { site } from './data/site'

// Prévia temporária da base visual (vai ser trocada pelas seções reais)
function App() {
  return (
    <main>
      <section className="secao">
        <div className="container">
          <h1>
            Seu negócio com <span className="destaque">site e agenda</span>
          </h1>
          <p>Prévia da base visual do {site.nome}.</p>
          <a className="botao" href="#">
            Botão principal
          </a>{' '}
          <a className="botao botao--contorno" href="#">
            Botão contorno
          </a>
        </div>
      </section>
      <section className="secao secao--clara">
        <div className="container">
          <h2>Seção clara</h2>
          <p>Usada pra alternar o ritmo da página (ex: planos e FAQ).</p>
        </div>
      </section>
    </main>
  )
}

export default App
