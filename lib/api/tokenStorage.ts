import type { TokenPair } from "./types";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

const isBrowser = () => typeof window !== "undefined";

export const tokenStorage = {
  getAccess: () => (isBrowser() ? localStorage.getItem(ACCESS_KEY) : null),
  getRefresh: () => (isBrowser() ? localStorage.getItem(REFRESH_KEY) : null),
  set: ({ access, refresh }: TokenPair) => {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
