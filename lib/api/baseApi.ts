import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { tokenStorage } from "./tokenStorage";
import type { TokenPair } from "./types";

// next.config.ts dagi rewrite orqali backendga boradi
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api/v1",
  credentials: "include",
  prepareHeaders: (headers) => {
    const access = tokenStorage.getAccess();
    if (access) headers.set("Authorization", `Bearer ${access}`);
    return headers;
  },
});

// 401 bo'lsa refresh token bilan yangi access token olib, so'rovni qayta yuboradi
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const refresh = tokenStorage.getRefresh();
  if (result.error?.status === 401 && refresh) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/token/refresh", method: "POST", body: { refresh } },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      tokenStorage.set(refreshResult.data as TokenPair);
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      tokenStorage.clear();
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Cart",
    "Profile",
    "Orders",
    "Faq",
    "Banners",
    "Home",
    "Categories",
    "Brands",
    "Products",
    "Promotions",
    "News",
  ],
  endpoints: () => ({}),
});
