# NBA Radar

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Database-3ECF8E?logo=supabase&logoColor=white)
![ESPN API](https://img.shields.io/badge/ESPN-API-red)
![Expo](https://img.shields.io/badge/React%20Native%20%2F%20Expo-mobile-000020?logo=expo)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

NBA Radar é uma central esportiva da NBA com placares em tempo real, detalhes das partidas, classificação, prêmios, draft, conta de usuário e personalização por time favorito.

## Preview

<!-- Adicione aqui screenshots do projeto -->

## Sobre o projeto

NBA Radar é um projeto web criado para centralizar informações da NBA em uma experiência moderna, escura, premium e personalizada. A proposta é unir dados de partidas, páginas editoriais e uma área autenticada em um só lugar, permitindo que cada torcedor acompanhe a liga com foco no seu time favorito.

O usuário pode acompanhar:

- Jogos do dia;
- Placar em tempo real;
- Detalhes da partida;
- Melhores momentos;
- Estatísticas;
- Classificação;
- Prêmios;
- Draft;
- Conta própria;
- Time favorito;
- Painel personalizado.

## Funcionalidades

- Placares da NBA em tempo real;
- Página de detalhes da partida;
- Lances e estatísticas;
- Melhores momentos quando disponíveis;
- Classificação da temporada;
- Página de prêmios;
- Página de draft/prospectos;
- Login e cadastro de usuários;
- Escolha do time favorito;
- Painel personalizado do usuário;
- Dashboard do usuário;
- Tema visual baseado no time favorito;
- Personalização visual por time favorito;
- Tema dinâmico com cores das franquias;
- Base inicial para aplicativo mobile.

## Tecnologias

- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- Supabase Auth;
- Supabase Database;
- ESPN endpoints;
- Highlightly API;
- Expo / React Native para mobile.

## Estrutura do projeto

```txt
/src
  /app              Rotas, layouts, páginas e API routes do Next.js.
  /components       Componentes reutilizáveis da interface web.
  /services         Camada de serviços para buscar e normalizar dados do app.
  /integrations     Integrações com provedores externos, como ESPN e Highlightly.
  /types            Tipagens compartilhadas do domínio NBA Radar.
  /utils            Helpers de datas, vídeos, formatação e imagens.
  /data             Bases locais e mocks usados como fallback.
  /theme            Mapa de cores das franquias e helpers de tema.

/mobile
  /src              Base inicial do aplicativo mobile, quando expandida.
  /screens          Telas do app mobile.
  /components       Componentes mobile.
  /services         Serviços mobile.
  /theme            Tema visual mobile.

/docs               Documentação técnica e notas de arquitetura.
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto e preencha as variáveis necessárias. Nunca commite `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

HIGHLIGHTLY_API_BASE_URL=
HIGHLIGHTLY_API_KEY=
HIGHLIGHTLY_API_HOST=

NEWSAPI_KEY=

EXPO_PUBLIC_API_BASE_URL=
```

## Rodando localmente

Instale as dependências e inicie o servidor web:

```bash
npm install
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

## Rodando o app mobile

Como existe uma pasta `/mobile`, o app Expo pode ser iniciado separadamente:

```bash
cd mobile
npm install
npm run start
```

Para apontar o mobile para a API local da web, use:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Fontes de dados

- ESPN: placares, jogos, detalhes, notícias, classificação e dados complementares.
- Highlightly: dados complementares e highlights quando disponível.
- Supabase: autenticação, perfis e time favorito do usuário.
- Base local: usada apenas como fallback em algumas áreas.

Leia mais em [`docs/data-sources.md`](docs/data-sources.md).

## Personalização por time favorito

O NBA Radar mantém uma identidade escura/premium e aplica as cores do time favorito como accents visuais em botões, bordas, badges, cards do painel, seção “Seu Radar” e destaques ativos. O mapa de cores das franquias fica em [`src/theme/nbaTeamThemes.ts`](src/theme/nbaTeamThemes.ts), e a documentação dedicada está em [`docs/team-themes.md`](docs/team-themes.md).

## Páginas institucionais

O projeto possui páginas de:

- Sobre;
- Política de Privacidade;
- Termos de Uso;
- Contato.

Essas páginas ajudam a preparar o projeto para uso público, deploy, autenticação de usuários e futura monetização.

## Roadmap

- Melhorar painel do usuário;
- Criar notificações para jogos do time favorito;
- Expandir app mobile;
- Melhorar dados de draft;
- Criar preferências avançadas de usuário;
- Melhorar tema por franquia;
- Adicionar favoritos de jogadores;
- Adicionar alertas de jogos ao vivo.

## Aviso

Este projeto é independente, criado para fins de estudo e portfólio. NBA Radar não possui afiliação oficial com a NBA, ESPN, times ou ligas mencionadas. Marcas, nomes e dados pertencem aos seus respectivos proprietários.

## Autor

Nathan Moura Vieira

- GitHub: _adicione seu link_
- LinkedIn: _adicione seu link_
