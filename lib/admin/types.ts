// Admin API tiplari (OpenAPI: /api/schema/ → components.schemas.Admin*)

export type OrderStatus =
  | "new"
  | "awaiting_payment"
  | "processing"
  | "assembled"
  | "shipped"
  | "ready_for_pickup"
  | "completed"
  | "cancelled"
  | "refunded";

export type DeliveryType = "delivery" | "pickup";
export type PaymentMethod = "card" | "on_delivery" | "invoice";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "on_order";
export type LeadStatus = "new" | "in_progress" | "done" | "rejected";
export type LeadType = "callback" | "price_request" | "consultation" | "one_click";
export type ArticleType = "news" | "article" | "blog";

export interface AdminProduct {
  id: number;
  category: number;
  brand: number | null;
  name: string;
  slug: string;
  article: string;
  price: string;
  old_price: string | null;
  description: string;
  attrs_json: Record<string, unknown> | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface AdminOrderItem {
  id: number;
  product: number | null;
  name_snapshot: string;
  article_snapshot: string;
  price: string;
  quantity: number;
}

export interface AdminOrder {
  id: number;
  number: string;
  user: string | null;
  customer_email: string;
  status: OrderStatus;
  delivery_type: DeliveryType;
  payment_method: PaymentMethod;
  address_snapshot: Record<string, unknown> | null;
  subtotal: string;
  cart_discount: string;
  promo_discount: string;
  delivery_cost: string;
  total: string;
  items: AdminOrderItem[];
  created_at: string;
  paid_at: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  language: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface AdminCategory {
  id: number;
  parent: number | null;
  name: string;
  slug: string;
  sort: number;
  is_active: boolean;
}

export interface AdminBrand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

export interface AdminStock {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  status: StockStatus;
  synced_at: string | null;
}

export interface AdminLead {
  id: number;
  type: LeadType;
  name: string;
  phone: string;
  product: number | null;
  consent: boolean;
  status: LeadStatus;
  created_at: string;
}

export interface Paginated<T> {
  count: number;
  pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Admin API resurslari: /api/v1/admin/<resource>/
export type AdminResource =
  | "products"
  | "product-images"
  | "categories"
  | "brands"
  | "stock"
  | "orders"
  | "users"
  | "reviews"
  | "leads"
  | "articles"
  | "promotions"
  | "banners"
  | "faq"
  | "pages"
  | "promo-codes"
  | "discount-tiers";
