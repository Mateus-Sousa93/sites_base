# Almeida & Rocha Contabilidade

Página única de um escritório de contabilidade para pequenas e médias empresas.
Cada seção ocupa uma tela no desktop: topo com vídeo da cidade e números,
serviços em acordeão com foto, simulador de plano (regime, funcionários e BPO
viram a mensagem do WhatsApp), segmentos atendidos, troca de contador em quatro
semanas, depoimentos e chamada final com mapa.

Next.js 16 (App Router, página estática), CSS Modules, fonte Schibsted Grotesk
via `next/font`.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
```

## Adaptar para um cliente real

Todo o conteúdo fica em `src/content/site.ts`: serviços, preços base por regime,
valor por funcionário e do BPO, segmentos, etapas da troca, depoimentos, CRC,
endereço e horários. Preços, CRC e depoimentos atuais são fictícios.
`demo: true` pede para não indexar e mostra o aviso no rodapé.

## Mídias

Fotos do Unsplash e vídeos do Pexels, com licença de uso comercial.

| Arquivo | Origem |
|---|---|
| videos/hero-cidade.mp4 | pexels.com/video/14549980 |
| videos/mesa-calculo.mp4 | pexels.com/video/7821807 |
| srv-abertura | images.unsplash.com/photo-1450101499163-c8848c66ca85 |
| srv-contabil | images.unsplash.com/photo-1554224155-6726b3ff858f |
| srv-fiscal | images.unsplash.com/photo-1554224154-26032ffc0d07 |
| srv-folha | images.unsplash.com/photo-1626266061368-46a8f578ddd6 |
| srv-bpo | images.unsplash.com/photo-1628348068343-c6a848d2b6dd |
| seg-comercio | images.unsplash.com/photo-1598959652545-c0230cdbb01f |
| seg-ecommerce | images.unsplash.com/photo-1594392175511-30eca83d51c8 |
| seg-servicos | images.unsplash.com/photo-1554902843-260acd0993f8 |
| seg-industria | images.unsplash.com/photo-1594402918538-96636fcb6d8c |
| escritorio | images.unsplash.com/photo-1497366811353-6870744d04b2 |
| escritorio-mesa | images.unsplash.com/photo-1623177623442-979c1e42c255 |
| cta-assinatura | images.unsplash.com/photo-1627518788331-b3b7fdaa382f |
