"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { FiX } from "react-icons/fi";
import bag from "../../public/bag.svg";
import { useCompareStore } from "@/components/useCompareStore";
import { useFavoritesStore } from "@/components/useFavoritesStore";
import { useAddToCartMutation } from "@/lib/api/cartApi";
import { useGetProductsDetailsQuery } from "@/lib/api/productsApi";
import { useMounted } from "@/lib/useMounted";
import { styles } from "@/styles/index.styles";
import type { ProductType } from "@/types/product";

const ALL = "all";

const formatPrice = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function ComparePage() {
  const mounted = useMounted();
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const { toggleFavorite, isInFavorites } = useFavoritesStore();
  const [addToCart] = useAddToCartMutation();
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [onlyDiff, setOnlyDiff] = useState(false);

  const compareItems = useMemo(() => (mounted ? items : []), [mounted, items]);

  // Xususiyatlar (specs) uchun har bir mahsulotning to'liq ma'lumotini API'dan olamiz
  const ids = useMemo(() => compareItems.map((p) => p.id), [compareItems]);
  const { data: details, isFetching } = useGetProductsDetailsQuery(ids, {
    skip: ids.length === 0,
  });

  // API javobi bo'lsa — undan, bo'lmasa store'dagi ma'lumotdan
  const products: ProductType[] = useMemo(
    () =>
      compareItems.map(
        (item) => details?.find((d) => d.id === item.id) ?? item,
      ),
    [compareItems, details],
  );

  // Kategoriyalar va ulardagi mahsulotlar soni
  const categories = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    products.forEach((p) => {
      const key = p.category || "other";
      const prev = map.get(key);
      map.set(key, {
        name: p.categoryName || "Другое",
        count: (prev?.count ?? 0) + 1,
      });
    });
    return Array.from(map, ([slug, v]) => ({ slug, ...v }));
  }, [products]);

  const category = categories.some((c) => c.slug === activeCategory)
    ? activeCategory
    : ALL;

  const visible =
    category === ALL
      ? products
      : products.filter((p) => (p.category || "other") === category);

  // Jadval qatorlari: asosiy maydonlar + barcha mahsulotlardagi xususiyatlar
  const rows = useMemo(() => {
    const labels: string[] = [];
    visible.forEach((p) =>
      p.specs?.forEach((s) => {
        if (!labels.includes(s.label)) labels.push(s.label);
      }),
    );

    const all = [
      { label: "Цена", values: visible.map((p) => formatPrice(p.price)) },
      { label: "Артикул", values: visible.map((p) => p.article) },
      {
        label: "Наличие",
        values: visible.map((p) =>
          p.inStock === false ? "Нет в наличии" : "В наличии",
        ),
      },
      ...labels.map((label) => ({
        label,
        values: visible.map(
          (p) => p.specs?.find((s) => s.label === label)?.value ?? "—",
        ),
      })),
    ];

    return onlyDiff && visible.length > 1
      ? all.filter((r) => new Set(r.values).size > 1)
      : all;
  }, [visible, onlyDiff]);

  const handleAddToCart = async (product: ProductType) => {
    try {
      await addToCart({ product_id: product.id, quantity: 1 }).unwrap();
      toast.success("Товар добавлен в корзину");
    } catch {
      toast.error("Товара нет в наличии");
    }
  };

  const handleClear = () => {
    clearCompare();
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
        <span className="text-gray-600">Сравнение товаров</span>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-[33px] font-bold text-[#2C333D] mb-6">
        Сравнение товаров
      </h1>

      {mounted && compareItems.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500 text-sm mb-4">
            В сравнении пока нет товаров
          </p>
          <Link
            href="/"
            className="inline-block bg-[#005bff] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wide px-6 py-3 rounded-xl transition-colors"
          >
            Перейти к покупкам
          </Link>
        </div>
      ) : (
        <>
          {/* Kategoriya tablari va boshqaruv */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap gap-2">
              <TabButton
                label="Все категории"
                count={products.length}
                active={category === ALL}
                onClick={() => setActiveCategory(ALL)}
              />
              {categories.map((c) => (
                <TabButton
                  key={c.slug}
                  label={c.name}
                  count={c.count}
                  active={category === c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyDiff}
                  onChange={(e) => setOnlyDiff(e.target.checked)}
                  className="w-4 h-4 accent-[#1f6fd8]"
                />
                Только различия
              </label>
              <button
                type="button"
                onClick={handleClear}
                className="text-[#1f6fd8] hover:text-blue-800 font-medium"
              >
                Очистить список
              </button>
            </div>
          </div>

          {/* Taqqoslash jadvali (kichik ekranda gorizontal scroll) */}
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(16,24,40,0.08)] overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-white w-[140px] min-w-[140px] sm:w-[200px] sm:min-w-[200px] p-4 text-left align-bottom text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    {isFetching ? "Загрузка..." : `Товаров: ${visible.length}`}
                  </th>
                  {visible.map((p) => {
                    const inFavorites = isInFavorites(p.id);
                    return (
                      <th
                        key={p.id}
                        className="min-w-[200px] w-[240px] p-4 align-top text-left font-normal border-l border-gray-100"
                      >
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => removeFromCompare(p.id)}
                            aria-label="Убрать из сравнения"
                            className="absolute top-0 right-0 z-10 w-7 h-7 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 flex items-center justify-center transition-colors"
                          >
                            <FiX size={14} />
                          </button>

                          <Link
                            href={`/products/${p.id}`}
                            className="relative block w-full h-32 sm:h-36 mb-3"
                          >
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              sizes="200px"
                              className="object-contain p-2"
                            />
                          </Link>

                          <Link href={`/products/${p.id}`}>
                            <h3 className="text-xs sm:text-[13px] text-gray-900 line-clamp-2 hover:text-blue-600 leading-snug mb-2 min-h-[2.5em]">
                              {p.title}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                            {p.oldPrice && (
                              <span className="text-[11px] text-gray-400 line-through">
                                {formatPrice(p.oldPrice)}
                              </span>
                            )}
                            <span className="text-sm sm:text-base font-bold text-gray-900">
                              {formatPrice(p.price)}
                            </span>
                            {p.discount && (
                              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-md font-medium">
                                {p.discount}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAddToCart(p)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-medium py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Image src={bag} alt="" className="w-3.5 h-3.5 object-contain" />
                              Купить
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(p)}
                              aria-label={inFavorites ? "Убрать из избранного" : "В избранное"}
                              className={`w-8 h-8 border rounded-xl flex items-center justify-center transition-colors ${
                                inFavorites
                                  ? "border-red-200 bg-red-50 text-red-500"
                                  : "border-gray-200 hover:bg-gray-50 text-gray-500"
                              }`}
                            >
                              {inFavorites ? <IoMdHeart /> : <IoMdHeartEmpty />}
                            </button>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td
                      className={`sticky left-0 z-10 px-4 py-3 text-gray-500 ${
                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      {row.label}
                    </td>
                    {row.values.map((value, j) => (
                      <td
                        key={visible[j].id}
                        className="px-4 py-3 text-gray-900 border-l border-gray-100"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}

                {onlyDiff && rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={visible.length + 1}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Различий нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function TabButton({
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
      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
        active
          ? "bg-[#1f6fd8] border-[#1f6fd8] text-white"
          : "bg-white border-gray-200 text-gray-700 hover:border-[#1f6fd8] hover:text-[#1f6fd8]"
      }`}
    >
      {label} <span className={active ? "text-white/70" : "text-gray-400"}>{count}</span>
    </button>
  );
}
