"use client";

import { use } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { Card, ErrorState, Skeleton } from "@/components/admin/ui";
import { apiErrorText, useAdminGetQuery } from "@/lib/admin/adminApi";
import type { AdminProduct } from "@/lib/admin/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error, refetch } = useAdminGetQuery({ resource: "products", id });

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (error || !data) {
    return (
      <Card>
        <ErrorState text={apiErrorText(error)} onRetry={refetch} />
      </Card>
    );
  }
  // key — boshqa mahsulotga o'tilganda forma yangilanadi
  return <ProductForm key={String(data.id)} product={data as unknown as AdminProduct} />;
}
