# Fontes de Dados - NBA Radar

Este documento registra o estado atual das fontes de dados do projeto e deixa explícito onde ainda existe base local.

## Online

- Placares: ESPN Site API (`/scoreboard`), via rotas internas `/api/games`, `/api/games/today` e `/api/games/live`.
- Detalhes de jogos: ESPN Summary API (`/summary?event=...`), via `/api/games/[id]`.
- Highlights: ESPN Summary primeiro; Highlightly como complemento/fallback quando houver mapeamento de partida.
- Notícias: ESPN News API, com mock apenas em falha.
- Classificação: ESPN standings, com mock apenas em falha.
- Times: ESPN teams, com mock apenas em falha.
- Prêmios: ESPN Awards History quando disponível; base local somente como fallback.
- Draft/Picks: tentativa online via ESPN Core Draft API para picks já publicadas; base local quando a fonte online não retorna dados.

## Local / Mock

- Draft prospects futuros: mantidos como base local quando não há endpoint confiável de prospects pré-draft.
- Fotos dos prospects: mapa local opcional e avatar fallback quando não houver imagem confiável.
- Melhor jogador do time favorito: base local inicial quando não há integração confiável de estatísticas individuais por temporada.
- Home: alguns recortes rápidos de classificação, prêmios e draft ainda usam bases locais para prévia visual.
- Posts/blog e páginas antigas redirecionadas: conteúdo local legado.
- Jogos, notícias, times e standings: mocks existem apenas como fallback de erro.

## Observações Sobre Highlightly

A documentação pública da Highlightly Basketball lista endpoints para matches, highlights, leagues, teams, odds, standings, statistics, head-to-head e last-five-games. Não há endpoint documentado de Draft/prospects na Basketball API consultada em maio de 2026.

## Pendências

- Migrar a Home para consumir os services online em todas as prévias.
- Substituir melhor jogador do time favorito por fonte online confiável.
- Encontrar fonte oficial/confiável para ranking de prospects pré-draft.
- Expandir imagens confiáveis dos prospects sem usar fotos aleatórias.
- Monitorar se a ESPN Core Draft API passa a expor picks/prospects do ano atual antes do Draft.
- Evoluir notificações no app mobile quando a base Expo estiver integrada ao backend.
