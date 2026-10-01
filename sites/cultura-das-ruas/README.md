# Cultura das Ruas

Quinto site demonstrativo do `sites_base`: loja de sneakers e streetwear criada para apresentar o trabalho do Estúdio Conceito. O catálogo, preços e sacola são demonstrativos. A ação final abre o WhatsApp da Conceito para conversar sobre um projeto real. Não há pagamento ou pedidos reais.

## Projeto

Next.js 16, React 19, TypeScript e CSS. Identidade editorial preta, osso e vermelho. Cinco capítulos de `100svh` menos o cabeçalho, com catálogo dimensionado pela altura disponível. Fotografias geradas e vídeos de lifestyle licenciados. Os vídeos têm controle de reprodução, carregam ao entrar em cena, pausam fora da tela e respeitam `prefers-reduced-motion`.

## Publicação

Projeto Vercel `cultura-das-ruas`, conectado à `main` de `Mateus-Sousa93/sites_base`, com **Root Directory** `sites/cultura-das-ruas`.

- Hospedagem: https://cultura-das-ruas-conceito.vercel.app
- Domínio cadastrado: https://ruas.estudioconceito.com
- Case: https://www.estudioconceito.com/portfolio/cultura-das-ruas
- DNS confirmado pela API Vercel em 30/09/2026: CNAME `ruas` → `3b2db374b46550a7.vercel-dns-017.com.`. A alteração na Hostinger fica com o proprietário. Até o apontamento, o case usa a URL pública da Vercel.
- Robots `noindex, nofollow`: projeto demonstrativo, sem pagamento, cadastro ou pedidos reais.

## Comandos

`pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test`.

Os testes Playwright usam a URL pública por padrão, em 1440, 390 e 320 pixels. `SITE_URL` permite definir outro endereço. Cobrem busca, filtros, validação de tamanho, inclusão e quantidade na sacola, menu, foco de teclado, imagens e overflow. Se necessário: `pnpm exec playwright install chromium`.

Também cobrem desktop 1366×768, altura exata dos cinco capítulos, visibilidade de todas as ações dos produtos, reprodução/pausa de ambos os vídeos e preferência por movimento reduzido.

## Vídeos

Arquivos locais, sem dependência de player externo, sem áudio automático. Uso conforme a [licença Pexels](https://www.pexels.com/license/), consultada em 30/09/2026.

| Arquivo | Autor e origem |
| --- | --- |
| `public/videos/skate-motion.mp4` e poster | Åke Wall — https://www.pexels.com/video/close-shot-of-a-person-riding-skateboard-4625096/ |
| `public/videos/street-culture.mp4` e poster | RDNE Stock project — https://www.pexels.com/video/stylish-men-in-urban-wear-8126713/ |

Os vídeos contextualizam a cultura urbana; as peças dos modelos não representam os produtos do catálogo nem endosso à marca.

## Recuperação e mídias

Código inicial recuperado das alterações registradas na conversa de 29/09; o ZIP daquela sessão remota não estava nas pastas locais. Foram acrescentados tratamento de foco no modal, bloqueio de rolagem, busca mobile, identificação de demonstração e testes.

As prévias desktop/mobile existentes no repositório Conceito orientaram a direção visual. Três imagens próprias foram criadas com a ferramenta integrada ImageGen e otimizadas em JPEG. Nenhuma imagem depende de endereço externo. As pessoas representam modelos de campanha, não clientes ou equipe reais.

Prompts finais utilizados:

- `public/images/hero.jpg`: a partir da prévia aprovada, reconstruir somente a fotografia de abertura: tênis robusto preto/cinza nos pés, calça preta larga, asfalto molhado, viaduto urbano ao entardecer, produto à direita e espaço para título à esquerda; remover textos, botões e interface.
- `public/images/products.jpg`: quatro painéis quadrados iguais em grade 2×2, fundo osso e iluminação de estúdio; sneaker preto/cinza, sneaker branco/cinza com detalhe vermelho, moletom preto e camiseta areia. Produtos completos e centralizados, sem logos, letras, textos ou pessoas.
- `public/images/editorial.jpg`: tríptico de campanha streetwear com modelos adultos em cenário urbano de concreto; moletom preto com vermelho, camiseta areia e gorro preto, camiseta preta/boné e quadra de basquete. Tons suaves de preto, areia e vermelho, sem marcas, textos ou interface.
