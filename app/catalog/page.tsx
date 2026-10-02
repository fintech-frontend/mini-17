"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useGetCategoriesQuery } from "@/lib/api/catalogApi";
import { useGetProductsQuery } from "@/lib/api/productsApi";
import { styles } from "@/styles/index.styles";

export default function CatalogPage() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  // GET /catalog/categories/
  const { data: categories = [] } = useGetCategoriesQuery();
  // GET /catalog/products/?category_slug=&search=
  const { data, isFetching, isError } = useGetProductsQuery({
    page_size: 40,
    category_slug: category || undefined,
    search: search.trim() || undefined,
  });

  const products = data?.results ?? [];

  return (
    <main className={`${styles.container} px-4 sm:px-6 lg:px-8 py-6 sm:py-8`}>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-5">
        Каталог
      </h1>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск товаров"
        className="w-full sm:max-w-md mb-4 px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Kategoriyalar */}
      <ul className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide mb-5 sm:mb-6">
        {[{ id: 0, slug: "", name: "Все товары" }, ...categories].map((cat) => (
          <li key={cat.id} className="shrink-0">
            <button
              type="button"
              onClick={() => setCategory(cat.slug)}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all border whitespace-nowrap ${
                cat.slug === category
                  ? "bg-blue-50 text-blue-600 border-transparent"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>

      {isError ? (
        <p className="text-sm text-gray-500 text-center py-10">Не удалось загрузить товары.</p>
      ) : (
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4 transition-opacity ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!isFetching && !isError && products.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-10">Товары не найдены.</p>
      )}
    </main>
  );
}
