"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Gift,
  User,
  BarChart2,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useFavoritesStore } from "@/components/useFavoritesStore";
import { useCompareStore } from "@/components/useCompareStore";
import { useGetCartQuery } from "@/lib/api/cartApi";
import { useMounted } from "@/lib/useMounted";
import { useCallbackModal } from "@/components/CallbackModal";

// Ikonka ustidagi qizil sanoq belgisi
const Badge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#e52e2e] text-white text-[10px] font-bold flex items-center justify-center leading-none">
      {count > 99 ? "99+" : count}
    </span>
  ) : null;

const Header = () => {
  const mounted = useMounted();
  const favoritesCount = useFavoritesStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.items.length);
  const { data: cart } = useGetCartQuery();
  const openCallback = useCallbackModal((s) => s.open);

  const favCount = mounted ? favoritesCount : 0;
  const cmpCount = mounted ? compareCount : 0;
  const cartCount = cart?.totals.item_count ?? 0;

  return (
    <header className="w-full bg-white text-[#4A4A4A] text-sm border-b border-gray-100">
      {/* 1. TOP BAR */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2">
          {/* Kompyuterda: Navigatsiya havolalari */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs text-gray-600 whitespace-nowrap">
            <Link
              href="/komponiyaHaqida"
              className="hover:text-[#005bff] transition-colors"
            >
              О компании
            </Link>
            <Link
              href="/tolov"
              className="hover:text-[#005bff] transition-colors"
            >
              Оплата
            </Link>
            <Link
              href="/yetkazibBerish"
              className="hover:text-[#005bff] transition-colors"
            >
              Доставка
            </Link>
            <Link
              href="/qaytarish"
              className="hover:text-[#005bff] transition-colors"
            >
              Возврат
            </Link>
            <Link
              href="/fikrlar"
              className="hover:text-[#005bff] transition-colors"
            >
              Отзывы
            </Link>
            <Link
              href="/vafrosatvet"
              className="hover:text-[#005bff] transition-colors"
            >
              Вопрос-ответ
            </Link>
            <Link
              href="/blog"
              className="hover:text-[#005bff] transition-colors"
            >
              Блог
            </Link>
            <Link
              href="/aloqa"
              className="hover:text-[#005bff] transition-colors"
            >
              Контакты
            </Link>
          </nav>

          {/* Telefonda / iPad'da: Menu tugmasi */}
          <button className="lg:hidden flex items-center gap-1.5 text-gray-800 hover:text-[#005bff] font-medium text-xs">
            <Menu size={18} />
            <span>Меню</span>
          </button>

          {/* O'ng taraf: Telefon va Vaqt */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">
            <span className="text-[#808080] text-[11px] hidden xl:inline whitespace-nowrap">
              Ежедневно, с 8:00 до 18:00
            </span>
            <a
              href="tel:88004440065"
              className="text-xs sm:text-sm lg:text-base font-extrabold text-black hover:text-[#005bff] whitespace-nowrap"
            >
              8 800 444 00 65
            </a>
            <button
              type="button"
              onClick={openCallback}
              className="bg-[#f0f5fd] text-[#005bff] text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 rounded-md hover:bg-[#e0eafb] transition-colors font-semibold uppercase whitespace-nowrap"
            >
              ЗАКАЗАТЬ ЗВОНОК
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-3">
        {/* --- KOMPYUTER VERSIYA (lg: 1024px va undan katta) --- */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/logo 1.png"
              alt="Стройоптторг"
              className="h-10 xl:h-11 w-auto object-contain"
            />
          </Link>

          {/* Katalog Tugmasi */}
          <button className="flex items-center gap-2 bg-[#005bff] text-white px-5 py-2.5 rounded-xl hover:bg-[#004dc9] transition-colors font-semibold uppercase text-xs tracking-wider flex-shrink-0">
            <Menu size={18} />
            <span>КАТАЛОГ</span>
          </button>

          {/* Qidiruv inputi */}
          <div className="flex-1 max-w-2xl flex items-center border-2 border-[#005bff] rounded-xl overflow-hidden relative bg-white">
            <input
              type="text"
              placeholder="Найти среди 50000 товаров. Например: Дрель Bosch"
              className="w-full pl-4 pr-12 py-2 text-xs xl:text-sm placeholder:text-[#a0a0a0] focus:outline-none"
            />
            <button className="bg-[#005bff] text-white px-4 py-2.5 h-full absolute right-0 top-0 flex items-center justify-center hover:bg-[#004dc9] transition-colors">
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 xl:gap-6 flex-shrink-0">
            <Link
              href="/padarkalar"
              className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#005bff]"
            >
              <Gift size={22} strokeWidth={1.5} />
              <span className="text-[11px] text-gray-600 whitespace-nowrap">
                Все акции
              </span>
            </Link>

            <Link
              href="/kantak"
              className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#005bff]"
            >
              <User size={22} strokeWidth={1.5} />
              <span className="text-[11px] text-gray-600 whitespace-nowrap">
                Войти
              </span>
            </Link>

            <Link
              href="/sraveniy"
              className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#005bff]"
            >
              <span className="relative">
                <BarChart2 size={22} strokeWidth={1.5} className="rotate-90" />
                <Badge count={cmpCount} />
              </span>
              <span className="text-[11px] text-gray-600 whitespace-nowrap">
                Сравнение
              </span>
            </Link>

            <Link
              href="/favorites"
              className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#005bff] relative"
            >
              <span className="relative">
                <Heart size={22} strokeWidth={1.5} />
                <Badge count={favCount} />
              </span>
              <span className="text-[11px] text-gray-600 whitespace-nowrap">
                Избранное
              </span>
            </Link>

            <Link
              href="/karzinka"
              className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#005bff] relative"
            >
              <span className="relative">
                <ShoppingCart size={22} strokeWidth={1.5} />
                <Badge count={cartCount} />
              </span>
              <span className="text-[11px] text-gray-600 whitespace-nowrap">
                Корзина
              </span>
            </Link>
          </div>
        </div>

        <div className="flex lg:hidden flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo 1.png"
                alt="Стройоптторг"
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center gap-3 sm:gap-6">
              <Link
                href="/promotions"
                className="text-gray-700 hover:text-[#005bff]"
              >
                <Gift size={20} strokeWidth={1.5} />
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-[#005bff]"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
              <Link
                href="/sraveniy"
                className="text-gray-700 hover:text-[#005bff] relative"
              >
                <BarChart2 size={20} strokeWidth={1.5} className="rotate-90" />
                <Badge count={cmpCount} />
              </Link>
              <Link
                href="/favorites"
                className="text-gray-700 hover:text-[#005bff] relative"
              >
                <Heart size={20} strokeWidth={1.5} />
                <Badge count={favCount} />
              </Link>
              <Link
                href="/karzinka"
                className="text-gray-700 hover:text-[#005bff] relative"
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                <Badge count={cartCount} />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 w-full">
            <button className="flex items-center gap-1.5 bg-[#005bff] text-white px-3.5 sm:px-5 py-2.5 rounded-xl font-semibold uppercase text-xs tracking-wider flex-shrink-0">
              <Menu size={16} />
              <span>КАТАЛОГ</span>
            </button>

            <div className="flex-1 flex items-center border-2 border-[#005bff] rounded-xl overflow-hidden relative bg-white">
              <input
                type="text"
                placeholder="Найти среди 50000 товаров..."
                className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm placeholder:text-[#a0a0a0] focus:outline-none"
              />
              <button className="bg-[#005bff] text-white px-3 sm:px-4 py-2 h-full absolute right-0 top-0 flex items-center justify-center">
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
