import type { Metadata, Viewport } from "next";
import { Archivo, Big_Shoulders } from "next/font/google";
import { fullAddress, site } from "@/content/site";
import "./globals.css";

const shoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-shoulders",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const description = `Bikes de mountain bike, speed, urbanas e elétricas, equipamentos e oficina própria em ${site.address.city}. Test ride na loja, 12x sem juros e desconto no PIX.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | Bikes, elétricas e oficina em ${site.address.city}`,
  description,
  openGraph: { title: site.name, description, locale: "pt_BR", type: "website", siteName: site.name },
  robots: site.demo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#15171b",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "BikeStore",
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
  description: `${description} ${fullAddress}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${shoulders.variable} ${archivo.variable}`}>
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
