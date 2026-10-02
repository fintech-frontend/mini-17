"use client";

import ProductCard from "@/components/ProductCard";
import { useGetProductsQuery } from "@/lib/api/productsApi";

export default function HomeProduct() {
  const { data, isLoading, isError } = useGetProductsQuery();
  const products = data?.results ?? [];

  if (isLoading) return <p className="py-10 text-center text-gray-500">Загрузка...</p>;
  if (isError) return <p className="py-10 text-center text-gray-500">Не удалось загрузить товары.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}