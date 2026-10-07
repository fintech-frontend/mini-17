"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { dateTime, STOCK_STATUS } from "@/lib/admin/format";
import type { AdminStock } from "@/lib/admin/types";

type Row = AdminStock & Record<string, unknown>;

const statusOptions = Object.entries(STOCK_STATUS).map(([value, s]) => ({ value, label: s.label }));

export default function StockPage() {
  return (
    <ResourcePage<Row>
      resource="stock"
      title="Склад"
      subtitle="Остатки товаров. Статус «Мало» — сигнал пополнить запас."
      canCreate={false}
      canDelete={false}
      searchPlaceholder="Название товара…"
      defaultOrdering="quantity"
      filters={[{ param: "status", label: "Статус", options: statusOptions }]}
      columns={[
        {
          key: "product_name",
          label: "Товар",
          render: (r) => <span className="font-medium text-gray-900">{r.product_name}</span>,
        },
        { key: "product", label: "ID товара", align: "right" },
        {
          key: "quantity",
          label: "Остаток",
          sortable: true,
          align: "right",
          render: (r) => <span className="font-semibold">{r.quantity}</span>,
        },
        {
          key: "status",
          label: "Статус",
          render: (r) => <Badge tone={STOCK_STATUS[r.status].tone}>{STOCK_STATUS[r.status].label}</Badge>,
        },
        { key: "synced_at", label: "Обновлено", render: (r) => dateTime(r.synced_at) },
      ]}
      fields={[
        { name: "quantity", label: "Остаток", type: "number", required: true },
        { name: "status", label: "Статус", type: "select", required: true, options: statusOptions },
      ]}
    />
  );
}
