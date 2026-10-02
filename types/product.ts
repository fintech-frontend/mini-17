export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductType {
  id: number;
  slug?: string;
  title: string;
  article: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  image: string;
  images?: string[];      // galereya uchun qo'shimcha rasmlar
  category: string;       // slug
  categoryName?: string;
  brandName?: string;
  badge?: string;
  inStock?: boolean;
  description?: string;
  specs?: ProductSpec[];  // xususiyatlar
}
