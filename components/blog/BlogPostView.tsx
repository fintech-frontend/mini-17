"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetNewsItemQuery, useGetNewsQuery } from "@/lib/api/promoApi";
import {
  FALLBACK_POSTS,
  findFallbackPost,
  mapBlogPost,
  rubricLabel,
} from "@/lib/blog";
import BlogCard from "./BlogCard";
import BlogRubrics from "./BlogRubrics";
import InfoSidebar from "@/components/InfoSidebar";
import { styles } from "@/styles/index.styles";

// Maqola matnini bloklarga ajratish. HTML bo'lsa — teglar olib tashlanadi
// (dangerouslySetInnerHTML ishlatmaymiz), "## " — sarlavha, "- " — ro'yxat.
type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

function parseBody(body: string): Block[] {
  const text = body
    .replace(/<h[1-6][^>]*>/gi, "\n\n## ")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|h[1-6]|ul|ol)>|<br\s*\/?>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»");

  const blocks: Block[] = [];
  text.split(/\n{2,}/).forEach((chunk) => {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;

    if (lines.every((l) => l.startsWith("- "))) {
      blocks.push({ kind: "ul", items: lines.map((l) => l.slice(2)) });
    } else if (lines[0].startsWith("## ")) {
      blocks.push({ kind: "h2", text: lines[0].slice(3) });
      if (lines.length > 1) blocks.push({ kind: "p", text: lines.slice(1).join(" ") });
    } else {
      blocks.push({ kind: "p", text: lines.join(" ") });
    }
  });
  return blocks;
}

export default function BlogPostView({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useGetNewsItemQuery(slug);
  const { data: latest } = useGetNewsQuery({ page_size: 5 });

  const post = data ? mapBlogPost(data) : findFallbackPost(slug);

  // "Другие публикации" — joriy maqoladan tashqari 4 ta
  const others = (
    latest?.results.length ? latest.results.map(mapBlogPost) : FALLBACK_POSTS
  )
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  if (isLoading && !post) {
    return <div className="py-20 text-center text-gray-500">Загрузка...</div>;
  }

  if (!post) {
    return (
      <div className={`${styles.container} px-4 py-20 text-center`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Публикация не найдена
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isError ? "Возможно, она была удалена или перемещена." : null}
        </p>
        <Link
          href="/blog"
          className="inline-block bg-[#005bff] hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wide px-6 py-3 rounded-xl"
        >
          Вернуться в блог
        </Link>
      </div>
    );
  }

  const blocks = parseBody(post.body);

  return (
    <section className={`${styles.container} px-4 sm:px-6 md:px-8 py-6 sm:py-8`}>
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-2 flex flex-wrap items-center gap-1">
        <Link href="/" className="hover:text-[#005bff]">
          Стройоптторг
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#005bff]">
          Блог
        </Link>
        <span>/</span>
        <Link href={`/blog?rubric=${post.type}`} className="hover:text-[#005bff]">
          {rubricLabel(post.type)}
        </Link>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
        <article>
          <h1 className="text-2xl sm:text-3xl md:text-[33px] font-bold text-[#2C333D] leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <Link
              href={`/blog?rubric=${post.type}`}
              className="text-[10px] font-semibold uppercase tracking-wide text-gray-700 bg-gray-100 hover:bg-gray-200 rounded px-2.5 py-1 transition-colors"
            >
              {rubricLabel(post.type)}
            </Link>
            {post.date && (
              <span className="text-[11px] text-gray-400">• {post.date}</span>
            )}
          </div>

          {/* Birinchi paragraf — rasmdan oldin (saytdagidek) */}
          {blocks[0]?.kind === "p" && (
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              {blocks[0].text}
            </p>
          )}

          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            {blocks.slice(blocks[0]?.kind === "p" ? 1 : 0).map((b, i) => {
              if (b.kind === "h2") {
                return (
                  <h2 key={i} className="text-lg sm:text-2xl font-bold text-gray-900 pt-4">
                    {b.text}
                  </h2>
                );
              }
              if (b.kind === "ul") {
                return (
                  <ul key={i} className="space-y-2.5">
                    {b.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{b.text}</p>;
            })}
          </div>
        </article>

        <InfoSidebar showBanners={false}>
          <BlogRubrics active={post.type} />
        </InfoSidebar>
      </div>

      {/* Boshqa maqolalar */}
      {others.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Другие публикации
            </h2>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-medium text-blue-600 hover:underline"
            >
              Все публикации
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {others.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
