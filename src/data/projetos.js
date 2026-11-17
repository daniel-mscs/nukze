// Projetos que aparecem na seção "Projetos no ar".
// Para adicionar um cliente novo: coloque os prints em public/projetos/<id>/
// e copie um bloco abaixo.
const pasta = (id) => (arquivo) => `/projetos/${id}/${arquivo}.webp`
const rezenha = pasta('rezenha')

export const projetos = [
  {
    id: 'rezenha',
    nome: 'Rezenha Barbearia',
    rotulo: '01 · CLIENTE · NO AR · EM USO',
    descricao:
      'Santa Maria/RS. Os clientes marcavam pelo WhatsApp e a agenda era feita na mão. Hoje tem site, agendamento online e painel pro dono, com confirmação automática no WhatsApp.',
    chips: ['Site', 'Agendamento', 'Painel', 'WhatsApp'],
    link: 'https://www.barbeariarezenha.com.br',
    // Cada item vira um "card" que passa pro lado
    slides: [
      {
        tipo: 'celulares',
        imagens: [
          rezenha('celular-inicio'),
          rezenha('celular-servicos'),
          rezenha('celular-barbeiros'),
        ],
      },
      {
        tipo: 'destaque',
        rotulo: 'AGENDAMENTO',
        titulo: 'O cliente marca sozinho',
        texto: 'Escolhe barbeiro, serviço e horário livre em poucos toques.',
        imagem: rezenha('celular-agendamento'),
      },
      {
        tipo: 'destaque',
        rotulo: 'PAINEL DO DONO',
        titulo: 'Agendamento pingando no celular',
        texto:
          'Total do dia, atendidos, pendentes, faturamento e cada cliente confirmado.',
        imagem: rezenha('celular-painel'),
      },
      {
        tipo: 'navegador',
        url: 'barbeariarezenha.com.br',
        imagem: rezenha('desktop-servicos'),
      },
    ],
  },
]
