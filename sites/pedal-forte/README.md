# Pedal Forte

Página única de uma loja de bikes, elétricas, equipamentos e oficina. Cada seção
ocupa uma tela no desktop: topo com vídeo de trilha, categorias em acordeão,
destaque das elétricas, mais vendidos com filtro e compra pelo WhatsApp, faixa de
vídeo em primeira pessoa, oficina com tabela de preços, pedal de sábado com
depoimentos e loja com mapa.

Next.js 16 (App Router, página estática), CSS Modules, fontes Big Shoulders e
Archivo via `next/font`. Sem dependências além de Next e React.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
```

## Adaptar para um cliente real

Todo o conteúdo fica em `src/content/site.ts`: WhatsApp, endereço, horários,
categorias, produtos (preço, foto, filtro), serviços da oficina, pedal de sábado
e depoimentos. Desconto do PIX e número de parcelas também ficam lá.
`demo: true` pede para não indexar e mostra o aviso de projeto demonstrativo.

## Mídias

Fotos do Unsplash (licença Unsplash) e vídeos do Pexels (licença Pexels), ambos
com uso comercial livre. Os vídeos ficam em `public/videos`, com um quadro
parado como pôster para carregar rápido e para quem prefere menos movimento.

| Arquivo | Origem |
|---|---|
| videos/hero-trilha.mp4 | pexels.com/video/6537653 |
| videos/descida-pov.mp4 | pexels.com/video/11212807 |
| cat-mtb | images.unsplash.com/photo-1604850613811-b50ad1aeeecd |
| cat-estrada | images.unsplash.com/photo-1499871435582-a1d4ff236842 |
| cat-eletricas | images.unsplash.com/photo-1563990308267-cd6d3cc09318 |
| cat-urbanas | images.unsplash.com/photo-1571333250630-f0230c320b6d |
| cat-equipamentos | images.unsplash.com/photo-1605272047649-7f7619477fd4 |
| ebike-destaque | images.unsplash.com/photo-1624243519828-52a0f2c88af3 |
| prod-speed | images.unsplash.com/photo-1789145349184-bb9032f6caa9 |
| prod-mtb | images.unsplash.com/photo-1673121414328-52eff37bc6d0 |
| prod-ebike | images.unsplash.com/photo-1601391721091-4646369e0bb5 |
| prod-urbana | images.unsplash.com/photo-1559348349-86f1f65817fe |
| prod-capacete | images.unsplash.com/photo-1611485100985-cb332cd79671 |
| prod-luva | images.unsplash.com/photo-1653564244747-5851fce3667a |
| oficina | images.unsplash.com/photo-1678094583761-acfed21a8ad7 |
| oficina-detalhe | images.unsplash.com/photo-1675798227643-da319f8ee8f7 |
| comunidade | images.unsplash.com/photo-1735216228027-fe31c23474ce |
| loja | images.unsplash.com/photo-1623982607170-333fb1b8e840 |
| cta-por-do-sol | images.unsplash.com/photo-1604748954134-457791b2ce9b |
