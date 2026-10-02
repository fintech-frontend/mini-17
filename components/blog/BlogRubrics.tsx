"use client";

import Link from "next/link";
import { useGetNewsQuery } from "@/lib/api/promoApi";
import { FALLBACK_POSTS, RUBRICS } from "@/lib/blog";
import type { ArticleType } from "@/types/api";

// Har bir rubrikadagi maqolalar sonini API dan olamiz (page_size=1 — faqat `count` kerak)
function useRubricCounts() {
  const all = useGetNewsQuery({ page_size: 1 });
  const news = useGetNewsQuery({ page_size: 1, type: "news" });
  const article = useGetNewsQuery({ page_size: 1, type: "article" });
  const blog = useGetNewsQuery({ page_size: 1, type: "blog" });

  const apiTotal = all.data?.count ?? 0;
  if (apiTotal > 0) {
    return {
      total: apiTotal,
      byType: {
        news: news.data?.count ?? 0,
        article: article.data?.count ?? 0,
        blog: blog.data?.count ?? 0,
      } as Record<ArticleType, number>,
    };
  }

  // API bo'sh — zaxira postlar bo'yicha sanaymiz
  const byType = { news: 0, article: 0, blog: 0 } as Record<ArticleType, number>;
  FALLBACK_POSTS.forEach((p) => byType[p.type]++);
  return { total: FALLBACK_POSTS.length, byType };
}

export default function BlogRubrics({ active }: { active?: ArticleType }) {
  const { total, byType } = useRubricCounts();

  const items = [
    { href: "/blog", label: "Все публикации", count: total, isActive: !active },
    ...RUBRICS.map((r) => ({
      href: `/blog?rubric=${r.type}`,
      label: r.label,
      count: byType[r.type],
      isActive: active === r.type,
    })),
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_16px_rgba(16,24,40,0.08)]">
      <h3 className="text-base font-bold text-gray-900 mb-2">Рубрики</h3>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center justify-between py-3 text-[11px] font-medium uppercase tracking-wide transition-colors ${
                item.isActive
                  ? "text-[#1f6fd8]"
                  : "text-gray-700 hover:text-[#1f6fd8]"
              }`}
            >
              <span>{item.label}</span>
              <span className="min-w-6 text-center text-[10px] text-gray-400 bg-gray-50 rounded px-1.5 py-0.5">
                {item.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
