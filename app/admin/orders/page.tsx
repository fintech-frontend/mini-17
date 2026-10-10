"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Search } from "lucide-react";
import { useAdminList } from "@/lib/admin/adminApi";
import type { AdminOrder, DeliveryType, OrderStatus, PaymentMethod } from "@/lib/admin/types";
import {
  DELIVERY_TYPE,
  ORDER_STATUS,
  ORDER_TABS,
  PAYMENT_METHOD,
  apiError,
  dateTime,
  money,
  num,
  paymentState,
} from "@/lib/admin/labels";
import { downloadCsv } from "@/lib/admin/slugify";
import DataTable, { pageCount, toOrdering, type Column, type Sort } from "@/components/admin/DataTable";
import { Badge, Button, EmptyState, PageHeader, inputCls } from "@/components/admin/ui";

const PAGE_SIZE = 20;

export default function OrdersPage() {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [payment, setPayment] = useState<PaymentMethod | "">("");
  const [delivery, setDelivery] = useState<DeliveryType | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Sort | null>({ key: "created_at", dir: "desc" });

  const tabStatus = ORDER_TABS.find((t) => t.key === tab)?.status;

  // GET /admin/orders/?status=&payment_method=&delivery_type=&search=&ordering=&page=
  const orders = useAdminList<AdminOrder>("orders", {
    page,
    page_size: PAGE_SIZE,
    status: tabStatus ?? status,
    payment_method: payment,
    delivery_type: delivery,
    search: search.trim(),
    ordering: toOrdering(sort),
  });
  const rows = orders.data?.results ?? [];

  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const columns: Column<AdminOrder>[] = [
    {
      key: "number",
      header: "Заказ",
      hideable: false,
      render: (o) => <span className="font-semibold text-[#012F91]">№{o.number}</span>,
    },
    { key: "date", header: "Дата", sortKey: "created_at", render: (o) => <span className="whitespace-nowrap">{dateTime(o.created_at)}</span> },
    { key: "customer", header: "Клиент", render: (o) => <span className="block max-w-56 truncate">{o.customer_email || "—"}</span> },
    { key: "items", header: "Товаров", align: "right", render: (o) => num(o.items.reduce((s, i) => s + i.quantity, 0)) },
    {
      key: "total",
      header: "Сумма",
      sortKey: "total",
      align: "right",
      render: (o) => <span className="font-semibold text-gray-900 whitespace-nowrap">{money(o.total)}</span>,
    },
    {
      key: "payment",
      header: "Оплата",
      render: (o) => {
        const p = paymentState(o);
        return (
          <span>
            <Badge tone={p.tone}>{p.label}</Badge>
            <span className="block text-xs text-gray-400 mt-1">{PAYMENT_METHOD[o.payment_method]}</span>
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Статус",
      render: (o) => <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>,
    },
    { key: "channel", header: "Получение", render: (o) => DELIVERY_TYPE[o.delivery_type] },
  ];

  const exportCsv = () =>
    downloadCsv(
      `orders-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Номер", "Дата", "Клиент", "Товаров", "Сумма", "Оплата", "Способ оплаты", "Статус", "Получение"],
      rows.map((o) => [
        o.number,
        dateTime(o.created_at),
        o.customer_email,
        o.items.reduce((s, i) => s + i.quantity, 0),
        o.total,
        paymentState(o).label,
        PAYMENT_METHOD[o.payment_method],
        ORDER_STATUS[o.status].label,
        DELIVERY_TYPE[o.delivery_type],
      ])
    );

  const filtered = !!(search || payment || delivery || status || tabStatus);

  return (
    <>
      <PageHeader
        title="Заказы"
        description="Заказы с сайта: статусы, оплата и получение"
        actions={
          <Button variant="secondary" icon={<Download size={16} />} onClick={exportCsv} disabled={!rows.length}>
            Экспорт CSV
          </Button>
        }
      />

      <div className="flex gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
        {ORDER_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setTab(t.key);
              setStatus("");
              setPage(1);
            }}
            className={`px-4 h-10 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              tab === t.key ? "border-[#012F91] text-[#012F91]" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(o) => o.id}
        loading={orders.isLoading}
        error={orders.error ? apiError(orders.error, "Ошибка загрузки заказов") : undefined}
        onRetry={orders.refetch}
        sort={sort}
        onSort={reset(setSort)}
        onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
        page={page}
        pages={pageCount(orders.data, PAGE_SIZE)}
        count={orders.data?.count}
        onPage={setPage}
        empty={
          <EmptyState
            title={filtered ? "Заказы не найдены" : "Заказов пока нет"}
            text={filtered ? "Измените фильтры или условия поиска." : "Заказы, оформленные на сайте, появятся здесь."}
          />
        }
        toolbar={
          <>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => reset(setSearch)(e.target.value)}
                placeholder="Номер или email"
                aria-label="Поиск заказов"
                className={`${inputCls} h-9 pl-9`}
              />
            </div>
            {tab === "all" && (
              <select
                value={status}
                onChange={(e) => reset(setStatus)(e.target.value as OrderStatus | "")}
                aria-label="Статус"
                className={`${inputCls} h-9 w-auto!`}
              >
                <option value="">Любой статус</option>
                {(Object.keys(ORDER_STATUS) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS[s].label}
                  </option>
                ))}
              </select>
            )}
            <select
              value={payment}
              onChange={(e) => reset(setPayment)(e.target.value as PaymentMethod | "")}
              aria-label="Способ оплаты"
              className={`${inputCls} h-9 w-auto!`}
            >
              <option value="">Любая оплата</option>
              {(Object.keys(PAYMENT_METHOD) as PaymentMethod[]).map((m) => (
                <option key={m} value={m}>
                  {PAYMENT_METHOD[m]}
                </option>
              ))}
            </select>
            <select
              value={delivery}
              onChange={(e) => reset(setDelivery)(e.target.value as DeliveryType | "")}
              aria-label="Способ получения"
              className={`${inputCls} h-9 w-auto!`}
            >
              <option value="">Доставка и самовывоз</option>
              {(Object.keys(DELIVERY_TYPE) as DeliveryType[]).map((d) => (
                <option key={d} value={d}>
                  {DELIVERY_TYPE[d]}
                </option>
              ))}
            </select>
          </>
        }
      />
    </>
  );
}
