import type { TokenPair } from "./types";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

const isBrowser = () => typeof window !== "undefined";

// "Запомнить меня" belgilangan bo'lsa — localStorage (brauzer yopilsa ham qoladi),
// aks holda sessionStorage (tab/brauzer yopilganda o'chadi)
const storeWithTokens = () =>
  sessionStorage.getItem(ACCESS_KEY) !== null ? sessionStorage : localStorage;

const read = (key: string) =>
  isBrowser() ? sessionStorage.getItem(key) ?? localStorage.getItem(key) : null;

export const tokenStorage = {
  getAccess: () => read(ACCESS_KEY),
  getRefresh: () => read(REFRESH_KEY),
  // remember berilmasa (masalan token yangilanganda) — tokenlar turgan joyda qoladi
  set: ({ access, refresh }: TokenPair, remember?: boolean) => {
    if (!isBrowser()) return;
    const store =
      remember === undefined ? storeWithTokens() : remember ? localStorage : sessionStorage;
    if (remember !== undefined) tokenStorage.clear();
    store.setItem(ACCESS_KEY, access);
    if (refresh) store.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    if (!isBrowser()) return;
    for (const store of [localStorage, sessionStorage]) {
      store.removeItem(ACCESS_KEY);
      store.removeItem(REFRESH_KEY);
    }
  },
};
