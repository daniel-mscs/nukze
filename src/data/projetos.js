// Projetos que aparecem na seção "Projetos no ar".
// Para adicionar um cliente novo: coloque os prints em public/projetos/<id>/
// e copie um bloco abaixo.
const pasta = (id) => (arquivo) => `/projetos/${id}/${arquivo}.webp`
const rezenha = pasta('rezenha')

// Vídeos: mp4 (funciona em tudo), webm (mais leve) e capa (aparece enquanto carrega)
const video = (id, nome) => ({
  mp4: `/projetos/${id}/${nome}.mp4`,
  webm: `/projetos/${id}/${nome}.webm`,
  capa: `/projetos/${id}/${nome}-capa.webp`,
})

export const projetos = [
  {
    id: 'rezenha',
    nome: 'Rezenha Barbearia',
    rotulo: '01 · CLIENTE · NO AR · EM USO',
    descricao:
      'Santa Maria/RS. Os clientes marcavam pelo WhatsApp e a agenda era feita na mão. Hoje tem site, agendamento online e painel pro dono, com confirmação automática no WhatsApp.',
    chips: ['Site', 'Agendamento', 'Painel', 'WhatsApp'],
    link: 'https://www.barbeariarezenha.com.br',
    videoCelular: video('rezenha', 'video-celular'),
    videoDesktop: video('rezenha', 'video-desktop'),
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
        tipo: 'fluxo',
        rotulo: 'AGENDAMENTO',
        titulo: 'O cliente marca sozinho',
        texto:
          'Escolhe barbeiro, serviço, dia e horário livre. Confere o resumo e pronto.',
        imagens: [
          rezenha('celular-agenda-data'),
          rezenha('celular-agenda-horario'),
          rezenha('celular-agenda-resumo'),
        ],
      },
      {
        tipo: 'fluxo',
        rotulo: 'PLANO AUTOMÁTICO',
        titulo: 'Confirmação no WhatsApp, sem ninguém digitar',
        texto:
          'O cliente recebe a mensagem na hora, confirma com um toque e o horário fica garantido.',
        imagens: [
          rezenha('celular-agenda-confirme'),
          rezenha('celular-whatsapp-mensagem'),
          rezenha('celular-presenca-confirmada'),
        ],
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
        video: video('rezenha', 'video-desktop'),
      },
    ],
  },
]
