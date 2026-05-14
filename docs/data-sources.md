# Fontes de Dados - NBA Radar

Este documento registra o estado atual das fontes de dados do projeto e deixa explícito onde ainda existe base local.

## Online

- Placares: ESPN Site API (`/scoreboard`), via rotas internas `/api/games`, `/api/games/today` e `/api/games/live`.
- Detalhes de jogos: ESPN Summary API (`/summary?event=...`), via `/api/games/[id]`.
- Highlights: ESPN Summary primeiro; Highlightly como complemento/fallback quando houver mapeamento de partida.
- Notícias: ESPN News API, com mock apenas em falha.
- Classificação: ESPN standings, com mock apenas em falha.
- Times: ESPN teams, com mock apenas em falha.
- Perfil do usuário, jogos do time favorito: ESPN scoreboard por intervalo de datas, com fallback por dia quando o range falhar.
- Perfil do usuário, elenco: ESPN team roster (`/teams/{abbr}/roster`) quando disponível.
- Perfil do usuário, estatísticas do time: ESPN team statistics (`/teams/{abbr}/statistics`) quando disponível.
- Perfil do usuário, classificação/temporada: ESPN standings.
- Prêmios: ESPN Awards History quando disponível; base local somente como fallback.
- Draft/Picks: tentativa online via ESPN Core Draft API para picks já publicadas; base local quando a fonte online não retorna dados.

## Local / Mock

- Lendas da franquia no perfil: base local organizada para contexto histórico.
- Histórico da franquia no perfil: base local organizada para fundação, cidade, arena, títulos e resumo.
- Melhor jogador do time favorito: base local inicial quando não há integração confiável de estatísticas individuais por temporada.
- Draft prospects futuros: mantidos como base local quando não há endpoint confiável de prospects pré-draft.
- Fotos dos prospects: mapa local opcional e avatar fallback quando não houver imagem confiável.
- Home: alguns recortes rápidos de classificação, prêmios e draft ainda usam bases locais para prévia visual.
- Posts/blog e páginas antigas redirecionadas: conteúdo local legado.
- Jogos, notícias, times e standings: mocks existem apenas como fallback de erro.

## Perfil do Usuário

O painel `/perfil` consolida dados de várias fontes:

- Time favorito e preferências: Supabase `profiles`.
- Próximos jogos e últimos resultados: ESPN scoreboard.
- Temporada atual: ESPN standings.
- Elenco principal: ESPN roster.
- Estatísticas do time: ESPN statistics.
- Lendas e histórico: base local, exibida como contexto/fallback.
- Melhor jogador: base local inicial até existir fonte online confiável para estatísticas individuais por equipe.

Se uma parte falhar, a rota `/api/me/favorite-team/dashboard` retorna dados parciais e sinaliza a fonte em `sources`.

## Observações Sobre Highlightly

A documentação pública da Highlightly Basketball lista endpoints para matches, highlights, leagues, teams, odds, standings, statistics, head-to-head e last-five-games. Não há endpoint documentado de Draft/prospects na Basketball API consultada em maio de 2026.

## Pendências

- Substituir melhor jogador do time favorito por fonte online confiável.
- Expandir lendas e histórico para todas as franquias com curadoria manual revisada.
- Encontrar fonte oficial/confiável para ranking de prospects pré-draft.
- Expandir imagens confiáveis dos prospects sem usar fotos aleatórias.
- Monitorar se a ESPN Core Draft API passa a expor picks/prospects do ano atual antes do Draft.
- Evoluir notificações no app mobile quando a base Expo estiver integrada ao backend.
