"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, Search, Star, Trash2 } from "lucide-react";
import { useAdminDeleteMutation, useAdminList, useAdminUpdateMutation } from "@/lib/admin/adminApi";
import type { AdminReview } from "@/lib/admin/types";
import { apiError, dateTime } from "@/lib/admin/labels";
import DataTable, { pageCount, toOrdering, type Column, type Sort } from "@/components/admin/DataTable";
import { Badge, Button, EmptyState, PageHeader, inputCls, useConfirm } from "@/components/admin/ui";

const PAGE_SIZE = 20;

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Оценка ${value} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < value ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const confirm = useConfirm();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [published, setPublished] = useState("false");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState<Sort | null>({ key: "created_at", dir: "desc" });
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const reviews = useAdminList<AdminReview>("reviews", {
    page,
    page_size: PAGE_SIZE,
    search: search.trim(),
    is_published: published,
    rating,
    ordering: toOrdering(sort),
  });
  const pending = useAdminList<AdminReview>("reviews", { is_published: false, page_size: 1 });
  const [update] = useAdminUpdateMutation();
  const [remove] = useAdminDeleteMutation();

  const setPublishedFor = async (ids: (string | number)[], value: boolean) => {
    const res = await Promise.allSettled(
      ids.map((id) => update({ resource: "reviews", id, body: { is_published: value } }).unwrap())
    );
    const failed = res.filter((r) => r.status === "rejected").length;
    if (failed) toast.error(`Не удалось обновить: ${failed}`);
    else toast.success(value ? "Опубликовано" : "Скрыто с сайта");
    setSelected([]);
  };

  const del = async (r: AdminReview) => {
    const ok = await confirm({
      title: "Удалить отзыв?",
      message: `Отзыв от «${r.author_name}» будет удалён без возможности восстановления.`,
      confirmText: "Удалить",
      danger: true,
    });
    if (!ok) return;
    try {
      await remove({ resource: "reviews", id: r.id }).unwrap();
      toast.success("Отзыв удалён");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const columns: Column<AdminReview>[] = [
    {
      key: "author",
      header: "Автор",
      hideable: false,
      render: (r) => (
        <span>
          <span className="block font-medium text-gray-900">{r.author_name || "Аноним"}</span>
          <span className="block text-xs text-gray-400">{dateTime(r.created_at)}</span>
        </span>
      ),
    },
    { key: "rating", header: "Оценка", sortKey: "rating", render: (r) => <Stars value={r.rating} /> },
    {
      key: "comment",
      header: "Отзыв",
      className: "min-w-72",
      render: (r) => <span className="text-gray-700 line-clamp-3 max-w-xl">{r.comment || "—"}</span>,
    },
    {
      key: "product",
      header: "Товар",
      render: (r) =>
        r.product ? (
          <Link href={`/admin/products/${r.product}`} onClick={(e) => e.stopPropagation()} className="text-[#012F91] hover:underline">
            #{r.product}
          </Link>
        ) : (
          "—"
        ),
    },
    {
      key: "status",
      header: "Статус",
      render: (r) => (r.is_published ? <Badge tone="green">Опубликован</Badge> : <Badge tone="yellow">На модерации</Badge>),
    },
    {
      key: "actions",
      header: "",
      hideable: false,
      align: "right",
      render: (r) => (
        <span className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant={r.is_published ? "secondary" : "primary"}
            icon={r.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
            onClick={() => setPublishedFor([r.id], !r.is_published)}
          >
            {r.is_published ? "Скрыть" : "Опубликовать"}
          </Button>
          <button
            type="button"
            onClick={() => del(r)}
            aria-label="Удалить отзыв"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-[#EE0906]"
          >
            <Trash2 size={15} />
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Отзывы"
        description={`Модерация отзывов о товарах${pending.data ? ` · на модерации: ${pending.data.count}` : ""}`}
      />

      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {[
          { v: "false", label: "На модерации" },
          { v: "true", label: "Опубликованные" },
          { v: "", label: "Все" },
        ].map((t) => (
          <button
            key={t.v}
            type="button"
            onClick={() => {
              setPublished(t.v);
              setPage(1);
              setSelected([]);
            }}
            className={`px-4 h-10 text-sm font-medium border-b-2 -mb-px ${
              published === t.v ? "border-[#012F91] text-[#012F91]" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={reviews.data?.results ?? []}
        rowKey={(r) => r.id}
        loading={reviews.isLoading}
        error={reviews.error ? apiError(reviews.error, "Ошибка загрузки отзывов") : undefined}
        onRetry={reviews.refetch}
        sort={sort}
        onSort={(s) => {
          setSort(s);
          setPage(1);
        }}
        selected={selected}
        onSelect={setSelected}
        page={page}
        pages={pageCount(reviews.data, PAGE_SIZE)}
        count={reviews.data?.count}
        onPage={setPage}
        empty={<EmptyState title={published === "false" ? "Нет отзывов на модерации" : "Отзывов нет"} />}
        toolbar={
          selected.length ? (
            <>
              <span className="text-sm text-gray-600">Выбрано: {selected.length}</span>
              <Button size="sm" onClick={() => setPublishedFor(selected, true)}>
                Опубликовать
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setPublishedFor(selected, false)}>
                Скрыть
              </Button>
            </>
          ) : (
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
                  placeholder="Автор или текст"
                  aria-label="Поиск отзывов"
                  className={`${inputCls} h-9 pl-9`}
                />
              </div>
              <select
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                  setPage(1);
                }}
                aria-label="Оценка"
                className={`${inputCls} h-9 w-auto!`}
              >
                <option value="">Любая оценка</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {"★".repeat(n)} ({n})
                  </option>
                ))}
              </select>
            </>
          )
        }
      />
    </>
  );
}
