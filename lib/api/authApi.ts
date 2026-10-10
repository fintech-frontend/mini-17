import { baseApi } from "./baseApi";
import { tokenStorage } from "./tokenStorage";
import type {
  Detail,
  EmailCodeRequest,
  LoginRequest,
  LoginResponse,
  OrderList,
  Paginated,
  Profile,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
} from "./types";

// Auth va shaxsiy kabinet: /api/v1/auth/*, /api/v1/user/*
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // remember — "Запомнить меня" (backend'ga yuborilmaydi, faqat token qayerda saqlanishini belgilaydi)
    login: build.mutation<LoginResponse, LoginRequest & { remember?: boolean }>({
      query: ({ email, password }) => ({ url: "/auth/login", method: "POST", body: { email, password } }),
      // Tokenlarni tag'lar invalid bo'lishidan oldin saqlaymiz
      transformResponse: (data: LoginResponse, _meta, arg) => {
        tokenStorage.set(data.tokens, arg.remember ?? true);
        return data;
      },
      invalidatesTags: ["Profile", "Orders", "Cart", "Admin"],
    }),
    // Ro'yxatdan o'tish: akkaunt yaratiladi va emailga 6 xonali kod yuboriladi
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    // Emailni kod bilan tasdiqlash (shundan keyin login qilish mumkin)
    verifyEmail: build.mutation<Detail, EmailCodeRequest>({
      query: (body) => ({ url: "/auth/verify", method: "POST", body }),
    }),
    resendVerification: build.mutation<Detail, { email: string }>({
      query: (body) => ({ url: "/auth/resend-verification", method: "POST", body }),
    }),
    // Parolni tiklash: email -> kod -> yangi parol
    forgotPassword: build.mutation<Detail, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    verifyResetCode: build.mutation<Detail, EmailCodeRequest>({
      query: (body) => ({ url: "/auth/verify-reset-code", method: "POST", body }),
    }),
    resetPassword: build.mutation<Detail, ResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
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
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetMyOrdersQuery,
} = authApi;
