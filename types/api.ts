// Backend (https://yeteper714.pythonanywhere.com/api/docs/) javob tiplari

export interface Paginated<T> {
  count: number;
  pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  sort: number;
  product_count: number;
}

export interface ApiCategoryTree extends ApiCategory {
  children: ApiCategoryTree[];
}

export interface ApiBrand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  article: string;
  price: string;
  old_price: string | null;
  discount_percent: number;
  brand: ApiBrand | null;
  category: ApiCategory | null;
  main_image: string | null;
  rating: string;
  review_count: number;
  stock_quantity: number;
  in_stock: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface ApiProductImage {
  id: number;
  image: string;
  sort: number;
  is_main: boolean;
}

export interface ApiProductAttribute {
  attribute_id: number;
  code: string;
  name: string;
  unit: string;
  value: string | null;
}

export interface ApiProductDetail extends ApiProduct {
  description: string;
  images: ApiProductImage[];
  attributes: ApiProductAttribute[];
  stock: { quantity: number; status: string } | null;
  is_in_wishlist: boolean;
}

export interface ApiRatingSummary {
  product_id: number;
  average_rating: number;
  review_count: number;
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface ApiProductReview {
  id: number;
  product: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ApiBanner {
  id: number;
  title: string;
  image: string | null;
  link: string;
  sort: number;
}

export interface ApiPromotion {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  discount_label: string;
  valid_until: string | null;
  category: number | null;
  category_slug: string;
  is_active: boolean;
}

export interface ApiPromotionDetail extends ApiPromotion {
  body: string;
}

export type ArticleType = "news" | "article" | "blog";

export interface ApiArticle {
  id: number;
  type: ArticleType;
  title: string;
  slug: string;
  image: string | null;
  published_at: string | null;
}

export interface ApiArticleDetail extends ApiArticle {
  body: string;
}

export interface ApiHome {
  banners: ApiBanner[];
  categories: ApiCategory[];
  popular_products: ApiProduct[];
  best_selling_products: ApiProduct[];
  new_products: ApiProduct[];
  discounted_products: ApiProduct[];
  featured_products: ApiProduct[];
  promotions: ApiPromotion[];
  news: ApiArticle[];
}

export type LeadType = "callback" | "price_request" | "consultation" | "one_click";

export interface LeadCreateRequest {
  type?: LeadType;
  name: string;
  phone: string;
  product?: number | null;
  consent?: boolean;
}

export interface LeadCreateResponse extends LeadCreateRequest {
  id: number;
}

export interface ProductsQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  category_slug?: string;
  brand_slug?: string;
  brand?: number[];       // bir nechta brend: brand=1&brand=2
  featured?: boolean;
  discount?: boolean;
  in_stock?: boolean;
  min_price?: number;
  max_price?: number;
}
