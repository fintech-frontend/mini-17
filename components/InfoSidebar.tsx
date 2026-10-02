"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useGetBannersQuery } from "@/lib/api/contentApi";

// O'ng panel: bannerlar + rassilkaga obuna (FAQ, Доставка va boshqa info sahifalar uchun)
export default function InfoSidebar({
  className = "",
  showBanners = true,
  children,
}: {
  className?: string;
  showBanners?: boolean;
  // Panel tepasiga qo'shimcha blok (masalan, blogdagi "Рубрики")
  children?: React.ReactNode;
}) {
  const [agreed, setAgreed] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { data: banners } = useGetBannersQuery(undefined, { skip: !showBanners });

  return (
    <aside className={`space-y-5 ${className}`}>
      {children}

      {/* API bannerlari */}
      {showBanners && banners?.map((banner) => (
        <a
          key={banner.id}
          href={banner.link || "#"}
          className="relative block rounded-2xl overflow-hidden h-44 shadow-sm group"
        >
          {banner.image && (
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent p-5">
            <h3 className="text-lg font-bold text-slate-900 leading-snug max-w-[160px]">
              {banner.title}
            </h3>
          </div>
        </a>
      ))}

      {/* API'da banner bo'lmasa statik bannerlar */}
      {showBanners && !banners?.length && (
        <>
          {/* Banner 1: Все для отопления */}
          <div className="relative rounded-2xl overflow-hidden h-44 shadow-sm group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
              alt="Все для отопления"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent p-5 flex flex-col justify-start items-start space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug max-w-[150px]">
                Все для отопления
              </h3>
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
                до -30%
              </span>
            </div>
          </div>

          {/* Banner 2: Лакокрасочные материалы */}
          <div className="relative rounded-2xl overflow-hidden h-44 shadow-sm group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80"
              alt="Лакокрасочные материалы"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent p-5 flex flex-col justify-start items-start space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug max-w-[160px]">
                Лакокрасочные материалы
              </h3>
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
                до -30%
              </span>
            </div>
          </div>
        </>
      )}

      {/* Obuna bo'lish (Подпишитесь на рассылку) Bloki */}
      <div className="bg-[#f8f9fa] rounded-2xl p-6 space-y-4 text-center">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">
            Подпишитесь на рассылку
          </h3>
          <p className="text-[11px] text-gray-500 leading-tight">
            Регулярные скидки и спецпредложения, а так же новости компании.
          </p>
        </div>

        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
        />

        {/* Podpisatsya Tugmasi */}
        <button
          type="button"
          className="w-full py-3 bg-[#1976d2] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-colors"
        >
          ПОДПИСАТЬСЯ
        </button>

        {/* Razreshenie Checkbox */}
        <label className="flex items-start gap-2.5 text-left cursor-pointer pt-1">
          <div
            onClick={() => setAgreed(!agreed)}
            className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              agreed
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-300 bg-white"
            }`}
          >
            {agreed && <Check size={12} strokeWidth={3} />}
          </div>
          <span className="text-[10px] text-gray-400 leading-tight select-none">
            Согласен с обработкой персональных данных в соответствии с
            политикой конфиденциальности
          </span>
        </label>
      </div>
    </aside>
  );
}
