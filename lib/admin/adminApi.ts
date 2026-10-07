import { baseApi } from "@/lib/api/baseApi";
import type { AdminOrder, AdminResource, OrderStatus, Paginated } from "./types";

type Params = Record<string, string | number | boolean | undefined | null>;
type Row = { id: number | string } & Record<string, unknown>;

// Bo'sh parametrlarni olib tashlash (?search=&page= ... )
const clean = (params?: Params) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );

// Rasm/fayl bo'lsa multipart (FormData), bo'lmasa JSON yuboramiz
const toBody = (data: Record<string, unknown>) => {
  const hasFile = Object.values(data).some((v) => v instanceof File);
  if (!hasFile) return data;
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined) return;
    if (v instanceof File) form.append(k, v);
    else if (v === null) form.append(k, "");
    else if (typeof v === "object") form.append(k, JSON.stringify(v));
    else form.append(k, String(v));
  });
  return form;
};

const tag = (resource: AdminResource) => ({ type: "Admin" as const, id: resource });

// Barcha admin resurslari uchun umumiy CRUD: /api/v1/admin/<resource>/
export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminList: build.query<
      Paginated<Row> | Row[],
      { resource: AdminResource; params?: Params }
    >({
      query: ({ resource, params }) => ({ url: `/admin/${resource}`, params: clean(params) }),
      providesTags: (_r, _e, { resource }) => [tag(resource)],
    }),
    adminGet: build.query<Row, { resource: AdminResource; id: number | string }>({
      query: ({ resource, id }) => `/admin/${resource}/${id}`,
      providesTags: (_r, _e, { resource }) => [tag(resource)],
    }),
    adminCreate: build.mutation<Row, { resource: AdminResource; data: Record<string, unknown> }>({
      query: ({ resource, data }) => ({ url: `/admin/${resource}`, method: "POST", body: toBody(data) }),
      invalidatesTags: (_r, _e, { resource }) => [tag(resource)],
    }),
    adminUpdate: build.mutation<
      Row,
      { resource: AdminResource; id: number | string; data: Record<string, unknown> }
    >({
      query: ({ resource, id, data }) => ({
        url: `/admin/${resource}/${id}`,
        method: "PATCH",
        body: toBody(data),
      }),
      invalidatesTags: (_r, _e, { resource }) => [tag(resource)],
    }),
    adminDelete: build.mutation<void, { resource: AdminResource; id: number | string }>({
      query: ({ resource, id }) => ({ url: `/admin/${resource}/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { resource }) => [tag(resource)],
    }),
    // POST /admin/orders/{id}/set-status/
    setOrderStatus: build.mutation<AdminOrder, { id: number; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/set-status`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: [tag("orders")],
    }),
  }),
});

export const {
  useAdminListQuery,
  useAdminGetQuery,
  useAdminCreateMutation,
  useAdminUpdateMutation,
  useAdminDeleteMutation,
  useSetOrderStatusMutation,
} = adminApi;

// Ro'yxat javobi paginated yoki oddiy massiv bo'lishi mumkin
export function listRows<T>(data: Paginated<Row> | Row[] | undefined): T[] {
  if (!data) return [];
  return (Array.isArray(data) ? data : data.results) as unknown as T[];
}

export function listMeta(data: Paginated<Row> | Row[] | undefined) {
  if (!data || Array.isArray(data)) return { count: data?.length ?? 0, pages: 1 };
  return { count: data.count, pages: data.pages || 1 };
}

// DRF xatosini o'qiladigan matnga aylantirish
export function apiErrorText(error: unknown): string {
  const data = (error as { data?: unknown })?.data;
  if (!data) return "Ошибка соединения с сервером";
  if (typeof data === "string") return data.slice(0, 200);
  if (typeof data === "object") {
    return Object.entries(data as Record<string, unknown>)
      .map(([k, v]) => `${k === "detail" || k === "non_field_errors" ? "" : `${k}: `}${Array.isArray(v) ? v.join(", ") : String(v)}`)
      .join("; ");
  }
  return "Неизвестная ошибка";
}
