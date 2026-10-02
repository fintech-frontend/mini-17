import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductType } from "@/lib/data";

interface FavoritesState {
  items: ProductType[];
  toggleFavorite: (product: ProductType) => void;
  removeFromFavorites: (id: number | string) => void;
  isInFavorites: (id: number | string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleFavorite: (product) => {
        const exists = get().items.some((p) => p.id === product.id);
        set({
          items: exists
            ? get().items.filter((p) => p.id !== product.id)
            : [...get().items, product],
        });
      },
      removeFromFavorites: (id) => {
        set({ items: get().items.filter((p) => p.id !== id) });
      },
      isInFavorites: (id) => get().items.some((p) => p.id === id),
      clearFavorites: () => set({ items: [] }),
    }),
    { name: "favorites-storage" } // localStorage key
  )
);
