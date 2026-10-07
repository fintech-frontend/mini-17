"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Star, Trash2 } from "lucide-react";
import {
  apiErrorText,
  listRows,
  useAdminCreateMutation,
  useAdminDeleteMutation,
  useAdminListQuery,
  useAdminUpdateMutation,
} from "@/lib/admin/adminApi";
import { STOCK_STATUS } from "@/lib/admin/format";
import { useBrands, useCategories } from "@/lib/admin/options";
import type { AdminProduct, AdminStock, StockStatus } from "@/lib/admin/types";
import { Button, Card, Field, Input, PageHeader, Select, Textarea, Toggle } from "./ui";

const TABS = [
  { key: "main", label: "Основное" },
  { key: "prices", label: "Цены" },
  { key: "stock", label: "Склад" },
  { key: "media", label: "Фото" },
  { key: "specs", label: "Характеристики" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

// Kirill → lotin (slug uchun)
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};
const slugify = (text: string) =>
  text
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

type SpecRow = { key: string; value: string };

// attrs_json — erkin JSON; obyekt bo'lsa kalit–qiymat qatorlariga ajratamiz
const toSpecRows = (attrs: AdminProduct["attrs_json"]): SpecRow[] =>
  attrs && typeof attrs === "object" && !Array.isArray(attrs)
    ? Object.entries(attrs).map(([key, value]) => ({ key, value: String(value ?? "") }))
    : [];

export default function ProductForm({ product }: { product?: AdminProduct }) {
  const router = useRouter();
  const isNew = !product;
  const categories = useCategories();
  const brands = useBrands();
  const [tab, setTab] = useState<TabKey>("main");

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    article: product?.article ?? "",
    category: product ? String(product.category) : "",
    brand: product?.brand ? String(product.brand) : "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    old_price: product?.old_price ?? "",
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
  });
  const [specs, setSpecs] = useState<SpecRow[]>(() => toSpecRows(product?.attrs_json ?? null));
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const [create, { isLoading: creating }] = useAdminCreateMutation();
  const [update, { isLoading: updating }] = useAdminUpdateMutation();

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const attrs = Object.fromEntries(
      specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value]),
    );
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      article: form.article.trim(),
      category: Number(form.category),
      brand: form.brand ? Number(form.brand) : null,
      description: form.description,
      price: form.price,
      old_price: form.old_price === "" ? null : form.old_price,
      is_active: form.is_active,
      is_featured: form.is_featured,
      attrs_json: attrs,
    };

    try {
      if (isNew) {
        const created = (await create({ resource: "products", data: payload }).unwrap()) as unknown as AdminProduct;
        toast.success("Товар создан. Теперь можно добавить остаток и фото.");
        router.replace(`/admin/products/${created.id}`);
      } else {
        await update({ resource: "products", id: product.id, data: payload }).unwrap();
        toast.success("Изменения сохранены");
      }
    } catch (err) {
      toast.error(apiErrorText(err));
    }
  };

  const form1Tabs = TABS.filter((t) => !isNew || t.key === "main" || t.key === "prices" || t.key === "specs");

  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#012F91]">
        <ArrowLeft className="h-4 w-4" /> Все товары
      </Link>
      <PageHeader
        title={isNew ? "Новый товар" : product.name}
        subtitle={isNew ? "Остаток и фото можно добавить после сохранения" : `Артикул: ${product.article}`}
        actions={
          <>
            <Button variant="secondary" onClick={() => router.push("/admin/products")}>
              Отмена
            </Button>
            <Button type="submit" form="product-form" loading={creating || updating}>
              Сохранить
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1 border-b border-gray-200" role="tablist">
        {form1Tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? "border-[#012F91] text-[#012F91]" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form id="product-form" onSubmit={handleSave}>
        {/* Barcha tablar DOMda qoladi (validatsiya ishlashi uchun), faqat yashiriladi */}
        <div hidden={tab !== "main"}>
          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Название" required className="sm:col-span-2">
                <Input
                  required
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                />
              </Field>
              <Field label="Артикул" required>
                <Input required value={form.article} onChange={(e) => set("article", e.target.value)} />
              </Field>
              <Field label="Slug (для URL)" required hint="Латиница, цифры и дефис">
                <Input
                  required
                  pattern="[-a-zA-Z0-9_]+"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value);
                  }}
                />
              </Field>
              <Field label="Категория" required>
                <Select required value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="">Выберите…</option>
                  {categories.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Бренд">
                <Select value={form.brand} onChange={(e) => set("brand", e.target.value)}>
                  <option value="">Без бренда</option>
                  {brands.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Описание" className="sm:col-span-2">
                <Textarea rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </Field>
              <div className="flex flex-wrap gap-6 sm:col-span-2">
                <Toggle checked={form.is_active} onChange={(v) => set("is_active", v)} label="Показывать на сайте" />
                <Toggle checked={form.is_featured} onChange={(v) => set("is_featured", v)} label="Хит продаж" />
              </div>
            </div>
          </Card>
        </div>

        <div hidden={tab !== "prices"}>
          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Цена" required>
                <Input type="number" min="0" step="0.01" required value={form.price} onChange={(e) => set("price", e.target.value)} />
              </Field>
              <Field label="Старая цена" hint="Если указана и больше цены — на сайте покажется скидка">
                <Input type="number" min="0" step="0.01" value={form.old_price} onChange={(e) => set("old_price", e.target.value)} />
              </Field>
            </div>
            {Number(form.old_price) > Number(form.price) && Number(form.price) > 0 && (
              <p className="mt-4 text-sm text-emerald-700">
                Скидка на сайте: −{Math.round((1 - Number(form.price) / Number(form.old_price)) * 100)}%
              </p>
            )}
          </Card>
        </div>

        <div hidden={tab !== "specs"}>
          <Card title="Характеристики" action={
            <Button type="button" variant="secondary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setSpecs((s) => [...s, { key: "", value: "" }])}>
              Добавить
            </Button>
          }>
            {specs.length === 0 ? (
              <p className="text-sm text-gray-500">Характеристик пока нет. Например: «Мощность — 1450 Вт».</p>
            ) : (
              <div className="space-y-2">
                {specs.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      aria-label="Название"
                      placeholder="Название"
                      value={s.key}
                      onChange={(e) => setSpecs((rows) => rows.map((r, j) => (j === i ? { ...r, key: e.target.value } : r)))}
                    />
                    <Input
                      aria-label="Значение"
                      placeholder="Значение"
                      value={s.value}
                      onChange={(e) => setSpecs((rows) => rows.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))}
                    />
                    <button
                      type="button"
                      aria-label="Удалить"
                      onClick={() => setSpecs((rows) => rows.filter((_, j) => j !== i))}
                      className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-[#EE0906]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </form>

      {/* Ombor va rasmlar — alohida API, mahsulot saqlangandan keyin */}
      {product && tab === "stock" && <StockTab product={product} />}
      {product && tab === "media" && <MediaTab product={product} />}
    </>
  );
}

function StockTab({ product }: { product: AdminProduct }) {
  const { data, isLoading } = useAdminListQuery({
    resource: "stock",
    params: { search: product.name, page_size: 50 },
  });
  const stock = listRows<AdminStock>(data).find((s) => s.product === product.id);

  const [create, { isLoading: creating }] = useAdminCreateMutation();
  const [update, { isLoading: updating }] = useAdminUpdateMutation();
  const [quantity, setQuantity] = useState<string | null>(null);
  const [status, setStatus] = useState<StockStatus | null>(null);

  const qty = quantity ?? String(stock?.quantity ?? 0);
  const st = status ?? stock?.status ?? "in_stock";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (stock) {
        await update({ resource: "stock", id: stock.id, data: { quantity: Number(qty), status: st } }).unwrap();
      } else {
        await create({ resource: "stock", data: { product: product.id, quantity: Number(qty), status: st } }).unwrap();
      }
      toast.success("Остаток сохранён");
    } catch (err) {
      toast.error(apiErrorText(err));
    }
  };

  return (
    <Card title="Склад">
      {isLoading ? (
        <p className="text-sm text-gray-500">Загрузка…</p>
      ) : (
        <form onSubmit={handleSave} className="grid max-w-xl gap-4 sm:grid-cols-2">
          <Field label="Остаток, шт.">
            <Input type="number" min="0" required value={qty} onChange={(e) => setQuantity(e.target.value)} />
          </Field>
          <Field label="Статус">
            <Select value={st} onChange={(e) => setStatus(e.target.value as StockStatus)}>
              {Object.entries(STOCK_STATUS).map(([value, s]) => (
                <option key={value} value={value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" loading={creating || updating}>
              Сохранить остаток
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

type ProductImage = { id: number; product: number; image: string; sort: number; is_main: boolean };

function MediaTab({ product }: { product: AdminProduct }) {
  const { data, isLoading } = useAdminListQuery({
    resource: "product-images",
    params: { product: product.id, ordering: "sort", page_size: 50 },
  });
  const images = listRows<ProductImage>(data);
  const [create, { isLoading: uploading }] = useAdminCreateMutation();
  const [update] = useAdminUpdateMutation();
  const [remove] = useAdminDeleteMutation();

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    let failed = 0;
    for (const [i, file] of Array.from(files).entries()) {
      try {
        await create({
          resource: "product-images",
          data: {
            product: product.id,
            image: file,
            sort: images.length + i,
            is_main: images.length === 0 && i === 0,
          },
        }).unwrap();
      } catch (err) {
        failed++;
        toast.error(apiErrorText(err));
      }
    }
    if (!failed) toast.success("Фото загружено");
  };

  return (
    <Card
      title={`Фото (${images.length})`}
      action={
        <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg bg-[#012F91] px-3 text-xs font-medium text-white hover:bg-[#00257a]">
          <Plus className="h-3.5 w-3.5" />
          {uploading ? "Загрузка…" : "Загрузить"}
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => handleUpload(e.target.files)} />
        </label>
      }
    >
      {isLoading ? (
        <p className="text-sm text-gray-500">Загрузка…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-gray-500">Фото пока нет. Первое загруженное станет главным.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((img) => (
            <li key={img.id} className="group relative overflow-hidden rounded-lg ring-1 ring-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image} alt="" className="aspect-square w-full object-cover" />
              {img.is_main && (
                <span className="absolute left-2 top-2 rounded bg-[#012F91] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Главное
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-white/95 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <button
                  type="button"
                  title="Сделать главным"
                  aria-label="Сделать главным"
                  disabled={img.is_main}
                  onClick={() => update({ resource: "product-images", id: img.id, data: { is_main: true } })}
                  className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-amber-500 disabled:opacity-30"
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Удалить"
                  aria-label="Удалить фото"
                  onClick={() => remove({ resource: "product-images", id: img.id })}
                  className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-[#EE0906]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
