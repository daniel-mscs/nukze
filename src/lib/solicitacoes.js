// Salva o pedido do "Monte seu plano" na tabela solicitacoes_plano.
// O banco só deixa INSERIR (não deixa ler), por isso o id é gerado no navegador
// e a gente não pede nada de volta.
export async function enviarSolicitacao(pedido) {
  // Import dinâmico: a biblioteca do Supabase só é baixada quando alguém envia,
  // assim o site abre mais rápido pra todo mundo que só está olhando.
  const { supabase } = await import('./supabase')
  if (!supabase) {
    console.warn(
      'Supabase não configurado: confira o .env (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)',
    )
    return { ok: false, motivo: 'sem-config' }
  }

  const { error } = await supabase.from('solicitacoes_plano').insert({
    id: pedido.id,
    plano: pedido.plano,
    modulos: pedido.modulos,
    valor_mensal: pedido.valorMensal,
    taxa_criacao: pedido.taxaCriacao,
    nome: pedido.nome,
    negocio: pedido.negocio,
    tipo: pedido.tipo,
    cidade: pedido.cidade,
    whatsapp: pedido.whatsapp,
    nicho: pedido.nicho,
    descricao: pedido.descricao,
    aceite_privacidade: true,
  })

  if (error) {
    // Mensagem do anti-spam do banco ("Pedido já recebido...") é mostrada pro cliente
    const repetido = error.message?.includes('Pedido já recebido')
    console.warn('Erro ao salvar pedido:', error.message)
    return { ok: false, motivo: repetido ? 'repetido' : 'erro' }
  }
  return { ok: true }
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
