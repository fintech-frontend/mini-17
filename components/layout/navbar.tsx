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
import CatalogMenu from "./CatalogMenu";
import CartBadge from "./CartBadge";

const Header = () => {
  return (
    <header className="relative w-full bg-white text-[#4A4A4A] text-sm border-b border-gray-100">
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
              href="/yengiliklar"
              className="hover:text-[#005bff] transition-colors"
            >
              Новости
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
            <button className="bg-[#f0f5fd] text-[#005bff] text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 rounded-md hover:bg-[#e0eafb] transition-colors font-semibold uppercase whitespace-nowrap">
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
          <CatalogMenu />

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
              <BarChart2 size={22} strokeWidth={1.5} className="rotate-90" />
              <span className="text-[11px] text-gray-600 whitespace-nowrap">
                Сравнение
              </span>
            </Link>

            <Link
              href="/favorites"
              className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#005bff] relative"
            >
              <Heart size={22} strokeWidth={1.5} />
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
                <CartBadge />
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
                href="/compare"
                className="text-gray-700 hover:text-[#005bff]"
              >
                <BarChart2 size={20} strokeWidth={1.5} className="rotate-90" />
              </Link>
              <Link
                href="/favorites"
                className="text-gray-700 hover:text-[#005bff] relative"
              >
                <Heart size={20} strokeWidth={1.5} />
              </Link>
              <Link
                href="/karzinka"
                className="text-gray-700 hover:text-[#005bff] relative"
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                <CartBadge />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 w-full">
            <CatalogMenu compact />

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
