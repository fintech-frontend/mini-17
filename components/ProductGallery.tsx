'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Expand, X } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex] ?? images[0];
  const hasManyThumbs = images.length > 5;

  // Zoom oynasi ochiq bo'lganda Esc bilan yopish
  useEffect(() => {
    if (!isZoomOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsZoomOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isZoomOpen]);

  const scrollThumbs = (direction: 'up' | 'down') => {
    thumbsRef.current?.scrollBy({ top: direction === 'down' ? 160 : -160, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-5">
      {/* Kichik rasmlar (thumbnails) */}
      <div className="flex sm:flex-col items-center gap-2 sm:w-16 shrink-0">
        {hasManyThumbs && (
          <button
            type="button"
            onClick={() => scrollThumbs('up')}
            aria-label="Прокрутить вверх"
            className="hidden sm:flex w-8 h-6 items-center justify-center text-gray-400 hover:text-gray-700"
          >
            <ChevronUp size={18} />
          </button>
        )}

        <div
          ref={thumbsRef}
          className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-102 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          {images.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Фото ${index + 1}`}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg border bg-white overflow-hidden transition-colors ${
                index === activeIndex
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <Image src={img} alt={`${title} — фото ${index + 1}`} fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>

        {hasManyThumbs && (
          <button
            type="button"
            onClick={() => scrollThumbs('down')}
            aria-label="Прокрутить вниз"
            className="hidden sm:flex w-8 h-6 items-center justify-center text-gray-400 hover:text-gray-700"
          >
            <ChevronDown size={18} />
          </button>
        )}
      </div>

      {/* Asosiy rasm */}
      <div className="relative w-full sm:w-auto sm:flex-1 h-72 sm:h-96 lg:h-110 bg-white">
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-contain"
          priority
        />
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          aria-label="Увеличить фото"
          className="absolute left-0 bottom-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Expand size={18} />
        </button>
      </div>

      {/* Kattalashtirilgan rasm */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700"
          >
            <X size={22} />
          </button>
          <div
            className="relative w-full max-w-4xl h-[80vh] bg-white rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={activeImage} alt={title} fill sizes="900px" className="object-contain p-6" />
          </div>
        </div>
      )}
    </div>
  );
}
