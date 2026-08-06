import { FiCreditCard, FiTruck, FiList, FiTag } from "react-icons/fi";
import { IconType } from "react-icons";

export interface Specification {
  name: string;
  value: string;
}

export interface Benefit {
  text: string;
  icon: IconType;
}

export interface Product {
  title: string;
  type: string;
  brand: string;
  purpose: string;
  power: string;
  batteryCapacity: string;
  torque: string;
  voltage: string;
  article: string;
  price: number;
  oldPrice: number;
  discount: string;
  images: string[]; // <-- 'image' ni 'images' ga o'zgartirdik va turini string[] qildik
}

export const product: Product = {
  title: "Аккумуляторная дрель-шуруповерт",
  type: "Дрель-шуруповерт",
  brand: "Makita",
  purpose: "Бытовое / Профессиональное",
  power: "500 Вт",
  batteryCapacity: "2.0 А/ч",
  torque: "30 Н/м",
  voltage: "18 В",
  article: "DF330DWE",
  price: 8500,
  oldPrice: 10200,
  discount: "-15%",
  // Rasmlar massivi
  images: [
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
  ],
};

export const specifications: Specification[] = [
  { name: "Тип товара", value: product.type || "—" },
  { name: "Бренд", value: product.brand || "—" },
  { name: "Назначение", value: product.purpose || "—" },
  { name: "Мощность", value: product.power || "—" },
  { name: "Емкость АКБ (А/ч)", value: product.batteryCapacity || "—" },
  { name: "Крутящий момент", value: product.torque || "—" },
  { name: "Напряжение", value: product.voltage || "—" },
];

export const benefits: Benefit[] = [
  { text: "Оплата любым удобным способом", icon: FiCreditCard },
  { text: "Большой выбор товаров", icon: FiList },
  { text: "Быстрая доставка", icon: FiTruck },
  { text: "Скидки постоянным клиентам", icon: FiTag },
];