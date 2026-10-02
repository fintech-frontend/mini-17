'use client';
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { categories, features, promos as staticPromos, slides as staticSlides } from "@/lib/heroDta";
import { brands as staticBrands } from "@/lib/data";
import { useGetHomeQuery } from "@/lib/api/promoApi";
import { useGetBrandsQuery } from "@/lib/api/catalogApi";
import { mapBanner, mapBrand, mapPromotion } from "@/lib/api/mappers";
import BrandsCarousel from "@/components/BrendHomecard";
import BestOffers from "@/components/Offercard";
import AboutStore from "@/components/AboutStore";
import NewsItems from "@/components/NewsItems";
import { styles } from "@/styles/index.styles";
export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  // GET /home/ va GET /catalog/brands/
  const { data: home, isLoading: homeLoading } = useGetHomeQuery();
  const { data: apiBrands } = useGetBrandsQuery();

  // API da ma'lumot bo'lmasa, statik (dizayn) ma'lumotlari ko'rsatiladi
  const slides = useMemo(
    () => (home?.banners.length ? home.banners.map(mapBanner) : staticSlides),
    [home]
  );
  const promos = useMemo(
    () => (home?.promotions.length ? home.promotions.slice(0, 4).map(mapPromotion) : staticPromos),
    [home]
  );
  const brands = useMemo(
    () => (apiBrands?.length ? apiBrands.map(mapBrand) : staticBrands),
    [apiBrands]
  );

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current] ?? slides[0];

  return (
    <section className={`${styles.container} px-4 sm:px-6 md:px-8 lg:px-8 pt-6 sm:pt-8`}>
      {/* Hero karusel */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-72 sm:h-90 md:h-105 lg:h-125 bg-gray-200">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1440px"
              className="object-cover"
            />
            <div className="absolute inset-0 from-white/90 via-white/50 to-transparent" />
          </div>
        ))}

        {/* Matn qismi */}
        <div className="relative z-20 h-full flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-14 max-w-[92%] sm:max-w-105 md:max-w-115 lg:max-w-130">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2.5 sm:mb-3.5 md:mb-4">
            {slide.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 md:mb-7 leading-relaxed line-clamp-3 sm:line-clamp-none">
            {slide.description}
          </p>
          <Link
            href={slide.buttonHref}
            className="inline-flex items-center gap-2 w-fit bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 rounded-xl transition-colors"
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
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 transition-colors"
        >
          <FiChevronLeft size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={next}
          type="button"
          aria-label="Следующий слайд"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 transition-colors"
        >
          <FiChevronRight size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Nuqtalar (dots) */}
        <div className="absolute bottom-3 sm:bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrent(index)}
              type="button"
              aria-label={`${index + 1}-slaydga o'tish`}
              className={`rounded-full transition-all ${index === current
                  ? "w-2.5 h-2.5 border-2 border-blue-600 bg-blue-600"
                  : "w-2 h-2 bg-black/50 hover:bg-black/30"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Xususiyatlar qatori */}
      <div className="mt-5 sm:mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-y-3 sm:gap-y-4 gap-x-3 sm:gap-x-4 border-b border-gray-200 pb-4 sm:pb-5 md:pb-6">
        {features.map((f, index) => {
          const Icon = f.icon;
          return (
            <div key={index} className="flex items-center gap-2 sm:gap-2.5">
              <Icon className="text-blue-600 shrink-0" size={18} />
              <span className="text-[11px] sm:text-xs md:text-sm text-gray-700 leading-snug">
                {f.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Kategoriyalar */}
      <div className="mt-5 sm:mt-6 md:mt-10 lg:mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3 md:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center gap-2 sm:gap-3 transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
            <span className="text-[11px] sm:text-xs md:text-[13px] text-gray-700 leading-snug">
              {cat.title}
            </span>
          </Link>
        ))}

        <Link
          href="/catalog"
          className="bg-white hover:bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center gap-2 transition-colors p-3 sm:p-4"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
            <FiChevronRight size={16} className="sm:w-4.5 sm:h-4.5" />
          </div>
          <span className="text-[11px] sm:text-xs md:text-[13px] text-gray-700 leading-snug">
            Перейти в каталог
          </span>
        </Link>
      </div>

      {/* Promo bannerlar */}
      <div className="mt-3 sm:mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 pb-6 sm:pb-8 md:pb-10">
        {promos.map((promo) => (
          <Link
            key={promo.id}
            href={promo.href}
            className="relative rounded-xl overflow-hidden h-28 sm:h-30 md:h-35 group"
          >
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 from-black/40 via-black/10 to-transparent" />
            <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between">
              <h3 className="text-black font-semibold text-sm sm:text-base md:text-lg leading-tight drop-shadow-sm">
                {promo.title}
              </h3>
              <span className="w-fit bg-gray-900 text-white text-[10px] sm:text-[11px] md:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-md">
                {promo.discount}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Xitlar bo'limi */}
      <div className="mb-4 mt-8 sm:mt-10">
        <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[33px] text-[#2C333D] mb-3 sm:mb-4">
          Хиты продаж
        </h2>
        <div>
          <BestOffers products={home?.best_selling_products} isLoading={homeLoading} />
        </div>
      </div>
      <div>
        <BrandsCarousel title="Популярные бренды" brands={brands} />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl md:text-[28px] lg:text-[33px] text-[#2C333D] mt-6 sm:mt-8">
          Товары со скидкой
        </h2>
        <BestOffers products={home?.discounted_products} isLoading={homeLoading} />
      </div>
      <div>
        <AboutStore />
      </div>
      <div>
        <NewsItems />
      </div>
    </section>
  );
}
