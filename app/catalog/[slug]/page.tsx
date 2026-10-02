"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useGetBrandsQuery, useGetCategoryTreeQuery } from "@/lib/api/catalogApi";
import { useGetProductsQuery } from "@/lib/api/productsApi";
import { categoryHref, findCategoryPath, sortCategories } from "@/lib/catalogTree";

const SORT_OPTIONS = [
  { value: "", label: "по популярности" },
  { value: "-created_at", label: "по новизне" },
  { value: "price", label: "по цене: сначала дешёвые" },
  { value: "-price", label: "по цене: сначала дорогие" },
];
const PAGE_SIZES = [12, 16, 20, 24];
const VISIBLE_BRANDS = 7;

// Yozish tugaguncha so'rov yubormaslik uchun
function useDebounced<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const plural = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
  return "товаров";
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [ordering, setOrdering] = useState("");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brandIds, setBrandIds] = useState<number[]>([]);
  const [inStock, setInStock] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedMin = useDebounced(minPrice);
  const debouncedMax = useDebounced(maxPrice);

  // Filtr yoki kategoriya o'zgarsa birinchi sahifaga qaytamiz
  const filterKey = JSON.stringify([slug, ordering, pageSize, debouncedMin, debouncedMax, brandIds, inStock]);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  // GET /catalog/categories/tree/ va GET /catalog/brands/
  const { data: tree = [], isLoading: treeLoading } = useGetCategoryTreeQuery();
  const { data: brands = [] } = useGetBrandsQuery();

  // GET /catalog/products/?category_slug=&ordering=&min_price=&max_price=&brand=&in_stock=
  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    category_slug: slug,
    ordering: ordering || undefined,
    page,
    page_size: pageSize,
    min_price: debouncedMin ? Number(debouncedMin) : undefined,
    max_price: debouncedMax ? Number(debouncedMax) : undefined,
    brand: brandIds.length ? brandIds : undefined,
    in_stock: inStock || undefined,
  });

  const path = findCategoryPath(tree, slug);
  const category = path?.[path.length - 1];
  const children = sortCategories(category?.children ?? []);
  const products = data?.results ?? [];
  const total = data?.count ?? 0;
  const pages = data?.pages ?? 0;
  const visibleBrands = showAllBrands ? brands : brands.slice(0, VISIBLE_BRANDS);
  const hasFilters = !!(minPrice || maxPrice || brandIds.length || inStock);

  const toggleBrand = (id: number) =>
    setBrandIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setBrandIds([]);
    setInStock(false);
  };

  if (!treeLoading && !category) {
    return (
      <div className="w-full max-w-350 mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Категория не найдена</h1>
        <Link href="/catalog" className="text-sm text-blue-600 hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Навигация" className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 mb-3">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Стройоптторг
        </Link>
        <span className="text-gray-300">/</span>
        <Link href="/catalog" className="hover:text-blue-600 transition-colors">
          Каталог
        </Link>
        {path?.map((node, i) => (
          <span key={node.id} className="flex items-center gap-2">
            <span className="text-gray-300">/</span>
            {i === path.length - 1 ? (
              <span className="text-gray-400">{node.name}</span>
            ) : (
              <Link href={categoryHref(node.slug)} className="hover:text-blue-600 transition-colors">
                {node.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Sarlavha */}
      <div className="flex items-baseline gap-3 mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#2C333D]">
          {category?.name ?? " "}
        </h1>
        {data && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {total} {plural(total)}
          </span>
        )}
      </div>

      {/* Subkategoriyalar */}
      {children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {children.map((child) => (
            <Link
              key={child.id}
              href={categoryHref(child.slug)}
              className="px-3.5 py-2 text-xs sm:text-sm text-gray-700 border border-gray-200 rounded-md hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        {/* Filtrlar (telefonda tugma orqali ochiladi) */}
        <aside
          className={`${
            filtersOpen ? "fixed inset-0 z-100 bg-white overflow-y-auto p-5" : "hidden"
          } lg:static lg:block lg:p-0 lg:z-auto space-y-7`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <span className="text-lg font-bold text-gray-900">Фильтры</span>
            <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Закрыть фильтры">
              <X size={22} />
            </button>
          </div>

          {/* Narx */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Цена, ₽</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-2.5 text-sm focus-within:border-blue-500">
                <span className="text-gray-400 text-xs">от</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full outline-none bg-transparent"
                />
              </label>
              <label className="flex items-center gap-1.5 border border-gray-200 rounded-md px-3 py-2.5 text-sm focus-within:border-blue-500">
                <span className="text-gray-400 text-xs">до</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full outline-none bg-transparent"
                />
              </label>
            </div>
          </section>

          {/* Mavjudlik */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Наличие</h3>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 accent-blue-600"
              />
              В наличии
            </label>
          </section>

          {/* Brendlar */}
          {brands.length > 0 && (
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Бренд</h3>
              <div className="space-y-3">
                {visibleBrands.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={brandIds.includes(brand.id)}
                      onChange={() => toggleBrand(brand.id)}
                      className="w-5 h-5 rounded border-gray-300 accent-blue-600"
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
              {brands.length > VISIBLE_BRANDS && (
                <button
                  type="button"
                  onClick={() => setShowAllBrands((v) => !v)}
                  className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                >
                  {showAllBrands ? "Скрыть" : "Показать все"}
                </button>
              )}
            </section>
          )}

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="w-full py-2.5 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Сбросить фильтры
            </button>
          )}

          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="lg:hidden w-full py-3 text-sm font-semibold text-white bg-blue-600 rounded-md"
          >
            Показать {total} {plural(total)}
          </button>
        </aside>

        <div>
          {/* Saralash va sahifa hajmi */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-md"
              >
                <SlidersHorizontal size={16} />
                Фильтры
              </button>
              <span className="hidden sm:inline text-xs text-gray-500">Сортировка:</span>
              <div className="relative">
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="appearance-none text-xs text-gray-700 border border-gray-200 rounded-md pl-3 pr-8 py-2.5 bg-white outline-none focus:border-blue-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-gray-500">Показывать по:</span>
              {PAGE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPageSize(size)}
                  className={`w-9 h-9 text-xs rounded-md transition-colors ${
                    size === pageSize
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Mahsulotlar */}
          {isError ? (
            <p className="text-sm text-gray-500 text-center py-10">Не удалось загрузить товары.</p>
          ) : isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500 mb-3">Товары не найдены.</p>
              {hasFilters && (
                <button type="button" onClick={resetFilters} className="text-sm text-blue-600 hover:underline">
                  Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 transition-opacity ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Sahifalash */}
          {pages > 1 && (
            <div className="flex items-center justify-center flex-wrap gap-1.5 mt-8">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 h-9 text-sm text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-40"
              >
                Назад
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 text-sm rounded-md transition-colors ${
                    n === page ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 h-9 text-sm text-gray-600 rounded-md hover:bg-gray-50 disabled:opacity-40"
              >
                Далее
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
