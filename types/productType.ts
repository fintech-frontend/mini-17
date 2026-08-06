export interface Product {
  id: number;
  article: string;
  title: string;
  price: number;
  oldPrice?: number | null;
  discount?: string | null;
  badge?: string | null;
  image: string; // JSON dagi kabi bitta string rasm manzili
  
  // Xususiyatlar (agar API dan kelmasa, optional (?) qilib qo'yiladi)
  type?: string;
  brand?: string;
  purpose?: string;
  power?: string | number;
  batteryCapacity?: string | number;
  torque?: string | number;
  voltage?: string | number;
}
export interface Product {
  id: number;
  article: string;
  title: string;
  price: number;
  oldPrice2?: number;
  discount2?: string;
  badge?: string | null;
  image: string; // Mana shu yerda 'image' (birlikda, string) borligiga e'tibor bering
}