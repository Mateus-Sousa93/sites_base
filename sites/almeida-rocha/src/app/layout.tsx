import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { fullAddress, site } from "@/content/site";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const description = `Escritório de contabilidade em ${site.address.city}: abertura de empresa, contabilidade, impostos, folha de pagamento e BPO financeiro para pequenas e médias empresas.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | Contabilidade para empresas em ${site.address.city}`,
  description,
  openGraph: { title: site.name, description, locale: "pt_BR", type: "website", siteName: site.name },
  robots: site.demo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#121a33",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
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
    <html lang="pt-BR" className={schibsted.variable}>
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
