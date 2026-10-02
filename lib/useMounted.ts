import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Serverda false, brauzerda true. localStorage'dagi ma'lumotni (sanoq, badge)
// hydration xatosisiz ko'rsatish uchun.
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
