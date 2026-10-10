import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Instrument_Serif } from "next/font/google";
import { fullAddress, site } from "@/content/site";
import { SmoothScroll } from "@/motion/SmoothScroll";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  display: "swap",
});

// Serifa itálica: só em palavras-chave.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seo.title,
  description: site.seo.description,
  openGraph: {
    title: site.name,
    description: site.seo.description,
    locale: "pt_BR",
    type: "website",
    siteName: site.name,
  },
  robots: site.demo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: site.name,
  url: site.url,
  telephone: `+${site.whatsapp.number}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.postalCode,
    addressCountry: "BR",
  },
  openingHoursSpecification: site.hours.map((h) => ({ "@type": "OpeningHoursSpecification", ...h.schema })),
  description: `${site.seo.description} ${fullAddress}.`,
};

// Roda antes da primeira pintura: o CSS que depende de movimento (palcos altos)
// já nasce no estado certo. O <SmoothScroll> mantém o atributo depois disso. Sem
// JavaScript o atributo não existe e a página fica em fluxo normal.
const motionScript = `document.documentElement.dataset.motion=matchMedia("(prefers-reduced-motion: reduce)").matches?"off":"on"`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // O script do <head> e o Lenis escrevem atributos no <html> antes e depois da
    // hidratação; o React não deve estranhá-los.
    <html
      lang="pt-BR"
      className={`${hostGrotesk.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <SmoothScroll />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
