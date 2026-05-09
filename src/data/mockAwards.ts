import type { AwardWinner } from "@/types/award";
import { getPlayerImageUrl } from "@/utils/playerImages";

const pending2025Awards: AwardWinner[] = [
  "MVP",
  "Rookie of the Year",
  "Defensive Player of the Year",
  "Sixth Man of the Year",
  "Most Improved Player",
  "Coach of the Year",
  "Finals MVP",
  "Clutch Player of the Year"
].map((award) => ({
  id: `2025-26-${award.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  season: "2025-26",
  award,
  playerName: "A definir",
  status: "pending",
  summary: "Vencedor ainda não definido oficialmente na base local inicial."
}));

const awards: AwardWinner[] = [
  ...pending2025Awards,
  {
    id: "2024-25-mvp",
    season: "2024-25",
    award: "MVP",
    playerName: "Shai Gilgeous-Alexander",
    team: "Oklahoma City Thunder",
    position: "G",
    status: "confirmed",
    summary: "Temporada de elite como principal motor ofensivo do Thunder e vencedor oficial do prêmio."
  },
  {
    id: "2024-25-roty",
    season: "2024-25",
    award: "Rookie of the Year",
    playerName: "Stephon Castle",
    team: "San Antonio Spurs",
    position: "G",
    status: "confirmed",
    summary: "Impacto imediato como novato, combinando defesa forte, criação e evolução ao longo da temporada."
  },
  {
    id: "2024-25-dpoy",
    season: "2024-25",
    award: "Defensive Player of the Year",
    playerName: "Evan Mobley",
    team: "Cleveland Cavaliers",
    position: "F/C",
    status: "confirmed",
    summary: "Pilar defensivo de Cleveland, com mobilidade, proteção de aro e cobertura em múltiplas funções."
  },
  {
    id: "2024-25-sixth",
    season: "2024-25",
    award: "Sixth Man of the Year",
    playerName: "Payton Pritchard",
    team: "Boston Celtics",
    position: "G",
    status: "confirmed",
    summary: "Energia, arremesso e condução de segunda unidade em uma das rotações mais fortes da liga."
  },
  {
    id: "2024-25-mip",
    season: "2024-25",
    award: "Most Improved Player",
    playerName: "Dyson Daniels",
    team: "Atlanta Hawks",
    position: "G",
    status: "confirmed",
    summary: "Salto de impacto defensivo, volume e presença em uma função muito maior no perímetro."
  },
  {
    id: "2024-25-coach",
    season: "2024-25",
    award: "Coach of the Year",
    playerName: "Kenny Atkinson",
    team: "Cleveland Cavaliers",
    status: "confirmed",
    summary: "Reconhecimento pela consistência coletiva, organização e campanha de alto nível de Cleveland."
  },
  {
    id: "2024-25-finals",
    season: "2024-25",
    award: "Finals MVP",
    playerName: "Shai Gilgeous-Alexander",
    team: "Oklahoma City Thunder",
    position: "G",
    status: "confirmed",
    summary: "Vencedor do Bill Russell Trophy após liderar o Thunder no título da NBA."
  },
  {
    id: "2024-25-clutch",
    season: "2024-25",
    award: "Clutch Player of the Year",
    playerName: "Jalen Brunson",
    team: "New York Knicks",
    position: "G",
    status: "confirmed",
    summary: "Produção decisiva em posses apertadas e controle de jogo nos minutos finais."
  },
  {
    id: "2023-24-mvp",
    season: "2023-24",
    award: "MVP",
    playerName: "Nikola Jokic",
    team: "Denver Nuggets",
    position: "C",
    status: "confirmed",
    summary: "Temporada de controle ofensivo total, eficiência e impacto como principal criador de Denver."
  },
  {
    id: "2023-24-roty",
    season: "2023-24",
    award: "Rookie of the Year",
    playerName: "Victor Wembanyama",
    team: "San Antonio Spurs",
    position: "C",
    status: "confirmed",
    summary: "Impacto imediato nos dois lados da quadra e produção histórica para um novato."
  },
  {
    id: "2023-24-dpoy",
    season: "2023-24",
    award: "Defensive Player of the Year",
    playerName: "Rudy Gobert",
    team: "Minnesota Timberwolves",
    position: "C",
    status: "confirmed",
    summary: "Pilar defensivo de elite em uma das defesas mais fortes da liga."
  },
  {
    id: "2023-24-sixth",
    season: "2023-24",
    award: "Sixth Man of the Year",
    playerName: "Naz Reid",
    team: "Minnesota Timberwolves",
    position: "F/C",
    status: "confirmed",
    summary: "Pontuação, espaçamento e versatilidade saindo do banco."
  },
  {
    id: "2023-24-mip",
    season: "2023-24",
    award: "Most Improved Player",
    playerName: "Tyrese Maxey",
    team: "Philadelphia 76ers",
    position: "G",
    status: "confirmed",
    summary: "Salto de volume, responsabilidade ofensiva e criação com a bola."
  },
  {
    id: "2023-24-coach",
    season: "2023-24",
    award: "Coach of the Year",
    playerName: "Mark Daigneault",
    team: "Oklahoma City Thunder",
    status: "confirmed",
    summary: "Consolidou um elenco jovem entre as forças da Conferência Oeste."
  },
  {
    id: "2023-24-finals",
    season: "2023-24",
    award: "Finals MVP",
    playerName: "Jaylen Brown",
    team: "Boston Celtics",
    position: "F",
    status: "confirmed",
    summary: "Série decisiva com produção consistente, defesa física e presença em momentos-chave."
  },
  {
    id: "2023-24-clutch",
    season: "2023-24",
    award: "Clutch Player of the Year",
    playerName: "Stephen Curry",
    team: "Golden State Warriors",
    position: "G",
    status: "confirmed",
    summary: "Arremessos decisivos e criação de alto nível em posses apertadas."
  },
  {
    id: "2022-23-mvp",
    season: "2022-23",
    award: "MVP",
    playerName: "Joel Embiid",
    team: "Philadelphia 76ers",
    position: "C",
    status: "confirmed",
    summary: "Domínio como pontuador, proteção de aro e volume de elite no ataque."
  },
  {
    id: "2022-23-roty",
    season: "2022-23",
    award: "Rookie of the Year",
    playerName: "Paolo Banchero",
    team: "Orlando Magic",
    position: "F",
    status: "confirmed",
    summary: "Criação ofensiva e protagonismo imediato como primeira opção jovem."
  },
  {
    id: "2022-23-dpoy",
    season: "2022-23",
    award: "Defensive Player of the Year",
    playerName: "Jaren Jackson Jr.",
    team: "Memphis Grizzlies",
    position: "F/C",
    status: "confirmed",
    summary: "Pressão no aro, mobilidade e impacto defensivo em múltiplas coberturas."
  },
  {
    id: "2022-23-finals",
    season: "2022-23",
    award: "Finals MVP",
    playerName: "Nikola Jokic",
    team: "Denver Nuggets",
    position: "C",
    status: "confirmed",
    summary: "Controle absoluto da série com passe, pontuação e leitura de jogo."
  }
];

export const mockAwards: AwardWinner[] = awards.map((award) => ({
  ...award,
  imageUrl: getPlayerImageUrl(award.playerName, award.imageUrl)
}));
