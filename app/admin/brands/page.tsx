"use client";

import Image from "next/image";
import ResourcePage from "@/components/admin/ResourcePage";
import { mediaUrl } from "@/lib/admin/labels";
import type { AdminBrand } from "@/lib/admin/types";

export default function BrandsPage() {
  return (
    <ResourcePage<AdminBrand & Record<string, unknown>>
      title="Бренды"
      description="Производители: логотип показывается в карусели брендов на главной"
      resource="brands"
      noun="бренд"
      itemName={(b) => b.name}
      searchPlaceholder="Название бренда"
      defaultSort={{ key: "name", dir: "asc" }}
      defaults={{ name: "", slug: "" }}
      columns={[
        {
          key: "logo",
          header: "Логотип",
          render: (b) => (
            <span className="relative block w-20 h-10 rounded bg-gray-50 overflow-hidden">
              {b.logo && <Image src={mediaUrl(b.logo)} alt="" fill sizes="80px" className="object-contain p-1" />}
            </span>
          ),
        },
        {
          key: "name",
          header: "Название",
          sortKey: "name",
          hideable: false,
          render: (b) => <span className="font-medium text-gray-900">{b.name}</span>,
        },
        { key: "slug", header: "Slug", render: (b) => <span className="font-mono text-xs text-gray-500">{b.slug}</span> },
      ]}
      fields={[
        { name: "name", label: "Название", type: "text", required: true, placeholder: "Bosch" },
        { name: "slug", label: "Slug", type: "slug", from: "name", required: true },
        { name: "logo", label: "Логотип", type: "image" },
      ]}
    />
  );
}
