// Todo o conteúdo do site fica aqui. Para adaptar a outro estúdio, troque os
// dados abaixo: nenhum componente tem texto de negócio escrito direto no JSX.

export type Treatment = {
  name: string;
  minutes: number;
  price: number;
  description: string;
};

export type Testimonial = {
  name: string;
  treatment: string;
  quote: string;
};

export type InstagramPost = {
  kind: string;
  text: string;
  tone: "plum" | "rose" | "paper" | "olive" | "porcelain";
};

export type OpeningHours = {
  days: string;
  hours: string;
  // Formato schema.org, usado nos dados estruturados para o Google.
  schema: { dayOfWeek: string[]; opens: string; closes: string };
};

export const site = {
  name: "Studio Áurea Estética",
  shortName: "Studio Áurea",
  descriptor: "estética",
  url: "https://studio-aurea.vercel.app",
  demo: true,

  whatsapp: {
    // Somente dígitos, com DDI e DDD. Número de demonstração: troque pelo real.
    number: "5534996123456",
    display: "(34) 99612-3456",
    greeting: "Olá, Studio Áurea! Gostaria de agendar uma avaliação.",
  },

  instagram: {
    handle: "studioaurea.estetica",
    url: "https://www.instagram.com/studioaurea.estetica/",
  },

  address: {
    street: "Av. Rondon Pacheco, 3500",
    district: "Tabajaras",
    city: "Uberlândia",
    state: "MG",
    postalCode: "38408-028",
  },

  hours: [
    {
      days: "Segunda a sexta",
      hours: "9h às 18h",
      schema: {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
    {
      days: "Sábado",
      hours: "9h às 13h",
      schema: { dayOfWeek: ["Saturday"], opens: "09:00", closes: "13:00" },
    },
  ] satisfies OpeningHours[],

  hero: {
    title: ["Pele bem", "cuidada,", "resultado", "natural."],
    lead:
      "Tratamentos faciais e corporais pensados para a sua pele, depois de uma avaliação cuidadosa. Sem exagero, sem pressa e sem pacote pronto.",
    cta: "Agendar avaliação",
  },

  assessment: {
    title: "Conte um pouco sobre a sua pele",
    intro: "Marque o que fizer sentido. A gente usa isso para preparar a sua avaliação.",
    skinTypes: ["Seca", "Mista", "Oleosa", "Sensível", "Não sei dizer"],
    concerns: ["Manchas", "Acne", "Poros dilatados", "Linhas finas", "Textura", "Inchaço"],
    periods: ["Manhã", "Tarde", "Sábado"],
    submit: "Enviar pelo WhatsApp",
    note: "A avaliação é presencial, dura cerca de 30 minutos e não obriga a fechar nenhum tratamento.",
  },

  treatments: {
    title: "Tratamentos",
    intro:
      "Os valores são por sessão. O número de sessões e o intervalo entre elas são definidos na avaliação, de acordo com o que a sua pele precisa.",
    items: [
      {
        name: "Limpeza de pele",
        minutes: 60,
        price: 180,
        description:
          "Higienização, esfoliação, extração cuidadosa e máscara calmante. Costuma ser repetida a cada 30 a 45 dias.",
      },
      {
        name: "Peeling químico",
        minutes: 45,
        price: 250,
        description:
          "Ácidos em concentração escolhida na avaliação para uniformizar o tom e suavizar manchas e marcas leves.",
      },
      {
        name: "Microagulhamento",
        minutes: 90,
        price: 390,
        description:
          "Microperfurações que estimulam a produção de colágeno. Indicado para cicatrizes de acne, poros e textura irregular.",
      },
      {
        name: "Drenagem linfática",
        minutes: 50,
        price: 150,
        description:
          "Manobras lentas e ritmadas que ajudam a reduzir o inchaço e a retenção de líquido.",
      },
    ] satisfies Treatment[],
  },

  studio: {
    title: "Um espaço calmo, com uma cliente por vez.",
    text:
      "O Studio Áurea tem uma sala de atendimento só. Isso quer dizer horário marcado de verdade, sem sala de espera cheia e com tempo para explicar cada etapa do cuidado.",
    commitments: [
      {
        title: "Avaliação antes de tudo",
        text: "Nenhum procedimento é feito sem conversa e análise da pele.",
      },
      {
        title: "Material descartável",
        text: "Agulhas, luvas e lençóis de uso único, abertos na sua frente.",
      },
      {
        title: "Produtos regularizados",
        text: "Todos os ativos usados têm registro ou notificação na Anvisa.",
      },
    ],
  },

  testimonials: {
    title: "Quem já passou por aqui",
    items: [
      {
        name: "Camila",
        treatment: "Limpeza de pele e peeling",
        quote:
          "Eu tinha medo de sair vermelha e com a pele descascando. Saí com a pele leve e com um cronograma que eu consigo seguir em casa.",
      },
      {
        name: "Mariana",
        treatment: "Microagulhamento",
        quote:
          "Foram quatro sessões para as marcas de acne. Ela me mostrou fotos de cada etapa, então eu vi a diferença sem ninguém precisar me convencer.",
      },
      {
        name: "Juliana",
        treatment: "Drenagem linfática",
        quote: "Atendimento pontual, sala silenciosa e zero pressão para comprar pacote.",
      },
    ] satisfies Testimonial[],
  },

  instagramPosts: [
    { kind: "Dica", text: "Protetor solar todo dia. Inclusive quando está nublado.", tone: "plum" },
    { kind: "Dúvida", text: "De quanto em quanto tempo fazer limpeza de pele?", tone: "rose" },
    { kind: "Mito", text: "Pele oleosa não precisa de hidratante.", tone: "paper" },
    { kind: "Bastidor", text: "Fotos de antes e depois só com autorização por escrito.", tone: "olive" },
    { kind: "Aviso", text: "Aos sábados, atendimento das 9h às 13h.", tone: "porcelain" },
  ] satisfies InstagramPost[],

  visit: {
    title: "Venha nos visitar",
    text: "Estamos na Rondon Pacheco, no Tabajaras. O atendimento é sempre com horário marcado.",
  },

  finalCta: {
    title: "Sua pele merece um plano, não um palpite.",
    text: "Agende uma avaliação e saia sabendo o que fazer, em que ordem e quanto vai custar.",
    cta: "Agendar avaliação",
  },
};

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}, ${site.address.postalCode}`;
