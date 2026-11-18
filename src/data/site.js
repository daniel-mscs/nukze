// Configurações gerais do site. Troque aqui e muda no site todo.
export const site = {
  nome: 'Nukze',
  cidade: 'Santa Maria/RS',
  // Formato: 55 + DDD + número, só dígitos
  whatsapp: '5555991975065',
  mensagemWhatsapp: 'Oi! Vi o site da Nukze e quero um orçamento.',
  // Aparece depois que alguém envia o "Monte seu plano"
  prazoResposta: 'Em até 24h úteis',
  dono: {
    nome: 'Daniel Alves',
    cargo: 'Desenvolvedor web · Estudante de Engenharia de Software',
    foto: '/sobre/daniel.webp',
  },
  // Deixe vazio ('') o que não quiser mostrar
  links: {
    portfolio: 'https://www.daniel-alvesdev.com.br',
    github: 'https://github.com/daniel-mscs',
    linkedin: 'https://www.linkedin.com/in/daniel-mscs/',
    instagram: 'https://www.instagram.com/daniel.mscs/',
    email: '', // TODO: preencher se quiser mostrar o e-mail
  },
}

// Monta o link do WhatsApp com a mensagem já escrita
export function linkWhatsapp(
  mensagem = site.mensagemWhatsapp,
  numero = site.whatsapp,
) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}

// Parceiro que cuida do marketing / tráfego pago (valor negociado com ele)
export const parceiro = {
  nome: 'Guilherme Matos',
  cargo: 'Growth, copywriting e tráfego pago',
  desde: 2021,
  foto: '/sobre/guilherme.webp',
  instagram: 'https://www.instagram.com/guimaatos/',
  linkedin: 'https://www.linkedin.com/in/wilson-matos-49a8b7208/',
  whatsapp: '5555997159944',
}
