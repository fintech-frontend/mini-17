"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Package, ShoppingCart, TrendingUp, Users, Wallet } from "lucide-react";
import { listMeta, listRows, useAdminListQuery } from "@/lib/admin/adminApi";
import { dateTime, money, ORDER_STATUS, PAYMENT_METHOD } from "@/lib/admin/format";
import type { AdminOrder, AdminStock } from "@/lib/admin/types";
import { Badge, Card, EmptyState, ErrorState, PageHeader, Select, Skeleton } from "@/components/admin/ui";

const DAY = 86_400_000;
const FETCH_LIMIT = 200;
// Daromadga hisoblanmaydigan buyurtmalar
const EXCLUDED = new Set(["cancelled", "refunded"]);

const PERIODS = [
  { days: 7, label: "7 дней" },
  { days: 30, label: "30 дней" },
  { days: 90, label: "90 дней" },
];

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

function summarize(orders: AdminOrder[]) {
  const valid = orders.filter((o) => !EXCLUDED.has(o.status));
  const revenue = valid.reduce((s, o) => s + Number(o.total), 0);
  const items = valid.reduce((s, o) => s + o.items.reduce((n, i) => n + i.quantity, 0), 0);
  return {
    revenue,
    count: orders.length,
    avg: valid.length ? revenue / valid.length : 0,
    items,
  };
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous) return <span className="text-xs text-gray-400">нет данных за прошлый период</span>;
  const pct = ((current - previous) / previous) * 100;
  const up = pct >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-[#EE0906]"}`}>
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(pct).toFixed(1)}%
      <span className="ml-1 font-normal text-gray-400">к прошлому периоду</span>
    </span>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  children,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-900">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#012F91]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </Card>
  );
}

// Kunlar bo'yicha daromad — chiziqli grafik (SVG)
function LineChart({ points }: { points: { label: string; value: number }[] }) {
  const W = 640;
  const H = 220;
  const pad = { l: 8, r: 8, t: 12, b: 24 };
  const max = Math.max(...points.map((p) => p.value), 1);
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(points.length - 1, 1);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${path} L${x(points.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const step = Math.ceil(points.length / 6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full" role="img" aria-label="Выручка по дням">
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={pad.l} x2={W - pad.r} y1={y(max * t)} y2={y(max * t)} stroke="#E5E7EB" strokeDasharray="3 3" />
      ))}
      <path d={area} fill="#012F91" opacity="0.08" />
      <path d={path} fill="none" stroke="#012F91" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={p.label}>
          <circle cx={x(i)} cy={y(p.value)} r="3" fill="#012F91">
            <title>{`${p.label}: ${money(p.value)}`}</title>
          </circle>
          {i % step === 0 && (
            <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#6B7280">
              {p.label.slice(5).split("-").reverse().join(".")}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

const DONUT_COLORS = ["#012F91", "#EE0906", "#F59E0B", "#10B981", "#6B7280"];

function Donut({ parts }: { parts: { label: string; value: number }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const R = 52;
  const C = 2 * Math.PI * R;
  // Har bir bo'lakning boshlanish joyi (render paytida o'zgaruvchini o'zgartirmaymiz)
  const starts = parts.map((_, i) => parts.slice(0, i).reduce((s, p) => s + (p.value / (total || 1)) * C, 0));

  if (!total) return <EmptyState title="Нет данных" />;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label="Способы оплаты">
        {parts.map((p, i) => {
          const len = (p.value / total) * C;
          return (
            <circle
              key={p.label}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth="20"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-starts[i]}
            />
          );
        })}
      </svg>
      <ul className="w-full space-y-2 text-sm">
        {parts.map((p, i) => (
          <li key={p.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
              {p.label}
            </span>
            <span className="font-semibold tabular-nums">{Math.round((p.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  if (!rows.length) return <EmptyState title="Нет данных" />;
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-gray-600">{r.label}</span>
            <span className="font-semibold tabular-nums text-gray-900">{r.value}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-[#012F91]" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function DashboardPage() {
  const [days, setDays] = useState(30);
  // "Hozir" vaqti sahifa ochilganda bir marta olinadi (render paytida Date.now() chaqirilmaydi)
  const [now] = useState(() => Date.now());

  const { data, isLoading, error, refetch } = useAdminListQuery({
    resource: "orders",
    params: { ordering: "-created_at", page_size: FETCH_LIMIT },
  });
  const { data: users } = useAdminListQuery({ resource: "users", params: { page_size: 1, is_staff: "false" } });
  const { data: lowStock } = useAdminListQuery({ resource: "stock", params: { status: "low_stock", page_size: 5 } });
  const { data: outStock } = useAdminListQuery({ resource: "stock", params: { status: "out_of_stock", page_size: 5 } });

  const all = useMemo(() => listRows<AdminOrder>(data), [data]);
  const { count: totalOrders } = listMeta(data);

  const stats = useMemo(() => {
    const inRange = (o: AdminOrder, from: number, to: number) => {
      const t = new Date(o.created_at).getTime();
      return t >= from && t < to;
    };
    const current = all.filter((o) => inRange(o, now - days * DAY, now + DAY));
    const previous = all.filter((o) => inRange(o, now - 2 * days * DAY, now - days * DAY));

    // Kunlar bo'yicha daromad
    const byDay = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) byDay.set(dayKey(new Date(now - i * DAY)), 0);
    current
      .filter((o) => !EXCLUDED.has(o.status))
      .forEach((o) => {
        const k = dayKey(new Date(o.created_at));
        byDay.set(k, (byDay.get(k) ?? 0) + Number(o.total));
      });

    const methods = new Map<string, number>();
    current.forEach((o) => {
      const label = PAYMENT_METHOD[o.payment_method] ?? o.payment_method;
      methods.set(label, (methods.get(label) ?? 0) + 1);
    });

    const statuses = new Map<string, number>();
    current.forEach((o) => {
      const label = ORDER_STATUS[o.status].label;
      statuses.set(label, (statuses.get(label) ?? 0) + 1);
    });

    // Eng ko'p sotilgan mahsulotlar
    const products = new Map<string, { qty: number; sum: number }>();
    current
      .filter((o) => !EXCLUDED.has(o.status))
      .forEach((o) =>
        o.items.forEach((i) => {
          const p = products.get(i.name_snapshot) ?? { qty: 0, sum: 0 };
          products.set(i.name_snapshot, { qty: p.qty + i.quantity, sum: p.sum + Number(i.price) * i.quantity });
        }),
      );

    return {
      cur: summarize(current),
      prev: summarize(previous),
      line: Array.from(byDay, ([label, value]) => ({ label, value })),
      methods: Array.from(methods, ([label, value]) => ({ label, value })),
      statuses: Array.from(statuses, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
      top: Array.from(products, ([name, v]) => ({ name, ...v })).sort((a, b) => b.qty - a.qty).slice(0, 5),
    };
  }, [all, days, now]);

  const stockAlerts = [...listRows<AdminStock>(outStock), ...listRows<AdminStock>(lowStock)].slice(0, 6);

  return (
    <>
      <PageHeader
        title="Дашборд"
        subtitle="Показатели магазина по заказам"
        actions={
          <Select aria-label="Период" value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-auto">
            {PERIODS.map((p) => (
              <option key={p.days} value={p.days}>
                За {p.label}
              </option>
            ))}
          </Select>
        }
      />

      {error ? (
        <Card>
          <ErrorState text="Не удалось получить заказы. Проверьте, что у вашей учётной записи есть права сотрудника." onRetry={refetch} />
        </Card>
      ) : (
        <>
          {totalOrders > FETCH_LIMIT && (
            <p className="mb-4 rounded-lg bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
              Показатели рассчитаны по последним {FETCH_LIMIT} заказам из {totalOrders}.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
            ) : (
              <>
                <Kpi label="Выручка" value={money(stats.cur.revenue)} icon={Wallet}>
                  <Delta current={stats.cur.revenue} previous={stats.prev.revenue} />
                </Kpi>
                <Kpi label="Заказов" value={String(stats.cur.count)} icon={ShoppingCart}>
                  <Delta current={stats.cur.count} previous={stats.prev.count} />
                </Kpi>
                <Kpi label="Средний чек" value={money(stats.cur.avg)} icon={TrendingUp}>
                  <Delta current={stats.cur.avg} previous={stats.prev.avg} />
                </Kpi>
                <Kpi label="Продано товаров" value={String(stats.cur.items)} icon={Package}>
                  <Delta current={stats.cur.items} previous={stats.prev.items} />
                </Kpi>
              </>
            )}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5" />
            Всего покупателей: {listMeta(users).count}. Прибыль не показываем: в данных магазина нет себестоимости товаров.
          </p>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Card title="Выручка по дням" className="xl:col-span-2">
              {isLoading ? <Skeleton className="h-56" /> : <LineChart points={stats.line} />}
            </Card>
            <Card title="Способы оплаты">
              {isLoading ? <Skeleton className="h-40" /> : <Donut parts={stats.methods} />}
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Card title="Заказы по статусам">{isLoading ? <Skeleton className="h-40" /> : <Bars rows={stats.statuses} />}</Card>

            <Card title="Самые продаваемые товары" padded={false}>
              {stats.top.length === 0 ? (
                <EmptyState title="Нет продаж за период" />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {stats.top.map((p) => (
                    <li key={p.name} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      <span className="line-clamp-2 text-gray-900">{p.name}</span>
                      <span className="shrink-0 text-right tabular-nums">
                        <span className="block font-semibold">{p.qty} шт.</span>
                        <span className="text-xs text-gray-400">{money(p.sum)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              title="Заканчиваются на складе"
              padded={false}
              action={<Link href="/admin/stock" className="text-xs font-medium text-[#012F91] hover:underline">Склад →</Link>}
            >
              {stockAlerts.length === 0 ? (
                <EmptyState title="Всё в порядке" text="Товаров с низким остатком нет." />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {stockAlerts.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      <Link href={`/admin/products/${s.product}`} className="line-clamp-1 text-gray-900 hover:text-[#012F91]">
                        {s.product_name}
                      </Link>
                      <Badge tone={s.status === "out_of_stock" ? "red" : "yellow"}>{s.quantity} шт.</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card
            className="mt-6"
            title="Последние заказы"
            padded={false}
            action={<Link href="/admin/orders" className="text-xs font-medium text-[#012F91] hover:underline">Все заказы →</Link>}
          >
            {all.length === 0 && !isLoading ? (
              <EmptyState title="Заказов пока нет" text="Они появятся здесь, когда покупатели начнут оформлять заказы на сайте." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-3">Заказ</th>
                      <th className="px-5 py-3">Дата</th>
                      <th className="px-5 py-3">Клиент</th>
                      <th className="px-5 py-3 text-right">Сумма</th>
                      <th className="px-5 py-3">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {all.slice(0, 6).map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/80">
                        <td className="px-5 py-3">
                          <Link href={`/admin/orders/${o.id}`} className="font-semibold text-[#012F91] hover:underline">
                            #{o.number}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-gray-500">{dateTime(o.created_at)}</td>
                        <td className="px-5 py-3">{o.customer_email || "—"}</td>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums">{money(o.total)}</td>
                        <td className="px-5 py-3">
                          <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </>
  );
}
