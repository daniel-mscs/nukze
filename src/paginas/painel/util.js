import { createClient } from '@supabase/supabase-js'

// Cliente do Supabase só do painel: aqui o login FICA salvo no navegador
// (no site público não salva nada). A segurança de verdade é o RLS do banco:
// só quem está na tabela nukze_equipe consegue ler ou mudar alguma coisa.
const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY

export const db =
  url && chave
    ? createClient(url, chave, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: 'nukze-painel',
        },
      })
    : null

export const reais = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const data = (d) =>
  d ? new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—'

export const dataHora = (d) =>
  d
    ? new Date(d).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

// 5555991234567 -> (55) 99123-4567
export const fone = (w = '') => {
  const n = w.replace(/^55/, '')
  return n.length === 11
    ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
    : n.length === 10
      ? `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
      : w
}

export const zap = (numero, texto = '') =>
  `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`

export const nomePlano = {
  vitrine: 'Vitrine',
  agenda: 'Agenda',
  automatico: 'Automático',
  premium: 'Site premium',
  personalizado: 'Personalizado',
}

export const statusPedido = {
  nova: 'Novo',
  em_contato: 'Em contato',
  fechada: 'Fechado',
  descartada: 'Descartado',
}

// Data de hoje no formato AAAA-MM-DD (fuso de Brasília)
export const hoje = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })

export const mesAtual = () => hoje().slice(0, 7) // AAAA-MM

export const nomeMes = (aaaamm) => {
  const [a, m] = aaaamm.split('-').map(Number)
  const t = new Date(Date.UTC(a, m - 1, 1)).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return t[0].toUpperCase() + t.slice(1)
}

export const somaMes = (aaaamm, n) => {
  const [a, m] = aaaamm.split('-').map(Number)
  const d = new Date(Date.UTC(a, m - 1 + n, 1))
  return d.toISOString().slice(0, 7)
}

// Situação de uma cobrança
export const situacao = (c) =>
  c.pago_em ? 'pago' : c.vencimento < hoje() ? 'atrasado' : 'pendente'

// Mensagem pronta de cobrança pro WhatsApp
export function mensagemCobranca(c, cliente, config) {
  const primeiro = (cliente?.nome || '').split(' ')[0]
  const atrasada = situacao(c) === 'atrasado'
  const pix = config?.chave_pix
    ? `\n\nChave Pix: ${config.chave_pix}${config.nome_recebedor ? ` (${config.nome_recebedor})` : ''}`
    : ''
  return (
    `Oi, ${primeiro}! Tudo certo? 😊\n\n` +
    (atrasada
      ? `A cobrança "${c.descricao}" de ${reais(c.valor)}, que venceu em ${data(c.vencimento)}, ficou em aberto.`
      : `Passando pra lembrar da cobrança "${c.descricao}" de ${reais(c.valor)}, com vencimento em ${data(c.vencimento)}.`) +
    pix +
    `\n\nQualquer dúvida, é só me chamar. Obrigado!`
  )
}
