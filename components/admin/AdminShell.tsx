"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Boxes,
  ChevronsLeft,
  ChevronsRight,
  FolderTree,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Percent,
  PhoneCall,
  Search,
  ShoppingCart,
  Star,
  Tag,
  TicketPercent,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { useGetProfileQuery, useLogoutMutation } from "@/lib/api/authApi";
import { listMeta, useAdminListQuery } from "@/lib/admin/adminApi";

const NAV: { group: string; items: { href: string; label: string; icon: React.ElementType }[] }[] = [
  {
    group: "Главное",
    items: [{ href: "/admin", label: "Дашборд", icon: LayoutDashboard }],
  },
  {
    group: "Продажи",
    items: [
      { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
      { href: "/admin/leads", label: "Заявки", icon: PhoneCall },
      { href: "/admin/customers", label: "Клиенты", icon: Users },
    ],
  },
  {
    group: "Каталог",
    items: [
      { href: "/admin/products", label: "Товары", icon: Package },
      { href: "/admin/categories", label: "Категории", icon: FolderTree },
      { href: "/admin/brands", label: "Бренды", icon: Tag },
      { href: "/admin/stock", label: "Склад", icon: Warehouse },
    ],
  },
  {
    group: "Маркетинг",
    items: [
      { href: "/admin/promotions", label: "Акции", icon: Percent },
      { href: "/admin/promo-codes", label: "Промокоды", icon: TicketPercent },
      { href: "/admin/discount-tiers", label: "Скидки от суммы", icon: Boxes },
      { href: "/admin/banners", label: "Баннеры", icon: ImageIcon },
    ],
  },
  {
    group: "Контент",
    items: [
      { href: "/admin/articles", label: "Блог", icon: BookOpen },
      { href: "/admin/reviews", label: "Отзывы", icon: Star },
      { href: "/admin/faq", label: "Вопрос-ответ", icon: HelpCircle },
      { href: "/admin/pages", label: "Страницы", icon: MessageSquare },
    ],
  },
];

const COLLAPSE_KEY = "admin-sidebar-collapsed";

// Sidebar holati localStorage'da (faqat shu brauzer uchun qulaylik)
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const setCollapsedStored = (v: boolean) => {
  try {
    localStorage.setItem(COLLAPSE_KEY, v ? "1" : "0");
  } catch {
    /* private rejim — e'tiborsiz */
  }
  listeners.forEach((l) => l());
};

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function Sidebar({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {NAV.map((section) => (
        <div key={section.group}>
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
              {section.group}
            </p>
          )}
          <ul className="space-y-0.5">
            {section.items.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      collapsed ? "justify-center" : ""
                    } ${
                      active
                        ? "bg-white text-[#003B73] font-semibold shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-[#EE0906]">
        С
      </span>
      {!collapsed && (
        <span className="leading-tight">
          <span className="block text-sm font-bold text-white">СтройОптТорг</span>
          <span className="block text-[11px] text-white/50">Панель управления</span>
        </span>
      )}
    </Link>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: profile } = useGetProfileQuery();
  const [logout] = useLogoutMutation();

  // Bildirishnomalar: yangi buyurtmalar va yangi arizalar soni
  const { data: newOrders } = useAdminListQuery({
    resource: "orders",
    params: { status: "new", page_size: 1 },
  });
  const { data: newLeads } = useAdminListQuery({
    resource: "leads",
    params: { status: "new", page_size: 1 },
  });
  const notifications = listMeta(newOrders).count + listMeta(newLeads).count;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/admin/orders?search=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    await logout().unwrap().catch(() => undefined);
    router.replace("/admin/login");
  };

  const initials =
    `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.toUpperCase() ||
    profile?.email?.[0]?.toUpperCase() ||
    "A";

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-gray-900">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col bg-[#003B73] transition-[width] duration-200 lg:flex ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <Logo collapsed={collapsed} />
        <Sidebar collapsed={collapsed} />
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setCollapsedStored(!collapsed)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white ${
              collapsed ? "justify-center" : ""
            }`}
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
            {!collapsed && "Свернуть"}
          </button>
        </div>
      </aside>

      {/* Mobil sidebar (drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-[#003B73]">
            <div className="flex items-center justify-between pr-3">
              <Logo collapsed={false} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть меню"
                className="rounded-md p-1.5 text-white/70 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Yuqori panel */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <form onSubmit={handleSearch} className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск заказа по номеру или email…"
              className="h-9 w-full rounded-lg border-0 bg-gray-100 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#012F91]"
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 md:block"
            >
              Открыть сайт ↗
            </Link>

            <Link
              href="/admin/orders?status=new"
              aria-label={`Уведомления: ${notifications}`}
              className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EE0906] px-1 text-[10px] font-bold text-white">
                  {notifications > 99 ? "99+" : notifications}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2.5 border-l border-gray-200 pl-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#012F91] text-xs font-bold text-white">
                {initials}
              </span>
              <div className="hidden leading-tight md:block">
                <p className="max-w-[160px] truncate text-sm font-semibold text-gray-900">
                  {profile?.full_name || profile?.email || "Администратор"}
                </p>
                <p className="text-[11px] text-gray-500">Сотрудник</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Выйти"
                title="Выйти"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#EE0906]"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </header>

        <main key={pathname} className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
