'use client';

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { useGetProductsQuery } from "@/lib/api/productsApi";
import type { ProductType } from "@/types/product";

interface BestOffersProps {
  // Berilsa shu mahsulotlar ko'rsatiladi, aks holda /catalog/products/ dan yuklanadi
  products?: ProductType[];
  isLoading?: boolean;
}

export default function BestOffers({ products: externalProducts, isLoading: externalLoading }: BestOffersProps) {
  const query = useGetProductsQuery(
    { page_size: 20 },
    { skip: externalProducts !== undefined || externalLoading }
  );
  const products = useMemo(
    () => externalProducts ?? query.data?.results ?? [],
    [externalProducts, query.data]
  );
  const isLoading = externalLoading || query.isLoading;
  const { isError, refetch } = query;
  const [activeCategory, setActiveCategory] = useState("all");

  // Mahsulotlardan unikal kategoriyalar (slug -> name)
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (p.category) map.set(p.category, p.categoryName ?? p.category);
    });
    return [
      { id: "all", name: "Все товары" },
      ...Array.from(map, ([id, name]) => ({ id, name })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 py-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-500 mb-3">Не удалось загрузить товары.</p>
        <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">
          Повторить
        </button>
      </div>
    );
  }

  return (
    <section className="w-full py-5 sm:py-6 md:py-8">
      <ul className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 sm:mb-5 md:mb-6">
        {categories.map((cat) => (
          <li key={cat.id} className="shrink-0">
            <button
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all border whitespace-nowrap ${
                cat.id === activeCategory
                  ? "bg-blue-50 text-blue-600 border-transparent"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-10">
          В этой категории пока нет товаров.
        </p>
      )}
    </section>
  );
}