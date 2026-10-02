import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-gray-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed mb-2 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      <span className="text-[11px] text-gray-400">{post.date}</span>
    </Link>
  );
}
