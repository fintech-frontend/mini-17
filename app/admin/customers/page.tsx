"use client";

import ResourcePage from "@/components/admin/ResourcePage";
import { Badge } from "@/components/admin/ui";
import { dateOnly, dateTime } from "@/lib/admin/format";
import type { AdminUser } from "@/lib/admin/types";

type Row = AdminUser & Record<string, unknown>;

export default function CustomersPage() {
  return (
    <ResourcePage<Row>
      resource="users"
      title="Клиенты"
      subtitle="Зарегистрированные пользователи. Блокировка запрещает вход в аккаунт."
      canCreate={false}
      canDelete={false}
      searchPlaceholder="Имя, email или телефон…"
      defaultOrdering="-date_joined"
      filters={[
        {
          param: "is_active",
          label: "Статус",
          options: [
            { value: "true", label: "Активные" },
            { value: "false", label: "Заблокированные" },
          ],
        },
        {
          param: "is_staff",
          label: "Тип",
          options: [
            { value: "false", label: "Покупатели" },
            { value: "true", label: "Сотрудники" },
          ],
        },
      ]}
      columns={[
        {
          key: "full_name",
          label: "Клиент",
          render: (r) => (
            <div>
              <p className="font-medium text-gray-900">{r.full_name || "Без имени"}</p>
              <p className="text-xs text-gray-500">{r.email}</p>
            </div>
          ),
        },
        { key: "phone_number", label: "Телефон", render: (r) => r.phone_number || "—" },
        { key: "date_joined", label: "Регистрация", sortable: true, render: (r) => dateOnly(r.date_joined) },
        { key: "last_login", label: "Последний вход", render: (r) => dateTime(r.last_login), hiddenByDefault: true },
        {
          key: "is_staff",
          label: "Роль",
          render: (r) => (r.is_staff ? <Badge tone="blue">Сотрудник</Badge> : <Badge>Покупатель</Badge>),
        },
        {
          key: "is_active",
          label: "Статус",
          render: (r) => (r.is_active ? <Badge tone="green">Активен</Badge> : <Badge tone="red">Заблокирован</Badge>),
        },
      ]}
      fields={[
        { name: "first_name", label: "Имя", type: "text" },
        { name: "last_name", label: "Фамилия", type: "text" },
        { name: "phone_number", label: "Телефон", type: "text" },
        { name: "is_active", label: "Активен (снимите, чтобы заблокировать)", type: "toggle" },
        { name: "is_staff", label: "Доступ к админ-панели", type: "toggle" },
      ]}
    />
  );
}
