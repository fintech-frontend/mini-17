'use client';
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdOutlinePayments, MdOutlineLocalShipping } from "react-icons/md";
import { HiOutlineViewGrid } from "react-icons/hi";
import { MdDiscount } from "react-icons/md";

/* ------------------------------------------------------------------ */
/* Data — ko'chirib productD.ts yoki lib/data.ts fayliga joylashtirsa bo'ladi */
/* ------------------------------------------------------------------ */

interface Slide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Электроинструмент для любых нужд",
    description:
      "У нас обновился ассортимент сантехники, мебели для ванной комнаты, а так же других сопутствующих товаров.",
    buttonText: "Перейти к товарам",
    buttonHref: "/catalog",
    image: "/images/homeR.png",
  },
  {
    id: 2,
    title: "Сантехника для вашего дома",
    description: "Большой выбор смесителей, унитазов и аксессуаров по выгодным ценам.",
    buttonText: "Смотреть каталог",
    buttonHref: "/catalog/santehnika",
    image: "/images/homeR.png",
  },
  {
    id: 3,
    title: "Строительные материалы в наличии",
    description: "Быстрая доставка по всему региону и оплата любым удобным способом.",
    buttonText: "Перейти к товарам",
    buttonHref: "/catalog/stroymaterialy",
    image: "/images/homeR.png",
  },
  {
    id: 4,
    title: "Скидки на крупные покупки",
    description: "Делаем скидки до 30% при заказе от определенной суммы.",
    buttonText: "Узнать подробнее",
    buttonHref: "/promo",
    image: "/images/homeR.png",
  },
];

const features = [
  { icon: MdOutlinePayments, text: "Оплата любым удобным способом" },
  { icon: HiOutlineViewGrid, text: "Большой выбор товаров в каталоге" },
  { icon: MdOutlineLocalShipping, text: "Осуществляем быструю доставку" },
  { icon: MdDiscount, text: "Делаем скидки на крупные покупки" },
];

interface Category {
  id: number;
  title: string;
  image: string;
  href: string;
}

const categories: Category[] = [
  { id: 1, title: "Сантехника", image: "/images/homeR.png", href: "/catalog/santehnika" },
  { id: 2, title: "Отделочные материалы", image: "/images/homeR.png", href: "/catalog/otdelka" },
  { id: 3, title: "Электротовары", image: "/images/homeR.png", href: "/catalog/electro" },
  { id: 4, title: "Инструменты", image: "/images/homeR.png", href: "/catalog/instrumenty" },
  { id: 5, title: "Столярные изделия", image: "/images/homeR.png", href: "/catalog/stolyarka" },
  { id: 6, title: "Общестроительные материалы", image: "/images/homeR.png", href: "/catalog/obshestroy" },
  { id: 7, title: "Все для сауны и бани", image: "/images/homeR.png", href: "/catalog/bania" },
];

interface Promo {
  id: number;
  title: string;
  discount: string;
  image: string;
  href: string;
}

const promos: Promo[] = [
  { id: 1, title: "Метизные изделия", discount: "до -15%", image: "/images/homeR.png", href: "/catalog/metiz" },
  { id: 2, title: "Лакокрасочные материалы", discount: "до -30%", image: "/images/homeR.png", href: "/catalog/lkm" },
  { id: 3, title: "Напольные покрытия", discount: "до -25%", image: "/images/homeR.png", href: "/catalog/poly" },
  { id: 4, title: "Все для отопления", discount: "до -30%", image: "/images/homeR.png", href: "/catalog/otoplenie" },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Avtomatik almashish
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">

      {/* ---------------- Hero karusel ---------------- */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] bg-gray-200">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            {/* Chapdan oq gradient — matn o'qilishi uchun */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
          </div>
        ))}

        {/* Matn qismi */}
        <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 max-w-[90%] sm:max-w-[520px]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
            {slide.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-7 leading-relaxed">
            {slide.description}
          </p>
          <Link
            href={slide.buttonHref}
            className="inline-flex items-center gap-2 w-fit bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-colors"
          >
            {slide.buttonText}
            <FiChevronRight size={16} />
          </Link>
        </div>

        {/* Oldingi/keyingi tugmalar */}
        <button
          onClick={prev}
          type="button"
          aria-label="Предыдущий слайд"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 transition-colors"
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          type="button"
          aria-label="Следующий слайд"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 transition-colors"
        >
          <FiChevronRight size={20} />
        </button>

        {/* Nuqtalar (dots) */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrent(index)}
              type="button"
              aria-label={`${index + 1}-slaydga o'tish`}
              className={`rounded-full transition-all ${
                index === current
                  ? "w-2.5 h-2.5 border-2 border-blue-600 bg-white"
                  : "w-2 h-2 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ---------------- Xususiyatlar qatori ---------------- */}
      <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-4 border-b border-gray-200 pb-5 sm:pb-6">
        {features.map((f, index) => {
          const Icon = f.icon;
          return (
            <div key={index} className="flex items-center gap-2.5">
              <Icon className="text-blue-600 flex-shrink-0" size={20} />
              <span className="text-xs sm:text-sm text-gray-700 leading-snug">{f.text}</span>
            </div>
          );
        })}
      </div>

      {/* ---------------- Kategoriyalar ---------------- */}
      <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 flex flex-col items-center text-center gap-3 transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
            <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">{cat.title}</span>
          </Link>
        ))}

        {/* "Katalogga o'tish" katakchasi */}
        <Link
          href="/catalog"
          className="bg-white hover:bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center gap-2 transition-colors p-4"
        >
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
            <FiChevronRight size={18} />
          </div>
          <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
            Перейти в каталог
          </span>
        </Link>
      </div>

      {/* ---------------- Promo bannerlar ---------------- */}
      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-8 sm:pb-10">
        {promos.map((promo) => (
          <Link
            key={promo.id}
            href={promo.href}
            className="relative rounded-xl overflow-hidden h-[120px] sm:h-[140px] group"
          >
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <h3 className="text-white font-semibold text-base sm:text-lg leading-tight drop-shadow-sm">
                {promo.title}
              </h3>
              <span className="w-fit bg-gray-900 text-white text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-md">
                {promo.discount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}