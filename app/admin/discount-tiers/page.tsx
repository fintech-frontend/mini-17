"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { money } from "@/lib/admin/format";

type Row = { id: number; threshold: string; percent: number; is_active: boolean } & Record<string, unknown>;

export default function DiscountTiersPage() {
  return (
    <ResourcePage<Row>
      resource="discount-tiers"
      title="Скидки от суммы заказа"
      subtitle="Пороги, которые видит покупатель в корзине: «от 3 000 — 5%, от 7 000 — 10%»"
      createLabel="Добавить порог"
      defaultOrdering="threshold"
      filters={[
        {
          param: "is_active",
          label: "Статус",
          options: [
            { value: "true", label: "Активные" },
            { value: "false", label: "Выключенные" },
          ],
        },
      ]}
      columns={[
        { key: "threshold", label: "Сумма заказа от", sortable: true, align: "right", render: (r) => money(r.threshold) },
        { key: "percent", label: "Скидка", align: "right", render: (r) => <span className="font-semibold">{r.percent}%</span> },
        { key: "is_active", label: "Статус", render: (r) => (r.is_active ? <Badge tone="green">Действует</Badge> : <Badge>Выключен</Badge>) },
      ]}
      fields={[
        { name: "threshold", label: "Сумма заказа от", type: "number", required: true },
        { name: "percent", label: "Скидка, %", type: "number", required: true },
        { name: "is_active", label: "Действует", type: "toggle" },
      ]}
    />
  );
}
