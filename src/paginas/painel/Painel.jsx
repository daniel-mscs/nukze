import {
  Activity,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  Target,
  Users,
  Wallet,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { db } from './util'
import Login from './Login'
import Resumo from './Resumo'
import Pedidos from './Pedidos'
import Clientes from './Clientes'
import Cobrancas from './Cobrancas'
import Config from './Config'
import Sites from './Sites'
import Suporte from './Suporte'
import Senha from './Senha'
import Leads from './Leads'
import './painel.css'

// Abas: 'dono' vê tudo; 'leitor' (Guilherme) vê pedidos, prospecção, clientes,
// suporte e sites, sem dinheiro (e pode cadastrar possíveis clientes e clientes)
const ABAS = [
  ['resumo', LayoutDashboard, 'Resumo', ['dono']],
  ['pedidos', Inbox, 'Pedidos', ['dono', 'leitor']],
  ['leads', Target, 'Prospecção', ['dono', 'leitor']],
  ['clientes', Users, 'Clientes', ['dono', 'leitor']],
  ['cobrancas', Wallet, 'Cobranças', ['dono']],
  ['suporte', LifeBuoy, 'Suporte', ['dono', 'leitor']],
  ['sites', Activity, 'Sites', ['dono', 'leitor']],
]

export default function Painel() {
  const [sessao, setSessao] = useState(undefined) // undefined = carregando
  const [membro, setMembro] = useState(undefined)
  const [aba, setAba] = useState(null)
  const [trocaSenha, setTrocaSenha] = useState(false)

  // Acompanha o login (entrar, sair, renovar)
  useEffect(() => {
    if (!db) return setSessao(null)
    db.auth.getSession().then(({ data }) => setSessao(data.session))
    // Renovação do login não troca a sessão na tela (evita recarregar tudo)
    const { data } = db.auth.onAuthStateChange((evento, s) => {
      if (evento === 'TOKEN_REFRESHED') return
      setSessao((atual) =>
        atual?.user?.id && atual.user.id === s?.user?.id ? atual : s,
      )
    })
    return () => data.subscription.unsubscribe()
  }, [])

  // Descobre se quem entrou é da equipe e qual o papel.
  // Depende só do ID do usuário: quando o login se renova sozinho (ex.: ao voltar
  // pra aba do navegador), o ID é o mesmo e nada é recarregado nem fechado.
  const usuarioId = sessao?.user?.id
  useEffect(() => {
    if (!usuarioId) {
      setMembro(undefined)
      setAba(null) // saiu: o próximo a entrar começa na aba inicial dele
      return
    }
    db.from('nukze_equipe')
      .select('nome, papel')
      .eq('user_id', usuarioId)
      .maybeSingle()
      .then(({ data }) => {
        setMembro(data || null)
        // só escolhe a aba inicial uma vez
        if (data)
          setAba((a) => a || (data.papel === 'dono' ? 'resumo' : 'pedidos'))
      })
  }, [usuarioId])

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
          {abas.map(([id, Ic, nome]) => (
            <button
              key={id}
              className={aba === id ? 'on' : ''}
              onClick={() => setAba(id)}
            >
              <Ic size={20} strokeWidth={1.8} aria-hidden="true" />
              {nome}
            </button>
          ))}
        </nav>
        <div className="pn-quem">
          <b>{membro.nome}</b>
          {dono && (
            <button
              className={aba === 'config' ? 'on' : ''}
              onClick={() => setAba('config')}
            >
              <Settings size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>Ajustes</span>
            </button>
          )}
          <button onClick={() => setTrocaSenha(true)}>
            <KeyRound size={15} strokeWidth={1.8} aria-hidden="true" />
            <span>Senha</span>
          </button>
          <button onClick={() => db.auth.signOut()}>
            <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="pn-main">
        {aba === 'resumo' && <Resumo irPara={setAba} />}
        {aba === 'pedidos' && <Pedidos dono={dono} />}
        {aba === 'leads' && <Leads dono={dono} />}
        {aba === 'clientes' && <Clientes dono={dono} />}
        {aba === 'cobrancas' && <Cobrancas />}
        {aba === 'suporte' && <Suporte dono={dono} />}
        {aba === 'sites' && <Sites />}
        {aba === 'config' && <Config />}
      </main>
      {trocaSenha && <Senha onFechar={() => setTrocaSenha(false)} />}
    </div>
  )
}
