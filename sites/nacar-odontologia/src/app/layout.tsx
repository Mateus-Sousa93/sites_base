import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Instrument_Serif } from "next/font/google";
import { fullAddress, site } from "@/content/site";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${hostGrotesk.variable} ${instrumentSerif.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
