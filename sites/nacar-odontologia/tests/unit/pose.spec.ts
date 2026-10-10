import { expect, test } from "@playwright/test";
import { lensPose } from "@/components/hero/pose";

test("extremos e limites", () => {
  expect(lensPose(0)).toEqual({ rotY: -0.6, rotX: 0.25, scale: 1, glow: 0 });
  const end = lensPose(1);
  expect(end.rotY).toBeCloseTo(Math.PI);
  expect(end.rotX).toBeCloseTo(0);
  expect(end.scale).toBeCloseTo(10);
  expect(end.glow).toBe(1);
  expect(lensPose(-1)).toEqual(lensPose(0));
  expect(lensPose(2)).toEqual(lensPose(1));
});

test("escala nunca diminui", () => {
  const s = Array.from({ length: 21 }, (_, i) => lensPose(i / 20).scale);
  expect(s.every((v, i) => i === 0 || v >= s[i - 1])).toBe(true);
});

test("a virada só começa com a lente grande e termina antes do fim do palco", () => {
  expect(lensPose(0.78).glow).toBe(0);
  expect(lensPose(0.88).glow).toBeCloseTo(0.5);
  expect(lensPose(0.98).glow).toBe(1);
  expect(lensPose(0.78).scale).toBeGreaterThan(5);
  const glow = Array.from({ length: 41 }, (_, i) => lensPose(i / 40).glow);
  expect(glow.every((v, i) => i === 0 || v >= glow[i - 1])).toBe(true);
});
