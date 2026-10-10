// Todo o conteúdo do site fica aqui. Para adaptar a outra clínica, troque os
// dados abaixo: nenhum componente tem texto de negócio escrito no JSX.
//
// Regra de conteúdo: nada de preço nem de gratuidade em nenhum texto. A
// publicidade odontológica é regulada pelo CFO.

export type OpeningHours = {
  days: string;
  hours: string;
  schema: { dayOfWeek: string[]; opens: string; closes: string };
};

export type Stat = { value: string; label: string };

export const site = {
  name: "Nácar Odontologia",
  // Marca tipográfica do cabeçalho: nome curto e descritor.
  brand: { mark: "Nácar", descriptor: "Odontologia" },
  url: "https://nacar.estudioconceito.com",
  demo: true,

  seo: {
    title: "Nácar Odontologia | Lentes, implantes e alinhadores em Uberlândia",
    description:
      "Clínica odontológica em Uberlândia com lentes de contato dental, implantes, alinhadores invisíveis e clareamento. Planejamento digital em 3D: você vê o resultado antes de começar.",
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
    { label: "Planejamento", href: "#planejamento" },
    { label: "Espaço", href: "#espaco" },
    { label: "Equipe", href: "#equipe" },
  ],

  header: {
    cta: "Agendar",
  },

  hero: {
    // O título quebra em linhas fixas; a última vai em serifa itálica azul-gelo.
    titleLines: ["O sorriso que", "você sempre"],
    titleAccent: "quis ver.",
    lead: "Lentes de contato dental, implantes e alinhadores com planejamento digital, em Uberlândia. Você vê o resultado na tela antes de decidir.",
    cta: "Agendar avaliação",
    // Legenda do objeto em destaque.
    caption: "Lente de porcelana · 0,3 mm",
    trust: [
      { value: "12 anos", label: "de clínica em Uberlândia" },
      { value: "4,9", label: "no Google, em 640 avaliações" },
      { value: "3D", label: "em todo planejamento" },
    ] satisfies Stat[],
  },

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
};

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}, ${site.address.postalCode}`;
