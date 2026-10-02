import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://yeteper714.pythonanywhere.com/api/v1/";

// Barcha endpointlar shu bitta API ga injectEndpoints orqali qo'shiladi
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access");
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Home", "Categories", "Brands", "Products", "Promotions", "News", "Banners"],
  endpoints: () => ({}),
});
