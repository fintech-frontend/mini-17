"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import { useFavoritesStore } from "@/components/useFavoritesStore";
import { useAddToCartMutation } from "@/lib/api/cartApi";
import { useMounted } from "@/lib/useMounted";
import { styles } from "@/styles/index.styles";

const ALL = "all";

export default function FavoritesPage() {
  const mounted = useMounted();
  const { items, clearFavorites } = useFavoritesStore();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [activeCategory, setActiveCategory] = useState(ALL);

  const favorites = useMemo(() => (mounted ? items : []), [mounted, items]);

  // Kategoriyalar va ulardagi mahsulotlar soni
  const categories = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    favorites.forEach((p) => {
      const key = p.category || "other";
      const name = p.categoryName || "Другое";
      const prev = map.get(key);
      map.set(key, { name, count: (prev?.count ?? 0) + 1 });
    });
    return Array.from(map, ([slug, v]) => ({ slug, ...v }));
  }, [favorites]);

  // Tanlangan kategoriya o'chirib yuborilgan bo'lsa — "Все категории"
  const category = categories.some((c) => c.slug === activeCategory)
    ? activeCategory
    : ALL;

  const visible =
    category === ALL
      ? favorites
      : favorites.filter((p) => (p.category || "other") === category);

  const handleAddAllToCart = async () => {
    const results = await Promise.allSettled(
      visible.map((p) => addToCart({ product_id: p.id, quantity: 1 }).unwrap()),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - ok;

    if (ok) toast.success(`Добавлено в корзину: ${ok}`);
    if (failed) toast.error(`Не удалось добавить (нет в наличии): ${failed}`);
  };

  const handleClear = () => {
    clearFavorites();
    setActiveCategory(ALL);
  };

  return (
    <section className={`${styles.container} px-4 sm:px-6 md:px-8 py-6 sm:py-8`}>
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
        <Link href="/" className="hover:text-[#005bff]">
          Стройоптторг
        </Link>
        <span>/</span>
        <span className="text-gray-600">Избранные товары</span>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-[33px] font-bold text-[#2C333D] mb-6">
        Избранные товары
      </h1>

      {mounted && favorites.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500 text-sm mb-4">
            В избранном пока нет товаров
          </p>
          <Link
            href="/"
            className="inline-block bg-[#005bff] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wide px-6 py-3 rounded-xl transition-colors"
          >
            Перейти к покупкам
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Chap panel: kategoriyalar va tugmalar */}
          <aside className="w-full lg:w-[260px] shrink-0 bg-white rounded-2xl p-4 shadow-[0_2px_16px_rgba(16,24,40,0.08)]">
            <ul className="divide-y divide-gray-100">
              <li>
                <CategoryButton
                  label="Все категории"
                  count={favorites.length}
                  active={category === ALL}
                  onClick={() => setActiveCategory(ALL)}
                />
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <CategoryButton
                    label={c.name}
                    count={c.count}
                    active={category === c.slug}
                    onClick={() => setActiveCategory(c.slug)}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleAddAllToCart}
                disabled={isAdding || visible.length === 0}
                className="w-full py-4 bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold uppercase tracking-wide rounded-lg transition-colors disabled:opacity-50"
              >
                {isAdding ? "Добавляем..." : "Добавить все в корзину"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-[#1f6fd8] text-xs font-medium rounded-lg transition-colors"
              >
                Очистить список
              </button>
            </div>
          </aside>

          {/* O'ng tomon: mahsulotlar */}
          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CategoryButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between py-3.5 text-[11px] font-medium uppercase tracking-wide transition-colors ${
        active ? "text-[#1f6fd8]" : "text-gray-700 hover:text-[#1f6fd8]"
      }`}
    >
      <span className="text-left">{label}</span>
      <span className="text-[10px] text-gray-400">{count}</span>
    </button>
  );
}
