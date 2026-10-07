"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { dateOnly, money } from "@/lib/admin/format";

type Row = {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: string;
  min_order: string;
  valid_to: string | null;
  usage_limit: number | null;
  used_count: number;
} & Record<string, unknown>;

const typeOptions = [
  { value: "percent", label: "Процент" },
  { value: "fixed", label: "Фиксированная сумма" },
];

export default function PromoCodesPage() {
  return (
    <ResourcePage<Row>
      resource="promo-codes"
      title="Промокоды"
      subtitle="Скидочные коды для корзины"
      createLabel="Создать промокод"
      searchPlaceholder="Код…"
      filters={[{ param: "type", label: "Тип", options: typeOptions }]}
      columns={[
        { key: "code", label: "Код", sortable: true, render: (r) => <code className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-900">{r.code}</code> },
        {
          key: "value",
          label: "Скидка",
          align: "right",
          render: (r) => (r.type === "percent" ? `${Number(r.value)}%` : money(r.value)),
        },
        { key: "min_order", label: "Мин. заказ", align: "right", render: (r) => money(r.min_order) },
        {
          key: "used_count",
          label: "Использовано",
          align: "right",
          render: (r) => (
            <span className="tabular-nums">
              {r.used_count}
              {r.usage_limit ? <span className="text-gray-400"> / {r.usage_limit}</span> : null}
            </span>
          ),
        },
        {
          key: "valid_to",
          label: "Статус",
          render: (r) => {
            const expired = r.valid_to && new Date(r.valid_to) < new Date();
            const exhausted = r.usage_limit !== null && r.used_count >= r.usage_limit;
            if (expired) return <Badge>Истёк {dateOnly(r.valid_to)}</Badge>;
            if (exhausted) return <Badge tone="red">Лимит исчерпан</Badge>;
            return <Badge tone="green">{r.valid_to ? `До ${dateOnly(r.valid_to)}` : "Активен"}</Badge>;
          },
        },
      ]}
      fields={[
        { name: "code", label: "Код", type: "text", required: true, placeholder: "SALE10" },
        { name: "type", label: "Тип скидки", type: "select", required: true, options: typeOptions },
        { name: "value", label: "Размер скидки", type: "number", required: true, hint: "Процент или сумма — в зависимости от типа" },
        { name: "min_order", label: "Минимальная сумма заказа", type: "number" },
        { name: "usage_limit", label: "Лимит использований", type: "number", hint: "Пусто — без ограничений" },
        { name: "valid_to", label: "Действует до", type: "datetime" },
      ]}
    />
  );
}
