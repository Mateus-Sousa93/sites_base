# Clínica Pulso

Página única de uma clínica médica com seis especialidades. Cada seção ocupa uma
tela no desktop: topo com vídeo de ausculta e agenda interativa (especialidade,
médico e horário viram a mensagem do WhatsApp), especialidades com foto e valor,
exames no local com vídeo de eletrocardiograma, como funciona, corpo clínico,
avaliações e chamada final com mapa.

Next.js 16 (App Router, página estática), CSS Modules, fontes Newsreader e
Figtree via `next/font`.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
```

## Adaptar para um cliente real

Todo o conteúdo fica em `src/content/site.ts`: especialidades (valor, médico,
horários exibidos na agenda), exames, etapas, corpo clínico com CRM, avaliações,
endereço e horários. Médicos, CRMs e avaliações atuais são fictícios: publicar
dados de profissionais exige os dados reais e a autorização deles, e a
publicidade médica segue as regras do CFM. `demo: true` pede para não indexar e
mostra o aviso no rodapé.

## Mídias

Fotos do Unsplash e vídeos do Pexels, com licença de uso comercial. Nenhuma mídia
mostra médico ou paciente identificável.

| Arquivo | Origem |
|---|---|
| videos/hero-ausculta.mp4 | pexels.com/video/5453380 |
| videos/exame-ecg.mp4 | pexels.com/video/14939589 |
| esp-clinica-geral | images.unsplash.com/photo-1700832082200-af7deeb63d9b |
| esp-cardiologia | images.unsplash.com/photo-1618939304347-e91b1f33d2ab |
| esp-pediatria | images.unsplash.com/photo-1763294905874-504ea922bbc9 |
| esp-dermatologia | images.unsplash.com/photo-1700760934166-4c766d708139 |
| esp-ginecologia | images.unsplash.com/photo-1654931800911-7a9cfb3b7c17 |
| esp-ortopedia | images.unsplash.com/photo-1564725075388-cc8338732289 |
| exame-ultrassom | images.unsplash.com/photo-1691933880096-4046bc9e2fa0 |
| exame-laboratorio | images.unsplash.com/photo-1579154341184-22069e4614d2 |
| exame-pressao | images.unsplash.com/photo-1631815584191-0ed1723f0ead |
| clinica-espera | images.unsplash.com/photo-1629909614456-6b1c5c94cecc |
| clinica-recepcao | images.unsplash.com/photo-1764727291644-5dcb0b1a0375 |
| clinica-corredor | images.unsplash.com/photo-1519494026892-80bbd2d6fd0d |
| cta-estetoscopio | images.unsplash.com/photo-1505751172876-fa1923c5c528 |
