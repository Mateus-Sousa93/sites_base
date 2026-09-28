// Todo o conteúdo do site fica aqui. Para adaptar a outra clínica, troque os
// dados e as mídias abaixo: nenhum componente tem texto de negócio escrito no JSX.

import type { StaticImageData } from "next/image";

import clinicaCorredor from "@/assets/images/clinica-corredor.jpg";
import clinicaEspera from "@/assets/images/clinica-espera.jpg";
import clinicaRecepcao from "@/assets/images/clinica-recepcao.jpg";
import ctaEstetoscopio from "@/assets/images/cta-estetoscopio.jpg";
import espCardiologia from "@/assets/images/esp-cardiologia.jpg";
import espClinicaGeral from "@/assets/images/esp-clinica-geral.jpg";
import espDermatologia from "@/assets/images/esp-dermatologia.jpg";
import espGinecologia from "@/assets/images/esp-ginecologia.jpg";
import espOrtopedia from "@/assets/images/esp-ortopedia.jpg";
import espPediatria from "@/assets/images/esp-pediatria.jpg";
import exameLaboratorio from "@/assets/images/exame-laboratorio.jpg";
import examePressao from "@/assets/images/exame-pressao.jpg";
import exameUltrassom from "@/assets/images/exame-ultrassom.jpg";

export type Photo = { src: StaticImageData; alt: string };

export type Specialty = {
  id: string;
  name: string;
  description: string;
  price: number;
  photo: Photo;
  doctor: string;
  // Próximos horários livres exibidos na agenda do topo (demonstração).
  slots: { day: string; time: string }[];
};

export type OpeningHours = {
  days: string;
  hours: string;
  schema: { dayOfWeek: string[]; opens: string; closes: string };
};

const specialties: Specialty[] = [
  {
    id: "clinica-geral",
    name: "Clínica geral",
    description: "Check-up, acompanhamento de doenças crônicas e encaminhamento quando precisa.",
    price: 220,
    photo: { src: espClinicaGeral, alt: "Estetoscópio e medidor de pressão sobre lençol branco" },
    doctor: "Dra. Helena Duarte",
    slots: [
      { day: "Seg", time: "08:30" },
      { day: "Seg", time: "14:00" },
      { day: "Ter", time: "10:30" },
    ],
  },
  {
    id: "cardiologia",
    name: "Cardiologia",
    description: "Avaliação do coração, pressão alta, arritmias e liberação para atividade física.",
    price: 320,
    photo: { src: espCardiologia, alt: "Modelo anatômico de coração sobre fundo claro" },
    doctor: "Dr. Marcos Vieira",
    slots: [
      { day: "Seg", time: "14:00" },
      { day: "Ter", time: "09:30" },
      { day: "Qui", time: "16:00" },
    ],
  },
  {
    id: "pediatria",
    name: "Pediatria",
    description: "Consultas de rotina, vacinas em dia e acompanhamento do crescimento.",
    price: 260,
    photo: { src: espPediatria, alt: "Urso de pelúcia com estetoscópio" },
    doctor: "Dra. Paula Rezende",
    slots: [
      { day: "Ter", time: "08:00" },
      { day: "Qua", time: "15:30" },
      { day: "Sex", time: "09:00" },
    ],
  },
  {
    id: "dermatologia",
    name: "Dermatologia",
    description: "Pintas, acne, queda de cabelo e mapeamento de pele com dermatoscopia.",
    price: 300,
    photo: { src: espDermatologia, alt: "Mãos aplicando creme na pele do braço" },
    doctor: "Dr. André Lemos",
    slots: [
      { day: "Qua", time: "10:00" },
      { day: "Qui", time: "13:30" },
      { day: "Sex", time: "11:00" },
    ],
  },
  {
    id: "ginecologia",
    name: "Ginecologia",
    description: "Preventivo, planejamento familiar, pré-natal e ultrassom no mesmo lugar.",
    price: 290,
    photo: { src: espGinecologia, alt: "Imagem de ultrassom segurada sobre a barriga" },
    doctor: "Dra. Camila Torres",
    slots: [
      { day: "Seg", time: "10:00" },
      { day: "Qua", time: "08:30" },
      { day: "Qui", time: "14:30" },
    ],
  },
  {
    id: "ortopedia",
    name: "Ortopedia",
    description: "Dores na coluna, joelho e ombro, lesões do esporte e raio-X no local.",
    price: 300,
    photo: { src: espOrtopedia, alt: "Raio-X de punho e mão" },
    doctor: "Dr. Rafael Nunes",
    slots: [
      { day: "Ter", time: "15:00" },
      { day: "Qui", time: "09:00" },
      { day: "Sex", time: "16:30" },
    ],
  },
];

export const site = {
  name: "Clínica Pulso",
  url: "https://clinica-pulso.vercel.app",
  demo: true,

  whatsapp: {
    // Somente dígitos, com DDI e DDD.
    number: "5534992011427",
    display: "(34) 99201-1427",
    greeting: "Olá, Clínica Pulso! Vim pelo site.",
  },

  instagram: {
    handle: "clinicapulso",
    url: "https://www.instagram.com/clinicapulso/",
  },

  address: {
    street: "Av. João Naves de Ávila, 1331, sala 402",
    district: "Santa Mônica",
    city: "Uberlândia",
    state: "MG",
    postalCode: "38408-902",
  },

  hours: [
    {
      days: "Segunda a sexta",
      hours: "7h às 19h",
      schema: {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00",
      },
    },
    {
      days: "Sábado",
      hours: "8h às 12h",
      schema: { dayOfWeek: ["Saturday"], opens: "08:00", closes: "12:00" },
    },
  ] satisfies OpeningHours[],

  hero: {
    video: { src: "/videos/hero-ausculta.mp4", poster: "/videos/hero-ausculta-poster.jpg" },
    title: "Cuidado com a sua saúde, sem pressa.",
    lead: "Seis especialidades, exames no mesmo prédio e consultas de 40 minutos em Uberlândia. Convênios e particular.",
    trust: [
      { value: "18 anos", label: "de clínica" },
      { value: "4,9", label: "no Google, 1.200 avaliações" },
      { value: "40 min", label: "de consulta, em média" },
    ],
  },

  specialties: {
    title: "Especialidades",
    intro: "Valores de consulta particular. Aceitamos os principais convênios: confirme o seu pelo WhatsApp.",
    items: specialties,
  },

  exams: {
    title: "Exames no mesmo lugar",
    text: "Sem precisar marcar em outro endereço. Boa parte dos exames é feita no dia da consulta, e o resultado chega no seu WhatsApp.",
    video: { src: "/videos/exame-ecg.mp4", poster: "/videos/exame-ecg-poster.jpg" },
    items: [
      { name: "Eletrocardiograma", detail: "Na hora, com laudo no mesmo dia", photo: null },
      { name: "Ultrassonografia", detail: "Abdominal, pélvica, obstétrica e de tireoide", photo: { src: exameUltrassom, alt: "Mãos com luvas operando aparelho de ultrassom" } },
      { name: "Exames laboratoriais", detail: "Coleta das 7h às 10h, resultado em até 24h", photo: { src: exameLaboratorio, alt: "Tubos de coleta de sangue em uma estante" } },
      { name: "MAPA e Holter 24h", detail: "Monitoramento de pressão e ritmo cardíaco", photo: { src: examePressao, alt: "Medição de pressão arterial no braço" } },
    ] as { name: string; detail: string; photo: Photo | null }[],
  },

  steps: {
    title: "Como funciona",
    photo: { src: clinicaEspera, alt: "Sala de espera clara com sofá verde-água" } satisfies Photo,
    items: [
      { title: "Agende pelo WhatsApp", text: "Escolha a especialidade e o horário. A confirmação chega na hora." },
      { title: "Chegue 15 minutos antes", text: "Traga documento com foto e a carteirinha do convênio, se tiver." },
      { title: "Consulta sem pressa", text: "Em média 40 minutos, com tempo para explicar e tirar dúvidas." },
      { title: "Retorno incluso", text: "Até 30 dias para mostrar exames, sem pagar uma nova consulta." },
    ],
  },

  team: {
    title: "Corpo clínico",
    intro: "Especialistas com registro ativo no CRM-MG e agenda própria na clínica.",
    photos: [
      { src: clinicaRecepcao, alt: "Balcão da recepção da clínica" },
      { src: clinicaCorredor, alt: "Corredor iluminado da clínica" },
    ] satisfies Photo[],
    doctors: [
      { name: "Dra. Helena Duarte", specialty: "Clínica geral", crm: "CRM-MG 38.412", days: "Seg a qua" },
      { name: "Dr. Marcos Vieira", specialty: "Cardiologia", crm: "CRM-MG 45.210", days: "Seg, ter e qui" },
      { name: "Dra. Paula Rezende", specialty: "Pediatria", crm: "CRM-MG 51.077", days: "Ter, qua e sex" },
      { name: "Dr. André Lemos", specialty: "Dermatologia", crm: "CRM-MG 47.936", days: "Qua a sex" },
      { name: "Dra. Camila Torres", specialty: "Ginecologia", crm: "CRM-MG 42.658", days: "Seg, qua e qui" },
      { name: "Dr. Rafael Nunes", specialty: "Ortopedia", crm: "CRM-MG 49.301", days: "Ter, qui e sex" },
    ],
  },

  testimonials: {
    title: "A confiança de quem já passou por aqui",
    rating: "4,9",
    ratingLabel: "média de 1.200 avaliações no Google",
    items: [
      { name: "Carla", specialty: "Cardiologia", quote: "Explicou com calma cada exame e tirou todas as minhas dúvidas. Saí da consulta entendendo o meu tratamento." },
      { name: "Roberto", specialty: "Clínica geral", quote: "Faço acompanhamento há anos. Pontualidade rara, e os exames saem no mesmo prédio." },
      { name: "Fernanda", specialty: "Pediatria", quote: "Minha filha tinha pavor de médico. Hoje ela pede para ir na tia Paula." },
    ],
  },

  finalCta: {
    title: "Agende a sua consulta.",
    text: "Fale com a nossa equipe pelo WhatsApp. A gente encontra o melhor horário e confirma o seu convênio.",
    photo: { src: ctaEstetoscopio, alt: "" } satisfies Photo,
  },
};

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}, ${site.address.postalCode}`;
