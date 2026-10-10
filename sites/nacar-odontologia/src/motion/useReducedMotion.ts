"use client";

import { useCallback, useSyncExternalStore } from "react";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Acompanha uma media query. No servidor e durante a hidratação vale
// `serverValue`; depois, o valor real, atualizado a cada mudança.
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

// Verdadeiro quando o sistema pede movimento reduzido. No servidor e durante a
// hidratação também é verdadeiro: a página nasce estática e o movimento só
// entra depois que o JavaScript sobe.
export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY, true);
}
