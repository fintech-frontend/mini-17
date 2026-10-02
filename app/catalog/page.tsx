"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useGetCategoryTreeQuery } from "@/lib/api/catalogApi";
import { NO_IMAGE } from "@/lib/api/mappers";
import { categoryHref, sortCategories } from "@/lib/catalogTree";

const MAX_CHILDREN = 4;

export default function CatalogPage() {
  // GET /catalog/categories/tree/
  const { data: tree = [], isLoading, isError, refetch } = useGetCategoryTreeQuery();
  const categories = sortCategories(tree);

  return (
    <div className="w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Навигация" className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Стройоптторг
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-400">Каталог</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#2C333D] mb-6 sm:mb-8">
        Каталог
      </h1>

      {isError ? (
        <div className="text-center py-10">
          <p className="text-sm text-gray-500 mb-3">Не удалось загрузить каталог.</p>
          <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
            Повторить
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-72 rounded-md bg-gray-100 animate-pulse" />
              ))
            : categories.map((cat) => {
                const children = sortCategories(cat.children ?? []);
                return (
                  <div
                    key={cat.id}
                    className="border border-gray-200 rounded-md p-4 hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <Link href={categoryHref(cat.slug)} className="group block">
                      <div className="relative h-28 mb-4">
                        <Image
                          src={NO_IMAGE}
                          alt={cat.name}
                          fill
                          sizes="200px"
                          className="object-contain"
                        />
                      </div>
                      <h2 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h2>
                    </Link>

                    {children.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {children.slice(0, MAX_CHILDREN).map((child) => (
                          <li key={child.id}>
                            <Link
                              href={categoryHref(child.slug)}
                              className="flex items-start gap-1.5 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <ChevronRight size={12} className="mt-0.5 shrink-0" />
                              {child.name}
                            </Link>
                          </li>
                        ))}
                        {children.length > MAX_CHILDREN && (
                          <li>
                            <Link
                              href={categoryHref(cat.slug)}
                              className="text-xs font-medium text-blue-600 hover:underline"
                            >
                              Все разделы ({children.length})
                            </Link>
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-gray-400">{cat.product_count} товаров</p>
                    )}
                  </div>
                );
              })}
        </div>
      )}

      {!isLoading && !isError && categories.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-10">Категории пока не добавлены.</p>
      )}
    </div>
  );
}
