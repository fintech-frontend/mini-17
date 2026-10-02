"use client";

import Link from "next/link";
import { useGetNewsQuery } from "@/lib/api/promoApi";
import { FALLBACK_POSTS, mapBlogPost, rubricLabel } from "@/lib/blog";
import type { ArticleType } from "@/types/api";
import BlogCard from "./BlogCard";
import BlogRubrics from "./BlogRubrics";
import InfoSidebar from "@/components/InfoSidebar";
import { styles } from "@/styles/index.styles";

const PAGE_SIZE = 12;

export default function BlogList({
  rubric,
  page,
}: {
  rubric?: ArticleType;
  page: number;
}) {
  const { data, isLoading, isError } = useGetNewsQuery({
    type: rubric,
    page,
    page_size: PAGE_SIZE,
  });

  // API da maqola bo'lmasa (yoki xato bo'lsa) zaxira postlarni ko'rsatamiz
  const useFallback = !isLoading && (isError || !data?.count);
  const fallback = FALLBACK_POSTS.filter((p) => !rubric || p.type === rubric);

  const posts = useFallback
    ? fallback.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : (data?.results ?? []).map(mapBlogPost);
  const totalPages = useFallback
    ? Math.max(1, Math.ceil(fallback.length / PAGE_SIZE))
    : (data?.pages ?? 1);

  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (rubric) params.set("rubric", rubric);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <section className={`${styles.container} px-4 sm:px-6 md:px-8 py-6 sm:py-8`}>
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
        <Link href="/" className="hover:text-[#005bff]">
          Стройоптторг
        </Link>
        <span>/</span>
        {rubric ? (
          <>
            <Link href="/blog" className="hover:text-[#005bff]">
              Блог
            </Link>
            <span>/</span>
            <span className="text-gray-600">{rubricLabel(rubric)}</span>
          </>
        ) : (
          <span className="text-gray-600">Блог</span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-[33px] font-bold text-[#2C333D] mb-6">
        {rubric ? rubricLabel(rubric) : "Блог"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] rounded-xl bg-gray-100 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-500 py-10 text-center">
              В этой рубрике пока нет публикаций
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Sahifalash */}
          {totalPages > 1 && (
            <nav
              aria-label="Страницы"
              className="flex items-center justify-center gap-1.5 pt-10 text-xs"
            >
              <PageLink href={pageHref(page - 1)} disabled={page <= 1}>
                Назад
              </PageLink>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PageLink key={n} href={pageHref(n)} active={n === page}>
                  {n}
                </PageLink>
              ))}
              <PageLink href={pageHref(page + 1)} disabled={page >= totalPages}>
                Далее
              </PageLink>
            </nav>
          )}
        </div>

        <InfoSidebar showBanners={false}>
          <BlogRubrics active={rubric} />
        </InfoSidebar>
      </div>
    </section>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const base = "min-w-8 h-8 px-2.5 flex items-center justify-center rounded border";
  if (disabled) {
    return (
      <span className={`${base} border-gray-100 text-gray-300`}>{children}</span>
    );
  }
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${base} transition-colors ${
        active
          ? "bg-[#1f6fd8] border-[#1f6fd8] text-white"
          : "border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </Link>
  );
}
