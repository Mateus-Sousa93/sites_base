# Nácar Odontologia — mídia a gerar

Tudo o que o site precisa de vídeo e imagem, com o prompt pronto de cada arquivo.

## Como entregar

1. Gere cada item com o prompt indicado.
2. Salve em `sites/nacar-odontologia/midia-bruta/` com **exatamente o nome da tabela** (a pasta fica fora do git).
3. Avise no chat quais arquivos chegaram. Eu recorto, comprimo e encaixo no site.

Não precisa esperar tudo: pode mandar em lotes. A ordem das seções abaixo já é a ordem de prioridade.

## Antes de mandar, confira

- Nenhum texto, logo ou marca-d'água na imagem.
- Dentes com anatomia plausível (quantidade, formato, sem dentes "derretidos").
- Fundo escuro realmente escuro nos clipes; o site é tinta `#0B1020` e o clipe precisa se fundir a ele.
- Nos clipes: sem cortes, movimento lento e contínuo, objeto no centro do quadro.

Se um resultado sair quase bom, mande mesmo assim com uma observação. Eu digo se dá para aproveitar.

---

## 1. Clipes dos tratamentos (Veo)

Configuração de todos: **16:9, 8 segundos, a maior resolução disponível, sem áudio** (se o Veo gerar som, eu removo). O objeto fica no terço central do quadro porque o site recorta para vertical no desktop e para horizontal no celular.

| Arquivo | Seção |
|---|---|
| `lente.mp4` | Tratamentos · 01 Lentes de contato |
| `implante.mp4` | Tratamentos · 02 Implantes |
| `alinhador.mp4` | Tratamentos · 03 Alinhadores |
| `clareamento.mp4` | Tratamentos · 04 Clareamento |
| `checkup.mp4` | Tratamentos · 05 Check-up digital |

### `lente.mp4`

```text
Extreme macro product shot. A single ultra-thin porcelain dental veneer — a translucent, gently curved white ceramic shell shaped like a small fingernail, about one centimeter tall — held delicately at its lower edge by fine stainless-steel tweezers entering from the bottom right corner. The veneer rotates very slowly and continuously around its vertical axis. Light passes through the translucent ceramic, revealing a faint mother-of-pearl iridescence along its edges.

Background: seamless deep ink navy-black (#0B1020), no horizon, no surface visible. Lighting: soft cool key light from the upper left, a thin pearlescent rim light from behind. 100mm macro lens look, shallow depth of field, ultra clean, calm and premium. Locked-off camera, no cuts, no zoom. Subject centered in the middle third of the frame.

No text, no logos, no watermark, no hands, no face.
```

### `implante.mp4`

```text
Extreme macro product shot. A single titanium dental implant — a small tapered threaded screw with a hexagonal connection on top, satin grey metal — floating upright just above a dark glossy reflective surface, rotating slowly and continuously around its vertical axis. A soft bar of light sweeps once across the threads, making each ridge catch a highlight in sequence. A faint reflection of the implant is visible on the surface below.

Background: seamless deep ink navy-black (#0B1020). Lighting: soft cool key light from the upper left, thin pearlescent rim light. 100mm macro lens look, shallow depth of field, ultra clean, calm and premium. Locked-off camera, no cuts, no zoom. Subject centered in the middle third of the frame.

No text, no logos, no engraving on the metal, no watermark, no hands.
```

### `alinhador.mp4`

```text
Macro product shot. A transparent clear orthodontic aligner tray — thin crystal-clear plastic molded in the shape of an upper dental arch, empty, with no teeth inside — suspended in mid-air and turning slowly around its vertical axis. A few tiny water droplets cling to its surface. Crisp refractions and small caustic highlights travel across the plastic as it turns.

Background: seamless deep ink navy-black (#0B1020), no surface visible. Lighting: soft cool key light from the upper left, thin pearlescent rim light outlining the transparent edges. 100mm macro lens look, shallow depth of field, ultra clean, calm and premium. Locked-off camera, no cuts, no zoom. Subject centered in the middle third of the frame.

No text, no logos, no brand markings, no watermark, no hands.
```

### `clareamento.mp4`

```text
Extreme close-up of a woman's natural, healthy smile. Frame only from just below the nose to the chin — lips and teeth, no eyes visible. Light olive skin with real texture, bare lips without lipstick. She holds a relaxed, gentle smile with tiny natural micro-movements. A soft cool light slowly brightens across her teeth from left to right, as if the smile were lighting up.

Teeth are a natural bright white, not artificial, with slight translucency at the edges and correct anatomy: individual teeth, realistic proportions, healthy pink gums.

Background: out-of-focus deep ink navy-black (#0B1020). 100mm macro lens look, shallow depth of field, slow motion, calm and premium. Locked-off camera, no cuts, no zoom. Mouth centered in the frame.

No text, no logos, no watermark, no dental instruments.
```

### `checkup.mp4`

```text
Macro shot. The tip of a modern handheld intraoral 3D scanner — a slim white and graphite wand — glides slowly from left to right over a white dental arch model resting on a dark matte surface. The scanner tip projects a soft blue-white structured light pattern onto the teeth of the model as it passes.

Background: deep ink navy-black (#0B1020), softly out of focus. Lighting: low-key, cool, with a thin pearlescent rim light on the scanner. 100mm macro lens look, shallow depth of field, ultra clean, calm and premium. Locked-off camera, no cuts, no zoom. Action centered in the middle third of the frame.

No text, no logos, no brand markings, no screens, no watermark, no face.
```

---

## 2. Clipe do planejamento digital (Veo)

Mesma configuração: 16:9, 8 segundos, sem áudio. Aqui o fundo é **preto puro**, porque o site funde o clipe por cima do fundo tinta.

| Arquivo | Seção |
|---|---|
| `planejamento.mp4` | Planejamento digital |

```text
A holographic 3D scan of a full human upper dental arch (U-shaped row of teeth), rendered as a fine glowing point cloud and thin wireframe mesh in pale ice-blue (#C9DDE8) on a pure black background (#000000). The arch rotates slowly and continuously around its vertical axis at constant speed. A thin horizontal scan line sweeps from top to bottom once, leaving the mesh slightly brighter where it has passed.

Clean technical visualization, elegant and minimal. Locked-off camera, no cuts, no zoom. The arch stays centered and fully inside the frame with wide margins on all sides.

No interface, no text, no numbers, no labels, no grid floor, no logos, no watermark.
```

---

## 3. Antes e depois (GPT Image 2)

Três casos, cada um com duas imagens que precisam ter **o mesmo enquadramento**. O jeito de garantir isso: gere primeiro o "depois" e, **na mesma conversa**, peça a edição para o "antes".

Formato: **paisagem 3:2 (1536×1024)**.

| Arquivos | Caso |
|---|---|
| `caso-1-depois.png`, `caso-1-antes.png` | Lentes de contato |
| `caso-2-depois.png`, `caso-2-antes.png` | Alinhadores |
| `caso-3-depois.png`, `caso-3-antes.png` | Implante |

### Caso 1 — `caso-1-depois.png`

```text
Photorealistic macro dental photograph. A Brazilian woman in her early 30s smiling naturally, framed tightly from the tip of the nose to the chin, no eyes visible, front view, mouth centered. Perfectly aligned, natural-looking porcelain veneers: bright natural white, subtle translucency at the incisal edges, realistic individual tooth anatomy, healthy pink gums. Light olive skin with natural texture, bare lips without lipstick.

Soft even studio light with a gentle cool tone. Out-of-focus deep ink navy-black background (#0B1020). Shot on a 100mm macro lens at f/8, sharp focus on the teeth.

No text, no logos, no watermark, no dental instruments.
```

### Caso 1 — `caso-1-antes.png` (edição da imagem anterior)

```text
Edit this exact photo. Keep the framing, face, lips, skin, lighting and background identical. Change only the teeth to a "before treatment" state: slightly yellowed, mildly uneven lengths, a small gap between the two upper front teeth and a tiny chip on one incisal edge. Realistic and not exaggerated, gums still healthy.
```

### Caso 2 — `caso-2-depois.png`

```text
Photorealistic macro dental photograph. A Brazilian man in his late 20s with short dark stubble smiling naturally, framed tightly from the tip of the nose to the chin, no eyes visible, front view, mouth centered. Well-aligned natural teeth after orthodontic treatment: natural white (not veneers), realistic individual tooth anatomy, healthy pink gums. Medium brown skin with natural texture.

Soft even studio light with a gentle cool tone. Out-of-focus deep ink navy-black background (#0B1020). Shot on a 100mm macro lens at f/8, sharp focus on the teeth.

No text, no logos, no watermark, no dental instruments.
```

### Caso 2 — `caso-2-antes.png` (edição da imagem anterior)

```text
Edit this exact photo. Keep the framing, face, stubble, lips, skin, lighting and background identical. Change only the teeth to a "before orthodontic treatment" state: mild crowding, one upper lateral incisor rotated and slightly overlapping its neighbor, one canine sitting a little higher than the others. Same tooth color. Realistic and not exaggerated, gums still healthy.
```

### Caso 3 — `caso-3-depois.png`

```text
Photorealistic macro dental photograph. A Brazilian woman in her late 50s smiling warmly, framed tightly from the tip of the nose to the chin, no eyes visible, front view, mouth centered. A complete, natural smile appropriate for her age: natural off-white teeth, realistic individual tooth anatomy, healthy gums. Fair skin with natural texture and fine lines around the mouth, soft neutral lip color.

Soft even studio light with a gentle cool tone. Out-of-focus deep ink navy-black background (#0B1020). Shot on a 100mm macro lens at f/8, sharp focus on the teeth.

No text, no logos, no watermark, no dental instruments.
```

### Caso 3 — `caso-3-antes.png` (edição da imagem anterior)

```text
Edit this exact photo. Keep the framing, face, lips, skin, lighting and background identical. Change only the teeth to a "before treatment" state: one upper premolar missing on the left side of the smile, leaving a visible gap, and slightly worn edges on the front teeth. Realistic and not exaggerated, gums still healthy.
```

---

## 4. Ambientes da clínica (GPT Image 2)

Formato: **paisagem 3:2 (1536×1024)**. Sem pessoas.

| Arquivo | Ambiente |
|---|---|
| `espaco-recepcao.png` | Recepção |
| `espaco-consultorio.png` | Consultório |
| `espaco-tecnologia.png` | Laboratório digital |
| `espaco-lounge.png` | Detalhe do lounge |

### `espaco-recepcao.png`

```text
Editorial architectural interior photograph of the reception of a boutique dental clinic in Brazil. Warm pearl-white microcement walls, a curved reception desk in honed travertine, one deep ink-navy upholstered armchair, brushed nickel details, a large window with sheer curtains and soft morning daylight, a single sculptural ceramic vase with dried branches. Calm, minimal and luxurious, like a boutique hotel lobby.

Shot on a 24mm tilt-shift lens at eye level, straight verticals, natural light, soft shadows.

No people, no signage, no text, no logos, no watermark.
```

### `espaco-consultorio.png`

```text
Editorial architectural interior photograph of a treatment room in a boutique dental clinic in Brazil. A modern dental chair upholstered in deep ink-navy leather at the center, pearl-white microcement walls, pale oak cabinetry with no handles, an overhead dental lamp switched off, a wall-mounted monitor with a black blank screen, a large window with sheer curtains and soft daylight. Spotless, calm and luxurious.

Shot on a 24mm tilt-shift lens at eye level, straight verticals, natural light, soft shadows.

No people, no signage, no text, no logos, no watermark.
```

### `espaco-tecnologia.png`

```text
Editorial interior photograph of the digital lab corner of a boutique dental clinic in Brazil. On a pale oak counter: an intraoral scanner resting on its stand and a compact white dental 3D printer, next to a monitor with a black blank screen. Pearl-white microcement wall with one deep ink-navy panel, soft focused task lighting from above, a small white dental arch model as the only decorative object. Precise, clean and premium.

Shot on a 35mm lens at eye level, straight verticals, soft shadows.

No people, no brand markings, no text, no logos, no watermark.
```

### `espaco-lounge.png`

```text
Editorial interior detail photograph in a boutique dental clinic in Brazil. A low honed-travertine side table with a small ceramic cup of coffee and a folded linen napkin, beside the arm of a deep ink-navy upholstered armchair. Soft daylight rakes across a pearl-white microcement wall, casting the gentle shadow of leaves. Quiet, warm and luxurious.

Shot on a 50mm lens, shallow depth of field, natural light.

No people, no text, no logos, no watermark.
```

---

## 5. Retratos da equipe (GPT Image 2)

Formato: **retrato 2:3 (1024×1536)**, em preto e branco.

| Arquivo | Pessoa |
|---|---|
| `equipe-1.png` | Dentista, mulher |
| `equipe-2.png` | Dentista, homem |

### `equipe-1.png`

```text
Black-and-white editorial portrait of a Brazilian female dentist in her late 30s. Shoulder-length dark hair, calm and confident half-smile, wearing a dark tailored scrub top, three-quarter view, looking at the camera, arms relaxed. Plain dark charcoal seamless backdrop. Soft Rembrandt lighting from the left, fine film grain, natural skin texture with no plastic retouching.

Waist-up framing, head in the upper third, generous empty space around the figure.

No text, no name tag, no embroidery, no logos, no watermark.
```

### `equipe-2.png`

```text
Black-and-white editorial portrait of a Brazilian male dentist in his mid 40s. Short greying hair, light stubble, calm and approachable expression, wearing a dark tailored scrub top, three-quarter view, looking at the camera, arms loosely crossed. Plain dark charcoal seamless backdrop. Soft Rembrandt lighting from the left, fine film grain, natural skin texture with no plastic retouching.

Waist-up framing, head in the upper third, generous empty space around the figure.

No text, no name tag, no embroidery, no logos, no watermark.
```

---

## 6. Opcional: lente girando (Veo)

Só se quisermos comparar com a lente em 3D do hero. 16:9, 8 segundos, sem áudio.

| Arquivo | Uso |
|---|---|
| `lente-turntable.mp4` | Alternativa ao objeto 3D do hero |

```text
A single ultra-thin porcelain dental veneer — a translucent, gently curved white ceramic shell shaped like a small fingernail — levitating at the exact center of the frame against a pure black background (#000000). It completes one slow, smooth 360-degree rotation around its vertical axis at perfectly constant speed. Lighting stays constant: soft cool key light from the upper left and a thin pearlescent rim light, with faint mother-of-pearl iridescence on the edges.

Locked-off camera, no cuts, no zoom, no camera movement. The veneer stays the same size throughout, with wide margins on all sides.

No hands, no tools, no surface, no text, no logos, no watermark.
```
