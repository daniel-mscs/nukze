import { useState } from 'react'
import { db } from './util'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    const { error } = await db.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    })
    setEnviando(false)
    if (error) setErro('E-mail ou senha incorretos.')
  }

  return (
    <div className="pn-centro">
      <form className="pn-cartao pn-login" onSubmit={entrar}>
        <div className="pn-logo">
          nukze<span>.</span>
        </div>
        <p>Área interna</p>
        <label>
          E-mail
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>
        {erro && <p className="pn-erro">{erro}</p>}
        <button className="pn-bt pn-bt--pri" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
