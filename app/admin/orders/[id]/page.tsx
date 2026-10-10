"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Ban, CheckCircle2, Circle, Printer, RotateCcw } from "lucide-react";
import { useAdminItem, useOrderPaymentsQuery, useSetOrderStatusMutation } from "@/lib/admin/adminApi";
import type { AdminOrder, OrderPayment, OrderStatus } from "@/lib/admin/types";
import {
  DELIVERY_TYPE,
  ORDER_STATUS,
  PAYMENT_METHOD,
  apiError,
  dateTime,
  money,
  num,
  paymentState,
  type Tone,
} from "@/lib/admin/labels";
import { Badge, Button, Card, EmptyState, ErrorState, Skeleton, inputCls, useConfirm } from "@/components/admin/ui";

const PAYMENT_STATUS: Record<OrderPayment["status"], { label: string; tone: Tone }> = {
  succeeded: { label: "Успешно", tone: "green" },
  pending: { label: "Ожидает", tone: "yellow" },
  failed: { label: "Ошибка", tone: "red" },
  cancelled: { label: "Отменён", tone: "grey" },
  refunded: { label: "Возврат", tone: "red" },
};

// Buyurtma bosqichlari (timeline uchun)
const FLOW: OrderStatus[] = ["new", "processing", "assembled", "shipped", "completed"];

const ADDRESS_LABELS: Record<string, string> = {
  full_name: "Получатель",
  recipient: "Получатель",
  name: "Получатель",
  phone: "Телефон",
  phone_number: "Телефон",
  region: "Регион",
  city: "Город",
  street: "Улица",
  house: "Дом",
  apartment: "Квартира",
  entrance: "Подъезд",
  floor: "Этаж",
  postal_code: "Индекс",
  comment: "Комментарий",
  address: "Адрес",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const confirm = useConfirm();
  const order = useAdminItem<AdminOrder>("orders", orderId);
  const payments = useOrderPaymentsQuery(orderId);
  const [setStatus, { isLoading: saving }] = useSetOrderStatusMutation();
  const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");

  if (order.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="h-96 xl:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }
  if (order.error || !order.data) {
    return (
      <Card>
        <ErrorState message={apiError(order.error, "Заказ не найден")} onRetry={order.refetch} />
      </Card>
    );
  }

  const o = order.data;
  const st = ORDER_STATUS[o.status];
  const pay = paymentState(o);
  const closed = o.status === "cancelled" || o.status === "refunded";
  const flowIndex = FLOW.indexOf(o.status === "ready_for_pickup" ? "shipped" : o.status === "awaiting_payment" ? "new" : o.status);

  const change = async (status: OrderStatus, ask?: { title: string; message: string; confirmText: string }) => {
    if (ask && !(await confirm({ ...ask, danger: true }))) return;
    try {
      await setStatus({ id: o.id, status }).unwrap();
      toast.success(`Статус: ${ORDER_STATUS[status].label}`);
      setNextStatus("");
    } catch (e) {
      toast.error(apiError(e, "Не удалось изменить статус"));
    }
  };

  const address = o.address_snapshot && typeof o.address_snapshot === "object" ? Object.entries(o.address_snapshot) : [];
  const discounts = Number(o.cart_discount) + Number(o.promo_discount);

  return (
    <>
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3 print:hidden">
        <ArrowLeft size={16} />
        Заказы
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Заказ №{o.number}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge tone={st.tone}>{st.label}</Badge>
            <Badge tone={pay.tone}>{pay.label}</Badge>
            <span className="text-sm text-gray-500">от {dateTime(o.created_at)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="secondary" icon={<Printer size={16} />} onClick={() => window.print()}>
            Счёт
          </Button>
          {o.paid_at && o.status !== "refunded" && (
            <Button
              variant="secondary"
              icon={<RotateCcw size={16} />}
              loading={saving}
              onClick={() =>
                change("refunded", {
                  title: "Оформить возврат?",
                  message: `Заказ №${o.number} получит статус «Возврат». Деньги (${money(o.total)}) нужно вернуть через платёжную систему.`,
                  confirmText: "Оформить возврат",
                })
              }
            >
              Возврат
            </Button>
          )}
          {!closed && (
            <Button
              variant="danger"
              icon={<Ban size={16} />}
              loading={saving}
              onClick={() =>
                change("cancelled", {
                  title: "Отменить заказ?",
                  message: `Заказ №${o.number} будет отменён. Клиент увидит новый статус в личном кабинете.`,
                  confirmText: "Отменить заказ",
                })
              }
            >
              Отменить
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card title={`Товары (${num(o.items.reduce((s, i) => s + i.quantity, 0))})`} bodyClassName="p-0">
            {o.items.length === 0 ? (
              <EmptyState title="В заказе нет товаров" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead className="text-xs text-gray-500 bg-gray-50">
                    <tr>
                      <th className="text-left font-medium px-5 py-2.5">Товар</th>
                      <th className="text-right font-medium px-5 py-2.5">Цена</th>
                      <th className="text-right font-medium px-5 py-2.5">Кол-во</th>
                      <th className="text-right font-medium px-5 py-2.5">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {o.items.map((i) => (
                      <tr key={i.id}>
                        <td className="px-5 py-3">
                          {i.product ? (
                            <Link href={`/admin/products/${i.product}`} className="text-gray-900 hover:text-[#012F91]">
                              {i.name_snapshot}
                            </Link>
                          ) : (
                            <span className="text-gray-900">{i.name_snapshot}</span>
                          )}
                          <span className="block text-xs text-gray-400 font-mono">{i.article_snapshot}</span>
                        </td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">{money(i.price)}</td>
                        <td className="px-5 py-3 text-right">{num(i.quantity)}</td>
                        <td className="px-5 py-3 text-right font-medium whitespace-nowrap">{money(Number(i.price) * i.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <dl className="border-t border-gray-100 px-5 py-4 space-y-2 text-sm tabular-nums ml-auto max-w-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Подытог</dt>
                <dd>{money(o.subtotal)}</dd>
              </div>
              {Number(o.cart_discount) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Скидка от суммы</dt>
                  <dd className="text-[#EE0906]">−{money(o.cart_discount)}</dd>
                </div>
              )}
              {Number(o.promo_discount) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Промокод</dt>
                  <dd className="text-[#EE0906]">−{money(o.promo_discount)}</dd>
                </div>
              )}
              {discounts === 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Скидки</dt>
                  <dd>{money(0)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Доставка</dt>
                <dd>{Number(o.delivery_cost) ? money(o.delivery_cost) : "Бесплатно"}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 text-base font-semibold text-gray-900">
                <dt>Итого</dt>
                <dd>{money(o.total)}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Оплата" bodyClassName="p-0">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 py-4 text-sm border-b border-gray-100">
              <div>
                <dt className="text-gray-500">Способ</dt>
                <dd className="text-gray-900 mt-0.5">{PAYMENT_METHOD[o.payment_method]}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Статус</dt>
                <dd className="mt-0.5">
                  <Badge tone={pay.tone}>{pay.label}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Оплачен</dt>
                <dd className="text-gray-900 mt-0.5">{dateTime(o.paid_at)}</dd>
              </div>
            </dl>
            {payments.isLoading ? (
              <div className="p-5">
                <Skeleton className="h-5 w-full" />
              </div>
            ) : payments.error ? (
              <p className="px-5 py-4 text-sm text-gray-500">
                Список транзакций недоступен{(payments.error as { status?: number }).status === 403 ? " — нет прав" : ""}. Статус оплаты выше взят из заказа.
              </p>
            ) : !payments.data?.length ? (
              <p className="px-5 py-4 text-sm text-gray-500">Транзакций по заказу пока нет.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead className="text-xs text-gray-500 bg-gray-50">
                    <tr>
                      <th className="text-left font-medium px-5 py-2.5">ID транзакции</th>
                      <th className="text-left font-medium px-5 py-2.5">Провайдер</th>
                      <th className="text-left font-medium px-5 py-2.5">Статус</th>
                      <th className="text-right font-medium px-5 py-2.5">Сумма</th>
                      <th className="text-right font-medium px-5 py-2.5">Дата</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.data.map((p) => (
                      <tr key={p.id}>
                        <td className="px-5 py-3 font-mono text-xs break-all">{p.provider_id || `#${p.id}`}</td>
                        <td className="px-5 py-3">{p.provider}</td>
                        <td className="px-5 py-3">
                          <Badge tone={PAYMENT_STATUS[p.status]?.tone ?? "grey"}>{PAYMENT_STATUS[p.status]?.label ?? p.status}</Badge>
                        </td>
                        <td className="px-5 py-3 text-right">{money(p.amount)}</td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">{dateTime(p.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Статус заказа" bodyClassName="p-5 space-y-5">
            <ol className="space-y-3">
              {FLOW.map((s, i) => {
                const done = !closed && flowIndex >= i;
                return (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    {done ? (
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={18} className="text-gray-300 shrink-0" />
                    )}
                    <span className={done ? "text-gray-900" : "text-gray-400"}>{ORDER_STATUS[s].label}</span>
                    {s === "new" && <span className="ml-auto text-xs text-gray-400">{dateTime(o.created_at)}</span>}
                  </li>
                );
              })}
              {closed && (
                <li className="flex items-center gap-3 text-sm">
                  <Ban size={18} className="text-[#EE0906] shrink-0" />
                  <span className="text-[#EE0906] font-medium">{st.label}</span>
                </li>
              )}
            </ol>
            <p className="text-xs text-gray-400">API хранит только текущий статус, поэтому даты промежуточных этапов не показываются.</p>

            <div className="print:hidden space-y-2 pt-4 border-t border-gray-100">
              <label className="block text-[13px] font-medium text-gray-700">Изменить статус</label>
              <div className="flex gap-2">
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as OrderStatus)}
                  aria-label="Новый статус"
                  className={inputCls}
                >
                  <option value="">Выберите статус</option>
                  {(Object.keys(ORDER_STATUS) as OrderStatus[])
                    .filter((s) => s !== o.status)
                    .map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS[s].label}
                      </option>
                    ))}
                </select>
                <Button disabled={!nextStatus} loading={saving} onClick={() => nextStatus && change(nextStatus)}>
                  Применить
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Клиент" bodyClassName="p-5 space-y-3 text-sm">
            <p>
              <span className="block text-gray-500">Email</span>
              {o.customer_email ? (
                <a href={`mailto:${o.customer_email}`} className="text-[#012F91] hover:underline break-all">
                  {o.customer_email}
                </a>
              ) : (
                "—"
              )}
            </p>
            {o.customer_email && (
              <Link
                href={`/admin/customers?search=${encodeURIComponent(o.customer_email)}`}
                className="inline-block text-[#012F91] hover:underline print:hidden"
              >
                Профиль клиента →
              </Link>
            )}
          </Card>

          <Card title={DELIVERY_TYPE[o.delivery_type]} bodyClassName="p-5 text-sm">
            {address.length === 0 ? (
              <p className="text-gray-500">{o.delivery_type === "pickup" ? "Клиент заберёт заказ со склада." : "Адрес не указан."}</p>
            ) : (
              <dl className="space-y-2">
                {address
                  .filter(([, v]) => v !== null && v !== "" && typeof v !== "object")
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-gray-500">{ADDRESS_LABELS[k] ?? k}</dt>
                      <dd className="text-gray-900">{String(v)}</dd>
                    </div>
                  ))}
              </dl>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
