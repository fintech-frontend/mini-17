"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { useCategories } from "@/lib/admin/options";
import type { AdminCategory } from "@/lib/admin/types";

type Row = AdminCategory & Record<string, unknown>;

export default function CategoriesPage() {
  const { byId, options, depthOf } = useCategories();

  return (
    <ResourcePage<Row>
      resource="categories"
      title="Категории"
      subtitle="Структура каталога. Вложенность задаётся полем «Родительская категория»."
      createLabel="Добавить категорию"
      searchPlaceholder="Название категории…"
      defaultOrdering="sort"
      filters={[
        {
          param: "is_active",
          label: "Статус",
          options: [
            { value: "true", label: "Активные" },
            { value: "false", label: "Скрытые" },
          ],
        },
      ]}
      columns={[
        {
          key: "name",
          label: "Название",
          sortable: true,
          render: (r) => {
            const cat = byId.get(r.id);
            const depth = cat ? depthOf(cat) : 0;
            return (
              <span className="font-medium text-gray-900" style={{ paddingLeft: depth * 20 }}>
                {depth > 0 && <span className="mr-1.5 text-gray-300">└</span>}
                {r.name}
              </span>
            );
          },
        },
        {
          key: "parent",
          label: "Родитель",
          render: (r) =>
            r.parent ? byId.get(r.parent)?.name ?? `#${r.parent}` : <span className="text-gray-400">—</span>,
        },
        { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-gray-500">{r.slug}</code> },
        { key: "sort", label: "Порядок", sortable: true, align: "right" },
        {
          key: "is_active",
          label: "Статус",
          render: (r) => (r.is_active ? <Badge tone="green">Активна</Badge> : <Badge>Скрыта</Badge>),
        },
      ]}
      fields={[
        { name: "name", label: "Название", type: "text", required: true },
        { name: "slug", label: "Slug (для URL)", type: "text", required: true },
        { name: "parent", label: "Родительская категория", type: "select", options },
        { name: "sort", label: "Порядок сортировки", type: "number" },
        { name: "is_active", label: "Показывать на сайте", type: "toggle" },
      ]}
    />
  );
}
