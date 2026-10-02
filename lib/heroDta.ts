import { IconType } from "react-icons";
import { MdOutlinePayments, MdOutlineLocalShipping } from "react-icons/md";
import { HiOutlineViewGrid } from "react-icons/hi";
import { MdDiscount } from "react-icons/md";

/* --- Interfeyslar --- */

export interface Slide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  image: string;
}

export interface Feature {
  icon: IconType;
  text: string;
}

export interface Category {
  id: number;
  title: string;
  image: string;
  href: string;
}

export interface Promo {
  id: number;
  slug?: string;
  title: string;
  discount: string;
  image: string;
  href: string;
  validUntil?: string;
}

/* --- Ma'lumotlar (Data) --- */

export const slides: Slide[] = [
  {
    id: 1,
    title: "Электроинструмент для любых нужд",
    description:
      "У нас обновился ассортимент сантехники, мебели для ванной комнаты, а так же других сопутствующих товаров.",
    buttonText: "Перейти к товарам",
    buttonHref: "/catalog",
    image: "/images/homeR.png",
  },
  {
    id: 2,
    title: "Сантехника для вашего дома",
    description: "Большой выбор смесителей, унитазов и аксессуаров по выгодным ценам.",
    buttonText: "Смотреть каталог",
    buttonHref: "/catalog/santehnika",
    image: "/images/santexnika.jpg",
  },
  {
    id: 3,
    title: "Строительные материалы в наличии",
    description: "Быстрая доставка по всему региону и оплата любым удобным способом.",
    buttonText: "Перейти к товарам",
    buttonHref: "/catalog/stroymaterialy",
    image: "/images/sss.jpg",
  },
  {
    id: 4,
    title: "Скидки на крупные покупки",
    description: "Делаем скидки до 30% при заказе от определенной суммы.",
    buttonText: "Узнать подробнее",
    buttonHref: "/promo",
    image: "/images/homeR.png",
  },
];

export const features: Feature[] = [
  { icon: MdOutlinePayments, text: "Оплата любым удобным способом" },
  { icon: HiOutlineViewGrid, text: "Большой выбор товаров в каталоге" },
  { icon: MdOutlineLocalShipping, text: "Осуществляем быструю доставку" },
  { icon: MdDiscount, text: "Делаем скидки на крупные покупки" },
];

export const categories: Category[] = [
  { id: 1, title: "Сантехника", image: "/images/vanna.png", href: "/catalog/santehnika" },
  { id: 2, title: "Отделочные материалы", image: "/images/mato.png", href: "/catalog/otdelka" },
  { id: 3, title: "Электротовары", image: "/images/chiroqY.png", href: "/catalog/electro" },
  { id: 4, title: "Инструменты", image: "/images/drel.png", href: "/catalog/instrumenty" },
  { id: 5, title: "Столярные изделия", image: "/images/reyka.png", href: "/catalog/stolyarka" },
  { id: 6, title: "Общестроительные материалы", image: "/images/gish.png", href: "/catalog/obshestroy" },
  { id: 7, title: "Все для сауны и бани", image: "/images/pechka.png", href: "/catalog/bania" },
];

export const promos: Promo[] = [
  { id: 1, title: "Метизные изделия", discount: "до -15%", image: "/images/home.png", href: "/aksiya" },
  { id: 2, title: "Лакокрасочные материалы", discount: "до -30%", image: "/images/home2.png", href: "/aksiya" },
  { id: 3, title: "Напольные покрытия", discount: "до -25%", image: "/images/home3.png", href: "/aksiya" },
  { id: 4, title: "Все для отопления", discount: "до -30%", image: "/images/home4.png", href: "/aksiya" },
];