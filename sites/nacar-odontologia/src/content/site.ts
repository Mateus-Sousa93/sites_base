// Todo o conteúdo do site fica aqui. Para adaptar a outra clínica, troque os
// dados e as fotos abaixo: nenhum componente tem texto de negócio escrito no JSX.
//
// Regra de conteúdo: nada de preço nem de gratuidade em nenhum texto. A
// publicidade odontológica é regulada pelo CFO.

import type { StaticImageData } from "next/image";

import casoAntes from "@/assets/images/caso-antes.jpg";
import casoDepois from "@/assets/images/caso-depois.jpg";
import depoimentosSorriso from "@/assets/images/depoimentos-sorriso.jpg";
import espacoConsultorio from "@/assets/images/espaco-consultorio.jpg";
import espacoEspera from "@/assets/images/espaco-espera.jpg";
import espacoLounge from "@/assets/images/espaco-lounge.jpg";
import espacoRecepcao from "@/assets/images/espaco-recepcao.jpg";
import heroConsulta from "@/assets/images/hero-consulta.jpg";
import heroSorriso from "@/assets/images/hero-sorriso.jpg";
import sorriso1 from "@/assets/images/sorriso-1.jpg";
import sorriso2 from "@/assets/images/sorriso-2.jpg";
import sorriso3 from "@/assets/images/sorriso-3.jpg";
import sorriso4 from "@/assets/images/sorriso-4.jpg";
import tratAlinhadores from "@/assets/images/trat-alinhadores.jpg";
import tratCheckup from "@/assets/images/trat-checkup.jpg";
import tratClareamento from "@/assets/images/trat-clareamento.jpg";
import tratImplantes from "@/assets/images/trat-implantes.jpg";
import tratLentes from "@/assets/images/trat-lentes.jpg";

export type Photo = { src: StaticImageData; alt: string };

export type OpeningHours = {
  days: string;
  hours: string;
  schema: { dayOfWeek: string[]; opens: string; closes: string };
};

export type Stat = { value: string; label: string };

export type Treatment = {
  id: string;
  name: string;
  summary: string;
  facts: string[];
  photo: Photo;
};

export type Choice = { id: string; label: string; phrase: string };

export const site = {
  name: "Nácar Odontologia",
  // Marca tipográfica do cabeçalho: nome curto e descritor.
  brand: { mark: "Nácar", descriptor: "Odontologia" },
  url: "https://nacar.estudioconceito.com",
  demo: true,

  seo: {
    title: "Nácar Odontologia | Lentes, implantes e alinhadores em Uberlândia",
    description:
      "Clínica odontológica em Uberlândia com lentes de contato dental, implantes, alinhadores invisíveis e clareamento. Planejamento digital: você vê o resultado antes de começar.",
  },

  whatsapp: {
    // Somente dígitos, com DDI e DDD.
    number: "5534992011427",
    display: "(34) 99201-1427",
    greeting:
      "Olá, Estúdio Conceito! Vi o site demonstrativo da Nácar Odontologia e quero saber mais sobre um projeto assim.",
  },

  address: {
    street: "Av. Rondon Pacheco, 4600, sala 1108",
    district: "Tibery",
    city: "Uberlândia",
    state: "MG",
    postalCode: "38405-142",
  },

  hours: [
    {
      days: "Segunda a sexta",
      hours: "8h às 19h",
      schema: {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "19:00",
      },
    },
    {
      days: "Sábado",
      hours: "8h às 12h",
      schema: { dayOfWeek: ["Saturday"], opens: "08:00", closes: "12:00" },
    },
  ] satisfies OpeningHours[],

  // Âncoras das seções da página, na ordem em que aparecem.
  nav: [
    { label: "Tratamentos", href: "#tratamentos" },
    { label: "Resultados", href: "#resultados" },
    { label: "Como funciona", href: "#planejamento" },
    { label: "A clínica", href: "#clinica" },
    { label: "Equipe", href: "#equipe" },
  ],

  header: {
    cta: "Agendar",
  },

  hero: {
    eyebrow: "Odontologia estética e reabilitação oral",
    // O título quebra em linhas fixas; a última vai em serifa itálica.
    titleLines: ["O sorriso que", "você sempre"],
    titleAccent: "quis ver.",
    lead: "Lentes de contato dental, implantes e alinhadores, planejados com você. Antes de começar, você vê o resultado na tela.",
    cta: "Agendar avaliação",
    secondary: { label: "Conhecer a clínica", href: "#clinica" },
    photo: { src: heroConsulta, alt: "Dentista conversando com uma paciente sorridente em um consultório claro e moderno" },
    inset: { src: heroSorriso, alt: "Mulher sorrindo sob a luz do fim da tarde" },
    rating: { value: "4,9", label: "640 avaliações no Google" },
    trust: [
      { value: "12 anos", label: "de clínica em Uberlândia" },
      { value: "3.200", label: "sorrisos planejados" },
      { value: "60 min", label: "de primeira consulta" },
    ] satisfies Stat[],
  },

  // Faixa que corre abaixo do hero.
  marquee: [
    "Lentes de contato dental",
    "Implantes",
    "Alinhadores invisíveis",
    "Clareamento",
    "Reabilitação oral",
    "Check-up digital",
  ],

  manifesto: {
    label: "Como trabalhamos",
    // Um parágrafo de 18 a 30 palavras.
    text: "Antes de tocar em um dente, escutamos, examinamos e desenhamos o resultado em 3D. Você vê o sorriso pronto na tela e só então decide começar.",
    // Trecho do texto que vai em serifa itálica.
    accent: "só então",
    stats: [
      { value: "60 min", label: "de primeira consulta, sem pressa" },
      { value: "2", label: "consultas até a prévia do seu sorriso" },
      { value: "3.200", label: "tratamentos planejados em 3D" },
    ] satisfies Stat[],
  },

  treatments: {
    label: "Tratamentos",
    title: "Cuidado completo,",
    titleAccent: "do check-up ao sorriso novo.",
    items: [
      {
        id: "lentes",
        name: "Lentes de contato dental",
        summary:
          "Lâminas de porcelana com 0,3 mm que corrigem cor, formato e pequenos desalinhamentos, com desgaste mínimo do dente.",
        facts: ["2 a 3 consultas", "Prévia do resultado antes de começar"],
        photo: { src: tratLentes, alt: "Close de um sorriso com dentes claros e alinhados" },
      },
      {
        id: "implantes",
        name: "Implantes",
        summary:
          "Reposição de um ou mais dentes com cirurgia guiada por tomografia. Em muitos casos, o dente provisório é colocado no mesmo dia.",
        facts: ["Cirurgia guiada", "Sedação consciente disponível"],
        photo: { src: tratImplantes, alt: "Mãos de dentista com luvas durante um atendimento" },
      },
      {
        id: "alinhadores",
        name: "Alinhadores invisíveis",
        summary:
          "Placas transparentes e removíveis que alinham os dentes sem fios nem braquetes. Você acompanha a evolução prevista, etapa por etapa.",
        facts: ["Troca a cada 10 dias", "Retornos a cada 6 a 8 semanas"],
        photo: { src: tratAlinhadores, alt: "Mulher encaixando um alinhador transparente nos dentes" },
      },
      {
        id: "clareamento",
        name: "Clareamento",
        summary:
          "Clareamento supervisionado, em consultório ou em casa com moldeiras sob medida, com controle de sensibilidade do início ao fim.",
        facts: ["1 a 3 sessões", "Resultado já na primeira semana"],
        photo: { src: tratClareamento, alt: "Mulher de cabelos cacheados sorrindo" },
      },
      {
        id: "checkup",
        name: "Check-up digital",
        summary:
          "Escaneamento 3D, radiografias digitais e fotografia do sorriso em uma única consulta. Você sai com um plano claro, por escrito.",
        facts: ["60 minutos", "Plano de tratamento por escrito"],
        photo: { src: tratCheckup, alt: "Equipo odontológico em um consultório com detalhes em madeira e palhinha" },
      },
    ] satisfies Treatment[],
  },

  results: {
    label: "Resultados",
    title: "Arraste e veja",
    titleAccent: "a diferença.",
    lead: "Todo tratamento estético começa por uma prévia. Você aprova o resultado antes de qualquer procedimento.",
    caseLabel: "Clareamento e lentes de contato dental",
    before: { src: casoAntes, alt: "Sorriso antes do tratamento, com dentes amarelados" },
    after: { src: casoDepois, alt: "O mesmo sorriso depois do tratamento, com dentes claros" },
    note: "Comparação ilustrativa, criada para este site demonstrativo.",
    gallery: [
      { photo: { src: sorriso1, alt: "Retrato em preto e branco de uma mulher sorrindo de olhos fechados" }, caption: "Lentes de contato" },
      { photo: { src: sorriso2, alt: "Retrato em preto e branco de uma mulher sorrindo" }, caption: "Alinhadores" },
      { photo: { src: sorriso3, alt: "Mulher sorrindo, olhando para baixo" }, caption: "Clareamento" },
      { photo: { src: sorriso4, alt: "Mulher de olhos claros sorrindo para a câmera" }, caption: "Reabilitação" },
    ],
  },

  process: {
    label: "Como funciona",
    title: "Você vê antes",
    titleAccent: "de decidir.",
    lead: "O planejamento digital tira a dúvida do caminho. Nada começa sem a sua aprovação.",
    photo: { src: espacoConsultorio, alt: "Consultório odontológico claro, com cadeira e equipamentos modernos" },
    card: { value: "100%", label: "dos tratamentos estéticos com prévia aprovada pelo paciente" },
    steps: [
      { title: "Escuta e exame", text: "Uma hora de conversa, fotos e escaneamento 3D. Sem pressa e sem molde de massa." },
      { title: "Desenho do sorriso", text: "Projetamos o resultado no computador a partir do seu rosto e da sua mordida." },
      { title: "Prévia na boca", text: "Você experimenta o novo sorriso em um ensaio provisório e ajusta o que quiser." },
      { title: "Execução", text: "Só então começamos, seguindo exatamente o que você aprovou." },
    ],
  },

  space: {
    label: "A clínica",
    title: "Um lugar para esquecer",
    titleAccent: "que é dentista.",
    lead: "Luz natural, silêncio e tempo. O atendimento é individual: uma pessoa por vez, do café da recepção à cadeira.",
    items: [
      { photo: { src: espacoRecepcao, alt: "Recepção com balcão de madeira ripada, parede de reboco claro e uma oliveira" }, caption: "Recepção" },
      { photo: { src: espacoLounge, alt: "Lounge com sofá claro, oliveiras e janelas do piso ao teto" }, caption: "Lounge" },
      { photo: { src: espacoConsultorio, alt: "Consultório claro com cadeira odontológica e piso de madeira" }, caption: "Consultório" },
      { photo: { src: espacoEspera, alt: "Sala de espera minimalista com mesa de chá" }, caption: "Sala de espera" },
    ],
  },

  team: {
    label: "Equipe",
    title: "Quem cuida",
    titleAccent: "de você.",
    lead: "Dois especialistas que atendem juntos os casos de reabilitação, do planejamento à última consulta.",
    people: [
      {
        name: "Dra. Marina Teles",
        initials: "MT",
        role: "Reabilitação oral e lentes de contato dental",
        cro: "CRO-MG 48.210",
        bio: "Especialista em prótese dentária, dedica-se à estética do sorriso há mais de dez anos.",
      },
      {
        name: "Dr. Caio Bragança",
        initials: "CB",
        role: "Implantodontia e cirurgia guiada",
        cro: "CRO-MG 51.377",
        bio: "Mestre em implantodontia, planeja cada cirurgia em 3D antes de entrar na sala.",
      },
    ],
  },

  testimonials: {
    label: "Depoimentos",
    title: "Quem passou",
    titleAccent: "por aqui.",
    rating: { value: "4,9", label: "em 640 avaliações no Google" },
    photo: { src: depoimentosSorriso, alt: "Close em preto e branco de um sorriso" },
    items: [
      {
        quote: "Vi meu sorriso pronto na tela antes de decidir. Não teve surpresa nenhuma: ficou igual ao que aprovei.",
        author: "Renata M.",
        context: "Lentes de contato dental",
      },
      {
        quote: "Tinha pavor de dentista. Explicaram cada etapa com calma e eu saí da cirurgia já com o dente provisório.",
        author: "Paulo H.",
        context: "Implante",
      },
      {
        quote: "Usei os alinhadores por dez meses e quase ninguém percebeu. O resultado bateu com a simulação do primeiro dia.",
        author: "Júlia A.",
        context: "Alinhadores invisíveis",
      },
    ],
  },

  booking: {
    label: "Agendar",
    title: "Vamos conversar",
    titleAccent: "sobre o seu sorriso.",
    lead: "Conte o que você procura e escolha o melhor período. A mensagem já chega pronta no nosso WhatsApp.",
    goalsLabel: "O que você procura?",
    goals: [
      { id: "lentes", label: "Lentes de contato", phrase: "avaliar lentes de contato dental" },
      { id: "alinhar", label: "Alinhar os dentes", phrase: "alinhar os dentes" },
      { id: "clarear", label: "Clarear o sorriso", phrase: "clarear o sorriso" },
      { id: "repor", label: "Repor um dente", phrase: "repor um dente" },
    ] satisfies Choice[],
    periodsLabel: "Melhor período",
    periods: [
      { id: "manha", label: "Manhã", phrase: "de manhã" },
      { id: "tarde", label: "Tarde", phrase: "à tarde" },
      { id: "noite", label: "Início da noite", phrase: "no início da noite" },
    ] satisfies Choice[],
    cta: "Enviar pelo WhatsApp",
    visitTitle: "Onde estamos",
    mapsLabel: "Como chegar",
  },

  footer: {
    tagline: "Odontologia estética e reabilitação oral em Uberlândia.",
    note: "Projeto demonstrativo do Estúdio Conceito. Equipe, registros e depoimentos são fictícios, e as imagens são ilustrativas.",
  },
};

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}, ${site.address.postalCode}`;
