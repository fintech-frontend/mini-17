"use client";

import { IoMdHeartEmpty } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import Image from 'next/image';
import Link from 'next/link';

import bag from '../public/bag.svg';
import chiziq from '../public/chiziq.svg';
import { ProductType } from "@/lib/data";
import { useCompareStore } from "./useCompareStore";

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.id);

  const handleCompareClick = () => {
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-2.5 sm:p-3 relative flex flex-col justify-between hover:shadow-xl transition-all duration-300 w-full h-full">

      <div className="relative">
        {product.badge && (
          <span className="absolute top-0 left-0 z-10 bg-white border border-orange-400 text-orange-500 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-lg shadow-sm">
            {product.badge}
          </span>
        )}
        <Link
          href={`/products/${product.id}`}
          className="relative w-full h-27.5 sm:h-35 md:h-37.5 lg:h-40 mb-2.5 sm:mb-3 flex items-center justify-center bg-white rounded-xl overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            className="object-contain hover:scale-105 transition-transform duration-300 p-1.5 sm:p-2"
          />
        </Link>
      </div>

      <div className="mb-2 flex-1">
        <p className="text-[10px] sm:text-[11px] text-gray-400 mb-1">
          Артикул: {product.article}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xs sm:text-[13px] md:text-sm font-normal text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 flex-wrap">
          {product.oldPrice && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
              {product.oldPrice.toLocaleString()} ₽
            </span>
          )}
          <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
            {product.price.toLocaleString()} ₽
          </span>
          {product.discount && (
            <span className="text-[9px] sm:text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-md font-medium">
              {product.discount}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[11px] sm:text-xs font-medium py-2 sm:py-2.5 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm"
          >
            <Image src={bag} alt="shoppingBag" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0" />
            <span className="truncate">Купить</span>
          </Link>

          <div className="flex gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              aria-label="В избранное"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 text-gray-500 transition-colors flex items-center justify-center flex-shrink-0"
            >
              <IoMdHeartEmpty className="text-sm sm:text-base" />
            </button>

            {/* Taqqoslash — bosilganda galochkaga o'zgaradi */}
            <button
              type="button"
              onClick={handleCompareClick}
              aria-label={inCompare ? "Убрать из сравнения" : "Сравнить"}
              className={`w-8 h-8 sm:w-8.5 sm:h-8.5 border rounded-xl transition-colors flex items-center justify-center flex-shrink-0 ${
                inCompare
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              {inCompare ? (
                <FiCheck className="text-sm sm:text-base" strokeWidth={2.5} />
              ) : (
                <Image
                  src={chiziq}
                  alt="chiziq"
                  width={16}
                  height={16}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain"
                  style={{ height: "auto" }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}