# Studio Áurea Estética

Página única para um estúdio de estética, com cada seção ocupando uma tela: topo com
foto e preço de entrada, vitrine de tratamentos, quiz que sugere o tratamento e monta a mensagem do WhatsApp, espaço, depoimentos com números, galeria,
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
- `treatments.items`: nome, duração, preço, descrição, indicação e foto de cada tratamento.
- `quiz.concerns`: cada queixa aponta para o tratamento que o quiz vai sugerir.
- `results`: números e depoimentos. Só use dados e depoimentos reais, com autorização da cliente.
- `url`: domínio final (usado em metadados e dados estruturados).
- `demo`: enquanto for `true`, a página pede para não ser indexada pelo Google e
  o rodapé avisa que é um projeto demonstrativo. Troque para `false` ao publicar
  para o cliente.

Cores ficam como variáveis no topo de `src/app/globals.css`.

## Fotos

Todas as fotos de `src/assets/images` vêm do Unsplash (licença Unsplash: uso
comercial livre, sem atribuição obrigatória). Nenhuma mostra rosto identificável
nem equipe: são texturas, produtos, sala e mãos em procedimento, para servir de
demonstração até o cliente mandar as fotos dele. Para trocar, substitua o arquivo
mantendo o nome, ou aponte outro arquivo em `src/content/site.ts`.

| Arquivo | Origem |
|---|---|
| hero-serum | images.unsplash.com/photo-1747303969063-3b90bcb3942e |
| limpeza | images.unsplash.com/photo-1761718209708-9ab9ba1c7252 |
| peeling | images.unsplash.com/photo-1761718210055-e83ca7e2c9ad |
| microagulhamento | images.unsplash.com/photo-1761718209852-54ca4210183e |
| drenagem | images.unsplash.com/photo-1712638932314-e2b185ca0930 |
| quiz-conta-gotas | images.unsplash.com/photo-1573461160327-b450ce3d8e7f |
| studio-sala | images.unsplash.com/photo-1731597076108-f3bbe268162f |
| studio-toalhas | images.unsplash.com/photo-1706795033917-dee116e7cba2 |
| studio-produtos | images.unsplash.com/photo-1773565744218-d8d11de58362 |
| resultados-maos | images.unsplash.com/photo-1757689314932-bec6e9c39e51 |
| insta-serum | images.unsplash.com/photo-1748543668687-624e058c367c |
| insta-creme | images.unsplash.com/photo-1585945037805-5fd82c2e60b1 |
| insta-toalhas | images.unsplash.com/photo-1787168295699-03aed18d17d4 |
| insta-frasco | images.unsplash.com/photo-1707539160277-e39464517645 |
| insta-texturas | images.unsplash.com/photo-1629732047356-30c7e14e712b |
| insta-chantilly | images.unsplash.com/photo-1659007747376-3811b34e458f |
| cta-pele | images.unsplash.com/photo-1643684391140-c5056cfd3436 |
