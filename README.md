# sites_base

Sites institucionais de demonstração, um por pasta em `sites/`. Cada pasta é um
projeto Next.js independente, com dependências e lockfile próprios, e é publicada
como um projeto separado na Vercel.

| Site | Pasta | Estado |
|---|---|---|
| Studio Áurea Estética | `sites/studio-aurea` | pronto |
| Dr. Marcos Vieira Cardiologia | — | mockup |
| Almeida & Rocha Contabilidade | — | mockup |
| Pedal Forte | — | mockup |

## Rodar um site localmente

```bash
cd sites/studio-aurea
pnpm install
pnpm dev
```

## Publicar na Vercel

1. Na Vercel: **Add New → Project** e importar este repositório do GitHub.
2. Em **Root Directory**, escolher a pasta do site (ex.: `sites/studio-aurea`).
   A Vercel detecta Next.js e pnpm sozinha; não há variáveis de ambiente.
3. Repetir para cada site: é um projeto Vercel por pasta, todos apontando para o
   mesmo repositório. Para que um push em um site não reconstrua os outros, use
   em cada projeto **Settings → Git → Ignored Build Step** com
   `git diff --quiet HEAD^ HEAD -- .`.

## Conteúdo sem fotos

Os sites não usam fotos de banco de imagem: cada empresa tem a própria equipe e o
próprio espaço, e foto genérica passa a impressão de falsa. O layout é resolvido
com tipografia, cor e elementos úteis, como a ficha de avaliação do Studio Áurea.
Fotos reais do cliente podem entrar depois, sem mudar a estrutura.
