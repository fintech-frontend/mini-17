"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { useAdminList, useAdminUpdateMutation } from "@/lib/admin/adminApi";
import type { AdminLead, LeadStatus, LeadType } from "@/lib/admin/types";
import { LEAD_STATUS, LEAD_TYPE, apiError, dateTime } from "@/lib/admin/labels";
import DataTable, { pageCount, toOrdering, type Column, type Sort } from "@/components/admin/DataTable";
import { Badge, EmptyState, PageHeader, inputCls } from "@/components/admin/ui";

const PAGE_SIZE = 20;

function StatusSelect({ lead }: { lead: AdminLead }) {
  const [update, { isLoading }] = useAdminUpdateMutation();
  return (
    <select
      value={lead.status}
      disabled={isLoading}
      onClick={(e) => e.stopPropagation()}
      onChange={async (e) => {
        try {
          await update({ resource: "leads", id: lead.id, body: { status: e.target.value } }).unwrap();
          toast.success(`Заявка: ${LEAD_STATUS[e.target.value as LeadStatus].label}`);
        } catch (err) {
          toast.error(apiError(err));
        }
      }}
      aria-label={`Статус заявки ${lead.name}`}
      className={`${inputCls} h-9 w-40!`}
    >
      {(Object.keys(LEAD_STATUS) as LeadStatus[]).map((s) => (
        <option key={s} value={s}>
          {LEAD_STATUS[s].label}
        </option>
      ))}
    </select>
  );
}

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [type, setType] = useState<LeadType | "">("");
  const [sort, setSort] = useState<Sort | null>({ key: "created_at", dir: "desc" });

  const leads = useAdminList<AdminLead>("leads", {
    page,
    page_size: PAGE_SIZE,
    search: search.trim(),
    status,
    type,
    ordering: toOrdering(sort),
  });

  const columns: Column<AdminLead>[] = [
    { key: "date", header: "Дата", sortKey: "created_at", render: (l) => <span className="whitespace-nowrap">{dateTime(l.created_at)}</span> },
    { key: "name", header: "Имя", hideable: false, render: (l) => <span className="font-medium text-gray-900">{l.name}</span> },
    {
      key: "phone",
      header: "Телефон",
      hideable: false,
      render: (l) => (
        <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="text-[#012F91] hover:underline whitespace-nowrap">
          {l.phone}
        </a>
      ),
    },
    { key: "type", header: "Тип", render: (l) => LEAD_TYPE[l.type] ?? l.type },
    {
      key: "product",
      header: "Товар",
      render: (l) =>
        l.product ? (
          <Link href={`/admin/products/${l.product}`} className="text-[#012F91] hover:underline">
            #{l.product}
          </Link>
        ) : (
          "—"
        ),
    },
    {
      key: "current",
      header: "Статус",
      render: (l) => <Badge tone={LEAD_STATUS[l.status].tone}>{LEAD_STATUS[l.status].label}</Badge>,
    },
    { key: "change", header: "Изменить", hideable: false, render: (l) => <StatusSelect key={`${l.id}-${l.status}`} lead={l} /> },
  ];

  return (
    <>
      <PageHeader title="Заявки" description="Обратные звонки, запросы цены, консультации и покупки в 1 клик" />
      <DataTable
        columns={columns}
        rows={leads.data?.results ?? []}
        rowKey={(l) => l.id}
        loading={leads.isLoading}
        error={leads.error ? apiError(leads.error, "Ошибка загрузки заявок") : undefined}
        onRetry={leads.refetch}
        sort={sort}
        onSort={(s) => {
          setSort(s);
          setPage(1);
        }}
        page={page}
        pages={pageCount(leads.data, PAGE_SIZE)}
        count={leads.data?.count}
        onPage={setPage}
        empty={<EmptyState title={search || status || type ? "Заявки не найдены" : "Заявок пока нет"} />}
        toolbar={
          <>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Имя или телефон"
                aria-label="Поиск заявок"
                className={`${inputCls} h-9 pl-9`}
              />
            </div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as LeadStatus | "");
                setPage(1);
              }}
              aria-label="Статус"
              className={`${inputCls} h-9 w-auto!`}
            >
              <option value="">Любой статус</option>
              {(Object.keys(LEAD_STATUS) as LeadStatus[]).map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS[s].label}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as LeadType | "");
                setPage(1);
              }}
              aria-label="Тип заявки"
              className={`${inputCls} h-9 w-auto!`}
            >
              <option value="">Любой тип</option>
              {(Object.keys(LEAD_TYPE) as LeadType[]).map((t) => (
                <option key={t} value={t}>
                  {LEAD_TYPE[t]}
                </option>
              ))}
            </select>
          </>
        }
      />
    </>
  );
}
