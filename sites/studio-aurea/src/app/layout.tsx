import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Karla } from "next/font/google";
import { site, fullAddress } from "@/content/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const description = `Limpeza de pele, peeling químico, microagulhamento e drenagem linfática em ${site.address.city}. Avaliação antes de qualquer procedimento.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | Estética facial e corporal em ${site.address.city}`,
  description,
  openGraph: {
    title: site.name,
    description,
    locale: "pt_BR",
    type: "website",
    siteName: site.name,
  },
  robots: site.demo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#f2ece8",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
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
  openingHoursSpecification: site.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    ...h.schema,
  })),
  makesOffer: site.treatments.items.map((t) => ({
    "@type": "Offer",
    price: t.price,
    priceCurrency: "BRL",
    itemOffered: { "@type": "Service", name: t.name },
  })),
  description: `${description} ${fullAddress}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${karla.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
