# Nácar Odontologia — design do demo

Data: 10/10/2026. Aprovado em conversa por Mateus (direção "Esmalte", partes 1 e 2).

## Objetivo

Sexto site demonstrativo do `sites_base`, para prospectar clínicas odontológicas. O critério de sucesso é um só: o dono da clínica abre o link, **no desktop ou no celular**, e nos primeiros 5 segundos pensa "quero isso". Os demos atuais do nicho (Clínica Pulso, Studio Áurea) são corretos, mas estáticos; este precisa impressionar por movimento e direção de arte.

## Decisões já tomadas

- Direção de arte **Esmalte**: um objeto protagonista (lente de porcelana) sobre fundo escuro, que abre o site em claro.
- O efeito precisa existir no celular. Nenhum momento é "desligado" no mobile; no máximo muda de gesto.
- Hero com a lente em **3D em tempo real**. A versão em sequência de frames (clipe do Veo) é a alternativa caso o 3D não convença ou não segure desempenho no celular de teste.
- Mídia de rosto, sorriso, ambiente e clipes: gerada por Mateus (Veo e GPT Image 2) a partir de `sites/nacar-odontologia/MIDIA.md`. O site é construído com marcadores até a mídia chegar.
- Vídeos de divulgação com Remotion ficam fora deste projeto.

## Identidade

- **Nome:** Nácar Odontologia (nácar = madrepérola). Cidade do demo: Uberlândia, como nos outros. Antes de publicar, conferir que não há clínica homônima na cidade.
- **Paleta:** tinta `#0B1020`, pérola `#F4F1EC`, azul-gelo `#C9DDE8` como única cor de apoio. Tons auxiliares derivados (tinta clara para superfícies, pérola escura para divisórias, texto secundário). Sem azul hospitalar, sem dourado.
- **Acento:** brilho iridescente de madrepérola, usado só no objeto do hero e no hover/foco do botão principal.
- **Tipografia:** grotesca apertada para títulos e texto (Host Grotesk; se indisponível no `next/font`, Instrument Sans) e serifada itálica só em palavras-chave (Instrument Serif).
- **Tom do texto:** direto e calmo, em português do Brasil. Sem "sorriso dos sonhos", sem superlativos.

## Regras de conteúdo

- **Sem preços e sem "gratuito"** em lugar nenhum: a publicidade odontológica é regulada pelo CFO e um demo com preço pareceria amador para o dentista. Os tratamentos mostram número de consultas e duração.
- Equipe, CRO e depoimentos são fictícios. Imagens são ilustrativas, geradas por IA. Antes e depois com paciente real tem regra própria do CFO. Tudo isso vai no README e no aviso do rodapé.
- `demo: true` mantém `noindex` e o aviso de projeto demonstrativo.
- WhatsApp aponta para o Estúdio Conceito, com o mesmo número e o mesmo padrão de mensagem dos outros demos.

## A página

Página única. Ordem e comportamento:

| # | Seção | Fundo | Desktop | Celular |
|---|---|---|---|---|
| 1 | Hero | tinta | Seção fixa (~250vh). A lente gira e cresce com o scroll; título revelado por linhas; CTA e três selos de confiança. A lente reage ao ponteiro. | Mesmo efeito, com DPR e material mais leves. Sem ponteiro: flutuação lenta. |
| 2 | Virada | tinta → pérola | No fim do hero a lente cobre a tela, clareia, e o fundo da página passa a pérola. | Igual. |
| 3 | Manifesto | pérola | Parágrafo grande cujas palavras acendem com o scroll; três números. | Igual. |
| 4 | Tratamentos | pérola | Seção fixa: lista numerada 01–05 à esquerda, moldura de mídia à direita trocando por máscara, contador `02 / 05`. | Mídia fixa no topo, itens rolando por baixo e trocando a mídia. |
| 5 | Antes e depois | pérola | Cortina arrastável sobre o par de imagens; três casos. | Arrasta com o dedo. |
| 6 | Planejamento digital | tinta | Volta ao escuro. Arcada em SVG que se desenha com o scroll, rótulos técnicos, clipe opcional ao fundo. | Igual. |
| 7 | Espaço | tinta | Galeria horizontal fixa com parallax. | Carrossel com encaixe (scroll-snap). |
| 8 | Equipe | pérola | Retratos P&B, nome, especialidade, CRO. | Empilhado. |
| 9 | Depoimentos | pérola | Citação grande, nota do Google. | Igual. |
| 10 | Agendar | tinta | Gancho do demo: objetivo (alinhar, clarear, repor, lentes) + período montam a mensagem do WhatsApp. Mapa, endereço, horários. | Igual, empilhado. |
| — | Cabeçalho e rodapé | — | Cabeçalho fixo que troca de cor conforme o fundo; rodapé com o nome gigante. Barra de agendar fixa no celular. | — |

Cinco tratamentos: lentes de contato dental, implantes, alinhadores invisíveis, clareamento, check-up digital.

## Arquitetura

Projeto novo e independente em `sites/nacar-odontologia`, no padrão do repositório: Next.js 16.3.6 (App Router, página estática), React 19.3.0, TypeScript, CSS Modules, pnpm, com ESLint e Playwright como na Cultura das Ruas. Nada é compartilhado com os outros sites.

**Dependências novas**

| Pacote | Uso |
|---|---|
| `gsap`, `@gsap/react` | ScrollTrigger, SplitText, DrawSVG, timelines |
| `lenis` | Scroll suave no desktop; no toque fica o scroll nativo |
| `three`, `@react-three/fiber`, `@react-three/drei` | Só o objeto do hero, em chunk carregado depois da primeira pintura |

Ficam de fora: `motion`, pós-processamento, theatre.js, `@remotion/player`, ScrollSmoother.

**Unidades e fronteiras**

| Unidade | Responsabilidade | Depende de |
|---|---|---|
| `src/content/site.ts` | Todo o texto, dados e referências de mídia. Nenhum componente tem texto de negócio. | — |
| `src/motion/` | Registro do GSAP, provedor de scroll suave, revelação de texto, detecção de movimento reduzido. | gsap, lenis |
| `src/components/hero/HeroObject` | Contrato do objeto do hero: recebe o progresso do scroll (0 a 1) e desenha. Escolhe a implementação e cuida de carregamento tardio e fallback. | — |
| `src/components/hero/LensScene` | Implementação 3D: geometria procedural da lente, material físico iridescente, luzes sem HDRI externo. | three, R3F, drei |
| `MediaSlot` | Mostra o vídeo ou a imagem definidos em `site.ts`; se o arquivo ainda não existe, mostra um marcador com o nome esperado. | — |
| Seções | Uma por arquivo, com seu CSS Module. | motion, content |

A implementação em sequência de frames (`ScrollSequence`) só é escrita se a validação do 3D falhar; o contrato do `HeroObject` existe para que essa troca não mexa no restante do hero.

**Princípio de movimento:** o conteúdo é visível e legível por padrão no HTML. A animação é aplicada por cima quando o JavaScript sobe. Se algo falhar, ou se o sistema pedir movimento reduzido, a página fica estática e completa: nada depende de animação para aparecer.

## Desempenho

- O elemento de LCP é o título do hero (texto no HTML), nunca o canvas.
- JS inicial sem o 3D: até ~200 KB gz. Chunk 3D: até ~300 KB gz, importado dinamicamente no cliente.
- Um único canvas. Renderiza só com o hero na tela e a aba visível.
- DPR limitado (até 1,75 no desktop, 1,5 no celular) e degradação automática: se a taxa de quadros cair, baixa o DPR e troca para material sem transmissão.
- Sem WebGL, com movimento reduzido ou com falha de carregamento: imagem estática da lente (capturada da própria cena).
- Vídeos: H.264, sem áudio, até ~1,5 MB por clipe de tratamento, com poster; carregam ao entrar em cena e pausam fora da tela.

## Verificação

- `pnpm typecheck`, `pnpm lint`, `pnpm build`.
- Playwright em 1440, 1366×768, 390 e 320 px: sem overflow horizontal; links do WhatsApp com a mensagem certa; montagem da mensagem no agendamento; cortina do antes e depois por teclado; menu móvel e foco; com movimento reduzido todo o conteúdo está visível; com movimento normal o canvas do hero existe e a cor de fundo muda após a virada.
- Conferência visual por capturas no navegador a cada etapa.
- Validação no celular do Mateus por link de preview da Vercel.

## Publicação

Branch `feat/nacar-odontologia`. Projeto Vercel `nacar-odontologia` com Root Directory `sites/nacar-odontologia`, ligado ao repositório; o preview da branch serve para validar no celular. Depois de aprovado: merge na `main`, domínio `nacar.estudioconceito.com` (o CNAME na Hostinger fica com o Mateus) e entrada na tabela do README raiz.

## Ordem de construção

1. Base do projeto, movimento, cabeçalho, hero com a lente 3D, virada e manifesto. **Preview e validação no desktop e no celular.**
2. Demais seções, com marcadores de mídia.
3. Entrada da mídia gerada, com recorte e compressão (ffmpeg em `E:\Tools\ffmpeg\bin`).
4. Testes, acabamento, README e publicação.

## Fora do escopo

Demo de estética ("Luz rasante"), refazer a Clínica Pulso, vídeos com Remotion, página do case em estudioconceito.com, CMS, formulários com backend.

## Riscos

| Risco | Resposta |
|---|---|
| 3D pesado em Android intermediário | Degradação automática; se não bastar, sequência de frames gerada a partir da própria cena ou do clipe do Veo |
| Mídia gerada com artefatos (dentes, texto) | Critérios de conferência no `MIDIA.md`; marcadores permitem publicar o preview sem ela |
| Fonte indisponível no `next/font` | Alternativa definida (Instrument Sans) |
