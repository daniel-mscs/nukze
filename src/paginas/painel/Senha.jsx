import { CheckCircle2, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { db } from './util'

// Qualquer pessoa da equipe troca a própria senha (ex.: a provisória do 1º acesso)
export default function Senha({ onFechar }) {
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)

  async function salvar(e) {
    e.preventDefault()
    if (s1.length < 10) return setMsg('Usa pelo menos 10 caracteres.')
    if (s1 !== s2) return setMsg('As duas senhas não estão iguais.')
    const { error } = await db.auth.updateUser({ password: s1 })
    if (error)
      return setMsg(
        'Não deu pra trocar. Sai e entra de novo, e tenta outra vez.',
      )
    setOk(true)
  }

  return (
    <div className="pn-modal" onClick={onFechar}>
      <form
        className="pn-cartao pn-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={salvar}
      >
        <h2 className="pn-tit-ic">
          <KeyRound size={18} strokeWidth={1.8} aria-hidden="true" /> Trocar
          minha senha
        </h2>
        {ok ? (
          <>
            <p className="pn-ok-msg">
              <CheckCircle2 size={18} strokeWidth={1.8} aria-hidden="true" />{' '}
              Senha trocada. Use a nova no próximo login.
            </p>
            <div className="pn-form__bts">
              <button
                type="button"
                className="pn-bt pn-bt--pri"
                onClick={onFechar}
              >
                Fechar
              </button>
            </div>
          </>
        ) : (
          <>
            <label>
              Nova senha
              <input
                type="password"
                autoComplete="new-password"
                value={s1}
                onChange={(e) => setS1(e.target.value)}
                required
              />
            </label>
            <label>
              Repete a nova senha
              <input
                type="password"
                autoComplete="new-password"
                value={s2}
                onChange={(e) => setS2(e.target.value)}
                required
              />
            </label>
            {msg && <p className="pn-erro">{msg}</p>}
            <div className="pn-form__bts">
              <button type="button" className="pn-bt" onClick={onFechar}>
                Cancelar
              </button>
              <button className="pn-bt pn-bt--pri">Salvar</button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
