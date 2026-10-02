import BlogPostView from "@/components/blog/BlogPostView";

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  return <BlogPostView slug={slug} />;
}

export const metadata = {
  title: "Блог - Стройоптторг",
};
