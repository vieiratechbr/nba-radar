# Banco de dados

O NBA Radar usa Supabase como backend principal para autenticação, perfis, preferências e dados privados do usuário. O Supabase entrega PostgreSQL, Supabase Auth e Row Level Security (RLS), mantendo o MVP simples de operar e pronto para ser compartilhado pelo app web e pelo app mobile.

## Tabelas

### `profiles`

Armazena os dados públicos/funcionais do perfil autenticado:

- `id`: mesmo UUID de `auth.users.id`;
- `email` e `name`;
- `favorite_team_id`;
- `favorite_team_abbreviation`;
- `favorite_team_name`;
- `favorite_team_full_name`;
- `favorite_team_logo_url`;
- `created_at` e `updated_at`.

O tema por time usa `favorite_team_abbreviation` para buscar as cores em `/src/theme/nbaTeamThemes.ts`.

### `user_preferences`

Guarda preferências de notificações e visual do usuário:

- avisar antes do jogo;
- avisar início da partida;
- avisar placar final;
- avisar highlights disponíveis;
- `theme_mode`, inicialmente `system` ou `dark`.

### `saved_games`

Lista jogos salvos pelo usuário:

- `espn_event_id`;
- mandante;
- visitante;
- data do jogo.

A restrição `unique(user_id, espn_event_id)` impede duplicidade para o mesmo usuário.

### `favorite_players`

Lista jogadores favoritos do usuário:

- `player_id`, quando disponível;
- `player_name`;
- `team_abbreviation`;
- `image_url`.

A restrição `unique(user_id, player_name)` evita duplicidade simples por usuário.

## Row Level Security (RLS)

Todas as tabelas privadas têm RLS ativado em `/supabase/schema.sql`:

- `profiles`;
- `user_preferences`;
- `saved_games`;
- `favorite_players`.

As policies usam `auth.uid()` para garantir que cada usuário leia, insira, atualize ou remova apenas os próprios dados. O frontend usa apenas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`; a `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser exposta no client.

## Como aplicar o schema

1. Crie um projeto no Supabase.
2. Copie a Project URL e a anon public key.
3. Preencha `.env.local` na raiz do projeto.
4. Abra o SQL Editor do Supabase.
5. Rode o conteúdo de `/supabase/schema.sql`.
6. Inicie o projeto com `npm run dev`.

## Variáveis necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Serviços da aplicação

- `/src/services/profileService.ts`: usuário atual, profile e time favorito;
- `/src/services/preferencesService.ts`: leitura/upsert de preferências;
- `/src/services/savedGamesService.ts`: jogos salvos;
- `/src/services/favoritePlayersService.ts`: jogadores favoritos.

## Mobile

O app mobile deve usar o mesmo Supabase Auth e as mesmas tabelas de `profiles` e `user_preferences`. A recomendação é que o mobile consuma as rotas internas do NBA Radar sempre que precisar combinar dados privados do usuário com dados externos da NBA.
