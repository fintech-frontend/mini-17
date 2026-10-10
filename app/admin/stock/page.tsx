"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Check, Search } from "lucide-react";
import { useAdminList, useAdminUpdateMutation } from "@/lib/admin/adminApi";
import type { AdminStock, StockStatus } from "@/lib/admin/types";
import { STOCK_STATUS, apiError, dateTime } from "@/lib/admin/labels";
import DataTable, { pageCount, toOrdering, type Column, type Sort } from "@/components/admin/DataTable";
import { Badge, EmptyState, PageHeader, inputCls } from "@/components/admin/ui";

const PAGE_SIZE = 30;

// Bitta qator: qoldiq va statusni joyida tahrirlash
function StockEditor({ row }: { row: AdminStock }) {
  const [qty, setQty] = useState(String(row.quantity));
  const [status, setStatus] = useState<StockStatus>(row.status);
  const [update, { isLoading }] = useAdminUpdateMutation();
  const dirty = Number(qty) !== row.quantity || status !== row.status;

  const save = async () => {
    if (Number(qty) < 0 || qty === "") return toast.error("Остаток не может быть отрицательным");
    try {
      await update({ resource: "stock", id: row.id, body: { quantity: Number(qty), status } }).unwrap();
      toast.success(`Остаток «${row.product_name}» обновлён`);
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  return (
    <span className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        min={0}
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && dirty && save()}
        aria-label={`Остаток «${row.product_name}»`}
        className={`${inputCls} h-9 w-24! tabular-nums text-right`}
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as StockStatus)}
        aria-label={`Статус «${row.product_name}»`}
        className={`${inputCls} h-9 w-40!`}
      >
        {(Object.keys(STOCK_STATUS) as StockStatus[]).map((s) => (
          <option key={s} value={s}>
            {STOCK_STATUS[s].label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={save}
        disabled={!dirty || isLoading}
        aria-label="Сохранить"
        className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-[#012F91] text-white disabled:bg-gray-200 disabled:text-gray-400"
      >
        <Check size={16} />
      </button>
    </span>
  );
}

export default function StockPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StockStatus | "">("");
  const [sort, setSort] = useState<Sort | null>({ key: "quantity", dir: "asc" });

  const stock = useAdminList<AdminStock>("stock", {
    page,
    page_size: PAGE_SIZE,
    search: search.trim(),
    status,
    ordering: toOrdering(sort),
  });
  const low = useAdminList<AdminStock>("stock", { status: "low_stock", page_size: 1 });
  const out = useAdminList<AdminStock>("stock", { status: "out_of_stock", page_size: 1 });

  const columns: Column<AdminStock>[] = [
    {
      key: "product",
      header: "Товар",
      sortKey: "product__name",
      hideable: false,
      render: (s) => (
        <Link href={`/admin/products/${s.product}`} onClick={(e) => e.stopPropagation()} className="font-medium text-gray-900 hover:text-[#012F91]">
          {s.product_name}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Сейчас",
      render: (s) => <Badge tone={STOCK_STATUS[s.status].tone}>{STOCK_STATUS[s.status].label}</Badge>,
    },
    { key: "edit", header: "Остаток и статус", sortKey: "quantity", hideable: false, render: (s) => <StockEditor key={`${s.id}-${s.quantity}-${s.status}`} row={s} /> },
    { key: "synced", header: "Синхронизация", sortKey: "synced_at", render: (s) => <span className="whitespace-nowrap text-gray-500">{dateTime(s.synced_at)}</span> },
  ];

  return (
    <>
      <PageHeader title="Склад" description="Остатки товаров. Измените количество и нажмите ✓ или Enter." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => {
            setStatus("out_of_stock");
            setPage(1);
          }}
          className="text-left bg-white rounded-xl shadow-[0_1px_3px_rgba(16,24,40,0.06)] p-5 hover:ring-2 hover:ring-[#EE0906]/30"
        >
          <p className="text-[13px] text-gray-500">Нет в наличии</p>
          <p className="text-2xl font-bold text-[#EE0906] tabular-nums mt-1">{out.data?.count ?? "—"}</p>
        </button>
        <button
          type="button"
          onClick={() => {
            setStatus("low_stock");
            setPage(1);
          }}
          className="text-left bg-white rounded-xl shadow-[0_1px_3px_rgba(16,24,40,0.06)] p-5 hover:ring-2 hover:ring-amber-400/40"
        >
          <p className="text-[13px] text-gray-500">Заканчивается</p>
          <p className="text-2xl font-bold text-amber-600 tabular-nums mt-1">{low.data?.count ?? "—"}</p>
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={stock.data?.results ?? []}
        rowKey={(s) => s.id}
        loading={stock.isLoading}
        error={stock.error ? apiError(stock.error, "Ошибка загрузки склада") : undefined}
        onRetry={stock.refetch}
        sort={sort}
        onSort={(s) => {
          setSort(s);
          setPage(1);
        }}
        page={page}
        pages={pageCount(stock.data, PAGE_SIZE)}
        count={stock.data?.count}
        onPage={setPage}
        empty={
          <EmptyState
            title={search || status ? "Ничего не найдено" : "Складских записей пока нет"}
            text={search || status ? undefined : "Остаток появится после сохранения товара на вкладке «Склад»."}
          />
        }
        toolbar={
          <>
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Название товара"
                aria-label="Поиск по складу"
                className={`${inputCls} h-9 pl-9`}
              />
            </div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StockStatus | "");
                setPage(1);
              }}
              aria-label="Статус наличия"
              className={`${inputCls} h-9 w-auto!`}
            >
              <option value="">Любой статус</option>
              {(Object.keys(STOCK_STATUS) as StockStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STOCK_STATUS[s].label}
                </option>
              ))}
            </select>
          </>
        }
      />
    </>
  );
}
