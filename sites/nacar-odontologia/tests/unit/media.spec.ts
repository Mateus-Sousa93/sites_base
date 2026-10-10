import { expect, test } from "@playwright/test";
import { media } from "@/content/media";

test("arquivo fora do manifesto devolve src nulo e mantém nome e alt", () => {
  expect(media("arquivo-que-nao-existe.mp4", "Lente girando")).toEqual({
    file: "arquivo-que-nao-existe.mp4",
    alt: "Lente girando",
    kind: "video",
    src: null,
    poster: null,
    width: 0,
    height: 0,
  });
});

test("o tipo vem da extensão do arquivo", () => {
  expect(media("clipe.mp4", "").kind).toBe("video");
  expect(media("clipe.WEBM", "").kind).toBe("video");
  expect(media("retrato.png", "").kind).toBe("image");
  expect(media("retrato.jpg", "").kind).toBe("image");
});
