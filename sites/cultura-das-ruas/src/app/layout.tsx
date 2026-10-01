import type { Metadata, Viewport } from 'next';
import { Archivo, Big_Shoulders } from 'next/font/google';
import { brand } from '../content';
import './globals.css';

const heading = Big_Shoulders({ subsets: ['latin'], weight: ['600', '700', '800', '900'], variable: '--font-heading', display: 'swap', adjustFontFallback: false, fallback: ['Impact', 'Arial Narrow', 'sans-serif'] });
const body = Archivo({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: `${brand.name} | Sneakers e streetwear`,
  description: 'Sneakers, roupas e atitude. Conheça o Drop 01 da Cultura das Ruas.',
  robots: { index: false, follow: false },
  openGraph: { title: brand.name, description: 'Sneakers, roupas e atitude. Conheça o Drop 01.', type: 'website', locale: 'pt_BR', images: ['/images/hero.jpg'] },
};
export const viewport: Viewport = { themeColor: '#151515' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${heading.variable} ${body.variable}`}><body><a href="#conteudo" className="skip">Pular para o conteúdo</a>{children}</body></html>;
}
