"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Download, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import {
  useAdminDeleteMutation,
  useAdminList,
  useAdminUpdateMutation,
} from "@/lib/admin/adminApi";
import type { AdminBrand, AdminCategory, AdminProduct, AdminProductImage, AdminStock } from "@/lib/admin/types";
import { apiError, mediaUrl, money, num, type Tone } from "@/lib/admin/labels";
import { downloadCsv } from "@/lib/admin/slugify";
import DataTable, { pageCount, toOrdering, type Column, type Sort } from "@/components/admin/DataTable";
import { Badge, Button, EmptyState, PageHeader, inputCls, useConfirm } from "@/components/admin/ui";

const PAGE_SIZE = 20;

function productStatus(p: AdminProduct, stock?: AdminStock): { label: string; tone: Tone } {
  if (!p.is_active) return { label: "Черновик", tone: "grey" };
  if (stock && (stock.quantity <= 0 || stock.status === "out_of_stock")) return { label: "Нет в наличии", tone: "red" };
  return { label: "Активен", tone: "green" };
}

export default function ProductsPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState("");
  const [sort, setSort] = useState<Sort | null>({ key: "created_at", dir: "desc" });
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [busy, setBusy] = useState(false);

  // GET /admin/products/?search=&category=&is_active=&ordering=&page=
  const products = useAdminList<AdminProduct>("products", {
    page,
    page_size: PAGE_SIZE,
    search: search.trim(),
    category,
    is_active: active,
    ordering: toOrdering(sort),
  });
  const categories = useAdminList<AdminCategory>("categories", { page_size: 500 });
  const brands = useAdminList<AdminBrand>("brands", { page_size: 500 });
  const stock = useAdminList<AdminStock>("stock", { page_size: 500 });
  const images = useAdminList<AdminProductImage>("product-images", { is_main: true, page_size: 500 });

  const [update] = useAdminUpdateMutation();
  const [remove] = useAdminDeleteMutation();

  const catName = useMemo(() => new Map((categories.data?.results ?? []).map((c) => [c.id, c.name])), [categories.data]);
  const brandName = useMemo(() => new Map((brands.data?.results ?? []).map((b) => [b.id, b.name])), [brands.data]);
  const stockOf = useMemo(() => new Map((stock.data?.results ?? []).map((s) => [s.product, s])), [stock.data]);
  const imageOf = useMemo(() => new Map((images.data?.results ?? []).map((i) => [i.product, i.image])), [images.data]);

  const rows = products.data?.results ?? [];
  const resetPage = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
    setSelected([]);
  };

  const bulk = async (action: "activate" | "draft" | "delete") => {
    if (action === "delete") {
      const ok = await confirm({
        title: "Удалить товары?",
        message: `Будет удалено товаров: ${selected.length}. Это действие нельзя отменить.`,
        confirmText: "Удалить",
        danger: true,
      });
      if (!ok) return;
    }
    setBusy(true);
    const results = await Promise.allSettled(
      selected.map((id) =>
        action === "delete"
          ? remove({ resource: "products", id }).unwrap()
          : update({ resource: "products", id, body: { is_active: action === "activate" } }).unwrap()
      )
    );
    setBusy(false);
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed) toast.error(`Не удалось обработать: ${failed} из ${selected.length}`);
    else toast.success(action === "delete" ? "Товары удалены" : "Статус обновлён");
    setSelected([]);
  };

  const removeOne = async (p: AdminProduct) => {
    const ok = await confirm({
      title: "Удалить товар?",
      message: `«${p.name}» будет удалён без возможности восстановления.`,
      confirmText: "Удалить",
      danger: true,
    });
    if (!ok) return;
    try {
      await remove({ resource: "products", id: p.id }).unwrap();
      toast.success("Товар удалён");
    } catch (e) {
      toast.error(apiError(e, "Не удалось удалить товар"));
    }
  };

  const exportCsv = () => {
    const list = selected.length ? rows.filter((r) => selected.includes(r.id)) : rows;
    downloadCsv(
      `products-${new Date().toISOString().slice(0, 10)}.csv`,
      ["ID", "Название", "Артикул", "Категория", "Бренд", "Цена", "Старая цена", "Остаток", "Активен"],
      list.map((p) => [
        p.id,
        p.name,
        p.article,
        catName.get(p.category) ?? "",
        p.brand ? brandName.get(p.brand) ?? "" : "",
        p.price,
        p.old_price ?? "",
        stockOf.get(p.id)?.quantity ?? "",
        p.is_active ? "да" : "нет",
      ])
    );
  };

  const columns: Column<AdminProduct>[] = [
    {
      key: "photo",
      header: "Фото",
      hideable: true,
      render: (p) => (
        <span className="relative block w-11 h-11 rounded-lg bg-gray-50 overflow-hidden">
          <Image src={mediaUrl(imageOf.get(p.id))} alt="" fill sizes="44px" className="object-contain p-0.5" />
        </span>
      ),
    },
    {
      key: "name",
      header: "Название",
      sortKey: "name",
      hideable: false,
      className: "min-w-64",
      render: (p) => (
        <span className="flex items-start gap-1.5">
          {p.is_featured && <Star size={14} className="shrink-0 mt-0.5 fill-amber-400 text-amber-400" aria-label="Хит" />}
          <span>
            <span className="block font-medium text-gray-900 line-clamp-2">{p.name}</span>
            <span className="block text-xs text-gray-400">/{p.slug}</span>
          </span>
        </span>
      ),
    },
    { key: "article", header: "Артикул", render: (p) => <span className="font-mono text-xs">{p.article}</span> },
    { key: "category", header: "Категория", render: (p) => catName.get(p.category) ?? "—" },
    { key: "brand", header: "Бренд", render: (p) => (p.brand ? brandName.get(p.brand) ?? "—" : "—") },
    {
      key: "price",
      header: "Цена",
      sortKey: "price",
      align: "right",
      render: (p) => (
        <span className="whitespace-nowrap">
          <span className="font-medium text-gray-900">{money(p.price)}</span>
          {p.old_price && <span className="block text-xs text-gray-400 line-through">{money(p.old_price)}</span>}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Остаток",
      align: "right",
      render: (p) => {
        const s = stockOf.get(p.id);
        return s ? <span className={s.quantity <= 0 ? "text-[#EE0906] font-medium" : ""}>{num(s.quantity)}</span> : "—";
      },
    },
    {
      key: "status",
      header: "Статус",
      render: (p) => {
        const s = productStatus(p, stockOf.get(p.id));
        return <Badge tone={s.tone}>{s.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      hideable: false,
      align: "right",
      render: (p) => (
        <span className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/products/${p.id}`}
            aria-label={`Редактировать «${p.name}»`}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-[#012F91]"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            onClick={() => removeOne(p)}
            aria-label={`Удалить «${p.name}»`}
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
        title="Товары"
        description="Каталог магазина: цены, остатки, статусы и фото"
        actions={
          <>
            <Button variant="secondary" icon={<Download size={16} />} onClick={exportCsv} disabled={!rows.length}>
              Экспорт CSV
            </Button>
            <Button icon={<Plus size={16} />} onClick={() => router.push("/admin/products/new")}>
              Добавить товар
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(p) => p.id}
        loading={products.isLoading}
        error={products.error ? apiError(products.error, "Ошибка загрузки товаров") : undefined}
        onRetry={products.refetch}
        sort={sort}
        onSort={resetPage(setSort)}
        selected={selected}
        onSelect={setSelected}
        onRowClick={(p) => router.push(`/admin/products/${p.id}`)}
        page={page}
        pages={pageCount(products.data, PAGE_SIZE)}
        count={products.data?.count}
        onPage={setPage}
        empty={
          <EmptyState
            title={search || category || active ? "Ничего не найдено" : "Товаров пока нет"}
            text={search || category || active ? "Измените условия поиска или фильтры." : "Добавьте первый товар в каталог."}
            action={
              !search && !category && !active ? (
                <Button icon={<Plus size={16} />} onClick={() => router.push("/admin/products/new")}>
                  Добавить товар
                </Button>
              ) : undefined
            }
          />
        }
        toolbar={
          selected.length ? (
            <>
              <span className="text-sm text-gray-600 mr-1">Выбрано: {selected.length}</span>
              <Button size="sm" variant="secondary" loading={busy} onClick={() => bulk("activate")}>
                Активировать
              </Button>
              <Button size="sm" variant="secondary" loading={busy} onClick={() => bulk("draft")}>
                В черновик
              </Button>
              <Button size="sm" variant="danger" loading={busy} onClick={() => bulk("delete")}>
                Удалить
              </Button>
            </>
          ) : (
            <>
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => resetPage(setSearch)(e.target.value)}
                  placeholder="Название, артикул..."
                  aria-label="Поиск товаров"
                  className={`${inputCls} h-9 pl-9`}
                />
              </div>
              <select
                value={category}
                onChange={(e) => resetPage(setCategory)(e.target.value)}
                aria-label="Категория"
                className={`${inputCls} h-9 w-auto!`}
              >
                <option value="">Все категории</option>
                {(categories.data?.results ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={active}
                onChange={(e) => resetPage(setActive)(e.target.value)}
                aria-label="Статус"
                className={`${inputCls} h-9 w-auto!`}
              >
                <option value="">Все статусы</option>
                <option value="true">Активные</option>
                <option value="false">Черновики</option>
              </select>
            </>
          )
        }
      />
    </>
  );
}
