"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetNewsQuery } from "@/lib/api/promoApi";
import { mapArticle } from "@/lib/api/mappers";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
}

// API da yangilik bo'lmasa ko'rsatiladigan zaxira ro'yxat
const staticNews: NewsItem[] = [
  {
    id: 1,
    title: "Масштабное обновление каталога инструментов",
    excerpt: "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.",
    date: "5 Августа 2023",
    image: "/images/news1.png",
    href: "/news/1",
  },
  {
    id: 2,
    title: "Масштабное обновление каталога инструментов",
    excerpt: "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.",
    date: "5 Августа 2023",
    image: "/images/news2.png",
    href: "/news/2",
  },
  {
    id: 3,
    title: "Масштабное обновление каталога инструментов",
    excerpt: "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.",
    date: "5 Августа 2023",
    image: "/images/news3.png",
    href: "/news/3",
  },
  {
    id: 4,
    title: "Масштабное обновление каталога инструментов",
    excerpt: "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.",
    date: "5 Августа 2023",
    image: "/images/news4.png",
    href: "/news/4",
  },
];

export default function LatestNews() {
  // GET /news/?page_size=4
  const { data } = useGetNewsQuery({ page_size: 4 });
  const news: NewsItem[] = data?.results.length ? data.results.map(mapArticle) : staticNews;

  return (
    <section className="w-full py-6 sm:py-8 md:py-10">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          Последние новости
        </h2>
        <Link
          href="/news"
          className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
        >
          Больше новостей
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {news.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={item.href} className="group block">
      <div className="relative w-full h-44 sm:h-40 md:h-44 lg:h-45 rounded-xl overflow-hidden mb-3 sm:mb-3.5 bg-gray-100">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {item.title}
      </h3>

      {item.excerpt && (
        <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed mb-2 line-clamp-2">
          {item.excerpt}
        </p>
      )}

      <span className="text-[11px] sm:text-xs text-gray-400">{item.date}</span>
    </Link>
  );
}