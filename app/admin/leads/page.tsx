"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { dateTime, LEAD_STATUS, LEAD_TYPE } from "@/lib/admin/format";
import type { AdminLead } from "@/lib/admin/types";

type Row = AdminLead & Record<string, unknown>;

const statusOptions = Object.entries(LEAD_STATUS).map(([value, s]) => ({ value, label: s.label }));
const typeOptions = Object.entries(LEAD_TYPE).map(([value, label]) => ({ value, label }));

export default function LeadsPage() {
  return (
    <ResourcePage<Row>
      resource="leads"
      title="Заявки"
      subtitle="Обратные звонки, консультации и покупки в 1 клик с сайта"
      canCreate={false}
      searchPlaceholder="Имя или телефон…"
      defaultOrdering="-created_at"
      filters={[
        { param: "status", label: "Статус", options: statusOptions },
        { param: "type", label: "Тип", options: typeOptions },
      ]}
      columns={[
        { key: "created_at", label: "Дата", sortable: true, render: (r) => dateTime(r.created_at) },
        { key: "type", label: "Тип", render: (r) => LEAD_TYPE[r.type] ?? r.type },
        { key: "name", label: "Имя", render: (r) => <span className="font-medium text-gray-900">{r.name}</span> },
        {
          key: "phone",
          label: "Телефон",
          render: (r) => (
            <a href={`tel:${r.phone.replace(/\D/g, "")}`} className="text-[#012F91] hover:underline">
              {r.phone}
            </a>
          ),
        },
        { key: "product", label: "Товар", render: (r) => (r.product ? `#${r.product}` : "—") },
        {
          key: "status",
          label: "Статус",
          render: (r) => <Badge tone={LEAD_STATUS[r.status].tone}>{LEAD_STATUS[r.status].label}</Badge>,
        },
      ]}
      fields={[
        { name: "status", label: "Статус заявки", type: "select", required: true, options: statusOptions, wide: true },
      ]}
    />
  );
}
