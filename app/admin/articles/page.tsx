"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { ARTICLE_TYPE, dateOnly } from "@/lib/admin/format";
import type { ArticleType } from "@/lib/admin/types";

type Row = {
  id: number;
  type: ArticleType;
  title: string;
  slug: string;
  body: string;
  image: string | null;
  published_at: string | null;
} & Record<string, unknown>;

const typeOptions = Object.entries(ARTICLE_TYPE).map(([value, label]) => ({ value, label }));

export default function ArticlesPage() {
  return (
    <ResourcePage<Row>
      resource="articles"
      title="Блог"
      subtitle="Публикации раздела «Блог» на сайте"
      createLabel="Новая публикация"
      searchPlaceholder="Заголовок…"
      defaultOrdering="-published_at"
      filters={[{ param: "type", label: "Рубрика", options: typeOptions }]}
      columns={[
        {
          key: "image",
          label: "Обложка",
          render: (r) =>
            r.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.image} alt={r.title} className="h-10 w-16 rounded-md object-cover ring-1 ring-gray-200" />
            ) : (
              "—"
            ),
        },
        {
          key: "title",
          label: "Заголовок",
          render: (r) => (
            <a href={`/blog/${r.slug}`} target="_blank" rel="noreferrer" className="font-medium text-gray-900 hover:text-[#012F91]">
              {r.title}
            </a>
          ),
        },
        { key: "type", label: "Рубрика", render: (r) => ARTICLE_TYPE[r.type] ?? r.type },
        {
          key: "published_at",
          label: "Публикация",
          sortable: true,
          render: (r) => (r.published_at ? dateOnly(r.published_at) : <Badge>Черновик</Badge>),
        },
      ]}
      fields={[
        { name: "title", label: "Заголовок", type: "text", required: true, wide: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "type", label: "Рубрика", type: "select", required: true, options: typeOptions },
        { name: "published_at", label: "Дата публикации", type: "datetime", hint: "Пусто — черновик" },
        {
          name: "body",
          label: "Текст",
          type: "textarea",
          required: true,
          hint: "Абзацы через пустую строку, «## » — подзаголовок, «- » — пункт списка",
        },
        { name: "image", label: "Обложка", type: "image" },
      ]}
    />
  );
}
