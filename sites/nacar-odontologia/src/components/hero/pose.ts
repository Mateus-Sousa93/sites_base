// Pose da lente ao longo do palco do hero. Função pura: não conhece three nem
// DOM, e serve tanto à cena 3D quanto à camada da virada.

export type LensPose = {
  /** Giro em torno do eixo vertical, em radianos: de três quartos até as costas. */
  rotY: number;
  /** Inclinação para a frente, em radianos. */
  rotX: number;
  /** Fator sobre o tamanho de repouso: em 10 a lente cobre a tela. */
  scale: number;
  /** Quanto a tela já clareou, de 0 a 1 (a virada). */
  glow: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

export function lensPose(p: number): LensPose {
  const t = clamp01(p);
  return {
    rotY: -0.6 + (Math.PI + 0.6) * t,
    rotX: 0.25 - 0.25 * t,
    scale: 1 + 9 * t ** 3,
    glow: smoothstep(0.78, 0.98, t),
  };
}
