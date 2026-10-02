"use client";

import { useRef, useState, useEffect } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import ProductCard from "@/components/ProductCard";
import { ProductType } from "@/lib/data";

interface ProductCarouselProps {
  title: string;
  products: ProductType[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
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
  }, [products]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.clientWidth ?? 220;
    const amount = (cardWidth + 16) * 2; // 2 ta karta masofasi
    el.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="w-full py-4 sm:py-5 md:py-6">
      {title && (
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          {title}
        </h2>
      )}

      <div className="relative">
        {/* Chap tomon fade + strelka (faqat sm va undan katta ekranlarda) */}
        {canScrollLeft && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-10 sm:w-16 z-10 bg-gradient-to-r from-white to-transparent hidden sm:block" />
            <button
              type="button"
              aria-label="Прокрутить влево"
              onClick={() => scrollByAmount("left")}
              className="hidden sm:flex absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <IoChevronBack className="text-gray-600 text-base md:text-lg" />
            </button>
          </>
        )}

        {/* Kartalar qatori */}
        <div
          ref={scrollRef}
          className="flex gap-2.5 sm:gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {products.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              data-card
              className="snap-start w-[38vw] xs:w-36 sm:w-47.5 md:w-52 lg:w-55 shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* O'ng tomon fade + strelka - ko'proq karta bo'lsa chiqadi */}
        {canScrollRight && (
          <>
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 sm:w-16 z-10 bg-gradient-to-l from-white to-transparent hidden sm:block" />
            <button
              type="button"
              aria-label="Прокрутить вправо"
              onClick={() => scrollByAmount("right")}
              className="hidden sm:flex absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <IoChevronForward className="text-gray-600 text-base md:text-lg" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}