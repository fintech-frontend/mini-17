"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import {
  DELIVERY_TYPE,
  dateTime,
  money,
  ORDER_STATUS,
  ORDER_TABS,
  PAYMENT_METHOD,
} from "@/lib/admin/format";
import type { AdminOrder } from "@/lib/admin/types";

type Row = AdminOrder & Record<string, unknown>;

function OrdersContent() {
  const params = useSearchParams();
  const initialStatus = params.get("status") ?? "";
  const initialSearch = params.get("search") ?? "";
  const [tab, setTab] = useState(
    ORDER_TABS.find((t) => t.status === initialStatus)?.key ?? "all",
  );
  const status = ORDER_TABS.find((t) => t.key === tab)?.status;

  return (
    <>
      {/* key — tab o'zgarganda jadval yangidan yuklanadi */}
      <ResourcePage<Row>
        headerExtra={
          <>
            {/* Statuslar bo'yicha tablar */}
            <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Статус заказа">
              {ORDER_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    tab === t.key
                      ? "bg-[#012F91] text-white"
                      : "bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </>
        }
        key={`${tab}-${initialSearch}`}
        resource="orders"
        title="Заказы"
        subtitle="Заказы создаются покупателями на сайте. Здесь их можно только обрабатывать."
        canCreate={false}
        canDelete={false}
        searchPlaceholder="Номер заказа или email…"
        defaultOrdering="-created_at"
        initialParams={{
          ...(initialSearch ? { search: initialSearch } : {}),
          ...(status ? { status } : {}),
        }}
        editHref={(r) => `/admin/orders/${r.id}`}
        columns={[
          {
            key: "number",
            label: "Заказ",
            sortable: true,
            render: (r) => (
              <Link href={`/admin/orders/${r.id}`} className="font-semibold text-[#012F91] hover:underline">
                #{r.number}
              </Link>
            ),
          },
          { key: "created_at", label: "Дата", sortable: true, render: (r) => dateTime(r.created_at) },
          { key: "customer_email", label: "Клиент", render: (r) => r.customer_email || "—" },
          {
            key: "items",
            label: "Товаров",
            align: "right",
            render: (r) => r.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
          },
          {
            key: "total",
            label: "Сумма",
            sortable: true,
            align: "right",
            render: (r) => <span className="font-semibold text-gray-900">{money(r.total)}</span>,
          },
          { key: "payment_method", label: "Оплата", render: (r) => PAYMENT_METHOD[r.payment_method] ?? r.payment_method },
          {
            key: "paid_at",
            label: "Оплачен",
            render: (r) => (r.paid_at ? <Badge tone="green">Да</Badge> : <Badge tone="yellow">Нет</Badge>),
          },
          { key: "delivery_type", label: "Получение", render: (r) => DELIVERY_TYPE[r.delivery_type] ?? r.delivery_type },
          {
            key: "status",
            label: "Статус",
            render: (r) => {
              const s = ORDER_STATUS[r.status];
              return <Badge tone={s.tone}>{s.label}</Badge>;
            },
          },
        ]}
      />
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersContent />
    </Suspense>
  );
}
