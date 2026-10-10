"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink, GripVertical, ImagePlus, Plus, Star, Trash2 } from "lucide-react";
import {
  useAdminCreateMutation,
  useAdminDeleteMutation,
  useAdminItem,
  useAdminList,
  useAdminUpdateMutation,
} from "@/lib/admin/adminApi";
import type {
  AdminBrand,
  AdminCategory,
  AdminProduct,
  AdminProductImage,
  AdminStock,
  StockStatus,
} from "@/lib/admin/types";
import { STOCK_STATUS, apiError, mediaUrl } from "@/lib/admin/labels";
import { slugify } from "@/lib/admin/slugify";
import { Badge, Button, Card, EmptyState, ErrorState, Field, Skeleton, Toggle, inputCls, useConfirm } from "@/components/admin/ui";

type Tab = "general" | "prices" | "inventory" | "media" | "specs";
const TABS: { key: Tab; label: string; needsId?: boolean }[] = [
  { key: "general", label: "Основное" },
  { key: "prices", label: "Цены" },
  { key: "inventory", label: "Склад" },
  { key: "media", label: "Фото", needsId: true },
  { key: "specs", label: "Характеристики" },
];

interface FormState {
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  is_active: boolean;
  is_featured: boolean;
  price: string;
  old_price: string;
  article: string;
  stock_quantity: string;
  stock_status: StockStatus;
  specs: { key: string; value: string }[];
}

const EMPTY: FormState = {
  name: "",
  slug: "",
  description: "",
  category: "",
  brand: "",
  is_active: true,
  is_featured: false,
  price: "",
  old_price: "",
  article: "",
  stock_quantity: "0",
  stock_status: "in_stock",
  specs: [],
};

// attrs_json <-> kalit/qiymat ro'yxati
const specsFromJson = (json: unknown) =>
  json && typeof json === "object" && !Array.isArray(json)
    ? Object.entries(json as Record<string, unknown>).map(([key, value]) => ({ key, value: String(value ?? "") }))
    : [];
const specsToJson = (specs: { key: string; value: string }[]) =>
  Object.fromEntries(specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value.trim()]));

// Kategoriyalarni daraxt tartibida (— chuqurlik bilan) ko'rsatish
function categoryOptions(list: AdminCategory[]) {
  const children = new Map<number | null, AdminCategory[]>();
  for (const c of list) {
    const key = c.parent && list.some((p) => p.id === c.parent) ? c.parent : null;
    children.set(key, [...(children.get(key) ?? []), c]);
  }
  const out: { id: number; label: string }[] = [];
  const walk = (parent: number | null, depth: number) => {
    for (const c of (children.get(parent) ?? []).sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name))) {
      out.push({ id: c.id, label: `${"— ".repeat(depth)}${c.name}` });
      walk(c.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}

const toForm = (p: AdminProduct, stock?: AdminStock): FormState => ({
  name: p.name,
  slug: p.slug,
  description: p.description ?? "",
  category: String(p.category ?? ""),
  brand: p.brand ? String(p.brand) : "",
  is_active: p.is_active,
  is_featured: p.is_featured,
  price: p.price ?? "",
  old_price: p.old_price ?? "",
  article: p.article ?? "",
  stock_quantity: String(stock?.quantity ?? 0),
  stock_status: stock?.status ?? "in_stock",
  specs: specsFromJson(p.attrs_json),
});

// Ma'lumotlar to'liq yuklangach formani ochamiz (boshlang'ich qiymatlar bilan)
export default function ProductEditPage() {
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";
  const productId = isNew ? undefined : Number(params.id);

  const product = useAdminItem<AdminProduct>("products", productId);
  // Stock'da product bo'yicha filtr yo'q — ro'yxatdan product id bo'yicha topamiz
  const stockList = useAdminList<AdminStock>("stock", { page_size: 500 }, { skip: isNew });
  const stock = stockList.data?.results.find((s) => s.product === productId);

  if (!isNew && (product.isLoading || stockList.isLoading)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!isNew && (product.error || !product.data)) {
    return (
      <Card>
        <ErrorState message={apiError(product.error, "Товар не найден")} onRetry={product.refetch} />
      </Card>
    );
  }

  return (
    <ProductEditor
      key={productId ?? "new"}
      productId={productId}
      initial={product.data ? toForm(product.data, stock) : EMPTY}
      stock={stock}
    />
  );
}

function ProductEditor({
  productId,
  initial,
  stock,
}: {
  productId?: number;
  initial: FormState;
  stock?: AdminStock;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const isNew = productId === undefined;

  const [tab, setTab] = useState<Tab>("general");
  const [form, setForm] = useState<FormState>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const categories = useAdminList<AdminCategory>("categories", { page_size: 500 });
  const brands = useAdminList<AdminBrand>("brands", { page_size: 500, ordering: "name" });

  const [create] = useAdminCreateMutation();
  const [update] = useAdminUpdateMutation();
  const [remove] = useAdminDeleteMutation();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const catOptions = useMemo(() => categoryOptions(categories.data?.results ?? []), [categories.data]);
  const discount =
    Number(form.old_price) > Number(form.price) && Number(form.price) > 0
      ? Math.round((1 - Number(form.price) / Number(form.old_price)) * 100)
      : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Укажите название";
    if (!form.slug.trim()) e.slug = "Укажите адрес (slug)";
    if (!form.category) e.category = "Выберите категорию";
    if (!form.article.trim()) e.article = "Укажите артикул";
    if (!form.price || Number(form.price) <= 0) e.price = "Цена должна быть больше нуля";
    if (form.old_price && Number(form.old_price) <= Number(form.price)) e.old_price = "Старая цена должна быть больше текущей";
    if (Number(form.stock_quantity) < 0) e.stock_quantity = "Остаток не может быть отрицательным";
    setErrors(e);
    if (Object.keys(e).length) {
      const firstTab: Tab = e.name || e.slug || e.category ? "general" : e.price || e.old_price ? "prices" : "inventory";
      setTab(firstTab);
      toast.error("Проверьте обязательные поля");
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description,
      category: Number(form.category),
      brand: form.brand ? Number(form.brand) : null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      price: form.price,
      old_price: form.old_price || null,
      article: form.article.trim(),
      attrs_json: specsToJson(form.specs),
    };
    try {
      const saved = (isNew
        ? await create({ resource: "products", body }).unwrap()
        : await update({ resource: "products", id: productId!, body }).unwrap()) as AdminProduct;

      // Ombor qoldig'i: bor bo'lsa yangilaymiz, yo'q bo'lsa yaratamiz
      const stockBody = { product: saved.id, quantity: Number(form.stock_quantity || 0), status: form.stock_status };
      try {
        if (stock) await update({ resource: "stock", id: stock.id, body: stockBody }).unwrap();
        else await create({ resource: "stock", body: stockBody }).unwrap();
      } catch (e) {
        toast.error(`Товар сохранён, но остаток не обновлён: ${apiError(e)}`);
      }

      toast.success(isNew ? "Товар создан. Добавьте фото." : "Изменения сохранены");
      if (isNew) router.replace(`/admin/products/${saved.id}`);
    } catch (e) {
      const data = (e as { data?: Record<string, unknown> }).data;
      if (data && typeof data === "object") {
        setErrors(
          Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k === "attrs_json" ? "specs" : k, String(Array.isArray(v) ? v[0] : v)])
          )
        );
      }
      toast.error(apiError(e));
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    const ok = await confirm({
      title: "Удалить товар?",
      message: `«${form.name}» будет удалён без возможности восстановления.`,
      confirmText: "Удалить",
      danger: true,
    });
    if (!ok) return;
    try {
      await remove({ resource: "products", id: productId! }).unwrap();
      toast.success("Товар удалён");
      router.replace("/admin/products");
    } catch (e) {
      toast.error(apiError(e, "Не удалось удалить товар"));
    }
  };

  return (
    <>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3">
        <ArrowLeft size={16} />
        Товары
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{isNew ? "Новый товар" : form.name || "Товар"}</h1>
          {!isNew && (
            <div className="flex items-center gap-2 mt-1.5">
              <Badge tone={form.is_active ? "green" : "grey"}>{form.is_active ? "Активен" : "Черновик"}</Badge>
              <a
                href={`/products/${productId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#012F91] hover:underline"
              >
                Открыть на сайте <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="secondary" icon={<Trash2 size={16} />} onClick={deleteProduct}>
              Удалить
            </Button>
          )}
          <Button loading={saving} onClick={save}>
            {isNew ? "Создать товар" : "Сохранить"}
          </Button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const disabled = t.needsId && isNew;
          return (
            <button
              key={t.key}
              type="button"
              disabled={disabled}
              title={disabled ? "Сначала сохраните товар" : undefined}
              onClick={() => setTab(t.key)}
              className={`px-4 h-11 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors disabled:opacity-40 ${
                tab === t.key ? "border-[#012F91] text-[#012F91]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "general" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card title="Основная информация" className="xl:col-span-2" bodyClassName="p-5 space-y-5">
            <Field label="Название" required error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                placeholder="Перфоратор Bosch GBH 2-26 DRE, 800 Вт"
                className={inputCls}
              />
            </Field>
            <Field label="Адрес страницы (slug)" required error={errors.slug} hint="Латиница, цифры и дефисы. Используется в ссылке на товар.">
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value) || e.target.value.toLowerCase());
                }}
                className={`${inputCls} font-mono`}
              />
            </Field>
            <Field label="Описание" error={errors.description}>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={8}
                placeholder="Назначение, особенности, комплектация..."
                className={`${inputCls} h-auto py-2.5 leading-relaxed`}
              />
            </Field>
          </Card>

          <div className="space-y-6">
            <Card title="Публикация" bodyClassName="p-5 space-y-4">
              <Toggle checked={form.is_active} onChange={(v) => set("is_active", v)} label="Показывать на сайте" />
              <Toggle checked={form.is_featured} onChange={(v) => set("is_featured", v)} label="Хит продаж" />
            </Card>
            <Card title="Категория и бренд" bodyClassName="p-5 space-y-4">
              <Field label="Категория" required error={errors.category}>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                  <option value="">Выберите категорию</option>
                  {catOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Бренд" error={errors.brand}>
                <select value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputCls}>
                  <option value="">Без бренда</option>
                  {(brands.data?.results ?? []).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </Field>
            </Card>
          </div>
        </div>
      )}

      {tab === "prices" && (
        <Card title="Цены" className="max-w-2xl" bodyClassName="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Цена продажи" required error={errors.price}>
              <input
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className={`${inputCls} tabular-nums`}
              />
            </Field>
            <Field label="Старая цена (до скидки)" error={errors.old_price} hint="Оставьте пустым, если скидки нет">
              <input
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={form.old_price}
                onChange={(e) => set("old_price", e.target.value)}
                className={`${inputCls} tabular-nums`}
              />
            </Field>
          </div>
          {discount > 0 && (
            <p className="text-sm text-gray-600">
              На сайте будет показана скидка <Badge tone="green">−{discount}%</Badge>
            </p>
          )}
          <p className="text-xs text-gray-400">
            Оптовые цены по количеству и себестоимость пока не поддерживаются API — для них нужны новые поля на бэкенде.
          </p>
        </Card>
      )}

      {tab === "inventory" && (
        <Card title="Склад" className="max-w-2xl" bodyClassName="p-5 space-y-5">
          <Field label="Артикул (SKU)" required error={errors.article}>
            <input value={form.article} onChange={(e) => set("article", e.target.value)} className={`${inputCls} font-mono`} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Остаток, шт." error={errors.stock_quantity}>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={form.stock_quantity}
                onChange={(e) => set("stock_quantity", e.target.value)}
                className={`${inputCls} tabular-nums`}
              />
            </Field>
            <Field label="Статус наличия">
              <select
                value={form.stock_status}
                onChange={(e) => set("stock_status", e.target.value as StockStatus)}
                className={inputCls}
              >
                {(Object.keys(STOCK_STATUS) as StockStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STOCK_STATUS[s].label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {stock?.synced_at && (
            <p className="text-xs text-gray-400">Последняя синхронизация: {new Date(stock.synced_at).toLocaleString("ru-RU")}</p>
          )}
        </Card>
      )}

      {tab === "media" && productId && <MediaTab productId={productId} />}

      {tab === "specs" && (
        <Card
          title="Характеристики"
          className="max-w-3xl"
          bodyClassName="p-5 space-y-3"
          actions={
            <Button
              size="sm"
              variant="secondary"
              icon={<Plus size={14} />}
              onClick={() => set("specs", [...form.specs, { key: "", value: "" }])}
            >
              Добавить
            </Button>
          }
        >
          {errors.specs && <p className="text-xs text-[#EE0906]">{errors.specs}</p>}
          {form.specs.length === 0 ? (
            <EmptyState
              title="Характеристик пока нет"
              text="Например: Мощность, Вт — 800; Вес, кг — 2,7; Напряжение, В — 220."
              action={
                <Button size="sm" icon={<Plus size={14} />} onClick={() => set("specs", [{ key: "", value: "" }])}>
                  Добавить характеристику
                </Button>
              }
            />
          ) : (
            form.specs.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  value={s.key}
                  onChange={(e) => set("specs", form.specs.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))}
                  placeholder="Название (Мощность, Вт)"
                  aria-label="Название характеристики"
                  className={inputCls}
                />
                <input
                  value={s.value}
                  onChange={(e) => set("specs", form.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  placeholder="Значение (800)"
                  aria-label="Значение характеристики"
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => set("specs", form.specs.filter((_, j) => j !== i))}
                  aria-label="Удалить характеристику"
                  className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-[#EE0906]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </Card>
      )}
    </>
  );
}

// ---------- Rasmlar: yuklash, asosiy qilish, sudrab tartiblash, o'chirish ----------
function MediaTab({ productId }: { productId: number }) {
  const confirm = useConfirm();
  const images = useAdminList<AdminProductImage>("product-images", { product: productId, ordering: "sort", page_size: 100 });
  const [create] = useAdminCreateMutation();
  const [update] = useAdminUpdateMutation();
  const [remove] = useAdminDeleteMutation();
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [order, setOrder] = useState<AdminProductImage[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const list = order ?? [...(images.data?.results ?? [])].sort((a, b) => a.sort - b.sort);

  // POST /admin/product-images/ (multipart): product, image, sort, is_main
  const upload = async (files: FileList | File[]) => {
    const valid = [...files].filter((f) => f.type.startsWith("image/"));
    if (!valid.length) return;
    setUploading(valid.length);
    let sort = list.length ? Math.max(...list.map((i) => i.sort)) + 1 : 0;
    for (const file of valid) {
      const fd = new FormData();
      fd.append("product", String(productId));
      fd.append("image", file);
      fd.append("sort", String(sort++));
      fd.append("is_main", String(list.length === 0 && sort === 1));
      try {
        await create({ resource: "product-images", body: fd }).unwrap();
      } catch (e) {
        toast.error(`${file.name}: ${apiError(e, "не удалось загрузить")}`);
      }
      setUploading((n) => n - 1);
    }
    setOrder(null);
  };

  const makeMain = async (img: AdminProductImage) => {
    try {
      await Promise.all(
        list
          .filter((i) => i.is_main && i.id !== img.id)
          .map((i) => update({ resource: "product-images", id: i.id, body: { is_main: false } }).unwrap())
      );
      await update({ resource: "product-images", id: img.id, body: { is_main: true } }).unwrap();
      toast.success("Главное фото обновлено");
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const del = async (img: AdminProductImage) => {
    const ok = await confirm({ title: "Удалить фото?", message: "Фото будет удалено с сайта.", confirmText: "Удалить", danger: true });
    if (!ok) return;
    try {
      await remove({ resource: "product-images", id: img.id }).unwrap();
      setOrder(null);
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  // Sudrab tashlangandan keyin yangi tartibni saqlash
  const saveOrder = async (next: AdminProductImage[]) => {
    setOrder(next);
    try {
      await Promise.all(
        next.map((img, i) =>
          img.sort === i ? null : update({ resource: "product-images", id: img.id, body: { sort: i } }).unwrap()
        )
      );
      toast.success("Порядок фото сохранён");
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setOrder(null);
    }
  };

  return (
    <Card title="Фотографии" bodyClassName="p-5 space-y-5">
      <div
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return;
          e.preventDefault();
          setDragOver(false);
          upload(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed py-10 px-4 transition-colors ${
          dragOver ? "border-[#012F91] bg-blue-50/50" : "border-gray-200"
        }`}
      >
        <ImagePlus size={28} className="text-gray-400 mb-2" />
        <p className="text-sm text-gray-700">Перетащите фото сюда или</p>
        <Button size="sm" variant="secondary" className="mt-2" loading={uploading > 0} onClick={() => inputRef.current?.click()}>
          {uploading > 0 ? `Загрузка (${uploading})...` : "Выбрать файлы"}
        </Button>
        <p className="text-xs text-gray-400 mt-2">JPG, PNG или WebP. Можно выбрать несколько файлов.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {images.isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-center text-gray-500">Фото ещё не загружены — на сайте будет показана заглушка.</p>
      ) : (
        <>
          <p className="text-xs text-gray-500">Перетаскивайте карточки, чтобы изменить порядок. Звезда — главное фото в каталоге.</p>
          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {list.map((img, i) => (
              <li
                key={img.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  if (dragIndex === null || dragIndex === i) return;
                  e.preventDefault();
                  const next = [...list];
                  const [moved] = next.splice(dragIndex, 1);
                  next.splice(i, 0, moved);
                  setOrder(next);
                  setDragIndex(i);
                }}
                onDragEnd={() => {
                  if (order) saveOrder(order);
                  setDragIndex(null);
                }}
                className={`group relative aspect-square rounded-xl border bg-gray-50 overflow-hidden cursor-grab ${
                  img.is_main ? "border-[#012F91] ring-2 ring-[#012F91]/20" : "border-gray-200"
                } ${dragIndex === i ? "opacity-50" : ""}`}
              >
                <Image src={mediaUrl(img.image)} alt="" fill sizes="160px" className="object-contain p-2" />
                <GripVertical size={16} className="absolute top-2 left-2 text-gray-400" />
                {img.is_main && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-[#012F91] text-white px-1.5 py-0.5 rounded">
                    Главное
                  </span>
                )}
                <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  {!img.is_main && (
                    <button
                      type="button"
                      onClick={() => makeMain(img)}
                      aria-label="Сделать главным"
                      title="Сделать главным"
                      className="w-7 h-7 inline-flex items-center justify-center rounded-md bg-white shadow text-gray-600 hover:text-amber-500"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => del(img)}
                    aria-label="Удалить фото"
                    className="w-7 h-7 inline-flex items-center justify-center rounded-md bg-white shadow text-gray-600 hover:text-[#EE0906]"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
