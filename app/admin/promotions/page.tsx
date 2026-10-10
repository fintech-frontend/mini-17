"use client";

import Image from "next/image";
import ResourcePage from "@/components/admin/ResourcePage";
import { useAdminList } from "@/lib/admin/adminApi";
import { dateOnly, mediaUrl } from "@/lib/admin/labels";
import type { AdminCategory } from "@/lib/admin/types";
import { Badge } from "@/components/admin/ui";

interface AdminPromotion extends Record<string, unknown> {
  id: number;
  title: string;
  slug: string;
  body: string;
  image: string | null;
  discount_label: string;
  valid_until: string | null;
  category: number | null;
}

export default function PromotionsPage() {
  const categories = useAdminList<AdminCategory>("categories", { page_size: 500, ordering: "name" });
  const catName = new Map((categories.data?.results ?? []).map((c) => [c.id, c.name]));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <ResourcePage<AdminPromotion>
      title="Акции"
      description="Акции на сайте (/aksiya): баннер, срок действия и категория"
      resource="promotions"
      noun="акцию"
      itemName={(p) => p.title}
      searchPlaceholder="Название акции"
      defaults={{ title: "", slug: "", discount_label: "", valid_until: "", category: "", body: "" }}
      columns={[
        {
          key: "image",
          header: "Баннер",
          render: (p) => (
            <span className="relative block w-24 h-12 rounded bg-gray-50 overflow-hidden">
              {p.image && <Image src={mediaUrl(p.image)} alt="" fill sizes="96px" className="object-cover" />}
            </span>
          ),
        },
        {
          key: "title",
          header: "Название",
          sortKey: "title",
          hideable: false,
          render: (p) => <span className="font-medium text-gray-900">{p.title}</span>,
        },
        { key: "discount", header: "Скидка", render: (p) => p.discount_label || "—" },
        {
          key: "category",
          header: "Категория",
          render: (p) => (p.category ? catName.get(p.category) ?? "—" : "Все товары"),
        },
        {
          key: "valid",
          header: "Действует до",
          sortKey: "valid_until",
          render: (p) =>
            !p.valid_until ? (
              <Badge tone="green">Бессрочно</Badge>
            ) : p.valid_until < today ? (
              <Badge tone="grey">Завершена {dateOnly(p.valid_until)}</Badge>
            ) : (
              <Badge tone="blue">до {dateOnly(p.valid_until)}</Badge>
            ),
        },
      ]}
      fields={[
        { name: "title", label: "Название", type: "text", required: true, placeholder: "Скидки на лакокрасочные материалы" },
        { name: "slug", label: "Slug", type: "slug", from: "title", required: true },
        { name: "discount_label", label: "Подпись скидки", type: "text", placeholder: "до -30%", half: true },
        { name: "valid_until", label: "Действует до", type: "date", hint: "Пусто — бессрочно", half: true },
        {
          name: "category",
          label: "Категория",
          type: "select",
          hint: "Пусто — акция на все товары",
          options: (categories.data?.results ?? []).map((c) => ({ value: String(c.id), label: c.name })),
        },
        { name: "image", label: "Баннер", type: "image" },
        { name: "body", label: "Описание акции", type: "textarea" },
      ]}
    />
  );
}
