"use client";

import { Star } from "lucide-react";
import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { dateOnly } from "@/lib/admin/format";

type Row = {
  id: number;
  product: number | null;
  author_name: string;
  rating: number;
  comment: string;
  is_published: boolean;
  created_at: string;
} & Record<string, unknown>;

export default function ReviewsPage() {
  return (
    <ResourcePage<Row>
      resource="reviews"
      title="Отзывы"
      subtitle="Модерация отзывов о товарах: опубликовать или скрыть"
      canCreate={false}
      searchPlaceholder="Автор или текст…"
      defaultOrdering="-created_at"
      filters={[
        {
          param: "is_published",
          label: "Статус",
          options: [
            { value: "true", label: "Опубликованы" },
            { value: "false", label: "Скрыты" },
          ],
        },
        {
          param: "rating",
          label: "Оценка",
          options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} ★` })),
        },
      ]}
      columns={[
        { key: "created_at", label: "Дата", sortable: true, render: (r) => dateOnly(r.created_at) },
        { key: "author_name", label: "Автор", render: (r) => <span className="font-medium text-gray-900">{r.author_name}</span> },
        { key: "product", label: "Товар", render: (r) => (r.product ? `#${r.product}` : "—") },
        {
          key: "rating",
          label: "Оценка",
          sortable: true,
          render: (r) => (
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
              <Star className="h-3.5 w-3.5 fill-current" />
              {r.rating}
            </span>
          ),
        },
        { key: "comment", label: "Текст", render: (r) => <span className="line-clamp-2 max-w-md">{r.comment}</span> },
        {
          key: "is_published",
          label: "Статус",
          render: (r) => (r.is_published ? <Badge tone="green">Опубликован</Badge> : <Badge>Скрыт</Badge>),
        },
      ]}
      fields={[
        { name: "author_name", label: "Автор", type: "text", required: true },
        { name: "rating", label: "Оценка (1–5)", type: "number", required: true },
        { name: "comment", label: "Текст отзыва", type: "textarea", required: true },
        { name: "is_published", label: "Опубликован на сайте", type: "toggle" },
      ]}
    />
  );
}
