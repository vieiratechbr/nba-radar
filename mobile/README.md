# NBA Radar Mobile

Aplicativo mobile inicial do NBA Radar, criado em React Native com Expo e TypeScript dentro do mesmo repositório do site web.

## Status atual

- Estrutura inicial de telas criada.
- Identidade visual alinhada ao web: preto, charcoal, vermelho, branco e cards escuros.
- Logos copiadas para `mobile/assets/logos`.
- Services preparados para consumir as rotas internas do backend/web.
- Login, cadastro, perfil e time favorito estão estruturados para integração futura com Supabase.

## Como rodar

```bash
cd mobile
npm install
npm run start
```

Para testar contra o backend local do site:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

Em dispositivos físicos, troque `localhost` pelo IP da máquina na rede local.

## Estrutura

- `src/screens`: Home, Login, Cadastro, Time Favorito, Detalhes do Jogo e Perfil.
- `src/components`: componentes visuais reutilizáveis.
- `src/services`: cliente HTTP e services de auth/games/profile.
- `src/theme`: cores, espaçamentos e tipografia.
- `assets/logos`: logos oficiais do NBA Radar.


## Supabase compartilhado

O app mobile usará o mesmo Supabase Auth e as mesmas tabelas de `profiles`/`user_preferences` do projeto web. A base de dados e as policies RLS ficam documentadas em `../supabase/schema.sql` e `../docs/database.md`.

## Rotas esperadas do backend web

- `GET /api/games/today`
- `GET /api/games/:id`
- `GET /api/standings`
- `GET /api/auth/me`
- `GET /api/me/favorite-team/dashboard`

O app mobile não deve chamar ESPN, Highlightly ou qualquer API externa diretamente. Ele deve consumir as rotas internas do NBA Radar.

## Notificações futuras

Plano para uma próxima etapa com `expo-notifications`:

- Jogo do time favorito começando em 15 minutos.
- Início da partida.
- Fim da partida e resultado final.
- Melhores momentos disponíveis.
- Próximo jogo do time favorito.

As notificações precisarão respeitar login, time favorito salvo no profile e permissões do dispositivo.
