"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import type { AdminBrand } from "@/lib/admin/types";

type Row = AdminBrand & Record<string, unknown>;

export default function BrandsPage() {
  return (
    <ResourcePage<Row>
      resource="brands"
      title="Бренды"
      subtitle="Производители товаров в каталоге"
      createLabel="Добавить бренд"
      searchPlaceholder="Название бренда…"
      defaultOrdering="name"
      columns={[
        {
          key: "logo",
          label: "Логотип",
          render: (r) =>
            r.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.logo} alt={r.name} className="h-8 w-16 object-contain" />
            ) : (
              <span className="text-gray-400">—</span>
            ),
        },
        {
          key: "name",
          label: "Название",
          sortable: true,
          render: (r) => <span className="font-medium text-gray-900">{r.name}</span>,
        },
        { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-gray-500">{r.slug}</code> },
      ]}
      fields={[
        { name: "name", label: "Название", type: "text", required: true },
        { name: "slug", label: "Slug (для URL)", type: "text", required: true, hint: "Латиница, цифры и дефис: bosch" },
        { name: "logo", label: "Логотип", type: "image" },
      ]}
    />
  );
}
