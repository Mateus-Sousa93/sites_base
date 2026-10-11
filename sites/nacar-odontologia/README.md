# Nácar Odontologia

Página única de uma clínica odontológica de estética e reabilitação oral. Cada
seção ocupa uma tela no desktop: abertura com fotografia de tela cheia, como
trabalhamos, tratamentos em lista interativa (o item aberto troca a foto ao
lado), antes e depois com cortina arrastável, as quatro etapas do planejamento,
galeria da clínica, equipe, depoimentos e agendamento (objetivo e período viram
a mensagem do WhatsApp), com endereço, horários e mapa.

Next.js 16 (App Router, página estática), CSS Modules, fontes Instrument Serif e
Host Grotesk via `next/font`. Movimento com GSAP (texto do manifesto) e Lenis
(scroll suave no desktop); as entradas de bloco são CSS, ligadas pelo componente
`Reveal`.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm test          # Playwright; rode `pnpm build` antes
```

Os testes sobem o build em `localhost:3210` e rodam em cinco perfis: desktop com
movimento, e desktop, notebook, celular e celular pequeno com movimento reduzido.
`SITE_URL=https://... pnpm test` roda contra um endereço publicado.

## Adaptar para um cliente real

Todo o texto e as referências de foto ficam em `src/content/site.ts`:
tratamentos, etapas, equipe com CRO, depoimentos, opções do agendamento,
endereço e horários. Nenhum componente tem texto de negócio no JSX.

- **Sem preço e sem "gratuito"** em nenhum texto: a publicidade odontológica é
  regulada pelo CFO. Os tratamentos mostram número de consultas e duração.
- Equipe, registros no CRO e depoimentos atuais são fictícios. Publicar dados de
  profissionais e de pacientes exige os dados reais e a autorização deles.
- A equipe aparece com medalhão de iniciais: o site não usa rosto de banco de
  imagem como se fosse o dentista. Com retratos reais, o cartão ganha a foto.
- `demo: true` pede para não indexar e mostra o aviso no rodapé.

## Layout

No desktop cada seção usa a classe `screen` (`src/app/globals.css`): altura
mínima de uma janela, conteúdo centrado abaixo do cabeçalho. Tamanhos de texto e
de imagem dentro dela usam `min(vw, vh)` para caber em telas baixas. Abaixo de
900 px de largura ou de 600 px de altura as seções voltam ao fluxo normal.

O conteúdo é visível por padrão: sem JavaScript, ou com movimento reduzido no
sistema, a página fica estática e completa.

## Fotos

Fotos do Unsplash, com licença de uso comercial. Os originais ficam em
`midia-bruta/` (fora do git) e `python scripts/imagens.py` gera as versões de
`src/assets/images/`. As pessoas das fotos são modelos, não pacientes nem equipe.

O "antes" da cortina é uma **simulação**: o script amarela os dentes da própria
foto do "depois", para os dois lados terem exatamente o mesmo enquadramento. A
página avisa que a comparação é ilustrativa. Antes e depois com paciente real
segue as regras do CFO.

| Arquivo | Origem |
|---|---|
| hero-sorriso | images.unsplash.com/photo-1512503680075-3d32d864212a |
| manifesto-retrato | images.unsplash.com/photo-1562337404-3044c84ac061 |
| trat-lentes | images.unsplash.com/photo-1489278353717-f64c6ee8a4d2 |
| trat-implantes | images.unsplash.com/photo-1766338390573-ec092d69cdcb |
| trat-alinhadores | images.unsplash.com/photo-1777793636393-a0fec488f3fb |
| trat-clareamento | images.unsplash.com/photo-1758600588701-3aa5bb5d4e18 |
| trat-checkup | images.unsplash.com/photo-1591283261401-c76eba2d369a |
| caso-depois, caso-antes | images.unsplash.com/photo-1675526607070-f5cbd71dde92 |
| processo-consultorio, espaco-consultorio | images.unsplash.com/photo-1704455306251-b4634215d98f |
| espaco-recepcao | images.unsplash.com/photo-1784012980517-005c26585344 |
| espaco-lounge | images.unsplash.com/photo-1783667440357-bf89d00c2077 |
| espaco-espera | images.unsplash.com/photo-1762341116682-cef250137a24 |
| equipe-consulta | images.unsplash.com/photo-1777331903190-341a3dd0441b |

## Publicação

Projeto Vercel `nacar-odontologia`, Root Directory `sites/nacar-odontologia`.

- Hospedagem: https://nacar-odontologia-lyart.vercel.app
- Domínio cadastrado: https://nacar.estudioconceito.com. Falta o CNAME `nacar` →
  `3970b1c1857d456c.vercel-dns-017.com.` na Hostinger.
