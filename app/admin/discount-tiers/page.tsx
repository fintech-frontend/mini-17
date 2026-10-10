"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { money } from "@/lib/admin/labels";
import { Badge } from "@/components/admin/ui";

interface AdminDiscountTier extends Record<string, unknown> {
  id: number;
  threshold: string;
  percent: number;
  is_active: boolean;
}

export default function DiscountTiersPage() {
  return (
    <ResourcePage<AdminDiscountTier>
      title="Скидки от суммы"
      description="Пороги автоматической скидки в корзине (например, от 7 000 — 10%)"
      resource="discount-tiers"
      noun="порог"
      itemName={(t) => `от ${money(t.threshold)} — ${t.percent}%`}
      defaultSort={{ key: "threshold", dir: "asc" }}
      filters={[
        {
          name: "is_active",
          label: "Все",
          options: [
            { value: "true", label: "Активные" },
            { value: "false", label: "Выключенные" },
          ],
        },
      ]}
      defaults={{ threshold: "", percent: "", is_active: true }}
      columns={[
        {
          key: "threshold",
          header: "Сумма корзины от",
          sortKey: "threshold",
          hideable: false,
          render: (t) => <span className="font-medium text-gray-900">{money(t.threshold)}</span>,
        },
        { key: "percent", header: "Скидка", sortKey: "percent", align: "right", render: (t) => `${t.percent}%` },
        {
          key: "active",
          header: "Статус",
          render: (t) => <Badge tone={t.is_active ? "green" : "grey"}>{t.is_active ? "Активен" : "Выключен"}</Badge>,
        },
      ]}
      fields={[
        { name: "threshold", label: "Сумма корзины от", type: "number", required: true, half: true },
        { name: "percent", label: "Скидка, %", type: "number", required: true, half: true },
        { name: "is_active", label: "Статус", type: "toggle", hint: "Порог действует" },
      ]}
    />
  );
}
