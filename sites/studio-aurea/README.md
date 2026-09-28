# Studio Áurea Estética

Página única para um estúdio de estética: tratamentos com preço e duração, ficha
de avaliação que monta a mensagem do WhatsApp, depoimentos, posts do Instagram,
endereço com mapa e chamada final.

Next.js 16 (App Router, página estática), CSS Modules, fontes Bodoni Moda e Karla
via `next/font`. Sem dependências além de Next e React.

## Comandos

```bash
pnpm install
pnpm dev          # desenvolvimento em http://localhost:3000
pnpm build        # build de produção
pnpm typecheck
```

## Adaptar para um cliente real

Todo o texto e os dados ficam em `src/content/site.ts`:

- `whatsapp.number`: número com DDI e DDD, só dígitos. O atual é de demonstração.
- `instagram`, `address`, `hours`: dados do estúdio. O mapa usa o endereço.
- `treatments.items`: nome, duração em minutos, preço e descrição.
- `testimonials.items`: só use depoimentos reais, com autorização da cliente.
- `url`: domínio final (usado em metadados e dados estruturados).
- `demo`: enquanto for `true`, a página pede para não ser indexada pelo Google e
  o rodapé avisa que é um projeto demonstrativo. Troque para `false` ao publicar
  para o cliente.

Cores ficam como variáveis no topo de `src/app/globals.css`.
