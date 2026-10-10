"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { dateTime, money, num } from "@/lib/admin/labels";
import { Badge } from "@/components/admin/ui";

interface AdminPromoCode extends Record<string, unknown> {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: string;
  min_order: string;
  valid_to: string | null;
  usage_limit: number | null;
  used_count: number;
}

const TYPES = [
  { value: "percent", label: "Процент" },
  { value: "fixed", label: "Фиксированная сумма" },
];

export default function PromoCodesPage() {
  const now = new Date().toISOString();
  return (
    <ResourcePage<AdminPromoCode>
      title="Промокоды"
      description="Скидочные коды для корзины: размер, лимит и срок действия"
      resource="promo-codes"
      noun="промокод"
      itemName={(p) => p.code}
      searchPlaceholder="Код"
      filters={[{ name: "type", label: "Любой тип", options: TYPES }]}
      defaults={{ code: "", type: "percent", value: "", min_order: "0", valid_to: "", usage_limit: "" }}
      columns={[
        {
          key: "code",
          header: "Код",
          sortKey: "code",
          hideable: false,
          render: (p) => <span className="font-mono font-semibold text-gray-900">{p.code}</span>,
        },
        {
          key: "value",
          header: "Скидка",
          align: "right",
          render: (p) => (p.type === "percent" ? `${Number(p.value)}%` : money(p.value)),
        },
        {
          key: "min",
          header: "Мин. заказ",
          align: "right",
          render: (p) => (Number(p.min_order) ? money(p.min_order) : "—"),
        },
        {
          key: "usage",
          header: "Использован",
          align: "right",
          render: (p) => (
            <span className="tabular-nums">
              {num(p.used_count)}
              {p.usage_limit ? ` / ${num(p.usage_limit)}` : ""}
            </span>
          ),
        },
        {
          key: "valid",
          header: "Действует до",
          sortKey: "valid_to",
          render: (p) => (p.valid_to ? dateTime(p.valid_to) : "Бессрочно"),
        },
        {
          key: "state",
          header: "Статус",
          render: (p) =>
            p.valid_to && p.valid_to < now ? (
              <Badge tone="grey">Истёк</Badge>
            ) : p.usage_limit && p.used_count >= p.usage_limit ? (
              <Badge tone="red">Лимит исчерпан</Badge>
            ) : (
              <Badge tone="green">Активен</Badge>
            ),
        },
      ]}
      fields={[
        { name: "code", label: "Код", type: "text", required: true, placeholder: "LAKOART20", hint: "Клиент вводит его в корзине" },
        { name: "type", label: "Тип скидки", type: "select", required: true, options: TYPES, half: true },
        { name: "value", label: "Размер скидки", type: "number", required: true, hint: "% или сумма", half: true },
        { name: "min_order", label: "Минимальная сумма заказа", type: "number", half: true },
        { name: "usage_limit", label: "Лимит использований", type: "number", hint: "Пусто — без лимита", half: true },
        { name: "valid_to", label: "Действует до", type: "datetime", hint: "Пусто — бессрочно" },
      ]}
    />
  );
}
