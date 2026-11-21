import { useState } from 'react'
import { site, linkWhatsapp } from '../data/site'
import { normalizaWhatsapp, mascaraWhatsapp } from '../lib/solicitacoes'
import './Privacidade.css'
import './Suporte.css'

const TIPOS = [
  [
    'erro',
    '🐞',
    'Algo deu erro',
    'Botão que não funciona, página que não abre…',
  ],
  ['mudanca', '✏️', 'Quero mudar algo', 'Preço, foto, horário, texto…'],
  ['duvida', '❓', 'Tenho uma dúvida', 'Como usar o painel, a agenda…'],
]

// Página pública de suporte: o cliente abre um chamado e ele aparece no painel.
// O banco só deixa INSERIR (ninguém de fora consegue ler os chamados).
export default function Suporte() {
  const [f, setF] = useState({
    nome: '',
    negocio: '',
    whatsapp: '',
    tipo: 'erro',
    urgente: false,
    descricao: '',
    pagina: '',
    isca: '', // campo escondido: robô preenche, pessoa não
  })
  const [erro, setErro] = useState('')
  const [estado, setEstado] = useState('form') // form | enviando | ok | falhou
  const muda = (k) => (e) =>
    setF((x) => ({
      ...x,
      [k]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : k === 'whatsapp'
            ? mascaraWhatsapp(e.target.value)
            : e.target.value,
    }))

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    if (f.isca) return setEstado('ok')
    const whatsapp = normalizaWhatsapp(f.whatsapp)
    if (f.nome.trim().length < 2) return setErro('Coloca teu nome.')
    if (f.negocio.trim().length < 2)
      return setErro('Coloca o nome do teu negócio.')
    if (!/^55\d{10,11}$/.test(whatsapp))
      return setErro('Confere o WhatsApp (DDD + número).')
    if (f.descricao.trim().length < 10)
      return setErro('Conta um pouco mais do que aconteceu.')
    setEstado('enviando')
    const { supabase } = await import('../lib/supabase')
    if (!supabase) return setEstado('falhou')
    const { error } = await supabase.from('nukze_chamados').insert({
      id: crypto.randomUUID(),
      tipo: f.tipo,
      urgente: f.urgente,
      nome: f.nome.trim(),
      negocio: f.negocio.trim(),
      whatsapp,
      descricao: f.descricao.trim(),
      pagina: f.pagina.trim() || null,
      aceite_privacidade: true,
    })
    setEstado(error ? 'falhou' : 'ok')
  }

  const mensagemZap = `Oi, Daniel! Preciso de suporte.\n\nNegócio: ${f.negocio}\nProblema: ${f.descricao}`

  return (
    <>
      <header className="pv-topo">
        <div className="container pv-topo__barra">
          <a className="pv-logo" href="/">
            nukze<span>.</span>
          </a>
          <a className="btn" href="/">
            ← Site
          </a>
        </div>
      </header>

      <main className="container sp">
        <span className="tag">Suporte</span>
        <h1>Como posso ajudar?</h1>
        <p className="muted">
          Já é cliente da {site.nome}? Me conta o que aconteceu que eu resolvo.{' '}
          Se tiver um print, manda no meu WhatsApp depois.
        </p>

        {estado === 'ok' ? (
          <div className="sp-ok">
            <div className="sp-ok__ic">✓</div>
            <h2>Chamado recebido!</h2>
            <p className="muted">
              Já chegou aqui no meu painel. Vou te responder no WhatsApp{' '}
              {site.prazoResposta.toLowerCase()}
              {f.urgente ? ', e como é urgente, olho o quanto antes' : ''}.
            </p>
            <a
              className="btn"
              href={linkWhatsapp(
                'Oi, Daniel! Abri um chamado no suporte, segue o print:',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Mandar print no WhatsApp
            </a>
          </div>
        ) : estado === 'falhou' ? (
          <div className="sp-ok">
            <h2>Não consegui enviar 😕</h2>
            <p className="muted">
              Manda direto no meu WhatsApp que eu vejo na hora:
            </p>
            <a
              className="btn btn--principal"
              href={linkWhatsapp(mensagemZap)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chamar no WhatsApp
            </a>
          </div>
        ) : (
          <form className="sp-form" onSubmit={enviar} noValidate>
            <fieldset>
              <legend>O que aconteceu?</legend>
              <div className="sp-tipos">
                {TIPOS.map(([id, ic, nome, dica]) => (
                  <label key={id} className={f.tipo === id ? 'on' : ''}>
                    <input
                      type="radio"
                      name="tipo"
                      value={id}
                      checked={f.tipo === id}
                      onChange={muda('tipo')}
                    />
                    <span className="sp-tipos__ic">{ic}</span>
                    <b>{nome}</b>
                    <small>{dica}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="sp-campo">
              Descreve o problema ou o pedido
              <textarea
                value={f.descricao}
                onChange={muda('descricao')}
                maxLength={1000}
                rows={5}
                placeholder="Ex: quando o cliente clica em Agendar, a página fica branca."
              />
            </label>
            <label className="sp-campo">
              Onde aconteceu? <small>(opcional)</small>
              <input
                value={f.pagina}
                onChange={muda('pagina')}
                maxLength={200}
                placeholder="Ex: na página de serviços, no painel, no celular…"
              />
            </label>

            <label className="sp-urgente">
              <input
                type="checkbox"
                checked={f.urgente}
                onChange={muda('urgente')}
              />
              <span>
                <b>🚨 É urgente</b>
                <small>Está atrapalhando meus clientes agora</small>
              </span>
            </label>

            <div className="sp-dados">
              <label className="sp-campo">
                Teu nome
                <input
                  value={f.nome}
                  onChange={muda('nome')}
                  maxLength={60}
                  autoComplete="name"
                />
              </label>
              <label className="sp-campo">
                Nome do negócio
                <input
                  value={f.negocio}
                  onChange={muda('negocio')}
                  maxLength={80}
                />
              </label>
              <label className="sp-campo">
                WhatsApp
                <input
                  value={f.whatsapp}
                  onChange={muda('whatsapp')}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(55) 9 9999-9999"
                />
              </label>
            </div>

            <input
              className="sp-isca"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={f.isca}
              onChange={muda('isca')}
            />

            {erro && <p className="sp-erro">{erro}</p>}
            <button
              className="btn btn--principal"
              disabled={estado === 'enviando'}
            >
              {estado === 'enviando' ? 'Enviando…' : 'Enviar chamado'}
            </button>
            <p className="sp-lgpd">
              Ao enviar, você concorda com a{' '}
              <a href="/privacidade/" target="_blank" rel="noopener noreferrer">
                política de privacidade
              </a>
              . Seus dados só são usados pra responder este chamado.
            </p>
          </form>
        )}
      </main>
    </>
  )
}
