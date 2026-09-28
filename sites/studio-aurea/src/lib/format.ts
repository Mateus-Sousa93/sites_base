import { site } from "@/content/site";

export function whatsappUrl(message: string = site.whatsapp.greeting): string {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  // Intl usa espaço não separável entre "R$" e o número, o que evita quebra de linha.
  return brl.format(value);
}
