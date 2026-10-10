import { expect, test } from "@playwright/test";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";

test("whatsappUrl usa o número do estúdio e codifica a mensagem", () => {
  expect(whatsappUrl("Olá, tudo bem?")).toBe("https://wa.me/5534992011427?text=Ol%C3%A1%2C%20tudo%20bem%3F");
});

test("whatsappUrl sem argumento usa a saudação do site", () => {
  expect(whatsappUrl()).toBe(`https://wa.me/5534992011427?text=${encodeURIComponent(site.whatsapp.greeting)}`);
  expect(site.whatsapp.greeting).toBe(
    "Olá, Estúdio Conceito! Vi o site demonstrativo da Nácar Odontologia e quero saber mais sobre um projeto assim.",
  );
});
