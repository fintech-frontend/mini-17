"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  useApplyPromoMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/lib/api/cartApi";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&auto=format&fit=crop&q=80";
const MAX_TIER = 7000;

export default function CartPage() {
  const { data, isLoading, isError } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [applyPromo, { isLoading: isApplying, error: promoError }] =
    useApplyPromoMutation();
  const [promoCode, setPromoCode] = useState("");

  // API ma'lumotini sahifa formatiga o'tkazamiz
  const cart = (data?.items ?? []).map((item) => ({
    id: item.product.id,
    title: item.product.name,
    article: item.product.article,
    price: Number(item.price),
    oldPrice: item.product.old_price ? Number(item.product.old_price) : null,
    quantity: item.quantity,
    image: item.product.main_image ?? PLACEHOLDER_IMAGE,
  }));
  const totals = data?.totals;
  const subtotal = Number(totals?.subtotal ?? 0);
  const totalSum = Number(totals?.total ?? 0);
  const progress = Math.min((subtotal / MAX_TIER) * 100, 100);

  // Miqdorni o'zgartirish (+ / -)
  const updateQuantity = (id: number, delta: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    updateItem({ product_id: id, quantity: newQty });
  };

  // Savatdan o'chirish
  const removeFromCart = (id: number) => {
    removeItem(id);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) applyPromo(promoCode.trim());
  };

  if (isLoading) {
    return <div className="py-20 text-center text-gray-500">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        Не удалось загрузить корзину
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fafbfc] min-h-screen py-4 md:py-8 px-4 sm:px-8 md:px-12 font-sans text-slate-800">
      <div className="max-w-[1240px] mx-auto">
        {/* Sarlavha */}
        <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-slate-900">
          Корзина товаров
        </h1>

        {/* Chegirma Progress Bar (Barcha qurilmalarda bir xil ko'rinadi) */}
        <div className="bg-white border border-gray-100 rounded-lg p-4 md:p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-2">
            <span>
              Ваша скидка от суммы заказа:{" "}
              <strong className="text-blue-600">
                {Number(totals?.discount_total ?? 0).toLocaleString()} ₽
              </strong>
            </span>

            <div className="hidden md:flex items-center gap-3 bg-white border border-gray-100 shadow-md rounded-lg px-3 py-1.5 text-[11px]">
              <span className="text-gray-500">
                Сейчас у нас действуют следующие пороги:
              </span>
              <span>
                от <strong>3 000 ₽</strong>{" "}
                <span className="bg-emerald-600 text-white text-[9px] px-1 rounded font-bold">
                  -5%
                </span>
              </span>
              <span>
                от <strong>7 000 ₽</strong>{" "}
                <span className="bg-orange-500 text-white text-[9px] px-1 rounded font-bold">
                  -10%
                </span>
              </span>
            </div>
          </div>

          <div className="relative w-full h-2 bg-gray-100 rounded-full my-3 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-gray-400 font-medium">
            <span>{subtotal.toLocaleString()} ₽</span>
            <span>7 000 ₽</span>
          </div>
        </div>

        {cart.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-lg p-10 mb-6 text-center text-gray-500 shadow-sm">
            Корзина пуста
          </div>
        )}

        {cart.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-lg p-10 mb-6 text-center text-gray-500 shadow-sm">
            Корзина пуста
          </div>
        )}

        {/* --- 1. MOBILE VERSIYA (Faqat telefonda ko'rinadi: md breakpointdan kichik) --- */}
        <div className="block md:hidden bg-white border border-gray-100 rounded-lg p-3 mb-6 shadow-sm">
          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.id} className="py-4 space-y-3">
                {/* Rasm va Nom */}
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 shrink-0 relative bg-white rounded-md flex items-center justify-center p-1 border border-gray-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Артикул: {item.article}
                    </p>
                  </div>
                </div>

                {/* Counter + Price + Trash */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-9 h-9 rounded-full bg-[#f3f4f6] hover:bg-gray-200 active:scale-95 text-slate-600 font-medium text-base flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-800 min-w-[12px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-9 h-9 rounded-full bg-[#f3f4f6] hover:bg-gray-200 active:scale-95 text-slate-600 font-medium text-base flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">
                        {(item.price * item.quantity).toLocaleString()} ₽
                      </div>
                      {item.oldPrice && item.oldPrice > item.price && (
                        <div className="text-[10px] text-gray-400 line-through">
                          {(item.oldPrice * item.quantity).toLocaleString()} ₽
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 2. DESKTOP VERSIYA (Faqat kompyuterda ko'rinadi: md breakpointdan katta) --- */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Savat Jadvali */}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-lg p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[550px]">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 pb-3">
                  <th className="pb-3 w-[45%]">ТОВАР</th>
                  <th className="pb-3 text-center">ЦЕНА</th>
                  <th className="pb-3 text-center">КОЛИЧЕСТВО</th>
                  <th className="pb-3 text-right">СУММА</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {cart.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-4 pr-2">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 shrink-0 relative rounded border border-gray-100 p-1 bg-white">
                          <img
                            src={item.image}
                            alt={item.title}
                            sizes="56px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 line-clamp-2 max-w-[220px]">
                            {item.title}
                          </h3>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            Артикул: {item.article}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-center whitespace-nowrap">
                      <div className="font-bold text-slate-800">
                        {item.price.toLocaleString()} ₽
                      </div>
                    </td>

                    <td className="py-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-4 text-right font-extrabold text-blue-600 whitespace-nowrap">
                      {(item.price * item.quantity).toLocaleString()} ₽
                    </td>

                    <td className="py-4 pl-3 text-right">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* O'ng tarafdagi Итого bloki */}
          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-gray-100 pb-3">
              Итого
            </h2>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between items-center">
                <span>Скидка по промокоду</span>
                <span>
                  {Number(totals?.promo_discount ?? 0).toLocaleString()} ₽
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 text-sm font-bold text-slate-900">
                <span>Сумма</span>
                <span className="text-blue-600 text-lg font-extrabold">
                  {totalSum.toLocaleString()} ₽
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <input
                type="text"
                placeholder="Промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isApplying}
                className="w-full py-2 text-xs font-semibold border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                {data?.promo_code ? `Промокод: ${data.promo_code}` : "Применить"}
              </button>
              {promoError && (
                <p className="text-[11px] text-red-500">Неверный промокод</p>
              )}
            </div>

            <button
              type="button"
              className="w-full py-3 bg-[#1976d2] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-sm mt-4"
            >
              ПЕРЕЙТИ К ОФОРМЛЕНИЮ
            </button>
          </div>
        </div>

        {/* Mobil uchun pastki "ПЕРЕЙТИ К ОФОРМЛЕНИЮ" tugmasi va Jami summa */}
        <div className="block md:hidden bg-white border border-gray-100 rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm font-bold">
            <span>Итого:</span>
            <span className="text-blue-600 text-lg font-extrabold">
              {totalSum.toLocaleString()} ₽
            </span>
          </div>
          <button
            type="button"
            className="w-full py-3 bg-[#1976d2] active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg"
          >
            ПЕРЕЙТИ К ОФОРМЛЕНИЮ
          </button>
        </div>
      </div>
    </div>
  );
}
