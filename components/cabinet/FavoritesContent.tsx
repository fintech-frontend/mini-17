"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import { useFavoritesStore } from "@/components/useFavoritesStore";
import { useAddToCartMutation } from "@/lib/api/cartApi";
import { useMounted } from "@/lib/useMounted";

const ALL = "all";

// Избранные товары: kabinet ichida ham, /favorites sahifasida ham shu komponent chiqadi
export default function FavoritesContent() {
  const mounted = useMounted();
  const { items, clearFavorites } = useFavoritesStore();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [activeCategory, setActiveCategory] = useState(ALL);

  const favorites = useMemo(() => (mounted ? items : []), [mounted, items]);

  const categories = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    favorites.forEach((p) => {
      const key = p.category || "other";
      const prev = map.get(key);
      map.set(key, { name: p.categoryName || "Другое", count: (prev?.count ?? 0) + 1 });
    });
    return Array.from(map, ([slug, v]) => ({ slug, ...v }));
  }, [favorites]);

  // Tanlangan kategoriya bo'sh qolsa — "Все категории"
  const category = categories.some((c) => c.slug === activeCategory) ? activeCategory : ALL;
  const visible =
    category === ALL ? favorites : favorites.filter((p) => (p.category || "other") === category);

  const handleAddAllToCart = async () => {
    const results = await Promise.allSettled(
      visible.map((p) => addToCart({ product_id: p.id, quantity: 1 }).unwrap()),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - ok;
    if (ok) toast.success(`Добавлено в корзину: ${ok}`);
    if (failed) toast.error(`Не удалось добавить (нет в наличии): ${failed}`);
  };

  if (!mounted) return <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-48" />;

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-12 text-center">
        <p className="text-sm text-gray-500 mb-4">В избранном пока нет товаров</p>
        <Link
          href="/"
          className="inline-block bg-[#005bff] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wide px-7 py-3.5 rounded-xl transition-colors"
        >
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
        <h3 className="text-base font-semibold text-slate-800">Избранные товары</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={isAdding || visible.length === 0}
            className="px-5 py-2.5 bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold uppercase tracking-wide rounded-lg transition-colors disabled:opacity-50"
          >
            {isAdding ? "Добавляем..." : "Добавить все в корзину"}
          </button>
          <button
            type="button"
            onClick={() => {
              clearFavorites();
              setActiveCategory(ALL);
            }}
            className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#1f6fd8] text-xs font-medium rounded-lg transition-colors"
          >
            Очистить список
          </button>
        </div>
      </div>

      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[{ slug: ALL, name: "Все категории", count: favorites.length }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActiveCategory(c.slug)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                category === c.slug
                  ? "bg-[#0b1727] border-[#0b1727] text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              {c.name} <span className={category === c.slug ? "text-white/60" : "text-gray-400"}>{c.count}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
