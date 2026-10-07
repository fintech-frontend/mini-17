"use client";

import ResourcePage from "@/components/admin/ResourcePage";

type Row = { id: number; slug: string; title: string; body: string } & Record<string, unknown>;

export default function StaticPagesPage() {
  return (
    <ResourcePage<Row>
      resource="pages"
      title="Страницы"
      subtitle="Статические страницы: О компании, Доставка, Оплата, Контакты и др."
      createLabel="Добавить страницу"
      columns={[
        { key: "title", label: "Заголовок", render: (r) => <span className="font-medium text-gray-900">{r.title}</span> },
        { key: "slug", label: "Slug", render: (r) => <code className="text-xs text-gray-500">{r.slug}</code> },
        { key: "body", label: "Текст", render: (r) => <span className="line-clamp-1 max-w-lg text-gray-500">{r.body}</span> },
      ]}
      fields={[
        { name: "title", label: "Заголовок", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, hint: "Например: delivery" },
        { name: "body", label: "Текст страницы", type: "textarea", required: true },
      ]}
    />
  );
}
