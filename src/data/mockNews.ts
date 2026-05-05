import type { NewsArticle } from "@/types/news";

const courtImage = "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80";
const arenaImage = "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1200&q=80";
const ballImage = "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80";
const rimImage = "https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=1200&q=80";

export const mockNews: NewsArticle[] = [
  {
    id: "news-bulls-win-home",
    title: "Bulls vencem jogo importante em casa",
    source: "Radar NBA",
    date: "2026-05-04T09:00:00-03:00",
    category: "Bulls",
    summary:
      "Chicago controla os rebotes no quarto período e ganha confiança antes de uma sequência decisiva fora de casa.",
    imageUrl: courtImage,
    externalUrl: "https://example.com/bulls-vencem-jogo-importante",
    teamIds: ["chi"],
    featured: true
  },
  {
    id: "news-trade-market",
    title: "Rumores de troca movimentam o mercado da NBA",
    source: "Hoop Wire Brasil",
    date: "2026-05-04T11:20:00-03:00",
    category: "Rumores",
    summary:
      "Executivos monitoram alas versáteis e armadores veteranos enquanto franquias definem suas prioridades para a offseason.",
    imageUrl: arenaImage,
    externalUrl: "https://example.com/rumores-troca-nba",
    featured: true
  },
  {
    id: "news-lakers-fourth",
    title: "Astro dos Lakers lidera vitória no último quarto",
    source: "Linha de Três",
    date: "2026-05-03T23:45:00-03:00",
    category: "Destaques",
    summary:
      "Los Angeles acelera nos minutos finais, fecha a defesa e confirma resultado contra um rival direto do Oeste.",
    imageUrl: ballImage,
    externalUrl: "https://example.com/lakers-vitoria-ultimo-quarto",
    teamIds: ["lal"]
  },
  {
    id: "news-celtics-east",
    title: "Celtics seguem fortes na conferência leste",
    source: "Baseline Report",
    date: "2026-05-03T18:10:00-03:00",
    category: "Playoffs",
    summary:
      "Boston mantém o melhor saldo da conferência e chega aos jogos finais com rotação profunda e ataque eficiente.",
    imageUrl: rimImage,
    externalUrl: "https://example.com/celtics-leste",
    teamIds: ["bos"]
  },
  {
    id: "news-injury-road-trip",
    title: "Lesão preocupa franquia antes de sequência fora de casa",
    source: "Quadra Central",
    date: "2026-05-02T16:30:00-03:00",
    category: "Lesões",
    summary:
      "O departamento médico deve reavaliar o jogador nos próximos dias antes de liberar minutos completos.",
    imageUrl: arenaImage,
    externalUrl: "https://example.com/lesao-sequencia-fora"
  },
  {
    id: "news-nba-cup",
    title: "NBA Cup ganha destaque entre jogadores e torcedores",
    source: "Radar NBA",
    date: "2026-05-02T12:00:00-03:00",
    category: "NBA Cup",
    summary:
      "O torneio de meio de temporada aparece como vitrine para elencos jovens e amplia a intensidade de jogos em novembro.",
    imageUrl: courtImage,
    externalUrl: "https://example.com/nba-cup-destaque"
  },
  {
    id: "news-bulls-rotation",
    title: "Rotação jovem dos Bulls ganha minutos importantes",
    source: "Chicago Radar",
    date: "2026-05-01T10:15:00-03:00",
    category: "Bulls",
    summary:
      "A comissão técnica testa formações mais rápidas, com foco em defesa no ponto de ataque e transição ofensiva.",
    imageUrl: ballImage,
    externalUrl: "https://example.com/rotacao-jovem-bulls",
    teamIds: ["chi"]
  },
  {
    id: "news-market-wing",
    title: "Mercado valoriza alas com defesa e arremesso",
    source: "Cap Space",
    date: "2026-04-30T15:40:00-03:00",
    category: "Mercado",
    summary:
      "Franquias buscam jogadores capazes de marcar múltiplas posições sem comprometer o espaçamento no ataque.",
    imageUrl: rimImage,
    externalUrl: "https://example.com/mercado-alas-3d"
  },
  {
    id: "news-playoff-seed",
    title: "Disputa por mando de quadra esquenta no Oeste",
    source: "Pick and Roll",
    date: "2026-04-30T09:50:00-03:00",
    category: "Playoffs",
    summary:
      "Cinco times ainda podem trocar posições na tabela, tornando cada confronto direto decisivo.",
    imageUrl: arenaImage,
    externalUrl: "https://example.com/mando-oeste"
  },
  {
    id: "news-trades-big",
    title: "Franquias avaliam troca envolvendo pivô titular",
    source: "Insider Brasil",
    date: "2026-04-29T21:05:00-03:00",
    category: "Trades",
    summary:
      "Conversas preliminares indicam interesse por escolhas de draft e contratos expirantes na negociação.",
    imageUrl: ballImage,
    externalUrl: "https://example.com/troca-pivo-titular"
  },
  {
    id: "news-bulls-defense",
    title: "Defesa do Bulls melhora com quinteto mais físico",
    source: "Chicago Radar",
    date: "2026-04-29T13:25:00-03:00",
    category: "Bulls",
    summary:
      "Chicago reduz pontos no garrafão e força posses mais longas, mas ainda busca consistência nos rebotes defensivos.",
    imageUrl: courtImage,
    externalUrl: "https://example.com/defesa-bulls-quinteto",
    teamIds: ["chi"]
  },
  {
    id: "news-rumor-guard",
    title: "Armador veterano aparece no radar de contenders",
    source: "Linha de Três",
    date: "2026-04-28T17:55:00-03:00",
    category: "Rumores",
    summary:
      "A experiência em playoffs e a capacidade de organizar meia quadra chamam atenção de equipes no topo da tabela.",
    imageUrl: rimImage,
    externalUrl: "https://example.com/armador-veterano-contenders"
  }
];
