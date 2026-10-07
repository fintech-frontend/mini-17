"use client";

import ResourcePage from "@/components/admin/ResourcePage";

type Row = { id: number; title: string; image: string; link: string; sort: number } & Record<string, unknown>;

export default function BannersPage() {
  return (
    <ResourcePage<Row>
      resource="banners"
      title="Баннеры"
      subtitle="Слайдер на главной странице и баннеры в боковых колонках"
      createLabel="Добавить баннер"
      defaultOrdering="sort"
      columns={[
        {
          key: "image",
          label: "Изображение",
          render: (r) =>
            r.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.image} alt={r.title} className="h-12 w-24 rounded-md object-cover ring-1 ring-gray-200" />
            ) : (
              "—"
            ),
        },
        { key: "title", label: "Заголовок", render: (r) => <span className="font-medium text-gray-900">{r.title}</span> },
        { key: "link", label: "Ссылка", render: (r) => <code className="text-xs text-gray-500">{r.link || "—"}</code> },
        { key: "sort", label: "Порядок", sortable: true, align: "right" },
      ]}
      fields={[
        { name: "title", label: "Заголовок", type: "text", required: true },
        { name: "link", label: "Ссылка", type: "text", placeholder: "/catalog" },
        { name: "sort", label: "Порядок", type: "number" },
        { name: "image", label: "Изображение", type: "image", required: true },
      ]}
    />
  );
}
