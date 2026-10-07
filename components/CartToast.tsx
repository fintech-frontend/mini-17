"use client";

import Image from "next/image";
import Link from "next/link";
import toast, { type Toast } from "react-hot-toast";
import { AlertCircle, Check, X } from "lucide-react";
import type { Cart } from "@/lib/api/types";
import { NO_IMAGE } from "@/lib/api/mappers";

const rub = (value: string | number) => `${Math.round(Number(value)).toLocaleString("ru-RU")} ₽`;

const plural = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
  return "товаров";
};

function ToastShell({ t, children }: { t: Toast; children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-[calc(100vw-32px)] max-w-sm bg-white rounded-xl shadow-[0_12px_40px_rgba(16,24,40,0.18)] border border-gray-100 p-4 transition-all duration-300 ${
        t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {children}
    </div>
  );
}

function CloseButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      onClick={() => toast.dismiss(id)}
      aria-label="Закрыть уведомление"
      className="shrink-0 -mr-1 -mt-1 p-1 text-gray-400 hover:text-gray-700"
    >
      <X size={16} />
    </button>
  );
}

// POST /cart/items/ muvaffaqiyatli bo'lganda — javobdagi savat asosida bildirishnoma
export function showAddedToCartToast(cart: Cart, productId: number, quantity: number) {
  const item = cart.items.find((i) => i.product.id === productId);
  const count = cart.totals.item_count;

  toast.custom(
    (t) => (
      <ToastShell t={t}>
        <div className="flex items-start gap-2.5">
          <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check size={14} strokeWidth={3} />
          </span>
          <p className="flex-1 text-sm font-semibold text-gray-900 pt-0.5">Товар добавлен в корзину</p>
          <CloseButton id={t.id} />
        </div>

        {item && (
          <div className="flex items-center gap-3 mt-3">
            <div className="relative w-14 h-14 shrink-0 rounded-lg bg-gray-50 overflow-hidden">
              <Image
                src={item.product.main_image || NO_IMAGE}
                alt={item.product.name}
                fill
                sizes="56px"
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] text-gray-800 line-clamp-2 leading-snug">{item.product.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {quantity} шт. × <span className="font-semibold text-gray-900">{rub(item.price)}</span>
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
          В корзине: {count} {plural(count)} на сумму{" "}
          <span className="font-semibold text-gray-900">{rub(cart.totals.total)}</span>
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Link
            href="/karzinka"
            onClick={() => toast.dismiss(t.id)}
            className="text-center bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold py-2.5 rounded-md transition-colors"
          >
            Перейти в корзину
          </Link>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-50 hover:bg-gray-100 text-[#1f6fd8] text-xs font-medium py-2.5 rounded-md transition-colors"
          >
            Продолжить покупки
          </button>
        </div>
      </ToastShell>
    ),
    { id: "cart-toast", duration: 5000, position: "top-right" }
  );
}

// Savatga qo'shib bo'lmaganda
export function showCartErrorToast(message: string) {
  toast.custom(
    (t) => (
      <ToastShell t={t}>
        <div className="flex items-start gap-2.5">
          <AlertCircle size={22} className="shrink-0 text-red-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Не удалось добавить в корзину</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{message}</p>
          </div>
          <CloseButton id={t.id} />
        </div>
      </ToastShell>
    ),
    { id: "cart-toast", duration: 4000, position: "top-right" }
  );
}
