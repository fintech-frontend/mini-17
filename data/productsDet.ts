export interface ProductDet {
  id: number;
  article: string;
  title: string;
  price: number;
  oldPrice: number;
  discount: string;
  badge: string | null;
  image: string;
}

export const productsDet: ProductDet[] = [
  {
    id: 1,
    article: "XJ89YHGO",
    title: "Перфоратор универсальный Wander X645-46 GF 1450W",
    price: 12789,
    oldPrice: 15999,
    discount: "-15%",
    badge: null,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    article: "MK44TR78",
    title: "Аккумуляторная дрель-шуруповерт Makita DF330DWE",
    price: 8500,
    oldPrice: 10200,
    discount: "-15%",
    badge: "Хит продаж",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    article: "BS99LP21",
    title: "Угловая шлифмашина Bosch GWS 750 Professional",
    price: 5400,
    oldPrice: 6500,
    discount: "-17%",
    badge: "Скидка",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    article: "LW33XN55",
    title: "Лазерный нивелир Huepar 3D Cross Line",
    price: 9990,
    oldPrice: 12000,
    discount: "-20%",
    badge: "Новинка",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
  }
];