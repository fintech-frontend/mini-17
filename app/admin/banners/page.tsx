"use client";

import Image from "next/image";
import ResourcePage from "@/components/admin/ResourcePage";
import { mediaUrl } from "@/lib/admin/labels";

interface AdminBanner extends Record<string, unknown> {
  id: number;
  title: string;
  image: string;
  link: string;
  sort: number;
}

export default function BannersPage() {
  return (
    <ResourcePage<AdminBanner>
      title="Баннеры"
      description="Слайдер на главной странице. Порядок — по полю «Сортировка»."
      resource="banners"
      noun="баннер"
      itemName={(b) => b.title || `Баннер #${b.id}`}
      searchPlaceholder="Заголовок"
      defaultSort={{ key: "sort", dir: "asc" }}
      defaults={{ title: "", link: "", sort: "0" }}
      columns={[
        {
          key: "image",
          header: "Изображение",
          hideable: false,
          render: (b) => (
            <span className="relative block w-40 h-16 rounded bg-gray-50 overflow-hidden">
              {b.image && <Image src={mediaUrl(b.image)} alt="" fill sizes="160px" className="object-cover" />}
            </span>
          ),
        },
        {
          key: "title",
          header: "Заголовок",
          sortKey: "title",
          render: (b) => <span className="font-medium text-gray-900">{b.title || "—"}</span>,
        },
        { key: "link", header: "Ссылка", render: (b) => <span className="font-mono text-xs text-gray-500">{b.link || "—"}</span> },
        { key: "sort", header: "Сортировка", sortKey: "sort", align: "right", render: (b) => b.sort },
      ]}
      fields={[
        { name: "image", label: "Изображение", type: "image", required: true, hint: "Рекомендуемый размер 1440×500" },
        { name: "title", label: "Заголовок", type: "text", placeholder: "Электроинструмент для любых нужд" },
        { name: "link", label: "Ссылка", type: "text", placeholder: "/catalog", half: true },
        { name: "sort", label: "Сортировка", type: "number", half: true },
      ]}
    />
  );
}
