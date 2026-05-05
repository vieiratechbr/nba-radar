import type { BlogPost } from "@/types/post";

const coverA = "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80";
const coverB = "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1400&q=80";
const coverC = "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1400&q=80";

export const mockPosts: BlogPost[] = [
  {
    id: "post-bulls-season",
    slug: "o-que-esperar-do-chicago-bulls-nesta-temporada",
    title: "O que esperar do Chicago Bulls nesta temporada",
    category: "Chicago Bulls",
    author: "Equipe NBA Radar",
    date: "2026-05-04T08:00:00-03:00",
    readingTime: "6 min",
    coverImage: coverA,
    summary:
      "Um olhar sobre rotação, prioridades e caminhos possíveis para Chicago competir sem perder o foco no futuro.",
    content: [
      "O Chicago Bulls entra nesta fase do projeto tentando equilibrar duas forças: competir todas as noites e, ao mesmo tempo, abrir espaço para uma rotação mais jovem. Esse tipo de construção exige clareza sobre papéis, minutos e prioridades.",
      "A primeira resposta passa pelo perímetro. Coby White assumiu mais responsabilidade como criador, enquanto Ayo Dosunmu oferece pressão defensiva e velocidade em transição. Quando a equipe consegue transformar defesa em ataque cedo no relógio, o jogo fica menos pesado.",
      "O ponto de atenção continua sendo a consistência ofensiva em meia quadra. Chicago precisa encontrar arremessos de qualidade sem depender de posses longas demais. Espaçamento, cortes sem bola e decisões rápidas serão indicadores importantes.",
      "A temporada ideal para os Bulls não precisa ser medida apenas por posição final. Evolução dos jovens, identidade defensiva e flexibilidade para futuras decisões de elenco também devem pesar na avaliação."
    ],
    relatedSlugs: ["bulls-precisam-acelerar-a-reconstrucao", "resumo-da-rodada-grandes-atuacoes-e-surpresas"]
  },
  {
    id: "post-title-favorites",
    slug: "os-favoritos-ao-titulo-da-nba",
    title: "Os favoritos ao título da NBA",
    category: "Opinião",
    author: "Marcos Linhares",
    date: "2026-05-03T10:30:00-03:00",
    readingTime: "7 min",
    coverImage: coverB,
    summary:
      "A corrida pelo título mistura elencos consolidados, ataques de elite e defesas que chegam no momento certo.",
    content: [
      "Favoritismo na NBA raramente é estático. Lesões, matchups e ajustes de rotação mudam rapidamente a leitura de uma série, mas alguns times chegam com argumentos mais sólidos.",
      "Os melhores candidatos combinam criação em alto nível, defesa adaptável e pelo menos uma estrela capaz de quebrar sistemas no fim dos jogos. Esse trio de elementos costuma separar campanhas fortes de projetos realmente campeões.",
      "Outro ponto decisivo é profundidade. Em uma pós-temporada longa, o oitavo ou nono jogador da rotação pode virar o detalhe que mantém uma equipe viva em noites de baixo aproveitamento."
    ],
    relatedSlugs: ["mercado-da-nba-quem-pode-ser-trocado", "como-a-nba-cup-mudou-o-ritmo-da-temporada"]
  },
  {
    id: "post-nba-cup",
    slug: "como-a-nba-cup-mudou-o-ritmo-da-temporada",
    title: "Como a NBA Cup mudou o ritmo da temporada",
    category: "NBA Cup",
    author: "Equipe NBA Radar",
    date: "2026-05-02T13:20:00-03:00",
    readingTime: "5 min",
    coverImage: coverC,
    summary:
      "O torneio trouxe peso competitivo para meses historicamente mais irregulares e alterou a preparação das equipes.",
    content: [
      "A NBA Cup adicionou contexto a jogos que antes poderiam passar como parte comum do calendário. Para elencos jovens, o formato cria experiências de pressão sem depender exclusivamente dos playoffs.",
      "Do ponto de vista tático, técnicos tratam partidas de Copa como laboratório com urgência. Há ajustes mais rápidos, rotações mais curtas e maior atenção a saldo de pontos.",
      "Ainda existe espaço para evolução no formato, mas o impacto já aparece no engajamento de torcedores e no comportamento competitivo dos jogadores."
    ],
    relatedSlugs: ["resumo-da-rodada-grandes-atuacoes-e-surpresas", "os-favoritos-ao-titulo-da-nba"]
  },
  {
    id: "post-roundup",
    slug: "resumo-da-rodada-grandes-atuacoes-e-surpresas",
    title: "Resumo da rodada: grandes atuações e surpresas",
    category: "Resumo da rodada",
    author: "Ana Ribeiro",
    date: "2026-05-01T23:50:00-03:00",
    readingTime: "4 min",
    coverImage: coverA,
    summary:
      "A noite teve viradas, atuações individuais acima da média e resultados que mexeram na tabela.",
    content: [
      "A rodada começou com ritmo alto e terminou com impacto direto na briga por classificação. Times que precisavam vencer responderam com intensidade, enquanto favoritos encontraram resistência.",
      "O destaque individual veio de uma sequência de arremessos decisivos no último quarto. Mais do que volume, a qualidade das decisões chamou atenção.",
      "Para os próximos jogos, o ponto a observar é desgaste. Viagens, back-to-backs e rotações curtas podem pesar na reta final."
    ],
    relatedSlugs: ["o-que-esperar-do-chicago-bulls-nesta-temporada", "os-favoritos-ao-titulo-da-nba"]
  },
  {
    id: "post-market",
    slug: "mercado-da-nba-quem-pode-ser-trocado",
    title: "Mercado da NBA: quem pode ser trocado?",
    category: "Mercado da NBA",
    author: "Marcos Linhares",
    date: "2026-04-30T12:15:00-03:00",
    readingTime: "6 min",
    coverImage: coverB,
    summary:
      "Contratos expirantes, escolhas de draft e alas versáteis devem ditar o tom das conversas entre franquias.",
    content: [
      "O mercado da NBA se movimenta antes mesmo de qualquer proposta formal. Times monitoram encaixes salariais, disponibilidade de escolhas e necessidades específicas de rotação.",
      "Alas com defesa e arremesso continuam entre os ativos mais valiosos. A escassez desse perfil faz com que equipes paguem caro por jogadores capazes de permanecer em quadra nos playoffs.",
      "Para franquias em transição, a pergunta central é simples: preservar competitividade agora ou maximizar flexibilidade para a próxima janela?"
    ],
    relatedSlugs: ["os-favoritos-ao-titulo-da-nba", "bulls-precisam-acelerar-a-reconstrucao"]
  },
  {
    id: "post-bulls-rebuild",
    slug: "bulls-precisam-acelerar-a-reconstrucao",
    title: "Bulls precisam acelerar a reconstrução?",
    category: "Análise",
    author: "Equipe NBA Radar",
    date: "2026-04-29T09:40:00-03:00",
    readingTime: "8 min",
    coverImage: coverC,
    summary:
      "Chicago precisa decidir quanto da competitividade atual ajuda, ou atrasa, a próxima versão do elenco.",
    content: [
      "Reconstruir não significa perder sem direção. Para os Bulls, a melhor leitura está em transformar minutos relevantes em desenvolvimento real, mantendo um ambiente competitivo.",
      "Acelerar a reconstrução exige decisões difíceis sobre veteranos, contratos e escolhas de draft. O risco de ficar no meio da tabela existe, mas ele pode ser reduzido com clareza de plano.",
      "O caminho mais coerente passa por testar formações, medir quem evolui sob pressão e preservar flexibilidade para movimentos maiores quando o mercado abrir."
    ],
    relatedSlugs: ["o-que-esperar-do-chicago-bulls-nesta-temporada", "mercado-da-nba-quem-pode-ser-trocado"]
  }
];
