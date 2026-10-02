import type { ApiArticle, ApiBanner, ApiBrand, ApiProduct, ApiProductDetail, ApiPromotion } from "@/types/api";
import type { ProductSpec, ProductType } from "@/types/product";
import type { Promo, Slide } from "@/lib/heroDta";

export const NO_IMAGE = "/images/no-image.svg";

export const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    : "";

export const mapPromotion = (p: ApiPromotion): Promo => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  discount: p.discount_label,
  image: p.image || NO_IMAGE,
  href: `/aksiya/${p.slug}`,
  validUntil: p.valid_until ?? undefined,
});

export const mapBanner = (b: ApiBanner): Slide => ({
  id: b.id,
  title: b.title,
  description: "",
  buttonText: "Подробнее",
  buttonHref: b.link || "/catalog",
  image: b.image || NO_IMAGE,
});

export const mapBrand = (b: ApiBrand) => ({
  id: b.id,
  name: b.name,
  logo: b.logo || NO_IMAGE,
});

export const mapArticle = (a: ApiArticle) => ({
  id: a.id,
  title: a.title,
  excerpt: "",
  date: formatDate(a.published_at),
  image: a.image || NO_IMAGE,
  href: `/blog/${a.slug}`,
});

// API mahsulotini UI dagi ProductType ko'rinishiga o'tkazish
export const mapProduct = (p: ApiProduct): ProductType => ({
  id: p.id,
  slug: p.slug,
  title: p.name,
  article: p.article,
  price: Number(p.price),
  oldPrice: p.old_price ? Number(p.old_price) : undefined,
  discount: p.discount_percent > 0 ? `-${p.discount_percent}%` : undefined,
  image: p.main_image || NO_IMAGE,
  category: p.category?.slug ?? "",
  categoryName: p.category?.name,
  brandName: p.brand?.name,
  badge: p.is_featured ? "Хит" : undefined,
  inStock: p.in_stock,
});

export const mapProductDetail = (p: ApiProductDetail): ProductType => {
  const base = mapProduct(p);

  const images = [...p.images].sort((a, b) => a.sort - b.sort).map((img) => img.image);

  const specs: ProductSpec[] = [
    base.categoryName && { label: "Категория", value: base.categoryName },
    base.brandName && { label: "Бренд", value: base.brandName },
    ...p.attributes
      .filter((a) => a.value)
      .map((a) => ({
        label: a.unit ? `${a.name} (${a.unit})` : a.name,
        value: a.value as string,
      })),
  ].filter(Boolean) as ProductSpec[];

  return {
    ...base,
    images: images.length ? images : [base.image],
    description: p.description,
    specs,
  };
};
