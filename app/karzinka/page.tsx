"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import {
  useApplyPromoMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useRemovePromoMutation,
  useUpdateCartItemMutation,
} from "@/lib/api/cartApi";
import { useGetProductsQuery } from "@/lib/api/productsApi";
import { NO_IMAGE } from "@/lib/api/mappers";
import { getApiErrorMessage } from "@/lib/useAddToCart";
import ProductCarousel from "@/components/ProductCarusel";

// Summa bo'yicha chegirma pog'onalari
const DISCOUNT_TIERS = [
  { from: 3000, percent: 5, color: "bg-emerald-600" },
  { from: 7000, percent: 10, color: "bg-orange-500" },
  { from: 20000, percent: 15, color: "bg-rose-600" },
];

const rub = (value: number) => `${Math.round(value).toLocaleString("ru-RU")} ₽`;

export default function CartPage() {
  // GET /cart/
  const { data, isLoading, isError, refetch } = useGetCartQuery();
  const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [applyPromo, { isLoading: isApplying }] = useApplyPromoMutation();
  const [removePromo] = useRemovePromoMutation();
  // "Возможно вас заинтересуют" uchun
  const { data: suggested } = useGetProductsQuery({ page_size: 10 });

  const [promoCode, setPromoCode] = useState("");
  const [showTiers, setShowTiers] = useState(false);

  const items = data?.items ?? [];
  const totals = data?.totals;
  const subtotal = Number(totals?.subtotal ?? 0);
  const cartDiscount = Number(totals?.cart_discount ?? 0);
  const promoDiscount = Number(totals?.promo_discount ?? 0);
  const total = Number(totals?.total ?? 0);

  // Keyingi chegirma pog'onasi va progress
  const nextTier = DISCOUNT_TIERS.find((t) => subtotal < t.from);
  const prevFrom = [...DISCOUNT_TIERS].reverse().find((t) => subtotal >= t.from)?.from ?? 0;
  const progress = nextTier
    ? Math.min(((subtotal - prevFrom) / (nextTier.from - prevFrom)) * 100, 100)
    : 100;

  const cartIds = new Set(items.map((i) => i.product.id));
  const suggestions = (suggested?.results ?? []).filter((p) => !cartIds.has(p.id));

  const changeQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateItem({ product_id: productId, quantity }).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Не удалось изменить количество"));
    }
  };

  const handleApplyPromo = async () => {
    const code = promoCode.trim();
    if (!code) return;
    try {
      await applyPromo(code).unwrap();
      toast.success("Промокод применён");
      setPromoCode("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Промокод не найден"));
    }
  };

  return (
    <div className="w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Навигация" className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Стройоптторг
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-400">Корзина товаров</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#2C333D] mb-5 sm:mb-6">
        Корзина товаров
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
          <div className="h-96 rounded-md bg-gray-100 animate-pulse" />
          <div className="h-72 rounded-md bg-gray-100 animate-pulse" />
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-500 mb-3">Не удалось загрузить корзину.</p>
          <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
            Повторить
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="border border-gray-200 rounded-md py-16 px-4 text-center">
          <ShoppingCart size={44} strokeWidth={1.25} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-semibold text-gray-900 mb-1">Ваша корзина пуста</p>
          <p className="text-sm text-gray-500 mb-6">Добавьте товары из каталога, чтобы оформить заказ.</p>
          <Link
            href="/catalog"
            className="inline-block bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold uppercase tracking-wide px-6 py-3.5 rounded-md transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px] gap-6 items-start">
          <div className="space-y-4 min-w-0">
            {/* Summa bo'yicha chegirma */}
            <div className="relative border border-gray-200 rounded-md p-4 sm:p-5">
              <p className="text-xs text-gray-700 mb-2">
                Ваша скидка от суммы заказа:{" "}
                <strong className="text-blue-600">{rub(cartDiscount)}</strong>
                {totals?.tier_percent ? (
                  <span className="text-gray-400"> ({totals.tier_percent}%)</span>
                ) : null}
              </p>

              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
                <span>{rub(subtotal)}</span>
                {nextTier && <span>{rub(nextTier.from)}</span>}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                <p className="text-xs text-gray-700">
                  {nextTier ? (
                    <>
                      Добавьте в корзину товаров на{" "}
                      <strong className="text-blue-600">{rub(nextTier.from - subtotal)}</strong> и получите
                      скидку {nextTier.percent}%
                    </>
                  ) : (
                    <>У вас максимальная скидка от суммы заказа</>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setShowTiers((v) => !v)}
                  className="w-fit text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors"
                >
                  Информация о скидках от суммы корзины
                </button>
              </div>

              {/* Pog'onalar haqida oyna */}
              {showTiers && (
                <div className="absolute z-20 left-4 right-4 sm:right-auto sm:left-1/3 sm:max-w-md top-3 bg-white rounded-md shadow-[0_8px_32px_rgba(16,24,40,0.15)] p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-sm font-semibold text-blue-600">
                      Сейчас у нас действуют следующие пороги:
                    </p>
                    <button type="button" onClick={() => setShowTiers(false)} aria-label="Закрыть">
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-700">
                    {DISCOUNT_TIERS.map((tier) => (
                      <span key={tier.from} className="flex items-center gap-1.5">
                        от {rub(tier.from)} –
                        <span className={`${tier.color} text-white text-[10px] font-semibold px-1.5 py-0.5 rounded`}>
                          {tier.percent}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mahsulotlar jadvali */}
            <div className="border border-gray-200 rounded-md px-4 sm:px-5">
              <div className="hidden md:grid grid-cols-[minmax(0,1fr)_110px_130px_110px_32px] gap-4 py-4 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-100">
                <span>Товар</span>
                <span>Цена</span>
                <span>Количество</span>
                <span>Сумма</span>
                <span />
              </div>

              {items.map((item) => {
                const product = item.product;
                const price = Number(item.price);
                const oldPrice = product.old_price ? Number(product.old_price) : null;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[64px_minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_110px_130px_110px_32px] gap-x-4 gap-y-3 items-center py-4 border-b border-gray-100 last:border-b-0"
                  >
                    {/* Tovar */}
                    <div className="contents md:flex md:items-center md:gap-4 min-w-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="relative w-16 h-16 shrink-0 row-span-2 md:row-span-1"
                      >
                        <Image
                          src={product.main_image || NO_IMAGE}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-[13px] text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[11px] text-gray-400 mt-1">Артикул: {product.article}</p>
                      </div>
                    </div>

                    {/* O'chirish (telefonda o'ng yuqorida) */}
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label="Удалить из корзины"
                      className="md:hidden justify-self-end self-start text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* Narx */}
                    <div className="col-start-2 md:col-start-auto flex md:block items-baseline gap-2">
                      <p className="text-[15px] font-semibold text-blue-600">{rub(price)}</p>
                      {oldPrice && oldPrice > price && (
                        <p className="text-[11px] text-gray-400 line-through">{rub(oldPrice)}</p>
                      )}
                    </div>

                    {/* Miqdor */}
                    <div className="col-start-2 md:col-start-auto flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isUpdating}
                        aria-label="Уменьшить количество"
                        className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center text-gray-700"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, item.quantity + 1)}
                        disabled={isUpdating}
                        aria-label="Увеличить количество"
                        className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center text-gray-700"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Summa */}
                    <p className="col-start-3 row-start-3 md:col-start-auto md:row-start-auto justify-self-end md:justify-self-start text-[15px] font-semibold text-gray-900 whitespace-nowrap">
                      {rub(Number(item.total))}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label="Удалить из корзины"
                      className="hidden md:flex text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Итого */}
          <aside className="lg:sticky lg:top-4 rounded-md p-5 shadow-[0_2px_16px_rgba(16,24,40,0.08)] bg-white">
            <h2 className="text-lg font-semibold text-gray-900 pb-4 mb-4 border-b border-gray-100">Итого</h2>

            <dl className="space-y-3 text-xs text-gray-700">
              <div className="flex justify-between">
                <dt>Товары ({totals?.item_count ?? items.length})</dt>
                <dd>{rub(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Скидка по промокоду</dt>
                <dd>{rub(promoDiscount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Скидка от суммы заказа</dt>
                <dd>{rub(cartDiscount)}</dd>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                <dt className="text-sm font-semibold text-gray-900">Сумма</dt>
                <dd className="text-xl font-semibold text-[#1d2b4f]">{rub(total)}</dd>
              </div>
            </dl>

            {/* Promokod */}
            <div className="mt-5 space-y-2.5">
              {data?.promo_code ? (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-700 rounded-md px-3 py-2.5">
                  <span>
                    Промокод <strong>{data.promo_code}</strong> применён
                  </span>
                  <button type="button" onClick={() => removePromo()} aria-label="Удалить промокод">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    placeholder="Промокод"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-500 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isApplying || !promoCode.trim()}
                    className="w-full bg-gray-50 hover:bg-gray-100 disabled:opacity-60 text-[#1f6fd8] text-[13px] font-medium py-3 rounded-md transition-colors"
                  >
                    {isApplying ? "Проверяем..." : "Применить промокод"}
                  </button>
                </>
              )}
            </div>

            <Link
              href="/chekoutPage"
              className="mt-4 block text-center bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold uppercase tracking-wide py-3.5 rounded-md transition-colors"
            >
              Перейти к оформлению
            </Link>
          </aside>
        </div>
      )}

      {/* Tavsiyalar */}
      {suggestions.length > 0 && (
        <div className="mt-10">
          <ProductCarousel title="Возможно вас заинтересуют" products={suggestions} />
        </div>
      )}
    </div>
  );
}
