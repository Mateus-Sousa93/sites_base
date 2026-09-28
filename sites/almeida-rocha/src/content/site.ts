// Todo o conteúdo do site fica aqui. Para adaptar a outro escritório, troque os
// dados e as mídias abaixo: nenhum componente tem texto de negócio escrito no JSX.

import type { StaticImageData } from "next/image";

import ctaAssinatura from "@/assets/images/cta-assinatura.jpg";
import escritorio from "@/assets/images/escritorio.jpg";
import escritorioMesa from "@/assets/images/escritorio-mesa.jpg";
import segComercio from "@/assets/images/seg-comercio.jpg";
import segEcommerce from "@/assets/images/seg-ecommerce.jpg";
import segIndustria from "@/assets/images/seg-industria.jpg";
import segServicos from "@/assets/images/seg-servicos.jpg";
import srvAbertura from "@/assets/images/srv-abertura.jpg";
import srvBpo from "@/assets/images/srv-bpo.jpg";
import srvContabil from "@/assets/images/srv-contabil.jpg";
import srvFiscal from "@/assets/images/srv-fiscal.jpg";
import srvFolha from "@/assets/images/srv-folha.jpg";

export type Photo = { src: StaticImageData; alt: string };

export type Regime = { id: string; label: string; base: number; hint: string };

export type OpeningHours = {
  days: string;
  hours: string;
  schema: { dayOfWeek: string[]; opens: string; closes: string };
};

export const site = {
  name: "Almeida & Rocha Contabilidade",
  shortName: "Almeida & Rocha",
  url: "https://almeida-rocha.vercel.app",
  demo: true,

  whatsapp: {
    // Somente dígitos, com DDI e DDD.
    number: "5534992011427",
    display: "(34) 99201-1427",
    greeting: "Olá, Estúdio Conceito! Vi o site demonstrativo da Almeida & Rocha e quero saber mais sobre um projeto assim.",
  },

  linkedin: "https://www.linkedin.com/company/almeida-rocha-contabilidade/",

  address: {
    street: "Av. Presidente Vargas, 2121, conj. 804",
    district: "Jardim América",
    city: "Ribeirão Preto",
    state: "SP",
    postalCode: "14020-260",
  },

  hours: [
    {
      days: "Segunda a sexta",
      hours: "8h às 18h",
      schema: {
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    },
  ] satisfies OpeningHours[],

  hero: {
    video: { src: "/videos/hero-cidade.mp4", poster: "/videos/hero-cidade-poster.jpg" },
    title: ["Sua empresa em dia.", "Você no que importa."],
    lead: "Contabilidade, impostos, folha e financeiro para pequenas e médias empresas, com um contador que atende pelo nome e responde no mesmo dia.",
    primary: "Falar com um contador",
    secondary: "Simular meu plano",
    stats: [
      { value: "1.200", label: "empresas atendidas" },
      { value: "26", label: "anos de escritório" },
      { value: "4h", label: "tempo médio de resposta" },
    ],
  },

  services: {
    title: "O que fazemos por você",
    items: [
      {
        name: "Abertura de empresa",
        text: "Escolha do regime, contrato social, CNPJ, inscrições e alvará. Você só assina.",
        detail: "Pronta em até 15 dias úteis",
        photo: { src: srvAbertura, alt: "Mãos assinando um contrato" },
      },
      {
        name: "Contabilidade completa",
        text: "Balanço, DRE e balancetes mensais explicados em linguagem de dono de empresa.",
        detail: "Relatório mensal com leitura guiada",
        photo: { src: srvContabil, alt: "Relatório com gráficos sobre a mesa" },
      },
      {
        name: "Impostos e planejamento",
        text: "Apuração, guias e revisão anual do regime para você não pagar mais do que deve.",
        detail: "Revisão tributária todo ano",
        photo: { src: srvFiscal, alt: "Formulários de impostos e calculadora" },
      },
      {
        name: "Folha e departamento pessoal",
        text: "Admissões, férias, rescisões, eSocial e holerites no aplicativo do funcionário.",
        detail: "Folha fechada até o dia 3",
        photo: { src: srvFolha, alt: "Mãos digitando em uma calculadora" },
      },
      {
        name: "BPO financeiro",
        text: "Contas a pagar e receber, conciliação bancária e fluxo de caixa semanal.",
        detail: "Caixa conciliado toda semana",
        photo: { src: srvBpo, alt: "Pessoa analisando gráficos em um tablet" },
      },
    ] satisfies { name: string; text: string; detail: string; photo: Photo }[],
  },

  simulator: {
    title: "Monte o seu plano",
    intro: "Um valor mensal fixo, sem taxa escondida. Ajuste e veja na hora.",
    video: { src: "/videos/mesa-calculo.mp4", poster: "/videos/mesa-calculo-poster.jpg" },
    regimes: [
      { id: "mei", label: "MEI", base: 99, hint: "Faturamento até R$ 81 mil por ano" },
      { id: "simples", label: "Simples Nacional", base: 390, hint: "A maioria das pequenas empresas" },
      { id: "presumido", label: "Lucro Presumido", base: 790, hint: "Serviços com margem alta" },
      { id: "real", label: "Lucro Real", base: 1490, hint: "Faturamento acima de R$ 78 milhões ou margem baixa" },
    ] satisfies Regime[],
    perEmployee: 45,
    maxEmployees: 50,
    bpoPrice: 590,
    includes: ["Contador dedicado", "Guias e obrigações em dia", "Relatório mensal", "Atendimento por WhatsApp"],
    note: "Valores de demonstração. A proposta final considera o volume de notas e a atividade da empresa.",
  },

  segments: {
    title: "Quem atendemos",
    items: [
      { name: "Comércio e restaurantes", text: "Controle de estoque, cartão e delivery.", photo: { src: segComercio, alt: "Balcão de uma padaria" } },
      { name: "E-commerce", text: "Notas de marketplace e ICMS entre estados.", photo: { src: segEcommerce, alt: "Entrega de uma caixa de encomenda" } },
      { name: "Prestadores de serviço", text: "Clínicas, agências, TI e consultorias.", photo: { src: segServicos, alt: "Equipe trabalhando com notebooks em uma mesa" } },
      { name: "Pequena indústria", text: "Custo de produção e incentivos fiscais.", photo: { src: segIndustria, alt: "Mãos trabalhando em uma bancada de produção" } },
    ] satisfies { name: string; text: string; photo: Photo }[],
  },

  migration: {
    title: "Trocar de contador leva 30 dias",
    text: "A gente cuida de tudo com o seu contador atual. Você não perde prazo nem precisa reunir papel.",
    photo: { src: escritorio, alt: "Escritório amplo e iluminado" } satisfies Photo,
    steps: [
      { title: "Conversa de diagnóstico", text: "Entendemos a empresa e revisamos os últimos impostos pagos." },
      { title: "Proposta com valor fechado", text: "Sem surpresa na mensalidade." },
      { title: "Transferência dos documentos", text: "Pedimos tudo ao escritório anterior." },
      { title: "Primeiro fechamento com a gente", text: "Relatório entregue e explicado em reunião." },
    ],
  },

  testimonials: {
    title: "Empresários que dormem tranquilos",
    photo: { src: escritorioMesa, alt: "Mesa de trabalho do escritório" } satisfies Photo,
    items: [
      {
        name: "Juliana Prado",
        company: "Loja de roupas, 12 funcionários",
        quote: "Na revisão do regime descobriram que eu pagava imposto a mais havia dois anos. O escritório se pagou no primeiro mês.",
      },
      {
        name: "Ricardo Menezes",
        company: "Agência de marketing",
        quote: "Pergunto pelo WhatsApp e tenho resposta no mesmo dia, de alguém que conhece a minha empresa.",
      },
      {
        name: "Patrícia Oliveira",
        company: "E-commerce de cosméticos",
        quote: "Organizaram as notas dos marketplaces e hoje eu sei exatamente quanto lucro em cada canal.",
      },
    ],
  },

  finalCta: {
    title: "Vamos conversar sobre a sua empresa?",
    text: "A primeira conversa é sem custo e sem compromisso. Em 30 minutos você sai com um diagnóstico do que dá para melhorar.",
    photo: { src: ctaAssinatura, alt: "" } satisfies Photo,
    crc: "CRC-SP 2SP 034.521/O-7",
  },
};

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}, ${site.address.postalCode}`;
