// Todo o conteúdo do site fica aqui. Para adaptar a outra loja, troque os dados
// e as mídias abaixo: nenhum componente tem texto de negócio escrito no JSX.

import type { StaticImageData } from "next/image";

import catEletricas from "@/assets/images/cat-eletricas.jpg";
import catEquipamentos from "@/assets/images/cat-equipamentos.jpg";
import catEstrada from "@/assets/images/cat-estrada.jpg";
import catMtb from "@/assets/images/cat-mtb.jpg";
import catUrbanas from "@/assets/images/cat-urbanas.jpg";
import comunidade from "@/assets/images/comunidade.jpg";
import ctaPorDoSol from "@/assets/images/cta-por-do-sol.jpg";
import ebikeDestaque from "@/assets/images/ebike-destaque.jpg";
import loja from "@/assets/images/loja.jpg";
import oficina from "@/assets/images/oficina.jpg";
import oficinaDetalhe from "@/assets/images/oficina-detalhe.jpg";
import prodCapacete from "@/assets/images/prod-capacete.jpg";
import prodEbike from "@/assets/images/prod-ebike.jpg";
import prodLuva from "@/assets/images/prod-luva.jpg";
import prodMtb from "@/assets/images/prod-mtb.jpg";
import prodSpeed from "@/assets/images/prod-speed.jpg";
import prodUrbana from "@/assets/images/prod-urbana.jpg";

export type Photo = { src: StaticImageData; alt: string; position?: string };

export type ProductKind = "bikes" | "eletricas" | "equipamentos";

export type Product = {
  name: string;
  detail: string;
  kind: ProductKind;
  price: number;
  photo: Photo;
  tag?: string;
};

export type OpeningHours = {
  days: string;
  hours: string;
  schema: { dayOfWeek: string[]; opens: string; closes: string };
};

export const site = {
  name: "Pedal Forte",
  url: "https://pedal-forte.vercel.app",
  demo: true,
  pixDiscount: 0.05,
  installments: 12,

  whatsapp: {
    // Somente dígitos, com DDI e DDD. Número de demonstração: troque pelo real.
    number: "5531991481148",
    display: "(31) 99148-1148",
    greeting: "Olá, Pedal Forte! Vim pelo site.",
  },

  instagram: {
    handle: "pedalforte.bh",
    url: "https://www.instagram.com/pedalforte.bh/",
  },

  address: {
    street: "Rua da Bahia, 1148",
    district: "Centro",
    city: "Belo Horizonte",
    state: "MG",
    postalCode: "30160-011",
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
      hours: "8h às 13h",
      schema: { dayOfWeek: ["Saturday"], opens: "08:00", closes: "13:00" },
    },
  ] satisfies OpeningHours[],

  hero: {
    video: { src: "/videos/hero-trilha.mp4", poster: "/videos/hero-trilha-poster.jpg" },
    title: ["Aguenta", "a trilha."],
    lead: "Mountain bike, speed, urbanas, elétricas e tudo o que vai junto. Test ride na loja e oficina própria em Belo Horizonte.",
    primary: "Ver bikes",
    secondary: "Chamar no WhatsApp",
    perks: ["Envio para todo o Brasil", "12x sem juros no cartão", "5% de desconto no PIX"],
  },

  categories: {
    title: "Escolha o seu terreno",
    items: [
      { name: "Mountain bike", detail: "Aro 29, full e hardtail", count: 42, photo: { src: catMtb, alt: "Ciclista saltando de mountain bike nas montanhas" } },
      { name: "Speed", detail: "Estrada e gravel", count: 27, photo: { src: catEstrada, alt: "Pelotão de ciclistas de estrada em alta velocidade" } },
      { name: "Elétricas", detail: "Assistência até 25 km/h", count: 18, photo: { src: catEletricas, alt: "Mountain bike elétrica vermelha na montanha" } },
      { name: "Urbanas", detail: "Fixa, dobrável e passeio", count: 23, photo: { src: catUrbanas, alt: "Bike urbana de aro amarelo encostada em parede laranja" } },
      { name: "Equipamentos", detail: "Capacetes, luvas, roupas e peças", count: 310, photo: { src: catEquipamentos, alt: "Mãos com luvas de ciclismo no guidão" } },
    ] satisfies { name: string; detail: string; count: number; photo: Photo }[],
  },

  ebike: {
    title: ["Subida", "não é mais", "desculpa."],
    text: "Motor central que só ajuda quando você pedala. Dá para ir trabalhar sem chegar suado e encarar a serra no fim de semana.",
    photo: { src: ebikeDestaque, alt: "Bike elétrica de pneu largo estacionada nas pedras à beira-mar" } satisfies Photo,
    specs: [
      { value: "80", unit: "km", label: "de autonomia por carga" },
      { value: "250", unit: "W", label: "de motor central" },
      { value: "4", unit: "h", label: "para recarga completa" },
      { value: "25", unit: "km/h", label: "de assistência máxima" },
    ],
    from: 7990,
    cta: "Agendar test ride",
  },

  products: {
    title: "Mais vendidos",
    filters: [
      { id: "todos", label: "Todos" },
      { id: "bikes", label: "Bikes" },
      { id: "eletricas", label: "Elétricas" },
      { id: "equipamentos", label: "Equipamentos" },
    ] as const,
    items: [
      { name: "Speed Carbono 105", detail: "Quadro de carbono, 22 marchas", kind: "bikes", price: 12490, photo: { src: prodSpeed, alt: "Bike speed em estúdio fotográfico", position: "22% 70%" }, tag: "Novidade" },
      { name: "MTB Trail 29 Full", detail: "Suspensão dupla, 12 marchas", kind: "bikes", price: 9890, photo: { src: prodMtb, alt: "Mountain bike vermelha de suspensão dupla" } },
      { name: "E-Urban 500", detail: "Elétrica, 60 km de autonomia", kind: "eletricas", price: 7990, photo: { src: prodEbike, alt: "Bike elétrica urbana cinza" }, tag: "Mais vendida" },
      { name: "Urbana Fixa Classic", detail: "Aço cromoly, pinhão fixo", kind: "bikes", price: 2390, photo: { src: prodUrbana, alt: "Bike urbana de pinhão fixo cinza" } },
      { name: "Capacete Aero Vent", detail: "18 entradas de ar, 260 g", kind: "equipamentos", price: 489, photo: { src: prodCapacete, alt: "Capacete de ciclismo vermelho" } },
      { name: "Luva Grip Pro", detail: "Dedo inteiro, palma com gel", kind: "equipamentos", price: 159, photo: { src: prodLuva, alt: "Luva de ciclismo preta com palma antiderrapante" } },
    ] satisfies Product[],
  },

  adrenaline: {
    video: { src: "/videos/descida-pov.mp4", poster: "/videos/descida-pov-poster.jpg" },
    title: ["O caminho", "é a parte boa."],
    text: "A gente monta, regula e deixa a sua bike pronta para você só se preocupar com a próxima curva.",
  },

  workshop: {
    title: "Oficina",
    text: "Mecânicos certificados, peças originais e bike pronta em até 48 horas. Você acompanha tudo pelo WhatsApp.",
    photo: { src: oficina, alt: "Mecânico ajustando uma bike laranja na oficina" } satisfies Photo,
    detail: { src: oficinaDetalhe, alt: "Ferramenta ajustando o movimento central da bike" } satisfies Photo,
    services: [
      { name: "Revisão completa", detail: "Desmontagem, limpeza, lubrificação e regulagens", price: 220 },
      { name: "Revisão básica", detail: "Freios, câmbio, aperto geral e calibragem", price: 120 },
      { name: "Montagem de bike nova", detail: "Inclui regulagem de altura e ergonomia", price: 90 },
      { name: "Sangria de freio hidráulico", detail: "Por roda, com fluido incluso", price: 70 },
      { name: "Troca de câmara", detail: "Mão de obra, câmara à parte", price: 30 },
    ],
    cta: "Agendar revisão",
  },

  community: {
    title: "Pedal de sábado",
    text: "Toda semana sai um grupo da porta da loja. Tem pace para quem está começando e para quem quer suar.",
    photo: { src: comunidade, alt: "Grupo de ciclistas pedalando ao pôr do sol" } satisfies Photo,
    facts: [
      { label: "Saída", value: "Sábado, 6h30" },
      { label: "Distância", value: "40 a 70 km" },
      { label: "Nível", value: "Todos, com apoio" },
    ],
    cta: "Quero ir no próximo",
    testimonials: [
      { name: "Rafael", place: "Ouro Preto", quote: "Comprei a full e fizeram a regulagem na hora, do meu tamanho. Primeira trilha já saí confiante." },
      { name: "Camila", place: "Belo Horizonte", quote: "Fui na loja sem saber nada de elétrica. Fiz o test ride, entendi a diferença e hoje vou trabalhar de bike." },
      { name: "Thiago", place: "Lavras", quote: "Revisão entregue no prazo e com foto de cada peça trocada. Oficina de confiança é raro." },
    ],
  },

  finalCta: {
    title: "Bora pedalar?",
    text: "Venha fazer um test ride ou chame no WhatsApp. A gente te ajuda a escolher a bike certa para o seu terreno.",
    photo: { src: ctaPorDoSol, alt: "" } satisfies Photo,
    store: { src: loja, alt: "Interior da loja com bikes expostas" } satisfies Photo,
  },
};

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}, ${site.address.postalCode}`;
