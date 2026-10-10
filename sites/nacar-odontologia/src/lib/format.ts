import { site } from "@/content/site";

export function whatsappUrl(message: string = site.whatsapp.greeting): string {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
