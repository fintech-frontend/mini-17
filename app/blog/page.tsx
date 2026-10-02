import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import { RUBRICS } from "@/lib/blog";
import type { ArticleType } from "@/types/api";

export const metadata: Metadata = {
  title: "Блог - Стройоптторг",
};

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const { rubric, page } = await searchParams;

  // Faqat ma'lum rubrikalarni qabul qilamiz (?rubric=news|article|blog)
  const type = RUBRICS.find((r) => r.type === rubric)?.type as ArticleType | undefined;
  const pageNumber = Math.max(1, Number(page) || 1);

  return <BlogList rubric={type} page={pageNumber} />;
}
