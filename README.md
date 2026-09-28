# sites_base

Sites institucionais de demonstração, um por pasta em `sites/`. Cada pasta é um
projeto Next.js independente, com dependências e lockfile próprios, e é publicada
como um projeto separado na Vercel.

| Site | Pasta | Estado |
|---|---|---|
| Studio Áurea Estética | `sites/studio-aurea` | pronto |
| Clínica Pulso (clínica médica) | `sites/clinica-pulso` | pronto |
| Almeida & Rocha Contabilidade | — | mockup |
| Pedal Forte (bikes e elétricas) | `sites/pedal-forte` | pronto |

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

## Mídias

Cada seção ocupa uma tela inteira no desktop e sempre tem uma âncora visual forte.
As fotos e vídeos de demonstração vêm de bancos com licença comercial (Unsplash e
Pexels) e evitam rostos de "equipe" ou "clientes" falsos: mostram ambiente,
produto e ação. Cada site lista a origem das mídias no próprio README, e as fotos
reais do cliente entram depois sem mudar a estrutura.
