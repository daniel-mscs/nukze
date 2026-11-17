import { useState } from 'react'
import { proximosDias, ocupado } from '../../data/demo'
import './Barbearia.css'

const HORAS = [
  '09:00',
  '09:40',
  '10:20',
  '11:00',
  '13:30',
  '14:10',
  '14:50',
  '15:30',
  '16:10',
  '16:50',
  '17:30',
  '18:10',
]

// Site fictício 1: barbearia vintage. Tudo numa página só, com
// uma "comanda" fixa embaixo que vai se preenchendo.
export default function Barbearia({ cfg, onEnviar, verPainel }) {
  const dias = proximosDias()
  const [barbeiro, setBarbeiro] = useState(null)
  const [servico, setServico] = useState(null)
  const [dia, setDia] = useState(dias[0])
  const [hora, setHora] = useState(null)
  const [folha, setFolha] = useState(false) // "bottom sheet" do nome
  const [nome, setNome] = useState('')
  const [feito, setFeito] = useState(null)
  const s = cfg.servicos.find((x) => x.id === servico)
  const pronto = barbeiro && s && hora

  function confirmar(e) {
    e.preventDefault()
    const p = onEnviar({
      nome: nome.trim() || 'João',
      titulo: s.n,
      detalhe: `com ${barbeiro}`,
      quando: `${dia.semana === 'Hoje' ? 'Hoje' : dia.semana + ' ' + dia.dia} ${hora}`,
      valor: s.p,
      st: 'pendente',
    })
    setFolha(false)
    setFeito(p)
  }

  if (feito) {
    return (
      <div className="bb bb--feito">
        <div className="bb-ticket">
          <small>COMANDA Nº {String(feito.id).slice(-4)}</small>
          <h3>Tá marcado, {feito.nome}!</h3>
          <dl>
            <dt>Serviço</dt>
            <dd>{feito.titulo}</dd>
            <dt>Barbeiro</dt>
            <dd>{barbeiro}</dd>
            <dt>Quando</dt>
            <dd>{feito.quando}</dd>
            <dt>Total</dt>
            <dd>R$ {feito.valor}</dd>
          </dl>
          <p>Confirmação chega no seu WhatsApp. ✂️</p>
        </div>
        <button className="demo-chama" onClick={verPainel}>
          👀 Ver como o barbeiro recebe →
        </button>
      </div>
    )
  }

  return (
    <div className="bb">
      <div className="bb-poste" aria-hidden="true" />
      <header className="bb-topo">
        <span className="bb-logo">
          DOM BIGODE<small>BARBEARIA · DESDE 1987</small>
        </span>
        <span className="bb-aberto">● ABERTO</span>
      </header>

      <div className="bb-grid">
        <section className="bb-hero">
          <h3>
            CORTE.
            <br />
            BARBA.
            <br />
            <em>RESENHA.</em>
          </h3>
          <p>
            Cadeira de couro, navalha quente e café passado. Marca aí em 30
            segundos.
          </p>
        </section>

        <div className="bb-reserva">
          <h4>
            <span>01</span> Quem vai te atender?
          </h4>
          <div className="bb-barbeiros">
            {cfg.barbeiros.map((b) => (
              <button
                key={b.n}
                className={barbeiro === b.n ? 'on' : ''}
                onClick={() => {
                  setBarbeiro(b.n)
                  setHora(null)
                }}
              >
                <span className="bb-av" style={{ background: b.cor }}>
                  {b.n[0]}
                </span>
                <b>{b.n}</b>
                <small>{b.esp}</small>
              </button>
            ))}
          </div>

          <h4>
            <span>02</span> O que vai ser?
          </h4>
          <div className="bb-servicos">
            {cfg.servicos.map((x) => (
              <button
                key={x.id}
                className={servico === x.id ? 'on' : ''}
                onClick={() => setServico(x.id)}
              >
                <b>{x.n}</b>
                <i />
                <span>R$ {x.p}</span>
              </button>
            ))}
          </div>

          <h4>
            <span>03</span> Quando?
          </h4>
          <div className="bb-dias">
            {dias.map((d) => (
              <button
                key={d.chave}
                className={dia.chave === d.chave ? 'on' : ''}
                onClick={() => {
                  setDia(d)
                  setHora(null)
                }}
              >
                {d.semana}
                <b>{d.dia}</b>
              </button>
            ))}
          </div>
          {barbeiro ? (
            <div className="bb-horas">
              {HORAS.map((h) => {
                const cheio = ocupado(dia.chave, barbeiro, h)
                return (
                  <button
                    key={h}
                    disabled={cheio}
                    className={hora === h ? 'on' : ''}
                    onClick={() => setHora(h)}
                  >
                    {h}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="bb-dica">
              Escolhe o barbeiro pra ver os horários livres dele.
            </p>
          )}
        </div>
      </div>

      <div className={`bb-comanda ${pronto ? 'pronta' : ''}`}>
        <div>
          <small>SUA COMANDA</small>
          <b>{s ? s.n : '—'}</b>
          <span>
            {barbeiro || 'barbeiro?'} ·{' '}
            {hora ? `${dia.semana} ${hora}` : 'horário?'}
          </span>
        </div>
        <button disabled={!pronto} onClick={() => setFolha(true)}>
          {s ? `R$ ${s.p} · Reservar` : 'Reservar'}
        </button>
      </div>

      {folha && (
        <div className="bb-folha-fundo" onClick={() => setFolha(false)}>
          <form
            className="bb-folha"
            onClick={(e) => e.stopPropagation()}
            onSubmit={confirmar}
          >
            <h4>Último passo</h4>
            <label>
              Teu nome
              <input
                autoFocus
                maxLength={20}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João"
              />
            </label>
            <button type="submit">Confirmar reserva</button>
          </form>
        </div>
      )}
    </div>
  )
}
