// Dados FICTÍCIOS da demo interativa. Nada daqui vai pro banco.
// Cada nicho tem: tema (cores do painel), seed (pedidos iniciais) e fluxo
// (quais botões o dono vê em cada status e pra onde o pedido vai).

export const nichos = {
  barbearia: {
    nome: 'Dom Bigode',
    rotulo: '💈 Barbearia',
    url: 'dombigode.com.br',
    icone: '💈',
    tema: {
      bg: '#121110',
      card: '#1b1916',
      line: '#2e2a24',
      tx: '#efe6d2',
      tx2: '#8f8572',
      o: '#d9622b',
      ink: '#fff7ec',
    },
    servicos: [
      { id: 'corte', n: 'Corte', min: 40, p: 45 },
      { id: 'barba', n: 'Barba', min: 30, p: 35 },
      { id: 'combo', n: 'Corte + Barba', min: 60, p: 70 },
      { id: 'pigm', n: 'Pigmentação', min: 30, p: 30 },
    ],
    barbeiros: [
      { n: 'Lucas', esp: 'Degradê', cor: '#d9622b' },
      { n: 'Rafa', esp: 'Barba', cor: '#3f6e8c' },
      { n: 'Biel', esp: 'Freestyle', cor: '#8c6b3f' },
    ],
    seed: [
      {
        nome: 'Pedro',
        titulo: 'Corte',
        detalhe: 'com Lucas',
        quando: 'Hoje 09:00',
        valor: 45,
        st: 'atendido',
      },
      {
        nome: 'Marcos',
        titulo: 'Barba',
        detalhe: 'com Rafa',
        quando: 'Hoje 10:20',
        valor: 35,
        st: 'confirmado',
      },
      {
        nome: 'Caio',
        titulo: 'Corte',
        detalhe: 'com Biel',
        quando: 'Hoje 14:10',
        valor: 45,
        st: 'pendente',
      },
    ],
    status: {
      pendente: 'pendente',
      confirmado: 'confirmado',
      atendido: 'atendido',
      recusado: 'recusado',
    },
    fluxo: {
      pendente: [
        { rotulo: 'Recusar', para: 'recusado' },
        {
          rotulo: '✓ Confirmar',
          para: 'confirmado',
          pri: true,
          push: [
            '💬',
            'WhatsApp enviado',
            (p) => `Confirmação enviada pro ${p.nome}`,
          ],
        },
      ],
      confirmado: [
        {
          rotulo: 'Marcar como atendido',
          para: 'atendido',
          pri: true,
          push: [
            '💰',
            'Entrou no caixa',
            (p) => `+ R$ ${p.valor} · ${p.titulo}`,
          ],
        },
      ],
    },
    pago: 'atendido',
    caixa: (p) => p.valor,
  },

  tattoo: {
    nome: 'Tinta Viva',
    rotulo: '🖋️ Tatuagem',
    url: 'tintaviva.com.br',
    icone: '🖋️',
    tema: {
      bg: '#0c0c0c',
      card: '#161616',
      line: '#2a2a2a',
      tx: '#f4f1ea',
      tx2: '#8a8a8a',
      o: '#e5302f',
      ink: '#ffffff',
    },
    flashes: [
      { id: 1, nome: 'Rosa', emoji: '🌹', p: 280 },
      { id: 2, nome: 'Serpente', emoji: '🐍', p: 350 },
      { id: 3, nome: 'Andorinha', emoji: '🐦', p: 260 },
      { id: 4, nome: 'Lua', emoji: '🌙', p: 220 },
      { id: 5, nome: 'Adaga', emoji: '🗡️', p: 300 },
    ],
    artistas: [
      { n: 'Yas', esp: 'Fineline' },
      { n: 'Dani', esp: 'Blackwork' },
    ],
    seed: [
      {
        nome: 'Larissa',
        titulo: 'Flash #4 Lua',
        detalhe: 'Antebraço · 8 cm · Yas',
        quando: 'Sáb 10:00',
        valor: 295,
        st: 'agendado',
      },
      {
        nome: 'Bruno',
        titulo: 'Ideia própria',
        detalhe: 'Costas · 25 cm · Dani',
        quando: 'Aguardando',
        valor: 700,
        st: 'orcado',
        ideia: 'Mandala geométrica',
      },
    ],
    status: {
      novo: 'novo pedido',
      orcado: 'orçado',
      agendado: 'sessão marcada',
    },
    fluxo: {
      novo: [
        {
          rotulo: '💬 Enviar orçamento',
          para: 'orcado',
          wa: true,
          push: [
            '💬',
            'Orçamento enviado no WhatsApp',
            (p) => `${p.nome}: R$ ${p.valor} · sinal de 30% pra reservar`,
          ],
        },
      ],
      orcado: [
        {
          rotulo: '📅 Marcar sessão',
          para: 'agendado',
          pri: true,
          quando: 'Sex 15:00',
          push: [
            '📅',
            'Sessão marcada!',
            (p) => `Sinal de R$ ${Math.round(p.valor * 0.3)} entrou no caixa`,
          ],
        },
      ],
    },
    pago: 'agendado',
    caixa: (p) => Math.round(p.valor * 0.3),
  },

  massagem: {
    nome: 'Lótus',
    rotulo: '🪷 Massagem',
    url: 'lotusterapias.com.br',
    icone: '🪷',
    tema: {
      bg: '#f6f1e9',
      card: '#ffffff',
      line: '#e7ddcf',
      tx: '#2f2b26',
      tx2: '#8d8478',
      o: '#6f8f72',
      ink: '#ffffff',
    },
    sintomas: [
      { id: 'ombros', n: 'Ombros tensos', t: 'pedras' },
      { id: 'costas', n: 'Dor nas costas', t: 'pedras' },
      { id: 'pernas', n: 'Pernas inchadas', t: 'drenagem' },
      { id: 'estresse', n: 'Muito estresse', t: 'relaxante' },
      { id: 'sono', n: 'Dormindo mal', t: 'relaxante' },
    ],
    terapias: {
      relaxante: {
        n: 'Massagem relaxante',
        min: 60,
        p: 120,
        porque: 'Movimentos lentos que baixam a tensão e ajudam no sono.',
      },
      drenagem: {
        n: 'Drenagem linfática',
        min: 50,
        p: 110,
        porque: 'Estimula a circulação e reduz o inchaço nas pernas.',
      },
      pedras: {
        n: 'Pedras quentes',
        min: 75,
        p: 150,
        porque: 'O calor solta a musculatura profunda de ombros e costas.',
      },
    },
    terapeutas: ['Ana', 'Bruna'],
    seed: [
      {
        nome: 'Carla',
        titulo: 'Massagem relaxante',
        detalhe: 'com Ana',
        quando: 'Hoje 09:00',
        valor: 120,
        st: 'atendido',
      },
      {
        nome: 'Júlia',
        titulo: 'Drenagem linfática',
        detalhe: 'com Bruna',
        quando: 'Hoje 14:00',
        valor: 110,
        st: 'confirmado',
      },
    ],
    status: {
      pendente: 'pendente',
      confirmado: 'confirmado',
      atendido: 'atendido',
      recusado: 'recusado',
    },
    fluxo: {
      pendente: [
        { rotulo: 'Recusar', para: 'recusado' },
        {
          rotulo: '✓ Confirmar',
          para: 'confirmado',
          pri: true,
          push: [
            '💬',
            'WhatsApp enviado',
            (p) => `Confirmação enviada pra ${p.nome}`,
          ],
        },
      ],
      confirmado: [
        {
          rotulo: 'Sessão concluída',
          para: 'atendido',
          pri: true,
          push: [
            '💰',
            'Entrou no caixa',
            (p) => `+ R$ ${p.valor} · ${p.titulo}`,
          ],
        },
      ],
    },
    pago: 'atendido',
    caixa: (p) => p.valor,
  },

  imobiliaria: {
    nome: 'Alto Vista',
    rotulo: '🏠 Imobiliária',
    url: 'altovista.com.br',
    icone: '🏠',
    tema: {
      bg: '#f4f5f7',
      card: '#ffffff',
      line: '#e3e6eb',
      tx: '#13233a',
      tx2: '#7a8496',
      o: '#c79a4b',
      ink: '#ffffff',
    },
    corretores: ['Marina', 'Otávio'],
    imoveis: [
      {
        id: 'cobertura',
        tipo: 'Cobertura',
        nome: 'Cobertura com vista',
        bairro: 'Centro',
        m2: 180,
        quartos: 3,
        vagas: 2,
        aluguel: 6500,
        tour: true,
        fotos: ['cobertura-sala', 'cobertura-cozinha', 'cobertura-varanda'],
      },
      {
        id: 'alto',
        tipo: 'Apartamento',
        nome: 'Apartamento alto padrão',
        bairro: 'Jardins',
        m2: 130,
        quartos: 3,
        vagas: 2,
        aluguel: 4200,
        fotos: ['alto-sala', 'alto-cozinha'],
      },
      {
        id: 'garden',
        tipo: 'Apartamento',
        nome: 'Apartamento iluminado',
        bairro: 'Bela Vista',
        m2: 92,
        quartos: 2,
        vagas: 1,
        aluguel: 2900,
        fotos: ['garden-sala', 'garden-entrada'],
      },
      {
        id: 'loft',
        tipo: 'Loft',
        nome: 'Loft com vista',
        bairro: 'Alto da Colina',
        m2: 58,
        quartos: 1,
        vagas: 1,
        aluguel: 1850,
        fotos: ['loft-cozinha', 'loft-vista'],
      },
    ],
    seed: [
      {
        nome: 'Fernanda',
        titulo: 'Apartamento alto padrão',
        detalhe: 'Jardins · com Marina',
        quando: 'Hoje 10:00',
        valor: 4200,
        st: 'visitado',
      },
      {
        nome: 'Ricardo',
        titulo: 'Loft com vista',
        detalhe: 'Alto da Colina · com Otávio',
        quando: 'Hoje 15:30',
        valor: 1850,
        st: 'confirmado',
      },
    ],
    status: {
      pendente: 'visita pedida',
      confirmado: 'visita confirmada',
      visitado: 'visitou',
      fechado: 'contrato fechado',
      recusado: 'recusado',
    },
    fluxo: {
      pendente: [
        { rotulo: 'Recusar', para: 'recusado' },
        {
          rotulo: '✓ Confirmar visita',
          para: 'confirmado',
          pri: true,
          push: [
            '💬',
            'WhatsApp enviado',
            (p) => `Visita confirmada pro ${p.nome}, com o endereço`,
          ],
        },
      ],
      confirmado: [{ rotulo: 'Visita feita', para: 'visitado', pri: true }],
      visitado: [
        {
          rotulo: '📝 Fechar contrato',
          para: 'fechado',
          pri: true,
          push: [
            '💰',
            'Contrato fechado!',
            (p) => `+ R$ ${p.valor} · taxa de intermediação`,
          ],
        },
      ],
    },
    pago: 'fechado',
    caixa: (p) => p.valor,
  },

  // Site real feito pra um cliente (Michael), mostrado dentro da demo.
  // privado: só aparece com o link ?demo=oficina
  oficina: {
    nome: 'Michael Mecânico',
    rotulo: '🔧 Oficina',
    url: 'michaelmecanico.com.br',
    icone: '🔧',
    privado: true,
    iframe: '/demo/oficina/',
    tema: {
      bg: '#0b0e13',
      card: '#141922',
      line: '#232a36',
      tx: '#eef2f7',
      tx2: '#8a94a6',
      o: '#f59e0b',
      ink: '#111111',
    },
    seed: [
      {
        nome: 'Jorge',
        titulo: 'Troca de pastilhas',
        detalhe: 'Gol 2015',
        quando: 'Hoje 08:30',
        valor: 280,
        st: 'atendido',
      },
      {
        nome: 'Sandra',
        titulo: 'Revisão + óleo',
        detalhe: 'Onix 2019',
        quando: 'Hoje 13:00',
        valor: 350,
        st: 'confirmado',
      },
      {
        nome: 'Leandro',
        titulo: 'Diagnóstico de injeção',
        detalhe: 'HB20 2020',
        quando: 'Amanhã 09:00',
        valor: 150,
        st: 'pendente',
      },
    ],
    status: {
      pendente: 'pendente',
      confirmado: 'confirmado',
      atendido: 'pronto',
      recusado: 'recusado',
    },
    fluxo: {
      pendente: [
        { rotulo: 'Recusar', para: 'recusado' },
        {
          rotulo: '✓ Confirmar',
          para: 'confirmado',
          pri: true,
          push: [
            '💬',
            'WhatsApp enviado',
            (p) => `Horário confirmado pro ${p.nome}`,
          ],
        },
      ],
      confirmado: [
        {
          rotulo: 'Carro pronto',
          para: 'atendido',
          pri: true,
          push: [
            '💰',
            'Entrou no caixa',
            (p) => `+ R$ ${p.valor} · ${p.titulo}`,
          ],
        },
      ],
    },
    pago: 'atendido',
    caixa: (p) => p.valor,
  },
}

// Próximos dias úteis (sem domingo), usados nas agendas
export function proximosDias(qtd = 6) {
  const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const dias = []
  const d = new Date()
  while (dias.length < qtd) {
    if (d.getDay() !== 0) {
      dias.push({
        chave: d.toISOString().slice(0, 10),
        semana: dias.length ? nomes[d.getDay()] : 'Hoje',
        dia: d.getDate(),
      })
    }
    d.setDate(d.getDate() + 1)
  }
  return dias
}

// Horário "ocupado" de mentira, mas sempre igual pra mesma combinação
export const ocupado = (chave, pessoa, hora) =>
  (hora.charCodeAt(1) + chave.charCodeAt(9) + pessoa.length) % 4 === 0
