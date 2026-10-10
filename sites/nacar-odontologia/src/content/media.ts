// Referências de mídia. O manifesto é gerado pelo script de ingestão a partir de
// midia-bruta/ e começa vazio: enquanto um arquivo não chega, `src` é nulo e o
// site mostra um marcador no lugar.

import manifest from "./media-manifest.json";

type ManifestEntry = { src: string; poster?: string; width: number; height: number };

export type Media = {
  // Nome do arquivo esperado, como está no MIDIA.md (ex.: "lente.mp4").
  file: string;
  alt: string;
  kind: "video" | "image";
  src: string | null;
  poster: string | null;
  // Dimensões do arquivo processado; 0 enquanto ele não existe.
  width: number;
  height: number;
};

const entries: Record<string, ManifestEntry | undefined> = manifest;
const videoFile = /\.(mp4|webm|mov)$/i;

export function media(file: string, alt: string): Media {
  const entry = entries[file];
  return {
    file,
    alt,
    kind: videoFile.test(file) ? "video" : "image",
    src: entry?.src ?? null,
    poster: entry?.poster ?? null,
    width: entry?.width ?? 0,
    height: entry?.height ?? 0,
  };
}
