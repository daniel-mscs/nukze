import { useState } from 'react'
import {
  planos,
  modulos,
  comboModulos,
  taxaCriacao,
  calcularMensal,
  real,
} from '../data/planos'
import { site, linkWhatsapp } from '../data/site'
import {
  enviarSolicitacao,
  mascaraWhatsapp,
  normalizaWhatsapp,
} from '../lib/solicitacoes'
import { useNumeroAnimado } from '../hooks/useNumeroAnimado'
import Reveal from './Reveal'
import './MontePlano.css'

const TIPOS = [
  ['barbearia', '💈 Barbearia'],
  ['tatuagem', '🖋️ Tatuagem'],
  ['manicure', '💅 Manicure'],
  ['outro', '✨ Outro'],
]

// Regras de validação (o banco vai repetir as mesmas, por segurança)
function valida(d) {
  const e = {}
  if (d.nome.trim().length < 2) e.nome = 'Coloca seu nome'
  if (d.negocio.trim().length < 2) e.negocio = 'Coloca o nome do negócio'
  if (!d.tipo) e.tipo = 'Escolhe o tipo'
  if (d.cidade.trim().length < 2) e.cidade = 'Coloca a cidade'
  const w = d.whatsapp.replace(/\D/g, '')
  if (w.length < 10 || w.length > 11)
    e.whatsapp = 'WhatsApp com DDD, ex: (55) 9 9999-9999'
  if (!d.aceite) e.aceite = 'Precisa aceitar pra eu poder te chamar'
  return e
}

// Texto que vai pronto pro meu WhatsApp
function mensagem(p) {
  const nomesModulos = modulos
    .filter((m) => p.modulos.includes(m.id))
    .map((m) => m.nome)
  return [
    `Oi ${site.dono.nome.split(' ')[0]}! Montei meu plano no site da ${site.nome}:`,
    `• Plano: ${p.planoNome} (${real(p.valorPlano)}/mês)`,
    `• Módulos: ${nomesModulos.length ? nomesModulos.join(', ') : 'nenhum'}`,
    `• Total mensal: ${real(p.valorMensal)}`,
    `• Criação do site: ${real(p.taxaCriacao)}`,
    '',
    `Nome: ${p.nome}`,
    `Negócio: ${p.negocio} (${p.tipo}), ${p.cidade}`,
    `Pedido: #${p.id.slice(0, 8)}`,
  ].join('\n')
}

export default function MontePlano({
  plano,
  setPlano,
  escolhidos,
  setEscolhidos,
}) {
  const [dados, setDados] = useState({
    nome: '',
    negocio: '',
    tipo: '',
    cidade: '',
    whatsapp: '',
    aceite: false,
  })
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [pedido, setPedido] = useState(null)
  const [isca, setIsca] = useState('') // campo invisível: só robô preenche

  const conta = calcularMensal(plano, escolhidos)
  const totalAnimado = useNumeroAnimado(conta.total)
  const planoAtual = planos.find((p) => p.id === plano)

  const muda = (campo) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setDados((d) => ({
      ...d,
      [campo]: campo === 'whatsapp' ? mascaraWhatsapp(v) : v,
    }))
    if (erros[campo]) setErros((er) => ({ ...er, [campo]: undefined }))
  }
  const alternaModulo = (id) =>
    setEscolhidos((l) =>
      l.includes(id) ? l.filter((x) => x !== id) : [...l, id],
    )

  async function enviar(e) {
    e.preventDefault()
    if (enviando) return
    if (isca) return // robô: ignora em silêncio
    const er = valida(dados)
    setErros(er)
    if (Object.keys(er).length) {
      document.querySelector(`[name="${Object.keys(er)[0]}"]`)?.focus()
      return
    }
    setEnviando(true)
    const novo = {
      id: crypto.randomUUID(), // gerado aqui, então não preciso ler do banco depois
      plano,
      planoNome: planoAtual.nome,
      modulos: escolhidos,
      valorPlano: conta.plano,
      valorMensal: conta.total,
      taxaCriacao: taxaCriacao.preco,
      nome: dados.nome.trim(),
      negocio: dados.negocio.trim(),
      tipo: dados.tipo,
      cidade: dados.cidade.trim(),
      whatsapp: normalizaWhatsapp(dados.whatsapp),
    }
    const r = await enviarSolicitacao(novo)
    setPedido({ ...novo, salvo: r.ok })
    setEnviando(false)
    document
      .getElementById('monte-seu-plano')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (pedido) {
    return (
      <section className="secao container" id="monte-seu-plano">
        <div className="mp-ok">
          <div className="mp-ok__icone">✓</div>
          <span className="tag">Pedido #{pedido.id.slice(0, 8)}</span>
          <h2>
            Recebido, {pedido.nome.split(' ')[0]}!{' '}
            <span className="grad">Vou te chamar no WhatsApp.</span>
          </h2>
          <p className="muted">
            {pedido.salvo
              ? 'Seu pedido já chegou aqui. Se quiser adiantar, me manda o resumo agora:'
              : 'Não consegui salvar seu pedido agora, mas sem problema: me manda o resumo pelo WhatsApp que eu já vejo.'}
          </p>
          <pre className="mp-ok__resumo">{mensagem(pedido)}</pre>
          <div className="botoes">
            <a
              className="btn btn--principal"
              href={linkWhatsapp(mensagem(pedido))}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Mandar no WhatsApp
            </a>
            <button className="btn" onClick={() => setPedido(null)}>
              Montar outro
            </button>
          </div>
          <p className="mp-ok__pix">
            O pagamento é combinado comigo por lá (Pix).
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="secao container" id="monte-seu-plano">
      <div className="cabecalho">
        <Reveal as="span" className="tag">
          Monte seu plano
        </Reveal>
        <Reveal as="h2">
          Escolhe, soma e <span className="grad">pronto.</span>
        </Reveal>
        <Reveal as="p" className="muted">
          Sem compromisso: depois de enviar eu te chamo no WhatsApp pra acertar
          os detalhes.
        </Reveal>
      </div>

      <form className="mp" onSubmit={enviar} noValidate>
        <div className="mp__passos">
          <fieldset className="mp__bloco">
            <legend>
              <span>1</span> Plano
            </legend>
            <div className="mp__planos">
              {planos.map((p) => (
                <label
                  key={p.id}
                  className={`mp-plano ${plano === p.id ? 'on' : ''}`}
                >
                  <input
                    type="radio"
                    name="plano"
                    value={p.id}
                    checked={plano === p.id}
                    onChange={() => setPlano(p.id)}
                  />
                  <b>{p.nome}</b>
                  <span>{real(p.preco)}/mês</span>
                  {p.selo && <i>{p.selo}</i>}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mp__bloco">
            <legend>
              <span>2</span> Módulos extras <small>(opcional)</small>
            </legend>
            <div className="mp__modulos">
              {modulos.map((m) => (
                <label
                  key={m.id}
                  className={`mp-modulo ${escolhidos.includes(m.id) ? 'on' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={escolhidos.includes(m.id)}
                    onChange={() => alternaModulo(m.id)}
                  />
                  <span className="mp-modulo__chave" aria-hidden="true" />
                  <span className="mp-modulo__txt">
                    <b>{m.nome}</b>
                    <small>{m.descricao}</small>
                  </span>
                  <em>+ {real(m.preco)}</em>
                </label>
              ))}
            </div>
            <p className={`mp__combo ${conta.economia > 0 ? 'on' : ''}`}>
              {conta.economia > 0
                ? `🎉 Combo dos 3 aplicado: você economiza ${real(conta.economia)}/mês`
                : `Dica: levando os 3 módulos, sai por ${real(comboModulos)}/mês.`}
            </p>
          </fieldset>

          <fieldset className="mp__bloco">
            <legend>
              <span>3</span> Seus dados
            </legend>
            <div className="mp__campos">
              <Campo rotulo="Seu nome" erro={erros.nome}>
                <input
                  name="nome"
                  value={dados.nome}
                  onChange={muda('nome')}
                  maxLength={60}
                  autoComplete="name"
                />
              </Campo>
              <Campo rotulo="Nome do negócio" erro={erros.negocio}>
                <input
                  name="negocio"
                  value={dados.negocio}
                  onChange={muda('negocio')}
                  maxLength={80}
                  autoComplete="organization"
                />
              </Campo>
              <Campo rotulo="Tipo de negócio" erro={erros.tipo} largo>
                <div className="mp__tipos">
                  {TIPOS.map(([id, t]) => (
                    <label key={id} className={dados.tipo === id ? 'on' : ''}>
                      <input
                        type="radio"
                        name="tipo"
                        value={id}
                        checked={dados.tipo === id}
                        onChange={muda('tipo')}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </Campo>
              <Campo rotulo="Cidade" erro={erros.cidade}>
                <input
                  name="cidade"
                  value={dados.cidade}
                  onChange={muda('cidade')}
                  maxLength={60}
                  autoComplete="address-level2"
                />
              </Campo>
              <Campo rotulo="WhatsApp" erro={erros.whatsapp}>
                <input
                  name="whatsapp"
                  value={dados.whatsapp}
                  onChange={muda('whatsapp')}
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(55) 9 9999-9999"
                />
              </Campo>
            </div>

            {/* Isca anti-robô: invisível pra pessoas, robôs preenchem tudo */}
            <input
              className="mp__isca"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={isca}
              onChange={(e) => setIsca(e.target.value)}
              name="site_empresa"
            />

            <label className={`mp__aceite ${erros.aceite ? 'erro' : ''}`}>
              <input
                type="checkbox"
                name="aceite"
                checked={dados.aceite}
                onChange={muda('aceite')}
              />
              <span>
                Concordo em ser contatado pelo WhatsApp e com a{' '}
                <a href="/privacidade">política de privacidade</a>.
              </span>
            </label>
            {erros.aceite && <small className="mp__erro">{erros.aceite}</small>}
          </fieldset>
        </div>

        {/* Resumo: fixo do lado no PC, barra embaixo no celular */}
        <aside className="mp__resumo" aria-live="polite">
          <h4>Seu plano</h4>
          <div className="mp__linha">
            <span>{planoAtual.nome}</span>
            <span>{real(conta.plano)}</span>
          </div>
          {modulos
            .filter((m) => escolhidos.includes(m.id))
            .map((m) => (
              <div key={m.id} className="mp__linha mp__linha--sub">
                <span>+ {m.nome}</span>
                <span>{real(m.preco)}</span>
              </div>
            ))}
          {conta.economia > 0 && (
            <div className="mp__linha mp__linha--desc">
              <span>Desconto combo</span>
              <span>− {real(conta.economia)}</span>
            </div>
          )}
          <div className="mp__total">
            <span>Total mensal</span>
            <b>{real(totalAnimado)}</b>
          </div>
          <div className="mp__linha mp__linha--sub">
            <span>Criação do site (única)</span>
            <span>
              <s>{real(taxaCriacao.de)}</s> {real(taxaCriacao.preco)}
            </span>
          </div>
          <button
            type="submit"
            className="btn btn--principal mp__enviar"
            disabled={enviando}
          >
            {enviando ? 'Enviando…' : 'Enviar pedido'}
          </button>
          <small className="mp__obs">
            Sem cobrança agora. Pagamento só depois de combinar comigo.
          </small>
        </aside>
      </form>
    </section>
  )
}

// Campo com rótulo. Usa <label> pra que tocar no texto foque o campo
// (o grupo de opções usa <div>, porque já tem labels dentro).
function Campo({ rotulo, erro, largo, children }) {
  const Tag = largo ? 'div' : 'label'
  return (
    <Tag className={`mp-campo ${erro ? 'erro' : ''} ${largo ? 'largo' : ''}`}>
      <span className="mp-campo__rotulo">{rotulo}</span>
      {children}
      {erro && <small className="mp__erro">{erro}</small>}
    </Tag>
  )
}
