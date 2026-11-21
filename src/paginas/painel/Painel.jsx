import { useEffect, useState } from 'react'
import { db } from './util'
import Login from './Login'
import Resumo from './Resumo'
import Pedidos from './Pedidos'
import Clientes from './Clientes'
import Cobrancas from './Cobrancas'
import Config from './Config'
import './painel.css'

// Abas: 'dono' vê tudo; 'leitor' (Guilherme) só pedidos e clientes, sem dinheiro
const ABAS = [
  ['resumo', '📊', 'Resumo', ['dono']],
  ['pedidos', '📥', 'Pedidos', ['dono', 'leitor']],
  ['clientes', '👥', 'Clientes', ['dono', 'leitor']],
  ['cobrancas', '💰', 'Cobranças', ['dono']],
  ['config', '⚙️', 'Ajustes', ['dono']],
]

export default function Painel() {
  const [sessao, setSessao] = useState(undefined) // undefined = carregando
  const [membro, setMembro] = useState(undefined)
  const [aba, setAba] = useState(null)

  // Acompanha o login (entrar, sair, renovar)
  useEffect(() => {
    if (!db) return setSessao(null)
    db.auth.getSession().then(({ data }) => setSessao(data.session))
    const { data } = db.auth.onAuthStateChange((_e, s) => setSessao(s))
    return () => data.subscription.unsubscribe()
  }, [])

  // Descobre se quem entrou é da equipe e qual o papel
  useEffect(() => {
    if (!sessao) return setMembro(undefined)
    db.from('nukze_equipe')
      .select('nome, papel')
      .eq('user_id', sessao.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setMembro(data || null)
        if (data) setAba(data.papel === 'dono' ? 'resumo' : 'pedidos')
      })
  }, [sessao])

  if (!db)
    return (
      <div className="pn-centro">
        <p>Painel sem configuração do Supabase (faltam as variáveis).</p>
      </div>
    )
  if (sessao === undefined || (sessao && membro === undefined))
    return <div className="pn-centro pn-carregando">Carregando…</div>
  if (!sessao) return <Login />
  if (!membro)
    return (
      <div className="pn-centro">
        <div className="pn-cartao pn-aviso">
          <h2>Sem acesso</h2>
          <p>Essa conta não faz parte da equipe da Nukze.</p>
          <button className="pn-bt" onClick={() => db.auth.signOut()}>
            Sair
          </button>
        </div>
      </div>
    )

  const dono = membro.papel === 'dono'
  const abas = ABAS.filter(([, , , quem]) => quem.includes(membro.papel))

  return (
    <div className="pn">
      <aside className="pn-lado">
        <a className="pn-logo" href="/">
          nukze<span>.</span>
        </a>
        <nav className="pn-abas">
          {abas.map(([id, ic, nome]) => (
            <button
              key={id}
              className={aba === id ? 'on' : ''}
              onClick={() => setAba(id)}
            >
              <span>{ic}</span>
              {nome}
            </button>
          ))}
        </nav>
        <div className="pn-quem">
          <b>{membro.nome}</b>
          <small>{dono ? 'Acesso total' : 'Só leitura'}</small>
          <button onClick={() => db.auth.signOut()}>Sair</button>
        </div>
      </aside>

      <main className="pn-main">
        {aba === 'resumo' && <Resumo irPara={setAba} />}
        {aba === 'pedidos' && <Pedidos dono={dono} />}
        {aba === 'clientes' && <Clientes dono={dono} />}
        {aba === 'cobrancas' && <Cobrancas />}
        {aba === 'config' && <Config />}
      </main>
    </div>
  )
}
