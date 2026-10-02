import { baseApi } from "./baseApi";
import type { LeadCreateRequest, LeadCreateResponse } from "@/types/api";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // POST /leads/ — "Купить в 1 клик", qayta qo'ng'iroq, konsultatsiya
    createLead: build.mutation<LeadCreateResponse, LeadCreateRequest>({
      query: (body) => ({ url: "leads/", method: "POST", body }),
    }),
  }),
});

export const { useCreateLeadMutation } = ordersApi;
