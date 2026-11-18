// Envio do "Monte seu plano".
// ⏳ Passo 4: aqui vai entrar o insert no Supabase (tabela solicitacoes_plano).
// Por enquanto só simula, pra testarmos a tela sem banco.
export async function enviarSolicitacao(pedido) {
  await new Promise((r) => setTimeout(r, 600))
  return { ok: true, pedido }
}

// Deixa só os números do WhatsApp e coloca o 55 do Brasil se faltar
export function normalizaWhatsapp(texto) {
  const d = texto.replace(/\D/g, '')
  return d.length === 10 || d.length === 11 ? `55${d}` : d
}

// Máscara enquanto digita: (55) 9 9999-9999
export function mascaraWhatsapp(texto) {
  const d = texto.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 3) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`
}
