import { BufferAttribute, BufferGeometry } from "three";

export type LensGeometryOptions = {
  /** Largura (eixo x). Padrão: 1. */
  width?: number;
  /** Altura (eixo y), do colo à borda incisal. Padrão: 1,3. */
  height?: number;
  /** Flecha da face convexa (eixo z). Padrão: 0,22. */
  depth?: number;
  /** Espessura da casca no centro; afina até a borda, que é arredondada. Padrão: 0,035. */
  thickness?: number;
  /** Divisões ao longo do contorno. Padrão: 64. */
  segments?: number;
};

// Expoentes da superelipse em cada trecho do contorno: 2 é uma elipse, quanto
// maior, mais quadrado. Em cima (o colo) o arco é redondo; embaixo (a borda
// incisal) é quase reto, com um canto mais vivo que o outro, como num dente.
const TOP = 2.7;
const BOTTOM_LEFT = 4.6;
const BOTTOM_RIGHT = 3.6;
// Quanto o colo é mais estreito que a borda incisal.
const TAPER = 0.15;
// Curvatura ao longo da altura em relação à da largura: a lente abraça o dente
// de lado a lado e quase não curva de cima a baixo.
const VERTICAL_CURVE = 0.28;
// Dois sulcos verticais muito rasos dividem a face em três lóbulos, como num
// incisivo: profundidade em relação à flecha, posição e largura em relação à
// meia largura. São mais marcados perto da borda incisal e somem rumo ao colo.
const GROOVE_DEPTH = 0.05;
const GROOVE_AT = 0.36;
const GROOVE_WIDTH = 0.17;
// Fração do raio, junto à borda, em que as duas faces se fecham em meia-cana.
const EDGE = 0.07;
// Quanto da espessura do centro a casca ainda tem onde a borda começa a fechar.
const EDGE_THICKNESS = 0.7;

// Ponto do contorno no ângulo dado, em coordenadas de -1 a 1 (antes de a
// largura ser normalizada).
function outlinePoint(theta: number): [number, number] {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const exponent = 2 / (sin >= 0 ? TOP : cos >= 0 ? BOTTOM_RIGHT : BOTTOM_LEFT);
  const y = Math.sign(sin) * Math.abs(sin) ** exponent;
  const narrowing = 1 - TAPER * ((y + 1) / 2) ** 2;
  return [Math.sign(cos) * Math.abs(cos) ** exponent * narrowing, y];
}

// Casca fina e convexa em forma de lente de contato dental. A face convexa
// olha para +z; a côncava fica `thickness` atrás dela no centro. A casca afina
// para a borda, onde as duas faces se fecham em meia-cana e se encontram num
// anel de vértices compartilhado: a malha é fechada e a borda, arredondada,
// pega luz. A malha mede width × height, com a origem no centro; `depth` é a
// flecha da face convexa (a meia-cana da borda passa um nada dela para trás).
export function createLensGeometry({
  width = 1,
  height = 1.3,
  depth = 0.22,
  thickness = 0.035,
  segments = 64,
}: LensGeometryOptions = {}): BufferGeometry {
  const rings = Math.max(6, Math.round(segments * 0.375));

  // Contorno com a largura normalizada: x e y vão exatamente de -1 a 1.
  const outline = Array.from({ length: segments }, (_, j) => outlinePoint((j / segments) * Math.PI * 2));
  const xs = outline.map(([x]) => x);
  const left = Math.min(...xs);
  const span = Math.max(...xs) - left;
  for (const point of outline) point[0] = ((point[0] - left) / span) * 2 - 1;

  // Quanto a face convexa recua em cada ponto; o maior recuo fica na borda.
  const sag = (x: number, y: number) => x * x + VERTICAL_CURVE * y * y;
  const groove = (x: number, y: number) => {
    const bell = (center: number) => Math.exp(-(((x - center) / GROOVE_WIDTH) ** 2));
    const towardEdge = Math.min(1, Math.max(0, (0.55 - y) / 1.3));
    return GROOVE_DEPTH * (bell(GROOVE_AT) + bell(-GROOVE_AT)) * towardEdge * towardEdge * (3 - 2 * towardEdge);
  };
  const deepest = Math.max(...outline.map(([x, y]) => sag(x, y)));

  // Espessura ao longo do raio `u` (0 no centro, 1 na borda): afina devagar e,
  // no último trecho, fecha em arco. A face convexa cede metade do fechamento e
  // a côncava a outra metade: a borda fica no meio da espessura.
  const edgeStart = 1 - EDGE;
  const edgeThickness = thickness * EDGE_THICKNESS;
  const shell = (u: number) => {
    if (u <= edgeStart) return thickness * (1 - (1 - EDGE_THICKNESS) * (u / edgeStart) ** 2);
    return edgeThickness * Math.sqrt(Math.max(0, 1 - ((u - edgeStart) / EDGE) ** 2));
  };
  const dome = depth - edgeThickness / 2;

  const frontCount = 1 + rings * segments;
  const backCount = 1 + (rings - 1) * segments;
  const positions = new Float32Array((frontCount + backCount) * 3);
  const uvs = new Float32Array((frontCount + backCount) * 2);

  const put = (index: number, x: number, y: number, back: boolean, u: number) => {
    const closing = u > edgeStart ? (edgeThickness - shell(u)) / 2 : 0;
    // Os sulcos acabam antes da borda, que fica lisa.
    const lobes = dome * groove(x, y) * (1 - u ** 4);
    const z = dome * (1 - sag(x, y) / deepest) - lobes + edgeThickness / 2 - closing - (back ? shell(u) : 0);
    positions.set([(x * width) / 2, (y * height) / 2, z - depth / 2], index * 3);
    uvs.set([x / 2 + 0.5, y / 2 + 0.5], index * 2);
  };

  // Índice do vértice no anel `ring` (1 é o de dentro) e na divisão `j`. O
  // último anel, a borda, é o mesmo para as duas faces.
  const vertex = (back: boolean, ring: number, j: number) =>
    (back && ring < rings ? frontCount : 0) + 1 + (ring - 1) * segments + (j % segments);

  put(0, 0, 0, false, 0);
  put(frontCount, 0, 0, true, 0);
  for (let ring = 1; ring <= rings; ring++) {
    // Anéis mais juntos perto da borda, onde a casca fecha e a luz desenha o fio.
    const u = 1 - (1 - ring / rings) ** 1.7;
    for (let j = 0; j < segments; j++) {
      const [x, y] = outline[j];
      put(vertex(false, ring, j), x * u, y * u, false, u);
      if (ring < rings) put(vertex(true, ring, j), x * u, y * u, true, u);
    }
  }

  // Triângulos no sentido anti-horário vistos de fora: de +z na face convexa,
  // de -z na côncava.
  const indices: number[] = [];
  const triangle = (back: boolean, a: number, b: number, c: number) =>
    back ? indices.push(a, c, b) : indices.push(a, b, c);
  for (const back of [false, true]) {
    const center = back ? frontCount : 0;
    for (let j = 0; j < segments; j++) {
      triangle(back, center, vertex(back, 1, j), vertex(back, 1, j + 1));
      for (let ring = 1; ring < rings; ring++) {
        const a = vertex(back, ring, j);
        const b = vertex(back, ring + 1, j);
        const c = vertex(back, ring + 1, j + 1);
        const d = vertex(back, ring, j + 1);
        triangle(back, a, b, c);
        triangle(back, a, c, d);
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
