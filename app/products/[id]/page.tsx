'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetProductQuery, useGetRelatedProductsQuery } from '@/lib/api/productsApi';
import toast from 'react-hot-toast';

import ProductGallery from '@/components/ProductGallery';
import ProductSidebar from '@/components/Productsibebar';
import ProductBuyBox from '@/components/Productbuybox';
import ProductTabs from '@/components/Producttabs ';
import OneClickOrderModal from '@/components/ui/OneClickOrderModal';
import ProductCarousel from '@/components/ProductCarusel';
import { styles } from '@/styles/index.styles';

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params?.id);

  // GET /catalog/products/{id}/
  const { data: product, isLoading, isError } = useGetProductQuery(id, { skip: !id });
  // GET /catalog/products/{slug}/related/
  const { data: related = [] } = useGetRelatedProductsQuery(product?.slug ?? '', {
    skip: !product?.slug,
  });

  const [quantity, setQuantity] = useState(1);
  const [isOneClickOpen, setIsOneClickOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="w-full max-w-365 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-8 w-2/3 bg-gray-100 rounded-lg animate-pulse mb-6" />
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </main>
    );
  }

  if (isError || !product) {
    return (
      <div className={`${styles.container} mx-auto px-4 py-20 text-center`}>
        <h1 className="text-2xl font-bold text-gray-800">Товар не найден</h1>
      </div>
    );
  }

  const imagesList = product.images?.length ? product.images : [product.image];

  // Savatga qo'shish funksiyasi
  const handleAddToCart = () => {
    toast.success(`Товар добавлен в корзину! (${quantity} шт.)`, {
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  };

  // Sevimlilarga qo'shish funksiyasi
  const handleAddToFavorites = () => {
    toast('Товар добавлен в избранное ❤️', {
      style: {
        background: '#3B82F6',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        fontWeight: '500',
      },
    });
  };

  return (
    <main className="w-full max-w-365 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Навигация" className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 mb-3">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Стройоптторг
        </Link>
        {product.categoryName && (
          <>
            <span className="text-gray-300">/</span>
            <Link href="/catalog" className="hover:text-blue-600 transition-colors">
              {product.categoryName}
            </Link>
          </>
        )}
        <span className="text-gray-300">/</span>
        <span className="text-gray-400 line-clamp-1">{product.title}</span>
      </nav>

      {/* Sarlavha */}
      <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#2C333D] mb-5 sm:mb-6 leading-tight">
        {product.title}
      </h1>

      {/* Asosiy Grid: galereya | xususiyatlar | sotib olish */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_280px_260px] xl:grid-cols-[minmax(0,1fr)_300px_280px] gap-6 lg:gap-8 items-start">
        <div className="md:col-span-2 lg:col-span-1">
          <ProductGallery key={product.id} images={imagesList} title={product.title} />
        </div>

        <ProductSidebar specs={product.specs ?? []} />

        <ProductBuyBox
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          onAddToFavorites={handleAddToFavorites}
          onOneClickOpen={() => setIsOneClickOpen(true)}
        />
      </div>

      {/* Tablar bo'limi (alohida komponent) */}
      <ProductTabs product={product} />

      {/* Заказать в 1 клик modali */}
      <OneClickOrderModal
        isOpen={isOneClickOpen}
        onClose={() => setIsOneClickOpen(false)}
        productTitle={product.title}
        productId={product.id}
      />

      {/* O'xshash / boshqa mahsulotlar - gorizontal carousel, kartalar torayib tiqilib qolmaydi */}
      {related.length > 0 && <ProductCarousel title="Похожие товары" products={related} />}

    </main>
  );
}