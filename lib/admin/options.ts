"use client";

import { useMemo } from "react";
import { listRows, useAdminListQuery } from "./adminApi";
import type { AdminBrand, AdminCategory } from "./types";

// Barcha kategoriyalar (daraxt ko'rinishidagi nomlar bilan: "Родитель › Дочерняя")
export function useCategories() {
  const { data, isLoading } = useAdminListQuery({
    resource: "categories",
    params: { page_size: 500, ordering: "sort" },
  });
  return useMemo(() => {
    const list = listRows<AdminCategory>(data);
    const byId = new Map(list.map((c) => [c.id, c]));
    const pathOf = (c: AdminCategory): string => {
      const parent = c.parent ? byId.get(c.parent) : undefined;
      return parent ? `${pathOf(parent)} › ${c.name}` : c.name;
    };
    const depthOf = (c: AdminCategory): number => {
      const parent = c.parent ? byId.get(c.parent) : undefined;
      return parent ? depthOf(parent) + 1 : 0;
    };
    const options = list
      .map((c) => ({ value: String(c.id), label: pathOf(c) }))
      .sort((a, b) => a.label.localeCompare(b.label, "ru"));
    return { list, byId, options, pathOf, depthOf, isLoading };
  }, [data, isLoading]);
}

export function useBrands() {
  const { data } = useAdminListQuery({ resource: "brands", params: { page_size: 500, ordering: "name" } });
  return useMemo(() => {
    const list = listRows<AdminBrand>(data);
    return {
      list,
      byId: new Map(list.map((b) => [b.id, b])),
      options: list.map((b) => ({ value: String(b.id), label: b.name })),
    };
  }, [data]);
}
