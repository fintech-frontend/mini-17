"use client";

import Image from "next/image";
import ResourcePage from "@/components/admin/ResourcePage";
import { ARTICLE_TYPE, dateTime, mediaUrl } from "@/lib/admin/labels";
import type { ArticleType } from "@/lib/admin/types";
import { Badge } from "@/components/admin/ui";

interface AdminArticle extends Record<string, unknown> {
  id: number;
  type: ArticleType;
  title: string;
  slug: string;
  body: string;
  image: string | null;
  published_at: string | null;
}

const TYPES = (Object.keys(ARTICLE_TYPE) as ArticleType[]).map((t) => ({ value: t, label: ARTICLE_TYPE[t] }));

export default function BlogAdminPage() {
  const now = new Date().toISOString();
  return (
    <ResourcePage<AdminArticle>
      title="Блог"
      description="Новости, статьи и советы для раздела «Блог»"
      resource="articles"
      noun="публикацию"
      itemName={(a) => a.title}
      searchPlaceholder="Заголовок"
      defaultSort={{ key: "published_at", dir: "desc" }}
      filters={[{ name: "type", label: "Все рубрики", options: TYPES }]}
      defaults={{ type: "news", title: "", slug: "", published_at: "", body: "" }}
      columns={[
        {
          key: "image",
          header: "Обложка",
          render: (a) => (
            <span className="relative block w-20 h-12 rounded bg-gray-50 overflow-hidden">
              {a.image && <Image src={mediaUrl(a.image)} alt="" fill sizes="80px" className="object-cover" />}
            </span>
          ),
        },
        {
          key: "title",
          header: "Заголовок",
          sortKey: "title",
          hideable: false,
          render: (a) => <span className="font-medium text-gray-900 line-clamp-2">{a.title}</span>,
        },
        { key: "type", header: "Рубрика", render: (a) => ARTICLE_TYPE[a.type] ?? a.type },
        {
          key: "published",
          header: "Публикация",
          sortKey: "published_at",
          render: (a) =>
            !a.published_at ? (
              <Badge tone="grey">Черновик</Badge>
            ) : a.published_at > now ? (
              <Badge tone="yellow">{dateTime(a.published_at)}</Badge>
            ) : (
              <Badge tone="green">{dateTime(a.published_at)}</Badge>
            ),
        },
      ]}
      fields={[
        { name: "title", label: "Заголовок", type: "text", required: true },
        { name: "slug", label: "Slug", type: "slug", from: "title", required: true },
        { name: "type", label: "Рубрика", type: "select", required: true, options: TYPES, half: true },
        { name: "published_at", label: "Дата публикации", type: "datetime", hint: "Пусто — черновик", half: true },
        { name: "image", label: "Обложка", type: "image" },
        {
          name: "body",
          label: "Текст",
          type: "textarea",
          required: true,
          hint: "Абзацы разделяйте пустой строкой. Подзаголовок — строка, начинающаяся с ##",
        },
      ]}
    />
  );
}
