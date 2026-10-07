"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { dateOnly } from "@/lib/admin/format";
import { useCategories } from "@/lib/admin/options";

type Row = {
  id: number;
  title: string;
  slug: string;
  body: string;
  image: string | null;
  discount_label: string;
  valid_until: string | null;
  category: number | null;
} & Record<string, unknown>;

export default function PromotionsPage() {
  const { byId, options } = useCategories();

  return (
    <ResourcePage<Row>
      resource="promotions"
      title="Акции"
      subtitle="Страница «Все акции» и промо-блоки на главной"
      createLabel="Создать акцию"
      searchPlaceholder="Название акции…"
      columns={[
        {
          key: "image",
          label: "Баннер",
          render: (r) =>
            r.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.image} alt={r.title} className="h-10 w-20 rounded-md object-cover ring-1 ring-gray-200" />
            ) : (
              "—"
            ),
        },
        { key: "title", label: "Название", render: (r) => <span className="font-medium text-gray-900">{r.title}</span> },
        { key: "discount_label", label: "Скидка", render: (r) => <Badge tone="red">{r.discount_label || "—"}</Badge> },
        { key: "category", label: "Категория", render: (r) => (r.category ? byId.get(r.category)?.name ?? `#${r.category}` : "Все товары") },
        {
          key: "valid_until",
          label: "Действует до",
          render: (r) => {
            if (!r.valid_until) return <Badge tone="green">Бессрочно</Badge>;
            const expired = new Date(r.valid_until) < new Date();
            return expired ? <Badge>Завершена {dateOnly(r.valid_until)}</Badge> : dateOnly(r.valid_until);
          },
        },
      ]}
      fields={[
        { name: "title", label: "Название", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "discount_label", label: "Метка скидки", type: "text", placeholder: "до -30%" },
        { name: "valid_until", label: "Действует до", type: "date" },
        { name: "category", label: "Категория товаров", type: "select", options, wide: true },
        { name: "body", label: "Описание", type: "textarea" },
        { name: "image", label: "Баннер", type: "image" },
      ]}
    />
  );
}
