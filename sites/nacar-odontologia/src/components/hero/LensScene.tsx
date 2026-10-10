"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  Color,
  DataTexture,
  LinearFilter,
  MathUtils,
  NeutralToneMapping,
  SRGBColorSpace,
  type Group,
  type Material,
  type MeshPhysicalMaterial,
  type WebGLRenderer,
} from "three";
import { useMediaQuery } from "@/motion/useReducedMotion";
import { createLensGeometry } from "./lensGeometry";
import { lensPose, smoothstep } from "./pose";

export type LensQuality = "high" | "low";

export type LensSceneProps = {
  /** Progresso do palco, de 0 a 1, lido a cada quadro. */
  progressRef: { current: number };
  /** Caixa que a lente ocupa em repouso; a altura dela é a altura da lente. */
  homeRef: RefObject<HTMLElement | null>;
  /** Desenha só enquanto verdadeiro. */
  active: boolean;
  /** `low`: DPR 1 e material sem transmissão. */
  quality: LensQuality;
  /** O primeiro quadro foi desenhado. */
  onReady: () => void;
  /** A taxa de quadros caiu: pede a qualidade baixa. */
  onDecline: () => void;
  /** O contexto WebGL foi perdido. */
  onLost: () => void;
};

// Câmera de teleobjetiva, como numa foto de produto: pouca perspectiva.
const CAMERA = { fov: 22, position: [0, 0, 8] as [number, number, number], near: 0.1, far: 60 };
const GL = { alpha: true, antialias: true, powerPreference: "high-performance" as const, toneMapping: NeutralToneMapping };
const RESIZE = { scroll: false, debounce: 0 };

// Altura da geometria: é ela que casa com a altura da caixa de repouso.
const LENS_HEIGHT = 1.3;
// Inclinação de repouso no plano da tela, em radianos; some conforme a lente cresce.
const LEAN = -0.2;
// A lente sai do lugar de repouso e chega ao centro da tela neste trecho.
const DRIFT_FROM = 0.06;
const DRIFT_TO = 0.6;
// Peso: quanto a lente demora para alcançar o scroll e o ponteiro (maior = mais ágil).
const FOLLOW_SCROLL = 6;
const FOLLOW_POINTER = 2.4;

// A luz de trás da lente: um plano do tamanho de 2,7 lentes, um pouco acima e à
// esquerda do centro dela (em unidades da lente, que tem 1 de largura).
const BACKLIGHT = { x: -0.1, y: 0.12, size: 2.7 };
// Quanto do corpo da porcelana é luz que a atravessa.
const TRANSMISSION = 0.6;

// Branco-pérola da porcelana. Sem transmissão, a parte do corpo que seria luz
// atravessada vira luz própria, e a cor difusa cai na mesma proporção.
const PORCELAIN = "#f6f2ea";
const PORCELAIN_DIM = new Color(PORCELAIN).multiplyScalar(1 - TRANSMISSION);
// Cores em sRGB: pérola (a da página), azul-gelo e tinta.
const PEARL = "#f4f1ec";
const WHITE = [252, 253, 255];
const ICE = [201, 221, 232];
const INK = [11, 16, 32];

// A luz que atravessa a porcelana: um disco branco no centro que esfria para
// azul-gelo e some na tinta da página. Na qualidade alta é uma luz atrás da
// lente, vista só através dela (refratada); na baixa é a mesma imagem aplicada
// sobre a lente como luz própria.
function createLightTexture() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  const mix = (from: number[], to: number[], t: number) => from.map((value, i) => value + (to[i] - value) * t);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const radius = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / (size / 2);
      const body = mix(INK, ICE, (1 - smoothstep(0.3, 0.98, radius)) ** 1.25);
      const pixel = mix(body, WHITE, (1 - smoothstep(0.1, 0.62, radius)) * 0.9);
      data.set([...pixel, 255], (y * size + x) * 4);
    }
  }
  const texture = new DataTexture(data, size, size);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Espessura do filme de madrepérola (canal verde): ondas largas e irregulares,
// como as camadas do nácar. É ela que faz a cor do reflexo mudar ao longo da lente.
function createNacreTexture() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const wave =
        Math.sin(u * 3.1 + Math.sin(v * 2.3) * 1.4) * 0.6 + Math.sin(v * 3.9 - u * 1.6 + Math.sin(u * 2.7)) * 0.4;
      data.set([0, Math.round((0.62 + wave * 0.3) * 255), 0, 255], (y * size + x) * 4);
    }
  }
  const texture = new DataTexture(data, size, size);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Máscara das fontes de luz do estúdio: cheia no centro, esmaecendo até a
// borda, como o pano de uma caixa de luz. Sem ela o reflexo teria borda dura.
function createSoftboxTexture() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const radius = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / (size / 2);
      const value = Math.round((1 - smoothstep(0.3, 1, radius)) * 255);
      data.set([value, value, value, 255], (y * size + x) * 4);
    }
  }
  const texture = new DataTexture(data, size, size);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// A luz de trás só é desenhada no passe de transmissão (que tem um alvo de
// renderização próprio); no quadro final ela não aparece: quem ilumina a
// página atrás da lente é o brilho em CSS.
const onlyThroughTheLens = (renderer: WebGLRenderer, _scene: unknown, _camera: unknown, _geometry: unknown, material: Material) => {
  material.colorWrite = renderer.getRenderTarget() !== null;
};

type LensProps = Pick<LensSceneProps, "progressRef" | "homeRef" | "onReady" | "onLost"> & {
  transmissive: boolean;
  pointer: boolean;
};

function Lens({ progressRef, homeRef, onReady, onLost, transmissive, pointer }: LensProps) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const place = useRef<Group>(null);
  const lean = useRef<Group>(null);
  const turn = useRef<Group>(null);
  const material = useRef<MeshPhysicalMaterial>(null);
  const geometry = useMemo(() => createLensGeometry({ segments: 160 }), []);
  const light = useMemo(() => createLightTexture(), []);
  // A mesma luz, recortada no trecho que fica atrás da lente em repouso, para
  // ser aplicada sobre ela quando não há transmissão.
  const glow = useMemo(() => {
    const map = light.clone();
    map.repeat.set(1 / BACKLIGHT.size, LENS_HEIGHT / BACKLIGHT.size);
    map.offset.set(0.5 - (0.5 + BACKLIGHT.x) / BACKLIGHT.size, 0.5 - (LENS_HEIGHT / 2 + BACKLIGHT.y) / BACKLIGHT.size);
    map.needsUpdate = true;
    return map;
  }, [light]);
  const nacre = useMemo(() => createNacreTexture(), []);
  useEffect(
    () => () => {
      geometry.dispose();
      light.dispose();
      glow.dispose();
      nacre.dispose();
    },
    [geometry, light, glow, nacre],
  );

  // Estado da animação, fora do React: muda a cada quadro.
  const motion = useRef({ progress: -1, tiltX: 0, tiltY: 0, pointerX: 0, pointerY: 0, time: 0, frames: 0, compiled: false });

  // Onde o navegador permite, os programas do material compilam fora do quadro:
  // nada é desenhado até ficarem prontos e a página não engasga quando a cena
  // entra ou troca de material.
  useEffect(() => {
    const state = motion.current;
    let current = true;
    const done = () => {
      if (current) state.compiled = true;
    };
    state.compiled = false;
    if (gl.extensions.has("KHR_parallel_shader_compile")) gl.compileAsync(scene, camera).then(done, done);
    else done();
    return () => {
      current = false;
    };
  }, [gl, scene, camera, transmissive]);

  // Contexto perdido com a cena no ar (o sistema tomou a memória da placa, por
  // exemplo). Quando é a própria cena que sai, o ouvinte sai antes: o fiber
  // descarta o contexto ao desmontar, e isso não é uma falha.
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl, onLost]);

  useEffect(() => {
    if (!pointer) return;
    const state = motion.current;
    const onMove = (event: PointerEvent) => {
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      state.pointerX = 0;
      state.pointerY = 0;
    };
  }, [pointer]);

  // Prioridade 1: este componente é quem manda desenhar, e pode não desenhar.
  useFrame(({ size, viewport }, delta) => {
    const state = motion.current;
    const home = homeRef.current;
    if (!state.compiled || !home || !place.current || !lean.current || !turn.current || !material.current) return;

    const dt = Math.min(delta, 0.1);
    const target = progressRef.current;
    state.progress = state.progress < 0 ? target : MathUtils.damp(state.progress, target, FOLLOW_SCROLL, dt);
    const p = state.progress;
    const pose = lensPose(p);

    // Com a tela inteira já clara não há o que desenhar.
    if (pose.glow >= 1 && target >= p) return;

    // Vida própria só perto do repouso: flutuação lenta e inclinação pelo
    // ponteiro. Os primeiros quadros são a pose exata da lente em CSS; a vida
    // entra aos poucos, depois que a troca de uma pela outra terminou, e some
    // conforme a lente cresce.
    state.time += dt;
    const alive = smoothstep(0.8, 2.8, state.time) * (1 - smoothstep(0.02, 0.4, p));
    state.tiltX = MathUtils.damp(state.tiltX, state.pointerY * 0.12, FOLLOW_POINTER, dt);
    state.tiltY = MathUtils.damp(state.tiltY, state.pointerX * 0.2, FOLLOW_POINTER, dt);
    const t = state.time;

    // Onde a lente fica: do centro da caixa de repouso ao centro da janela. As
    // duas medidas são relativas ao canvas, em pixels, e viram unidades da cena.
    const canvas = gl.domElement.getBoundingClientRect();
    const box = home.getBoundingClientRect();
    const unit = 1 / viewport.factor;
    const fromX = box.left + box.width / 2 - canvas.left - size.width / 2;
    const fromY = box.top + box.height / 2 - canvas.top - size.height / 2;
    const toX = window.innerWidth / 2 - canvas.left - size.width / 2;
    const toY = window.innerHeight / 2 - canvas.top - size.height / 2;
    const drift = MathUtils.smootherstep(p, DRIFT_FROM, DRIFT_TO);
    const rest = (box.height * unit) / LENS_HEIGHT;

    place.current.position.set(
      MathUtils.lerp(fromX, toX, drift) * unit,
      -MathUtils.lerp(fromY, toY, drift) * unit + Math.sin(t * 0.9) * 0.02 * rest * alive,
      0,
    );
    place.current.scale.setScalar(rest * pose.scale);
    lean.current.rotation.z = LEAN * (1 - smoothstep(0.05, 0.7, p)) + Math.sin(t * 0.6 + 2) * 0.012 * alive;
    turn.current.rotation.set(
      pose.rotX + (state.tiltX + Math.sin(t * 0.7) * 0.03) * alive,
      pose.rotY + (state.tiltY + Math.sin(t * 0.5 + 1) * 0.05) * alive,
      0,
    );
    // Na virada a própria porcelana clareia até a cor da página.
    material.current.emissiveIntensity = (transmissive ? 0 : TRANSMISSION) + pose.glow;

    gl.render(scene, camera);
    // "Pronta" quer dizer que há imagem no canvas, não só comandos na fila da
    // GPU: espera uma vez o segundo quadro terminar de ser desenhado.
    if (++state.frames === 2) {
      gl.getContext().finish();
      onReady();
    }
  }, 1);

  return (
    <group ref={place}>
      {transmissive && (
        <mesh position={[BACKLIGHT.x, BACKLIGHT.y, -0.4]} scale={BACKLIGHT.size} onBeforeRender={onlyThroughTheLens}>
          <planeGeometry />
          <meshBasicMaterial map={light} toneMapped={false} depthTest={false} depthWrite={false} />
        </mesh>
      )}
      <group ref={lean}>
        <group ref={turn}>
          <mesh geometry={geometry}>
            {/* Porcelana: corpo leitoso que deixa passar parte da luz que vem de
                trás, esmalte liso por cima e um filme fino que dá o reflexo de
                madrepérola nos ângulos rasantes. */}
            <meshPhysicalMaterial
              ref={material}
              color={transmissive ? PORCELAIN : PORCELAIN_DIM}
              roughness={0.15}
              metalness={0}
              ior={1.5}
              transmission={transmissive ? TRANSMISSION : 0}
              thickness={0.4}
              clearcoat={1}
              clearcoatRoughness={0.12}
              sheen={0.7}
              sheenColor="#c9dde8"
              sheenRoughness={0.35}
              iridescence={1}
              iridescenceIOR={1.3}
              iridescenceThicknessRange={[100, 400]}
              iridescenceThicknessMap={nacre}
              emissive={transmissive ? PEARL : PORCELAIN}
              emissiveMap={transmissive ? null : glow}
              emissiveIntensity={0}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Estúdio: três fontes de luz num ambiente escuro, sem imagem externa. As
// posições contam com a pose de repouso da lente (virada para a esquerda): a
// luz principal se reflete no meio dela e escorre para a borda quando ela gira.
function Studio() {
  const softbox = useMemo(() => createSoftboxTexture(), []);
  useEffect(() => () => softbox.dispose(), [softbox]);

  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#222e44"]} />
      {/* Luz principal: área fria, alta e larga, à esquerda e acima. */}
      <Lightformer form="rect" map={softbox} color="#eaf3fb" intensity={12} position={[-8, 0.4, 3.2]} scale={[7, 13, 1]} />
      {/* Contraluz: painel largo atrás da lente. Só se reflete onde a superfície
          foge do olhar: desenha um fio de luz em todo o contorno e acende a
          madrepérola quando a lente passa de perfil. */}
      <Lightformer form="rect" map={softbox} color="#ffffff" intensity={6} position={[2, 1, -8]} scale={[13, 12, 1]} />
      {/* Preenchimento: mais fraco, largo, à direita e um pouco abaixo. É o que
          mantém a porcelana clara depois que ela dá as costas à luz principal. */}
      <Lightformer form="rect" map={softbox} color="#d5e4ee" intensity={4.5} position={[7, -1.5, 5]} scale={[9, 11, 1]} />
    </Environment>
  );
}

// A lente de porcelana em 3D: um canvas transparente do tamanho do palco.
export function LensScene({ progressRef, homeRef, active, quality, onReady, onDecline, onLost }: LensSceneProps) {
  const coarse = useMediaQuery("(pointer: coarse)", false);
  const high = quality === "high";

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={high ? [1, coarse ? 1.5 : 1.75] : 1}
      gl={GL}
      camera={CAMERA}
      resize={RESIZE}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => {
        // A luz de trás é larga e sem detalhe: meia resolução basta.
        gl.transmissionResolutionScale = 0.5;
      }}
    >
      {high && <PerformanceMonitor ms={200} iterations={8} bounds={() => [50, 60]} onDecline={onDecline} />}
      <Studio />
      {/* No toque o material já nasce sem transmissão, que é o passo mais caro. */}
      <Lens
        progressRef={progressRef}
        homeRef={homeRef}
        onReady={onReady}
        onLost={onLost}
        transmissive={high && !coarse}
        pointer={!coarse}
      />
    </Canvas>
  );
}
