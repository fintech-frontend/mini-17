"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, ChevronDown } from "lucide-react";
import { useCallbackModal } from "@/components/CallbackModal";

const Footer = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const openCallback = useCallbackModal((s) => s.open);

  return (
    <footer className="w-full bg-[#F4F5F7] text-[#333333] pt-6 sm:pt-8 pb-6 text-xs sm:text-sm border-t border-gray-200">
      {/* Header bilan aynan bir xil kenglik max-w-[1400px] va padding ishlatildi */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-300/60">
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo 1.png"
                alt="Стройоптторг"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </Link>

            <div className="text-right sm:text-left text-xs">
              <span className="text-[#808080] block text-[11px]">Email:</span>
              <a
                href="mailto:info@stroiopttorg.ru"
                className="text-[#005bff] hover:underline font-medium"
              >
                info@stroiopttorg.ru
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <div className="text-left sm:text-right">
              <a
                href="tel:500200684"
                className="text-base sm:text-lg font-extrabold text-black block hover:text-[#005bff] leading-tight"
              >
                500200684
              </a>
              <span className="text-[10px] sm:text-[11px] text-[#808080] block">
                Ежедневно, с 8:00 до 18:00
              </span>
            </div>

            <button
              type="button"
              onClick={openCallback}
              className="border border-[#D03020] text-[#D03020] px-3 sm:px-5 py-2 rounded text-[11px] sm:text-xs font-semibold hover:bg-[#D03020] hover:text-white transition-colors uppercase whitespace-nowrap"
            >
              ЗАКАЗАТЬ ЗВОНОК
            </button>
          </div>
        </div>

        {/* MIDDLE SECTION - MOBILE ACCORDION */}
        <div className="sm:hidden border-b border-gray-300/60">
          <div className="border-b border-gray-200 py-3">
            <button
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              className="flex items-center justify-between w-full font-bold text-sm text-black"
            >
              <span>Информация</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isInfoOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isInfoOpen && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3 text-xs text-[#555555]">
                <Link href="/komponiyaHaqida" className="hover:text-[#005bff]">
                  О компании
                </Link>
                <Link href="/tolov" className="hover:text-[#005bff]">
                  Оплата
                </Link>
                <Link href="/yetkazibBerish" className="hover:text-[#005bff]">
                  Доставка
                </Link>
                <Link href="/qaytarish" className="hover:text-[#005bff]">
                  Возврат
                </Link>
                <Link href="/reviews" className="hover:text-[#005bff]">
                  Отзывы
                </Link>
                <Link href="/faq" className="hover:text-[#005bff]">
                  Вопрос-ответ
                </Link>
                <Link href="/blog" className="hover:text-[#005bff]">
                  Блог
                </Link>
                <Link href="/aloqa" className="hover:text-[#005bff]">
                  Контакты
                </Link>
                <Link href="/kantak" className="hover:text-[#005bff]">
                  Вход \ Регистрация
                </Link>
                <Link href="/promotions" className="hover:text-[#005bff]">
                  Все акции
                </Link>
              </div>
            )}
          </div>

          <div className="py-3">
            <button
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className="flex items-center justify-between w-full font-bold text-sm text-black"
            >
              <span>Каталог</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isCatalogOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isCatalogOpen && (
              <div className="space-y-2 pt-3 text-xs text-[#555555]">
                <Link
                  href="/catalog/general"
                  className="block hover:text-[#005bff]"
                >
                  Общестроительные материалы
                </Link>
                <Link
                  href="/catalog/sauna"
                  className="block hover:text-[#005bff]"
                >
                  Все для сауны и бани
                </Link>
                <Link
                  href="/catalog/tools"
                  className="block hover:text-[#005bff]"
                >
                  Инструмент
                </Link>
                <Link
                  href="/catalog/finishing"
                  className="block hover:text-[#005bff]"
                >
                  Отделочные материалы
                </Link>
                <Link
                  href="/catalog/garden"
                  className="block hover:text-[#005bff]"
                >
                  Товары для дома, сада и огорода
                </Link>
                <Link
                  href="/catalog/heating"
                  className="block hover:text-[#005bff]"
                >
                  Водо-газоснабжение, отопление
                </Link>
                <Link
                  href="/catalog/electrical"
                  className="block hover:text-[#005bff]"
                >
                  Электротовары
                </Link>
                <Link
                  href="/catalog/plumbing"
                  className="block hover:text-[#005bff]"
                >
                  Сантехника
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8 py-6 border-b border-gray-300/60">
          <div>
            <h4 className="font-bold text-sm sm:text-base mb-3 text-black">
              Информация
            </h4>
            <ul className="space-y-2 text-xs text-[#555555]">
              <li>
                <Link href="/komponiyaHaqida" className="hover:text-[#005bff]">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/tolov" className="hover:text-[#005bff]">
                  Оплата
                </Link>
              </li>
              <li>
                <Link href="/yetkazibBerish" className="hover:text-[#005bff]">
                  Доставка
                </Link>
              </li>
              <li>
                <Link href="/qaytarish" className="hover:text-[#005bff]">
                  Возврат
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#005bff]">
                  Отзывы
                </Link>
              </li>
            </ul>
          </div>

          <div className="pt-0 sm:pt-7">
            <ul className="space-y-2 text-xs text-[#555555]">
              <li>
                <Link href="/faq" className="hover:text-[#005bff]">
                  Вопрос-ответ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#005bff]">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/aloqa" className="hover:text-[#005bff]">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/kantak" className="hover:text-[#005bff]">
                  Вход \ Регистрация
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="hover:text-[#005bff]">
                  Все акции
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm sm:text-base mb-3 text-black">
              Каталог
            </h4>
            <ul className="space-y-2 text-xs text-[#555555]">
              <li>
                <Link href="/catalog/general" className="hover:text-[#005bff]">
                  Общестроительные материалы
                </Link>
              </li>
              <li>
                <Link href="/catalog/sauna" className="hover:text-[#005bff]">
                  Все для сауны и бани
                </Link>
              </li>
              <li>
                <Link href="/catalog/tools" className="hover:text-[#005bff]">
                  Инструмент
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/finishing"
                  className="hover:text-[#005bff]"
                >
                  Отделочные материалы
                </Link>
              </li>
              <li>
                <Link href="/catalog/garden" className="hover:text-[#005bff]">
                  Товары для дома, сада и огорода
                </Link>
              </li>
              <li>
                <Link href="/catalog/heating" className="hover:text-[#005bff]">
                  Водо-газоснабжение, отопление, вентиляция
                </Link>
              </li>
            </ul>
          </div>

          <div className="pt-0 sm:pt-7">
            <ul className="space-y-2 text-xs text-[#555555]">
              <li>
                <Link href="/faq" className="hover:text-[#005bff]">
                  Вопрос-ответ
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/electrical"
                  className="hover:text-[#005bff]"
                >
                  Электротовары
                </Link>
              </li>
              <li>
                <Link href="/catalog/plumbing" className="hover:text-[#005bff]">
                  Сантехника
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/carpentry"
                  className="hover:text-[#005bff]"
                >
                  Столярные изделия
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/protection"
                  className="hover:text-[#005bff]"
                >
                  Спецодежда и средства индивидуальной пожарной защиты
                </Link>
              </li>
              <li>
                <Link href="/catalog/hardware" className="hover:text-[#005bff]">
                  Метизные, такелажные и скобяные изделия
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* PAYMENT SYSTEMS & NEWSLETTER */}
        <div className="py-6 border-b border-gray-300/60 space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 font-bold italic text-sm sm:text-base">
            <span className="tracking-widest text-blue-800 font-extrabold">
              VISA
            </span>
            <div className="flex -space-x-1 items-center">
              <span className="w-3.5 h-3.5 bg-red-500 rounded-full inline-block opacity-80" />
              <span className="w-3.5 h-3.5 bg-yellow-500 rounded-full inline-block opacity-80" />
            </div>
            <span className="text-gray-400 font-normal">Sber</span>
            <span className="text-green-600 font-extrabold not-italic tracking-wider">
              МИР
            </span>
            <span className="text-red-500 font-bold not-italic">ХАЛВА</span>
            <span className="text-gray-500 font-bold not-italic tracking-widest text-xs sm:text-sm">
              TINKOFF
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm font-semibold text-[#333333] text-center sm:text-left">
              Подпишитесь на рассылку и будьте в курсе!
            </span>
            <div className="flex items-center bg-white rounded-md overflow-hidden border border-gray-300 w-full sm:w-80 shadow-sm">
              <input
                type="email"
                placeholder="Ваш email"
                className="px-3 py-2 text-xs w-full focus:outline-none text-gray-700"
              />
              <button className="px-4 py-2 text-gray-600 hover:text-[#005bff] transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] text-[#808080] text-center sm:text-left">
          <div className="max-w-xl leading-relaxed">
            © 2003-2023 Интернет-магазин ООО «Стройоптторг» р/с
            40702810360000102415 в Ставропольское отделение №5230 ПАО Сбербанк,
            БИК 040702615
            <br className="hidden sm:inline" />
            <Link
              href="/privacy-policy"
              className="hover:underline text-gray-600 mt-1 inline-block"
            >
              Политика конфиденциальности
            </Link>
          </div>

          <div className="flex items-center gap-2 text-gray-400 font-semibold tracking-wider text-[10px]">
            <span>РАЗРАБОТКА САЙТА</span>
            <span className="text-gray-600 font-extrabold">READYCODE.RU</span>
          </div>
        </div>
      </div>
      
    </footer>
    
  );
 

};


export default Footer;
