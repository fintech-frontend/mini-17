"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full bg-white min-h-screen py-6 px-4 md:px-8 flex flex-col justify-between">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">
          <Link href="/" className="hover:text-[#005bff] transition-colors">
            Стройоптторг
          </Link>
          <span>/</span>
          <span className="text-gray-500">Страница не найдена</span>
        </div>

        {/* Sarlavha */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
          Страница не найдена
        </h1>

        {/* Markaziy kontent */}
        <div className="flex flex-col items-center justify-center text-center mt-12 md:mt-20">
          {/* 404 Katta Text va Soyasi (Shadow effect) */}
          <div className="relative select-none mb-6">
            {/* Orqa tarafdagi och-ko'k soya (Drop-shadow/Layer) */}
            <span className="text-[120px] sm:text-[180px] md:text-[220px] font-black leading-none text-[#e0edff] absolute left-2 top-2 sm:left-3 sm:top-3 -z-0">
              404
            </span>
            {/* Asosiy ko'k 404 text */}
            <span className="text-[120px] sm:text-[180px] md:text-[220px] font-black leading-none text-[#1677ff] relative z-10">
              404
            </span>
          </div>

          {/* Matn */}
          <p className="text-xs sm:text-sm text-gray-500 max-w-[480px] mb-8 leading-relaxed">
            Запрашиваемая страница не найдена. Возможно она была удалена, либо
            её адрес был изменен. Попробуйте воспользоваться поиском.
          </p>

          {/* Tugmalar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Ortga qaytish tugmasi */}
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-medium text-[#005bff] bg-[#f4f7fb] hover:bg-[#e8f0fe] rounded-lg transition-colors"
            >
              Вернуться назад
            </button>

            {/* Bosh sahifaga o'tish tugmasi */}
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-bold text-white bg-[#1677ff] hover:bg-[#005bff] rounded-lg transition-colors text-center uppercase tracking-wider"
            >
              НА ГЛАВНУЮ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
