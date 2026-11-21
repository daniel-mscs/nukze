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

export const nomeCiclo = { mensal: 'Mensal', anual: 'Anual', unico: 'Único' }

// Quanto já foi pago de uma cobrança (soma dos pagamentos)
export const pago = (c) =>
  (c.pagamentos || []).reduce((t, p) => t + Number(p.valor), 0)
export const saldo = (c) => Math.max(0, Number(c.valor) - pago(c))

// Situação de uma cobrança
export const situacao = (c) =>
  saldo(c) <= 0
    ? 'pago'
    : c.vencimento < hoje()
      ? 'atrasado'
      : pago(c) > 0
        ? 'parcial'
        : 'pendente'

export const NOME_SIT = {
  pago: 'Pago',
  parcial: 'Parcial',
  atrasado: 'Atrasado',
  pendente: 'Pendente',
}

const ultimoDia = (a, m) => new Date(Date.UTC(a, m, 0)).getUTCDate()

// Data de vencimento de um serviço num mês (AAAA-MM), ou null se não vence nele
export function vencimentoNoMes(s, aaaamm) {
  const [a, m] = aaaamm.split('-').map(Number)
  const [pa, pm, pd] = s.primeiro_vencimento.split('-').map(Number)
  const dia = (d) =>
    `${aaaamm}-${String(Math.min(d, ultimoDia(a, m))).padStart(2, '0')}`
  if (aaaamm < s.primeiro_vencimento.slice(0, 7)) return null
  if (s.ciclo === 'mensal') return dia(pd)
  if (s.ciclo === 'anual') return pm === m && a >= pa ? dia(pd) : null
  return s.primeiro_vencimento.slice(0, 7) === aaaamm
    ? s.primeiro_vencimento
    : null
}

// Próximo vencimento de um serviço a partir de hoje
export function proximoVencimento(s) {
  let mes = mesAtual()
  for (let i = 0; i < 24; i++) {
    const v = vencimentoNoMes(s, mes)
    if (v && v >= hoje()) return v
    mes = somaMes(mes, 1)
  }
  return s.ciclo === 'unico' ? null : s.primeiro_vencimento
}

// Valor por mês de um serviço (anual dividido por 12; único não conta)
export const porMes = (s) =>
  s.ciclo === 'mensal'
    ? Number(s.valor)
    : s.ciclo === 'anual'
      ? Number(s.valor) / 12
      : 0

export const diasAte = (d) =>
  Math.round(
    (new Date(d + 'T12:00:00Z') - new Date(hoje() + 'T12:00:00Z')) / 864e5,
  )

// Mensagem pronta de cobrança pro WhatsApp (cobra só o que falta)
export function mensagemCobranca(c, cliente, config) {
  const primeiro = (cliente?.nome || '').split(' ')[0]
  const atrasada = situacao(c) === 'atrasado'
  const falta = saldo(c)
  const parcial =
    pago(c) > 0 ? ` (já recebi ${reais(pago(c))}, falta ${reais(falta)})` : ''
  const pix = config?.chave_pix
    ? `\n\nChave Pix: ${config.chave_pix}${config.nome_recebedor ? ` (${config.nome_recebedor})` : ''}`
    : ''
  return (
    `Oi, ${primeiro}! Tudo certo? 😊\n\n` +
    (atrasada
      ? `A cobrança "${c.descricao}" de ${reais(c.valor)}, que venceu em ${data(c.vencimento)}, ficou em aberto${parcial}.`
      : `Passando pra lembrar da cobrança "${c.descricao}" de ${reais(c.valor)}, com vencimento em ${data(c.vencimento)}${parcial}.`) +
    pix +
    `\n\nQualquer dúvida, é só me chamar. Obrigado!`
  )
}

export const tipoChamado = {
  erro: '🐞 Erro',
  mudanca: '✏️ Mudança',
  duvida: '❓ Dúvida',
}
export const statusChamado = {
  aberto: 'Aberto',
  andamento: 'Em andamento',
  resolvido: 'Resolvido',
}
