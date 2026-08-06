import { IoMdHeartEmpty } from "react-icons/io";
import Image from 'next/image';
import Link from 'next/link';

import bag from '../public/bag.svg'
import chiziq from '../public/chiziq.svg';
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 relative flex flex-col justify-between hover:shadow-xl transition-all duration-300 h-full">

      {/* Rasm */}
      <Link href={`/products/${product.id}`} className="relative w-full h-36 sm:h-44 md:h-52 mb-3 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden block">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover hover:scale-105 transition-transform duration-300 p-2"
        />
      </Link>

      {/* Ma'lumotlar */}
      <div className="mb-3 sm:mb-4">
        <p className="text-[11px] sm:text-[13px] text-gray-400 mb-1">Артикул: {product.article}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm sm:text-base md:text-lg font-normal text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>
      </div>

      {/* Narx va Tugmalar */}
      <div>
        {/* Narxlar bloki */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
          {product.oldPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {product.oldPrice} ₽
            </span>
          )}
          <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            {product.price} ₽
          </span>
          {product.discount && (
            <span className="text-[10px] sm:text-xs bg-emerald-700 text-white px-1.5 sm:px-2 py-0.5 rounded-md font-medium">
              {product.discount}
            </span>
          )}
        </div>

        {/* Tugmalar bloki */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm text-center"
          >
            <Image src={bag} alt='shoppingBag' className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
            <span>Купить</span>
          </Link>
          <div className="flex gap-1.5 sm:gap-2">

            {/* Sevimlilarga qo'shish */}
            <button type="button" className="w-8 h-8 sm:w-[38px] sm:h-[38px] border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors flex items-center justify-center flex-shrink-0">
              <IoMdHeartEmpty className="text-sm sm:text-base" />
            </button>

            {/* Taqqoslash */}
            <button type="button" className="w-8 h-8 sm:w-[38px] sm:h-[38px] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center flex-shrink-0">
              <Image src={chiziq} alt='chiziq' className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}