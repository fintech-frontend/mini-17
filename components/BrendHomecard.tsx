'use client';

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";

interface Brand {
  id: number;
  name: string;
  logo: string; // rasm manzili (masalan /brands/kerabin.png)
}

interface BrandsCarouselProps {
  title?: string;
  brands: Brand[];
}

export default function BrandsCarousel({ title = "Популярные бренды", brands }: BrandsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [brands]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-brand-card]")?.clientWidth ?? 160;
    const amount = (cardWidth + 16) * 3;
    el.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="w-full py-5 sm:py-6 md:py-8 px-4 sm:px-5 md:px-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3.5 sm:mb-4 md:mb-5">
        {title}
      </h2>

      <div className="relative">
        {/* Chap strelka */}
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Прокрутить влево"
            onClick={() => scrollByAmount("left")}
            className="absolute left-0 sm:-left-2 md:-left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <IoChevronBack className="text-gray-600 text-sm sm:text-base" />
          </button>
        )}

        {/* Brend kartalari */}
        <div
          ref={scrollRef}
          className="flex gap-2.5 sm:gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {brands.map((brand) => (
            <div
              key={brand.id}
              data-brand-card
              className="snap-start shrink-0 w-32 h-16 sm:w-40 sm:h-18 md:w-44 md:h-20 bg-white rounded-xl flex items-center justify-center p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              <div className="relative w-full h-full">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="176px"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* O'ng strelka */}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Прокрутить вправо"
            onClick={() => scrollByAmount("right")}
            className="absolute right-0 sm:-right-2 md:-right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <IoChevronForward className="text-gray-600 text-sm sm:text-base" />
          </button>
        )}
      </div>
    </section>
  );
}