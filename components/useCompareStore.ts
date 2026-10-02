import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductType } from "@/lib/data";

interface CompareState {
  items: ProductType[];
  addToCompare: (product: ProductType) => void;
  removeFromCompare: (id: number | string) => void;
  isInCompare: (id: number | string) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCompare: (product) => {
        const exists = get().items.some((p) => p.id === product.id);
        if (exists) return;
        set({ items: [...get().items, product] });
      },
      removeFromCompare: (id) => {
        set({ items: get().items.filter((p) => p.id !== id) });
      },
      isInCompare: (id) => get().items.some((p) => p.id === id),
      clearCompare: () => set({ items: [] }),
    }),
    { name: "compare-storage" } // localStorage key
  )
);