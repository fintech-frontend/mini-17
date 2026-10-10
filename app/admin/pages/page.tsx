"use client";

import ResourcePage from "@/components/admin/ResourcePage";

interface AdminStaticPage extends Record<string, unknown> {
  id: number;
  slug: string;
  title: string;
  body: string;
}

export default function StaticPagesAdmin() {
  return (
    <ResourcePage<AdminStaticPage>
      title="Страницы"
      description="Статичные страницы: О компании, Доставка, Оплата, Контакты"
      resource="pages"
      noun="страницу"
      itemName={(p) => p.title}
      searchPlaceholder="Заголовок"
      defaultSort={{ key: "title", dir: "asc" }}
      defaults={{ title: "", slug: "", body: "" }}
      columns={[
        {
          key: "title",
          header: "Заголовок",
          sortKey: "title",
          hideable: false,
          render: (p) => <span className="font-medium text-gray-900">{p.title}</span>,
        },
        { key: "slug", header: "Адрес", render: (p) => <span className="font-mono text-xs text-gray-500">/{p.slug}</span> },
        { key: "body", header: "Текст", render: (p) => <span className="text-gray-500 line-clamp-1 max-w-xl">{p.body}</span> },
      ]}
      fields={[
        { name: "title", label: "Заголовок", type: "text", required: true, placeholder: "Доставка" },
        { name: "slug", label: "Slug", type: "slug", from: "title", required: true },
        { name: "body", label: "Текст страницы", type: "textarea", required: true },
      ]}
    />
  );
}
