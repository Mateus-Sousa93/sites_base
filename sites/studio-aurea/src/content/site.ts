// Todo o conteúdo do site fica aqui. Para adaptar a outro estúdio, troque os
// dados e as fotos abaixo: nenhum componente tem texto de negócio escrito no JSX.

import type { StaticImageData } from "next/image";

import ctaPele from "@/assets/images/cta-pele.jpg";
import drenagem from "@/assets/images/drenagem.jpg";
import heroSerum from "@/assets/images/hero-serum.jpg";
import instaChantilly from "@/assets/images/insta-chantilly.jpg";
import instaCreme from "@/assets/images/insta-creme.jpg";
import instaFrasco from "@/assets/images/insta-frasco.jpg";
import instaSerum from "@/assets/images/insta-serum.jpg";
import instaTexturas from "@/assets/images/insta-texturas.jpg";
import instaToalhas from "@/assets/images/insta-toalhas.jpg";
import limpeza from "@/assets/images/limpeza.jpg";
import microagulhamento from "@/assets/images/microagulhamento.jpg";
import peeling from "@/assets/images/peeling.jpg";
import quizContaGotas from "@/assets/images/quiz-conta-gotas.jpg";
import resultadosMaos from "@/assets/images/resultados-maos.jpg";
import studioProdutos from "@/assets/images/studio-produtos.jpg";
import studioSala from "@/assets/images/studio-sala.jpg";
import studioToalhas from "@/assets/images/studio-toalhas.jpg";

export type Photo = { src: StaticImageData; alt: string };

export type TreatmentId = "limpeza" | "peeling" | "microagulhamento" | "drenagem";

export type Treatment = {
  id: TreatmentId;
  name: string;
  minutes: number;
  price: number;
  description: string;
  indication: string;
  photo: Photo;
};

export type Concern = {
  label: string;
  treatment: TreatmentId;
};

export type Testimonial = {
  name: string;
  treatment: string;
  quote: string;
};

export type OpeningHours = {
  days: string;
  hours: string;
  // Formato schema.org, usado nos dados estruturados para o Google.
  schema: { dayOfWeek: string[]; opens: string; closes: string };
};

const treatments: Treatment[] = [
  {
    id: "limpeza",
    name: "Limpeza de pele",
    minutes: 60,
    price: 180,
    description:
      "Higienização, esfoliação, extração cuidadosa e máscara calmante. A pele sai leve, sem o aspecto vermelho de limpeza agressiva.",
    indication: "Cravos, oleosidade e pele sem viço. Repetir a cada 30 a 45 dias.",
    photo: { src: limpeza, alt: "Máscara de argila no rosto durante a limpeza de pele" },
  },
  {
    id: "peeling",
    name: "Peeling químico",
    minutes: 45,
    price: 250,
    description:
      "Ácidos em concentração escolhida na avaliação para renovar a camada superficial da pele, com descamação leve e controlada.",
    indication: "Manchas, tom irregular e marcas leves de acne.",
    photo: { src: peeling, alt: "Aplicação de ácido no rosto durante o peeling" },
  },
  {
    id: "microagulhamento",
    name: "Microagulhamento",
    minutes: 90,
    price: 390,
    description:
      "Microperfurações que estimulam a produção de colágeno. Feito com anestésico tópico e material descartável aberto na sua frente.",
    indication: "Cicatrizes de acne, poros dilatados, textura irregular e linhas finas.",
    photo: { src: microagulhamento, alt: "Procedimento facial com instrumentos de aço" },
  },
  {
    id: "drenagem",
    name: "Drenagem linfática",
    minutes: 50,
    price: 150,
    description:
      "Manobras lentas e ritmadas que estimulam a circulação linfática. Relaxa e deixa a sensação de corpo mais leve já na primeira sessão.",
    indication: "Inchaço, retenção de líquido e pós-operatório liberado pelo médico.",
    photo: { src: drenagem, alt: "Mãos fazendo drenagem linfática sobre toalha branca" },
  },
];

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
    lead: "Estética facial e corporal em Uberlândia, com avaliação antes de qualquer procedimento e uma cliente por vez.",
    cta: "Agendar avaliação",
    photo: {
      src: heroSerum,
      alt: "Conta-gotas pingando sérum em um frasco âmbar, sob luz natural",
    } satisfies Photo,
    highlight: { label: "Limpeza de pele", from: 180, minutes: 60 },
    trust: ["Avaliação antes de tudo", "Produtos regularizados na Anvisa", "Material descartável"],
  },

  treatments: {
    title: "Tratamentos",
    intro: "Valores por sessão. O protocolo é definido na avaliação.",
    items: treatments,
  },

  quiz: {
    title: "Qual tratamento combina com a sua pele?",
    intro: "Três perguntas rápidas. No fim, a gente sugere por onde começar e você envia tudo pelo WhatsApp.",
    photo: {
      src: quizContaGotas,
      alt: "Gota de sérum dourado caindo do conta-gotas sobre a pele",
    } satisfies Photo,
    skinTypes: ["Seca", "Mista", "Oleosa", "Sensível", "Não sei dizer"],
    concerns: [
      { label: "Cravos", treatment: "limpeza" },
      { label: "Acne ativa", treatment: "limpeza" },
      { label: "Manchas", treatment: "peeling" },
      { label: "Marcas de acne", treatment: "microagulhamento" },
      { label: "Poros dilatados", treatment: "microagulhamento" },
      { label: "Inchaço", treatment: "drenagem" },
    ] satisfies Concern[],
    periods: ["Manhã", "Tarde", "Sábado"],
    sensitiveNote: "Como a sua pele é sensível, a primeira sessão começa com um protocolo mais suave.",
    disclaimer: "A indicação final é feita na avaliação presencial, que não obriga a fechar nenhum tratamento.",
  },

  studio: {
    title: "Um espaço calmo, com uma cliente por vez.",
    text: "Uma sala de atendimento só. Horário marcado de verdade, sem sala de espera cheia e com tempo para explicar cada etapa do cuidado.",
    photos: [
      { src: studioSala, alt: "Sala de atendimento com maca e frascos de óleos" },
      { src: studioToalhas, alt: "Toalhas enroladas e velas acesas" },
      { src: studioProdutos, alt: "Frascos de cuidados com a pele sobre banqueta de madeira" },
    ] satisfies Photo[],
    commitments: [
      { title: "Avaliação antes de tudo", text: "Nenhum procedimento sem conversa e análise da pele." },
      { title: "Material descartável", text: "Agulhas, luvas e lençóis de uso único." },
      { title: "Produtos regularizados", text: "Ativos com registro ou notificação na Anvisa." },
    ],
  },

  results: {
    title: "Quem passa por aqui volta.",
    photo: { src: resultadosMaos, alt: "Mãos massageando o antebraço de uma cliente" } satisfies Photo,
    stats: [
      { value: "8 anos", label: "de estúdio em Uberlândia" },
      { value: "2.400", label: "atendimentos realizados" },
      { value: "4,9", label: "de nota média no Google" },
    ],
    testimonials: [
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
          "Foram quatro sessões para as marcas de acne. Ela fotografou cada etapa, então eu vi a diferença sem ninguém precisar me convencer.",
      },
      {
        name: "Juliana",
        treatment: "Drenagem linfática",
        quote:
          "Atendimento pontual, sala silenciosa e zero pressão para comprar pacote. Virou meu horário fixo da semana.",
      },
    ] satisfies Testimonial[],
  },

  gallery: {
    title: "Um pouco do dia a dia",
    photos: [
      { src: instaSerum, alt: "Discos de sérum dourado com bolhas" },
      { src: instaCreme, alt: "Textura de creme hidratante espalhada" },
      { src: instaToalhas, alt: "Toalhas brancas enroladas" },
      { src: instaFrasco, alt: "Frasco de óleo facial com conta-gotas" },
      { src: instaTexturas, alt: "Texturas de cremes e séruns sobre a bancada" },
      { src: instaChantilly, alt: "Creme batido em close" },
    ] satisfies Photo[],
  },

  visit: {
    title: "Venha nos visitar",
    text: "Atendimento sempre com horário marcado.",
  },

  finalCta: {
    title: "Sua pele merece um plano, não um palpite.",
    text: "Agende uma avaliação e saia sabendo o que fazer, em que ordem e quanto vai custar.",
    cta: "Agendar avaliação",
    photo: { src: ctaPele, alt: "" } satisfies Photo,
  },
};

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}, ${site.address.postalCode}`;

export function treatmentById(id: TreatmentId): Treatment {
  const found = site.treatments.items.find((t) => t.id === id);
  if (!found) throw new Error(`Tratamento desconhecido: ${id}`);
  return found;
}
