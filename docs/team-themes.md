# Temas por Time

O NBA Radar usa cores das franquias para personalizar a experiência do usuário logado com time favorito. A identidade principal permanece escura, premium e legível; as cores do time entram como accents em elementos estratégicos da interface.

## Como funciona

- O perfil do usuário armazena o `favorite_team_abbreviation`.
- O layout principal busca o perfil e aplica variáveis CSS com as cores do time.
- Se o perfil não carregar, se o usuário estiver deslogado ou se a abreviação for inválida, o tema padrão do NBA Radar é utilizado.
- As cores são usadas em botões principais, bordas, badges, cards importantes, glows sutis, links ativos e seções personalizadas.
- O fundo geral do site continua escuro para preservar contraste e consistência visual.

## Mapa de cores

O mapa de cores fica em:

```txt
/src/theme/nbaTeamThemes.ts
```

Ele exporta:

- `TeamTheme`: tipo base do tema;
- `NBA_TEAM_THEMES`: mapa por abreviação da franquia;
- `DEFAULT_THEME`: tema padrão NBA Radar;
- `getTeamTheme`: helper para buscar tema com fallback;
- `hexToRgb`: helper para criar variáveis RGB usadas em transparências e glows.

## Exemplos

- Lakers: roxo e dourado;
- Bulls: vermelho e preto;
- Celtics: verde e dourado;
- Warriors: azul e dourado.

## Princípio visual

As cores das franquias devem reforçar personalização sem destruir a identidade do produto. A regra é usar o tema como destaque, não como pintura completa da página.
