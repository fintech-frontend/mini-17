"use client";

import Link from "next/link";
import {
  Heart,
  ListOrdered,
  LogOut,
  MapPin,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react";

export const CABINET_ITEMS = [
  { id: "account", label: "Мой аккаунт", icon: UserRound },
  { id: "edit", label: "Изменить профиль", icon: User },
  { id: "orders", label: "Мои заказы", icon: ListOrdered },
  { id: "address", label: "Адрес доставки", icon: MapPin },
  { id: "favorites", label: "Избранные товары", icon: Heart },
  { id: "password", label: "Сменить пароль", icon: ShieldCheck },
  { id: "logout", label: "Выйти из аккаунта", icon: LogOut, isLogout: true },
] as const;

export type CabinetTab = (typeof CABINET_ITEMS)[number]["id"];

// Shaxsiy kabinet maketi: breadcrumb, sarlavha, chap menyu va o'ng tarafdagi kontent.
// /kantak va /favorites sahifalari bir xil ko'rinishda chiqishi uchun umumiy.
export default function CabinetShell({
  active,
  onSelect,
  children,
}: {
  active: string;
  onSelect: (id: CabinetTab) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-[#005bff]">
            Стройоптторг
          </Link>
          <span>/</span>
          <span className="text-gray-600">Личный кабинет</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-6">Личный кабинет</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <nav
            aria-label="Личный кабинет"
            className="w-full lg:w-[331px] flex-shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-fit"
          >
            {CABINET_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              const isLogout = "isLogout" in item && item.isLogout;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center px-5 py-3.5 text-xs sm:text-sm font-medium transition-all border-b border-gray-50 last:border-none ${
                    isActive
                      ? "bg-[#0b1727] text-white"
                      : isLogout
                        ? "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="flex-1 flex flex-col gap-6 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
