import { baseApi } from "./baseApi";
import { tokenStorage } from "./tokenStorage";
import type {
  Detail,
  LoginRequest,
  LoginResponse,
  OrderList,
  Paginated,
  Profile,
  RegisterRequest,
} from "./types";

// Auth va shaxsiy kabinet: /api/v1/auth/*, /api/v1/user/*
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      // Tokenlarni tag'lar invalid bo'lishidan oldin saqlaymiz
      transformResponse: (data: LoginResponse) => {
        tokenStorage.set(data.tokens);
        return data;
      },
      invalidatesTags: ["Profile", "Orders", "Cart"],
    }),
    register: build.mutation<unknown, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    logout: build.mutation<Detail, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        body: { refresh: tokenStorage.getRefresh() ?? "" },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          tokenStorage.clear();
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    getProfile: build.query<Profile, void>({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),
    updateProfile: build.mutation<Profile, Partial<Profile>>({
      query: (body) => ({ url: "/user/profile", method: "PATCH", body }),
      invalidatesTags: ["Profile"],
    }),
    getMyOrders: build.query<Paginated<OrderList>, { page?: number } | void>({
      query: (params) => ({ url: "/user/orders", params: params ?? undefined }),
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetMyOrdersQuery,
} = authApi;
