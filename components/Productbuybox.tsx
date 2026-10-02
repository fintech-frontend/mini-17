'use client';

import { Check, ChartNoAxesColumn, Heart, Minus, Plus } from 'lucide-react';
import { ProductType } from '@/types/product';
import { useCompareStore } from './useCompareStore';
import { useFavoritesStore } from './useFavoritesStore';
import { useMounted } from '@/lib/useMounted';

interface ProductBuyBoxProps {
  product: ProductType;
  quantity: number;
  setQuantity: (value: number) => void;
  onAddToCart: () => void;
  onAddToFavorites: () => void;
  onOneClickOpen: () => void;
}

const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;

export default function ProductBuyBox({
  product,
  quantity,
  setQuantity,
  onAddToCart,
  onAddToFavorites,
  onOneClickOpen,
}: ProductBuyBoxProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompareStore();
  const inCompare = isInCompare(product.id);
  const { toggleFavorite, isInFavorites } = useFavoritesStore();
  const mounted = useMounted();
  const inFavorites = mounted && isInFavorites(product.id);

  const handleFavoriteClick = () => {
    toggleFavorite(product);
    if (!inFavorites) onAddToFavorites();
  };

  return (
    <div className="bg-white rounded-md p-5 shadow-[0_2px_16px_rgba(16,24,40,0.08)]">
      <div className="text-xs text-gray-400">Артикул: {product.article}</div>

      {product.inStock === false ? (
        <div className="mt-2 text-xs text-gray-400">Нет в наличии</div>
      ) : (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-700">
          <Check size={14} className="text-emerald-600" strokeWidth={2.5} />
          <span>В наличии</span>
        </div>
      )}

      {/* Narx */}
      {/* Narx miqdorga ko'paytirib ko'rsatiladi */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className="text-2xl font-semibold text-[#1d2b4f]">
          {formatPrice(product.price * quantity)}
        </span>
        {product.oldPrice && (
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(product.oldPrice * quantity)}
          </span>
        )}
        {product.discount && (
          <span className="text-[10px] font-semibold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
            {product.discount}
          </span>
        )}
      </div>
      {quantity > 1 && (
        <div className="mt-1 text-xs text-gray-400">
          {formatPrice(product.price)} × {quantity} шт.
        </div>
      )}

      {/* Miqdor */}
      <div className="mt-4 flex items-center justify-between text-[13px] text-gray-700">
        <span>Количество:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Уменьшить количество"
            className="w-9 h-9 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="w-9 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Увеличить количество"
            className="w-9 h-9 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Tugmalar */}
      <div className="mt-5 space-y-2.5">
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold uppercase tracking-wide py-3.5 rounded-md transition-colors"
        >
          Добавить в корзину
        </button>
        <button
          type="button"
          onClick={onOneClickOpen}
          className="w-full bg-gray-50 hover:bg-gray-100 text-[#1f6fd8] text-[13px] font-medium py-3 rounded-md transition-colors"
        >
          Купить в 1 клик
        </button>
      </div>

      {/* Sevimlilar va taqqoslash */}
      <div className="mt-5 flex items-center justify-between text-xs text-gray-700">
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`flex items-center gap-2 transition-colors ${
            inFavorites ? 'text-red-500' : 'hover:text-blue-600'
          }`}
        >
          <span
            className={`w-9 h-9 border rounded-md flex items-center justify-center ${
              inFavorites ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}
          >
            <Heart size={16} strokeWidth={1.75} fill={inFavorites ? 'currentColor' : 'none'} />
          </span>
          {inFavorites ? 'В избранном' : 'В избранное'}
        </button>
        <button
          type="button"
          onClick={() => (inCompare ? removeFromCompare(product.id) : addToCompare(product))}
          className={`flex items-center gap-2 transition-colors ${
            inCompare ? 'text-blue-600' : 'hover:text-blue-600'
          }`}
        >
          <span
            className={`w-9 h-9 border rounded-md flex items-center justify-center ${
              inCompare ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <ChartNoAxesColumn size={16} strokeWidth={1.75} />
          </span>
          {inCompare ? 'В сравнении' : 'Сравнить'}
        </button>
      </div>
    </div>
  );
}
