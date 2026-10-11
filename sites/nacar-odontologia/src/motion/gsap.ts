import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Ponto único de entrada do GSAP: os componentes importam daqui, nunca direto do
// pacote, para os plugins estarem sempre registrados.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// No celular a barra de endereço muda a altura da janela durante o scroll; sem
// isto cada mudança recalcularia todos os gatilhos.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, useGSAP };
