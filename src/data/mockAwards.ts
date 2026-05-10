import type { AwardWinner } from "@/types/award";
import { getPlayerImageUrl } from "@/utils/playerImages";

const pendingAwards = (season: string, awards: string[]): AwardWinner[] =>
  awards.map((award) => ({
    id: `${season}-${award.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    season,
    award,
    playerName: "A definir",
    status: "pending",
    source: "mock",
    summary: "Vencedor ainda não definido oficialmente na base local inicial."
  }));

const awards: AwardWinner[] = [
  ...pendingAwards("2025-26", ["MVP", "Coach of the Year", "Finals MVP"]),
  {
    id: "2025-26-dpoy",
    season: "2025-26",
    award: "Defensive Player of the Year",
    playerName: "Victor Wembanyama",
    team: "San Antonio Spurs",
    position: "C",
    status: "confirmed",
    source: "mock",
    summary: "Listado pela ESPN em 2026 como vencedor do prêmio de defensor do ano."
  },
  {
    id: "2025-26-roty",
    season: "2025-26",
    award: "Rookie of the Year",
    playerName: "Cooper Flagg",
    team: "Dallas Mavericks",
    position: "F",
    status: "confirmed",
    source: "mock",
    summary: "Listado pela ESPN em 2026 como vencedor do prêmio de novato do ano."
  },
  {
    id: "2025-26-sixth",
    season: "2025-26",
    award: "Sixth Man of the Year",
    playerName: "Keldon Johnson",
    team: "San Antonio Spurs",
    position: "F",
    status: "confirmed",
    source: "mock",
    summary: "Listado pela ESPN em 2026 como vencedor do prêmio de sexto homem."
  },
  {
    id: "2025-26-mip",
    season: "2025-26",
    award: "Most Improved Player",
    playerName: "Nickeil Alexander-Walker",
    team: "Atlanta Hawks",
    position: "G",
    status: "confirmed",
    source: "mock",
    summary: "Listado pela ESPN em 2026 como vencedor do prêmio de maior evolução."
  },
  {
    id: "2025-26-clutch",
    season: "2025-26",
    award: "Clutch Player of the Year",
    playerName: "Shai Gilgeous-Alexander",
    team: "Oklahoma City Thunder",
    position: "G",
    status: "confirmed",
    source: "mock",
    summary: "Listado pela ESPN em 2026 como vencedor do prêmio de jogador mais decisivo."
  },
  {
    id: "2024-25-mvp",
    season: "2024-25",
    award: "MVP",
    playerName: "Shai Gilgeous-Alexander",
    team: "Oklahoma City Thunder",
    position: "G",
    status: "confirmed",
    source: "mock",
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
    source: "mock",
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
    source: "mock",
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
    source: "mock",
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
    source: "mock",
    summary: "Salto de impacto defensivo, volume e presença em uma função muito maior no perímetro."
  },
  {
    id: "2024-25-coach",
    season: "2024-25",
    award: "Coach of the Year",
    playerName: "Kenny Atkinson",
    team: "Cleveland Cavaliers",
    status: "confirmed",
    source: "mock",
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
    source: "mock",
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
    source: "mock",
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
    source: "mock",
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
    source: "mock",
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
    source: "mock",
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
    source: "mock",
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
    source: "mock",
    summary: "Salto de volume, responsabilidade ofensiva e criação com a bola."
  },
  {
    id: "2023-24-coach",
    season: "2023-24",
    award: "Coach of the Year",
    playerName: "Mark Daigneault",
    team: "Oklahoma City Thunder",
    status: "confirmed",
    source: "mock",
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
    source: "mock",
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
    source: "mock",
    summary: "Arremessos decisivos e criação de alto nível em posses apertadas."
  }
];

export const mockAwards: AwardWinner[] = awards.map((award) => ({
  ...award,
  imageUrl: getPlayerImageUrl(award.playerName, award.imageUrl)
}));
