"use client";

import { use, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Printer } from "lucide-react";
import {
  apiErrorText,
  useAdminGetQuery,
  useSetOrderStatusMutation,
} from "@/lib/admin/adminApi";
import {
  DELIVERY_TYPE,
  dateTime,
  money,
  ORDER_STATUS,
  PAYMENT_METHOD,
} from "@/lib/admin/format";
import type { AdminOrder, OrderStatus } from "@/lib/admin/types";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  PageHeader,
  Select,
  Skeleton,
} from "@/components/admin/ui";

// Buyurtma holatlari ketma-ketligi (timeline uchun)
const FLOW: OrderStatus[] = ["new", "awaiting_payment", "processing", "assembled", "shipped", "completed"];

// Manzil snapshot'ini o'qiladigan qatorlarga aylantirish (maydon nomlari backendga bog'liq)
const ADDRESS_LABELS: Record<string, string> = {
  city: "Город",
  street: "Улица",
  house: "Дом",
  apartment: "Квартира",
  entrance: "Подъезд",
  floor: "Этаж",
  phone: "Телефон",
  comment: "Комментарий",
  full_name: "Получатель",
  name: "Получатель",
  address: "Адрес",
};

function addressLines(snapshot: AdminOrder["address_snapshot"]) {
  if (!snapshot || typeof snapshot !== "object") return [];
  return Object.entries(snapshot)
    .filter(([, v]) => v !== null && v !== "" && typeof v !== "object")
    .map(([k, v]) => ({ label: ADDRESS_LABELS[k] ?? k, value: String(v) }));
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error, refetch } = useAdminGetQuery({ resource: "orders", id });
  const order = data as unknown as AdminOrder | undefined;
  const [setStatus, { isLoading: saving }] = useSetOrderStatusMutation();

  const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
  const [confirm, setConfirm] = useState<OrderStatus | null>(null);

  const changeStatus = async (status: OrderStatus) => {
    try {
      await setStatus({ id: Number(id), status }).unwrap();
      toast.success(`Статус: ${ORDER_STATUS[status].label}`);
      setNextStatus("");
      setConfirm(null);
    } catch (err) {
      toast.error(apiErrorText(err));
    }
  };

  const requestChange = (status: OrderStatus) => {
    // Bekor qilish va qaytarish — tasdiqlashni talab qiladi
    if (status === "cancelled" || status === "refunded") setConfirm(status);
    else changeStatus(status);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card>
        <ErrorState text={apiErrorText(error)} onRetry={refetch} />
      </Card>
    );
  }

  const status = ORDER_STATUS[order.status];
  const currentIndex = FLOW.indexOf(order.status);
  const terminal = order.status === "cancelled" || order.status === "refunded";
  const address = addressLines(order.address_snapshot);
  const itemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <Link
        href="/admin/orders"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#012F91]"
      >
        <ArrowLeft className="h-4 w-4" /> Все заказы
      </Link>

      <PageHeader
        title={`Заказ #${order.number}`}
        subtitle={
          <span className="inline-flex items-center gap-2">
            {dateTime(order.created_at)} <Badge tone={status.tone}>{status.label}</Badge>
          </span>
        }
        actions={
          <>
            <Button variant="secondary" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
              Печать
            </Button>
            {order.status !== "cancelled" && order.status !== "completed" && order.status !== "refunded" && (
              <Button variant="danger" onClick={() => requestChange("cancelled")}>
                Отменить заказ
              </Button>
            )}
            {order.status === "completed" && (
              <Button variant="secondary" onClick={() => requestChange("refunded")}>
                Оформить возврат
              </Button>
            )}
          </>
        }
      />

      {/* Timeline */}
      <Card className="mb-6" title="Ход выполнения">
        {terminal ? (
          <Badge tone="red">{status.label}</Badge>
        ) : (
          <ol className="flex flex-wrap items-center gap-y-3">
            {FLOW.map((s, i) => {
              const done = i <= currentIndex;
              const current = i === currentIndex;
              return (
                <li key={s} className="flex items-center">
                  <span
                    className={`flex h-7 items-center rounded-full px-3 text-xs font-semibold ${
                      current
                        ? "bg-[#012F91] text-white"
                        : done
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {ORDER_STATUS[s].label}
                  </span>
                  {i < FLOW.length - 1 && (
                    <span className={`mx-2 h-px w-6 ${i < currentIndex ? "bg-emerald-300" : "bg-gray-200"}`} />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Tarkib */}
          <Card title={`Товары (${itemsCount})`} padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Товар</th>
                    <th className="px-5 py-3 text-right">Цена</th>
                    <th className="px-5 py-3 text-right">Кол-во</th>
                    <th className="px-5 py-3 text-right">Сумма</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{item.name_snapshot}</p>
                        <p className="text-xs text-gray-500">Артикул: {item.article_snapshot}</p>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{money(item.price)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{item.quantity}</td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums">
                        {money(Number(item.price) * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <dl className="space-y-2 border-t border-gray-100 px-5 py-4 text-sm">
              <Line label="Сумма товаров" value={money(order.subtotal)} />
              {Number(order.cart_discount) > 0 && (
                <Line label="Скидка от суммы" value={`− ${money(order.cart_discount)}`} />
              )}
              {Number(order.promo_discount) > 0 && (
                <Line label="Скидка по промокоду" value={`− ${money(order.promo_discount)}`} />
              )}
              <Line label="Доставка" value={money(order.delivery_cost)} />
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                <dt>Итого</dt>
                <dd className="tabular-nums">{money(order.total)}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Statusni o'zgartirish */}
          <Card title="Изменить статус">
            <div className="space-y-3">
              <Select
                aria-label="Новый статус"
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as OrderStatus)}
              >
                <option value="">Выберите статус…</option>
                {(Object.keys(ORDER_STATUS) as OrderStatus[])
                  .filter((s) => s !== order.status)
                  .map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS[s].label}
                    </option>
                  ))}
              </Select>
              <Button
                className="w-full"
                disabled={!nextStatus}
                loading={saving && confirm === null}
                onClick={() => nextStatus && requestChange(nextStatus)}
              >
                Сохранить статус
              </Button>
            </div>
          </Card>

          <Card title="Клиент">
            <dl className="space-y-2 text-sm">
              <Line label="Email" value={order.customer_email || "—"} />
              <Line label="Аккаунт" value={order.user ? "Зарегистрирован" : "Гость"} />
            </dl>
          </Card>

          <Card title="Получение и оплата">
            <dl className="space-y-2 text-sm">
              <Line label="Способ получения" value={DELIVERY_TYPE[order.delivery_type] ?? order.delivery_type} />
              <Line label="Способ оплаты" value={PAYMENT_METHOD[order.payment_method] ?? order.payment_method} />
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Оплата</dt>
                <dd>
                  {order.paid_at ? (
                    <Badge tone="green">Оплачен {dateTime(order.paid_at)}</Badge>
                  ) : (
                    <Badge tone="yellow">Не оплачен</Badge>
                  )}
                </dd>
              </div>
            </dl>
            {address.length > 0 && (
              <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Адрес</p>
                {address.map((a) => (
                  <Line key={a.label} label={a.label} value={a.value} />
                ))}
              </dl>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm === "refunded" ? "Оформить возврат?" : "Отменить заказ?"}
        text={
          confirm === "refunded"
            ? "Статус заказа изменится на «Возврат». Деньги покупателю нужно вернуть отдельно через платёжную систему."
            : "Заказ будет отменён. Покупатель увидит новый статус в личном кабинете."
        }
        confirmLabel={confirm === "refunded" ? "Оформить возврат" : "Отменить заказ"}
        loading={saving}
        onConfirm={() => confirm && changeStatus(confirm)}
        onClose={() => setConfirm(null)}
      />
    </>
  );
}

function Line({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium tabular-nums text-gray-900">{value}</dd>
    </div>
  );
}
