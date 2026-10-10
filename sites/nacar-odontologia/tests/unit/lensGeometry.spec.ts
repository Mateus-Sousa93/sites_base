import { expect, test } from "@playwright/test";
import type { BufferGeometry } from "three";
import { createLensGeometry } from "@/components/hero/lensGeometry";

const size = (g: BufferGeometry) => {
  g.computeBoundingBox();
  return g.boundingBox!.max.clone().sub(g.boundingBox!.min);
};

test("geometria fechada, finita e nas dimensões pedidas", () => {
  const g = createLensGeometry();
  g.computeBoundingBox();
  const pos = g.getAttribute("position");
  expect(pos.count).toBeGreaterThan(1000);
  expect(Array.from(pos.array).every(Number.isFinite)).toBe(true);
  expect(g.getAttribute("normal")).toBeTruthy();
  const size = g.boundingBox!.max.clone().sub(g.boundingBox!.min);
  expect(size.x).toBeCloseTo(1, 1);
  expect(size.y).toBeCloseTo(1.3, 1);
});

test("fechada de fato: cada aresta pertence a exatamente dois triângulos, em sentidos opostos", () => {
  const g = createLensGeometry();
  const index = g.getIndex()!;
  const directed = new Map<string, number>();
  let degenerate = 0;
  for (let i = 0; i < index.count; i += 3) {
    const tri = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
    if (new Set(tri).size < 3) degenerate++;
    for (let k = 0; k < 3; k++) {
      const key = `${tri[k]}>${tri[(k + 1) % 3]}`;
      directed.set(key, (directed.get(key) ?? 0) + 1);
    }
  }
  // Uma única asserção: cada `expect` vira um passo no relatório, e são
  // milhares de arestas.
  const open = Array.from(directed).filter(([key, count]) => {
    const [a, b] = key.split(">");
    return count !== 1 || directed.get(`${b}>${a}`) !== 1;
  });
  expect(index.count).toBeGreaterThan(3000);
  expect(degenerate).toBe(0);
  expect(open).toEqual([]);
});

test("normais unitárias e apontando para fora: a face convexa olha para +z", () => {
  const g = createLensGeometry();
  const pos = g.getAttribute("position");
  const normal = g.getAttribute("normal");
  let front = -1;
  let back = -1;
  let worstLength = 0;
  for (let i = 0; i < pos.count; i++) {
    const length = Math.hypot(normal.getX(i), normal.getY(i), normal.getZ(i));
    worstLength = Math.max(worstLength, Math.abs(length - 1));
    // Os dois pontos sobre o eixo: o cume da face convexa e o fundo da côncava.
    if (Math.abs(pos.getX(i)) < 1e-9 && Math.abs(pos.getY(i)) < 1e-9) {
      if (front < 0 || pos.getZ(i) > pos.getZ(front)) front = i;
      if (back < 0 || pos.getZ(i) < pos.getZ(back)) back = i;
    }
  }
  expect(worstLength).toBeLessThan(1e-4);
  expect(front).not.toBe(back);
  expect(normal.getZ(front)).toBeGreaterThan(0.99);
  expect(normal.getZ(back)).toBeLessThan(-0.99);
  // Espessura da casca no centro.
  expect(pos.getZ(front) - pos.getZ(back)).toBeCloseTo(0.035, 3);
});

test("casca convexa e rasa, mais estreita em cima que embaixo", () => {
  const g = createLensGeometry();
  expect(size(g).z).toBeCloseTo(0.22, 1);

  // Largura do contorno a 70% da meia altura, acima e abaixo do centro.
  const pos = g.getAttribute("position");
  const widthAt = (y: number) => {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getY(i) - y) > 0.02) continue;
      min = Math.min(min, pos.getX(i));
      max = Math.max(max, pos.getX(i));
    }
    return max - min;
  };
  const upper = widthAt(0.65 * 0.7);
  const lower = widthAt(-0.65 * 0.7);
  expect(upper).toBeGreaterThan(0.4);
  expect(lower).toBeGreaterThan(upper + 0.08);
});

test("opções: dimensões e número de segmentos", () => {
  const g = createLensGeometry({ width: 2, height: 3, depth: 0.5, thickness: 0.1, segments: 32 });
  const s = size(g);
  expect(s.x).toBeCloseTo(2, 5);
  expect(s.y).toBeCloseTo(3, 5);
  // A flecha é a da face convexa; a meia-cana da borda passa um nada dela.
  expect(s.z).toBeGreaterThanOrEqual(0.5);
  expect(s.z).toBeLessThan(0.51);
  expect(createLensGeometry({ segments: 128 }).getAttribute("position").count).toBeGreaterThan(
    createLensGeometry().getAttribute("position").count,
  );
});
