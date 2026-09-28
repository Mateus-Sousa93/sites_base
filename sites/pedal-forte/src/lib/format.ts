import { site } from "@/content/site";

export function whatsappUrl(message: string = site.whatsapp.greeting): string {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

const whole = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

export function formatPrice(value: number): string {
  return whole.format(value);
}

export function pixPrice(value: number): string {
  return cents.format(value * (1 - site.pixDiscount));
}

export function installment(value: number): string {
  return `${site.installments}x de ${cents.format(value / site.installments)}`;
}
