"use client";

import toast from "react-hot-toast";
import { useAddToCartMutation } from "@/lib/api/cartApi";

// Backend xatosidan o'qiladigan matnni olish: {"quantity": ["..."]} yoki {"detail": "..."}
export function getApiErrorMessage(error: unknown, fallback: string) {
  const data = (error as { data?: unknown })?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const first = Object.values(data as Record<string, unknown>)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    if (typeof first === "string") return first;
  }
  return fallback;
}

// POST /cart/items/ — savatga qo'shish va natija haqida toast ko'rsatish
export function useAddToCart() {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const add = async (productId: number, quantity = 1) => {
    try {
      await addToCart({ product_id: productId, quantity }).unwrap();
      toast.success(`Товар добавлен в корзину (${quantity} шт.)`);
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось добавить товар в корзину"));
      return false;
    }
  };

  return { add, isLoading };
}
