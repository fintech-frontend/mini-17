"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAdminList } from "@/lib/admin/adminApi";
import type { AdminOrder, AdminProduct, AdminUser } from "@/lib/admin/types";
import { ORDER_STATUS, dateTime, money } from "@/lib/admin/labels";
import { Badge, Card, EmptyState, PageHeader, Skeleton } from "@/components/admin/ui";

export default function SearchPage() {
  return (
    <Suspense>
      <Results />
    </Suspense>
  );
}

// Yuqori paneldagi global qidiruv: buyurtmalar, mahsulotlar va mijozlar bo'yicha
function Results() {
  const q = useSearchParams().get("q")?.trim() ?? "";
  const orders = useAdminList<AdminOrder>("orders", { search: q, page_size: 8 }, { skip: !q });
  const products = useAdminList<AdminProduct>("products", { search: q, page_size: 8 }, { skip: !q });
  const users = useAdminList<AdminUser>("users", { search: q, page_size: 8 }, { skip: !q });

  const section = <T,>(
    title: string,
    res: { isLoading: boolean; data?: { count: number; results: T[] } },
    render: (row: T) => React.ReactNode,
    more: string
  ) => (
    <Card
      title={`${title}${res.data ? ` · ${res.data.count}` : ""}`}
      bodyClassName="p-0"
      actions={
        res.data && res.data.count > res.data.results.length ? (
          <Link href={more} className="text-sm text-[#012F91] hover:underline">
            Показать все
          </Link>
        ) : undefined
      }
    >
      {res.isLoading ? (
        <div className="p-5 space-y-3">
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
        </div>
      ) : !res.data?.results.length ? (
        <p className="px-5 py-6 text-sm text-gray-500">Ничего не найдено</p>
      ) : (
        <ul className="divide-y divide-gray-100">{res.data.results.map(render)}</ul>
      )}
    </Card>
  );

  if (!q) {
    return (
      <>
        <PageHeader title="Поиск" />
        <Card>
          <EmptyState title="Введите запрос" text="Ищите заказы по номеру или email, товары по названию и артикулу, клиентов по имени." />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title={`Результаты поиска: «${q}»`} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {section(
          "Заказы",
          orders,
          (o) => (
            <li key={o.id}>
              <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 text-sm">
                <span>
                  <span className="font-medium text-[#012F91]">№{o.number}</span>
                  <span className="block text-xs text-gray-400">
                    {o.customer_email} · {dateTime(o.created_at)}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <span className="tabular-nums font-medium">{money(o.total)}</span>
                  <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                </span>
              </Link>
            </li>
          ),
          "/admin/orders"
        )}
        {section(
          "Товары",
          products,
          (p) => (
            <li key={p.id}>
              <Link href={`/admin/products/${p.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 text-sm">
                <span className="min-w-0">
                  <span className="block font-medium text-gray-900 truncate">{p.name}</span>
                  <span className="block text-xs text-gray-400 font-mono">{p.article}</span>
                </span>
                <span className="tabular-nums font-medium shrink-0">{money(p.price)}</span>
              </Link>
            </li>
          ),
          "/admin/products"
        )}
        {section(
          "Клиенты",
          users,
          (u) => (
            <li key={u.id}>
              <Link
                href={`/admin/customers?search=${encodeURIComponent(u.email)}`}
                className="block px-5 py-3 hover:bg-gray-50 text-sm"
              >
                <span className="block font-medium text-gray-900">{u.full_name || "Без имени"}</span>
                <span className="block text-xs text-gray-400">{u.email}</span>
              </Link>
            </li>
          ),
          "/admin/customers"
        )}
      </div>
    </>
  );
}
