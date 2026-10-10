"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Download, Search } from "lucide-react";
import { useAdminList, useAdminUpdateMutation } from "@/lib/admin/adminApi";
import type { AdminOrder, AdminUser } from "@/lib/admin/types";
import { ORDER_STATUS, apiError, dateOnly, dateTime, money, num } from "@/lib/admin/labels";
import { downloadCsv } from "@/lib/admin/slugify";
import DataTable, { pageCount, toOrdering, type Column, type Sort } from "@/components/admin/DataTable";
import { Badge, Button, Drawer, EmptyState, Field, PageHeader, Toggle, inputCls, useConfirm } from "@/components/admin/ui";

const PAGE_SIZE = 20;

export default function CustomersPage() {
  return (
    <Suspense>
      <Customers />
    </Suspense>
  );
}

function Customers() {
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [type, setType] = useState("");
  const [active, setActive] = useState("");
  const [sort, setSort] = useState<Sort | null>({ key: "date_joined", dir: "desc" });
  const [openId, setOpenId] = useState<string | null>(null);

  const users = useAdminList<AdminUser>("users", {
    page,
    page_size: PAGE_SIZE,
    search: search.trim(),
    is_staff: type,
    is_active: active,
    ordering: toOrdering(sort),
  });
  // Buyurtmalar soni va jami summa — buyurtmalardan email bo'yicha hisoblanadi
  const orders = useAdminList<AdminOrder>("orders", { page_size: 500, ordering: "-created_at" });
  const stats = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    for (const o of orders.data?.results ?? []) {
      const key = o.customer_email.toLowerCase();
      const s = map.get(key) ?? { count: 0, total: 0 };
      s.count += 1;
      if (o.status !== "cancelled" && o.status !== "refunded") s.total += Number(o.total);
      map.set(key, s);
    }
    return map;
  }, [orders.data]);

  const rows = users.data?.results ?? [];
  const current = rows.find((u) => u.id === openId) ?? null;
  const statOf = (u: AdminUser) => stats.get(u.email.toLowerCase()) ?? { count: 0, total: 0 };

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Клиент",
      sortKey: "first_name",
      hideable: false,
      render: (u) => (
        <span className="flex items-center gap-3">
          <span className="w-9 h-9 shrink-0 rounded-full bg-[#012F91]/10 text-[#012F91] text-sm font-semibold flex items-center justify-center">
            {(u.full_name || u.email).charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block font-medium text-gray-900 truncate">{u.full_name || "Без имени"}</span>
            <span className="block text-xs text-gray-500 truncate">{u.email}</span>
          </span>
        </span>
      ),
    },
    { key: "phone", header: "Телефон", render: (u) => u.phone_number || "—" },
    {
      key: "type",
      header: "Тип",
      render: (u) => (u.is_staff ? <Badge tone="blue">Сотрудник</Badge> : <Badge tone="grey">Покупатель</Badge>),
    },
    { key: "orders", header: "Заказы", align: "right", render: (u) => num(statOf(u).count) },
    { key: "spent", header: "Сумма покупок", align: "right", render: (u) => <span className="font-medium">{money(statOf(u).total)}</span> },
    { key: "joined", header: "Регистрация", sortKey: "date_joined", render: (u) => dateOnly(u.date_joined) },
    {
      key: "status",
      header: "Статус",
      render: (u) => (u.is_active ? <Badge tone="green">Активен</Badge> : <Badge tone="red">Заблокирован</Badge>),
    },
  ];

  return (
    <>
      <PageHeader
        title="Клиенты"
        description="Зарегистрированные покупатели и сотрудники"
        actions={
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            disabled={!rows.length}
            onClick={() =>
              downloadCsv(
                `customers-${new Date().toISOString().slice(0, 10)}.csv`,
                ["Имя", "Email", "Телефон", "Тип", "Заказы", "Сумма покупок", "Регистрация", "Статус"],
                rows.map((u) => [
                  u.full_name,
                  u.email,
                  u.phone_number,
                  u.is_staff ? "Сотрудник" : "Покупатель",
                  statOf(u).count,
                  statOf(u).total,
                  dateOnly(u.date_joined),
                  u.is_active ? "Активен" : "Заблокирован",
                ])
              )
            }
          >
            Экспорт CSV
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(u) => u.id}
        loading={users.isLoading}
        error={users.error ? apiError(users.error, "Ошибка загрузки клиентов") : undefined}
        onRetry={users.refetch}
        sort={sort}
        onSort={(s) => {
          setSort(s);
          setPage(1);
        }}
        onRowClick={(u) => setOpenId(u.id)}
        page={page}
        pages={pageCount(users.data, PAGE_SIZE)}
        count={users.data?.count}
        onPage={setPage}
        empty={<EmptyState title={search || type || active ? "Никого не найдено" : "Клиентов пока нет"} />}
        toolbar={
          <>
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Имя, email или телефон"
                aria-label="Поиск клиентов"
                className={`${inputCls} h-9 pl-9`}
              />
            </div>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              aria-label="Тип"
              className={`${inputCls} h-9 w-auto!`}
            >
              <option value="">Все типы</option>
              <option value="false">Покупатели</option>
              <option value="true">Сотрудники</option>
            </select>
            <select
              value={active}
              onChange={(e) => {
                setActive(e.target.value);
                setPage(1);
              }}
              aria-label="Статус"
              className={`${inputCls} h-9 w-auto!`}
            >
              <option value="">Любой статус</option>
              <option value="true">Активные</option>
              <option value="false">Заблокированные</option>
            </select>
          </>
        }
      />

      <Drawer open={!!current} onClose={() => setOpenId(null)} title={current?.full_name || current?.email || ""}>
        {current && (
          <CustomerProfile
            key={current.id}
            user={current}
            orders={(orders.data?.results ?? []).filter((o) => o.customer_email.toLowerCase() === current.email.toLowerCase())}
          />
        )}
      </Drawer>
    </>
  );
}

function CustomerProfile({ user, orders }: { user: AdminUser; orders: AdminOrder[] }) {
  const confirm = useConfirm();
  const [update, { isLoading }] = useAdminUpdateMutation();
  const [form, setForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number ?? "",
  });
  const total = orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded").reduce((s, o) => s + Number(o.total), 0);

  const patch = async (body: Partial<AdminUser>, message: string) => {
    try {
      await update({ resource: "users", id: user.id, body }).unwrap();
      toast.success(message);
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  const toggleBlock = async () => {
    const ok = await confirm({
      title: user.is_active ? "Заблокировать клиента?" : "Разблокировать клиента?",
      message: user.is_active
        ? `${user.email} не сможет войти в аккаунт и оформлять заказы.`
        : `${user.email} снова сможет входить в аккаунт.`,
      confirmText: user.is_active ? "Заблокировать" : "Разблокировать",
      danger: user.is_active,
    });
    if (ok) patch({ is_active: !user.is_active }, user.is_active ? "Клиент заблокирован" : "Клиент разблокирован");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-[#F5F7FA] rounded-lg p-3">
          <p className="text-xs text-gray-500">Заказов</p>
          <p className="text-lg font-bold tabular-nums">{num(orders.length)}</p>
        </div>
        <div className="bg-[#F5F7FA] rounded-lg p-3">
          <p className="text-xs text-gray-500">Сумма покупок</p>
          <p className="text-lg font-bold tabular-nums">{money(total)}</p>
        </div>
        <div className="bg-[#F5F7FA] rounded-lg p-3">
          <p className="text-xs text-gray-500">Последний вход</p>
          <p className="text-sm font-semibold mt-1">{dateOnly(user.last_login)}</p>
        </div>
      </div>

      <section className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900">Контактные данные</h4>
        <p className="text-sm">
          <span className="text-gray-500">Email: </span>
          <a href={`mailto:${user.email}`} className="text-[#012F91] hover:underline">
            {user.email}
          </a>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Имя">
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Фамилия">
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <Field label="Телефон">
          <input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} className={inputCls} />
        </Field>
        <Button
          size="sm"
          loading={isLoading}
          onClick={() => patch({ ...form, phone_number: form.phone_number || null }, "Данные клиента сохранены")}
        >
          Сохранить
        </Button>
      </section>

      <section className="space-y-3 pt-5 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900">Доступ</h4>
        <Toggle
          checked={user.is_staff}
          onChange={(v) => patch({ is_staff: v }, v ? "Выдан доступ к админ-панели" : "Доступ к админ-панели снят")}
          label="Сотрудник (доступ к админ-панели)"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-gray-600">
            Статус: {user.is_active ? <Badge tone="green">Активен</Badge> : <Badge tone="red">Заблокирован</Badge>}
          </span>
          <Button size="sm" variant={user.is_active ? "danger" : "secondary"} onClick={toggleBlock}>
            {user.is_active ? "Заблокировать" : "Разблокировать"}
          </Button>
        </div>
        <p className="text-xs text-gray-400">Зарегистрирован {dateTime(user.date_joined)}</p>
      </section>

      <section className="space-y-3 pt-5 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900">История заказов</h4>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">Заказов пока нет.</p>
        ) : (
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-gray-50 text-sm">
                  <span>
                    <span className="font-medium text-[#012F91]">№{o.number}</span>
                    <span className="block text-xs text-gray-400">{dateTime(o.created_at)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge tone={ORDER_STATUS[o.status].tone}>{ORDER_STATUS[o.status].label}</Badge>
                    <span className="tabular-nums font-medium">{money(o.total)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
