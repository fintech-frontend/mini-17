"use client";

import Link from "next/link";
import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { money } from "@/lib/admin/format";
import { useBrands, useCategories } from "@/lib/admin/options";
import type { AdminProduct } from "@/lib/admin/types";

type Row = AdminProduct & Record<string, unknown>;

export default function ProductsPage() {
  const categories = useCategories();
  const brands = useBrands();

  return (
    <ResourcePage<Row>
      resource="products"
      title="Товары"
      subtitle="Каталог магазина"
      createLabel="Добавить товар"
      createHref="/admin/products/new"
      editHref={(r) => `/admin/products/${r.id}`}
      searchPlaceholder="Название или артикул…"
      defaultOrdering="-created_at"
      filters={[
        { param: "category", label: "Категория", options: categories.options },
        { param: "brand", label: "Бренд", options: brands.options },
        {
          param: "is_active",
          label: "Статус",
          options: [
            { value: "true", label: "Активные" },
            { value: "false", label: "Скрытые" },
          ],
        },
        { param: "is_featured", label: "Хит", options: [{ value: "true", label: "Только хиты" }] },
      ]}
      columns={[
        {
          key: "name",
          label: "Товар",
          sortable: true,
          render: (r) => (
            <Link href={`/admin/products/${r.id}`} className="block max-w-xs">
              <span className="line-clamp-2 font-medium text-gray-900 hover:text-[#012F91]">{r.name}</span>
              <span className="text-xs text-gray-500">Артикул: {r.article}</span>
            </Link>
          ),
        },
        {
          key: "category",
          label: "Категория",
          render: (r) => categories.byId.get(r.category)?.name ?? `#${r.category}`,
        },
        {
          key: "brand",
          label: "Бренд",
          render: (r) => (r.brand ? brands.byId.get(r.brand)?.name ?? `#${r.brand}` : "—"),
        },
        {
          key: "price",
          label: "Цена",
          sortable: true,
          align: "right",
          render: (r) => (
            <div>
              <p className="font-semibold text-gray-900">{money(r.price)}</p>
              {r.old_price && <p className="text-xs text-gray-400 line-through">{money(r.old_price)}</p>}
            </div>
          ),
        },
        {
          key: "is_featured",
          label: "Хит",
          align: "center",
          render: (r) => (r.is_featured ? <Badge tone="yellow">Хит</Badge> : "—"),
        },
        {
          key: "is_active",
          label: "Статус",
          render: (r) => (r.is_active ? <Badge tone="green">Активен</Badge> : <Badge>Скрыт</Badge>),
        },
      ]}
    />
  );
}
