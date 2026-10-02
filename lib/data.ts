import type { ProductType } from "@/types/product";

export type { ProductType };

// API ishlamay qolganda yoki bo'sh bo'lsa ishlatiladigan zaxira ma'lumotlar
export const productsData: ProductType[] = [
  {
    id: 1,
    article: "XJ89YHGO",
    title: 'Перфоратор универсальный Wander X645-46 GF 1450W',
    price: 12789,
    oldPrice: 15999,
    discount: '-15%',
    category: 'instruments', // Инструменты
    image: '/images/drels.png',
  },
  {
    id: 2,
    article: "XJ89YHGO",
    title: 'Смеситель Faris G-120 для раковины',
    price: 1789,
    discount: '-18%',
    category: 'santehnika', // Сантехника
    image: '/images/rokovina.png',
  },
  {
    id: 3,
    article: "XJ89YHGO",
    title: 'Триммерная леска «Спираль-100»',
    price: 260,
    oldPrice: 310,
    discount: '-10%',
    category: 'garden', // Для сада
    image: '/images/ip.png',
  },
  {
    id: 4,
    article: "XJ89YHGO",
    title: 'Унитаз подвесной Aragio с двойным сливом',
    price: 12789,
    oldPrice: 15999,
    discount: '-10%',
    category: 'santehnika', // Сантехника
    image: '/images/unitaz.png',
  },
  {
    id: 5,
    article: "XJ89YHGO",
    title: 'Клей для напольных покрытий Porret',
    price: 12789,
    oldPrice: 15999,
    discount: '-10%',
    category: 'home', // Для дома
    image: '/images/porret.png',
  }
];
export const brands = [
  { id: 1, name: "Керамин", logo: "/images/keramin.png" },
  { id: 2, name: "Electrolux", logo: "/images/electolux.png" },
  { id: 3, name: "Bosch", logo: "/images/bosch.png" },
  { id: 4, name: "Oasis", logo: "/images/oasis.png" },
  { id: 5, name: "Kinplast", logo: "/images/kinplast.png" },
  { id: 6, name: "Ceresit", logo: "/images/ceresit.png" },
  { id: 7, name: "Bauproffe", logo: "/images/bauproffe.png" },
];

