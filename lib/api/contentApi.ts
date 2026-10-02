import { baseApi } from "./baseApi";
import type { Banner, Faq, LeadCreateRequest, StaticPage } from "./types";

// Ochiq kontent: FAQ, bannerlar, statik sahifalar, arizalar (leads)
export const contentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFaq: build.query<Faq[], void>({
      query: () => "/faq",
      providesTags: ["Faq"],
    }),
    getBanners: build.query<Banner[], void>({
      query: () => "/banners",
      providesTags: ["Banners"],
    }),
    getStaticPage: build.query<StaticPage, string>({
      query: (slug) => `/pages/${slug}`,
    }),
    createLead: build.mutation<LeadCreateRequest & { id: number }, LeadCreateRequest>({
      query: (body) => ({ url: "/leads", method: "POST", body }),
    }),
  }),
});

export const {
  useGetFaqQuery,
  useGetBannersQuery,
  useGetStaticPageQuery,
  useCreateLeadMutation,
} = contentApi;
