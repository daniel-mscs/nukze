// ⚠️ VALORES PROVISÓRIOS: troque aqui e muda no site todo.
// Em modo dev (npm run dev) aparece um aviso "valores provisórios" na seção.
export const provisorio = true

export const planos = [
  {
    id: 'vitrine',
    nome: 'Vitrine',
    preco: 59,
    resumo: 'Seu negócio bonito na internet.',
    inclui: [
      'Site sob medida, com a cara do seu negócio',
      'Fotos do ambiente e dos trabalhos',
      'Serviços e preços',
      'Equipe com foto e especialidade',
      'Botão de WhatsApp, mapa e redes',
      'Hospedagem e suporte comigo',
    ],
  },
  {
    id: 'agenda',
    nome: 'Agenda',
    preco: 99,
    resumo: 'Seus clientes marcam sozinhos.',
    selo: 'Mais escolhido',
    inclui: [
      'Tudo do Vitrine',
      'Agendamento online 24h',
      'Painel do dono com a agenda do dia',
      'Você confirma cada horário com 1 toque',
      'Folgas, bloqueios e horários por profissional',
    ],
  },
  {
    id: 'automatico',
    nome: 'Automático',
    preco: 149,
    resumo: 'O WhatsApp trabalha por você.',
    inclui: [
      'Tudo do Agenda',
      'Confirmação automática no WhatsApp',
      'Lembrete antes do horário',
      'Botão "Confirmar presença"',
      'Número oficial da API da Meta',
    ],
    nota: 'As mensagens do WhatsApp são cobradas pela Meta direto no seu cartão (em média R$ 0,04 cada).',
    // Oferta do parceiro de marketing: aparece só neste plano
    bonus: {
      titulo: 'Opcional: tráfego pago',
      texto: 'Anúncios no Instagram e Facebook pra trazer mais clientes.',
      preco: 'Valor a combinar',
    },
  },
]

// Módulos extras do painel: somam em qualquer plano
export const modulos = [
  {
    id: 'clientes',
    nome: 'Clientes (CRM)',
    preco: 19,
    descricao:
      'Ficha de cada cliente, histórico, aniversariantes e quem sumiu.',
  },
  {
    id: 'caixa',
    nome: 'Caixa',
    preco: 19,
    descricao: 'Entradas e saídas do dia, por categoria.',
  },
  {
    id: 'estoque',
    nome: 'Estoque',
    preco: 19,
    descricao: 'Produtos, quantidades e aviso de reposição.',
  },
]

// Levando os 3 módulos juntos, o valor cai pra este
export const comboModulos = 45

export const taxaCriacao = {
  preco: 397,
  de: 697, // aparece riscado
  rotulo: 'Preço de lançamento',
  parcelas: 'em até 3x',
}

// Soma do plano + módulos (com desconto do combo). Usado no "Monte seu plano".
export function calcularMensal(planoId, modulosIds = []) {
  const plano = planos.find((p) => p.id === planoId)
  const somaModulos = modulos
    .filter((m) => modulosIds.includes(m.id))
    .reduce((t, m) => t + m.preco, 0)
  const extras =
    modulosIds.length === modulos.length ? comboModulos : somaModulos
  return {
    plano: plano?.preco || 0,
    extras,
    total: (plano?.preco || 0) + extras,
    economia: somaModulos - extras,
  }
}

export const real = (v) => `R$ ${v.toLocaleString('pt-BR')}`

// Site premium: só o site sob medida (sem agenda/painel), pra qualquer negócio
export const premium = {
  titulo: 'Site premium',
  preco: 'Orçamento personalizado',
  inclui: [
    'Design exclusivo, feito do zero pro seu negócio',
    'Animações e efeitos que prendem a atenção',
    'Rápido e perfeito no celular',
    'Pronto pro Google (SEO) e redes sociais',
    'Seu domínio, hospedagem e suporte comigo',
  ],
  nichos: [
    'Restaurante',
    'Clínica',
    'Advocacia',
    'Academia',
    'Estética',
    'Loja',
    'Imobiliária',
    'Fotografia',
  ],
}
