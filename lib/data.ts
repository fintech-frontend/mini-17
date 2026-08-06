export interface Product {
  id: number;
  title: string;
  article: string;
  price: number;
  oldPrice?: number | null;
  discount?: string | null;
  badge?: string | null;
  image: string;
}

export const products: Product[] = [
  {
    "id": 1,
    "title": "Перфоратор универсальный Wander X645-46 GF 1450W",
    "article": "XJ89YHGO",
    "price": 12789,
    "oldPrice": 15999,
    "discount": "-15%",
    "badge": null,
    "image": "/images/homeR.png" // Rasmlar joylashuviga qarab o'zgartirasiz
  },
  {
    "id": 2,
    "title": "Смеситель Faris G-120 для раковины",
    "article": "XJ89YHGO",
    "price": 1789,
    "oldPrice": null,
    "discount": null,
    "badge": "хит",
    "image": "/images/homeR.png"
  },
  {
    "id": 3,
    "title": "Триммерная леска «Спираль-100»",
    "article": "XJ89YHGO",
    "price": 260,
    "oldPrice": 312,
    "discount": "-10%",
    "badge": null,
    "image": "/images/homeR.png"
  },
  {
    "id": 4,
    "title": "Унитаз подвесной Aragio с двойным сливом",
    "article": "XJ89YHGO",
    "price": 12789,
    "oldPrice": 15999,
    "discount": "-12%",
    "badge": "хит",
    "image": "/images/homeR.png"
  },
  {
    "id": 5,
    "title": "Набор гравировальных насадок Nozzle-Tok",
    "article": "XJ89YHGO",
    "price": 12789,
    "oldPrice": 15999,
    "discount": "-15%",
    "badge": null,
    "image": "/images/homeR.png"
  },
  {
    "id": 6,
    "title": "Перфоратор универсальный Wander X645-46 GF 1450W",
    "article": "XJ89YHGO",
    "price": 12789,
    "oldPrice": 15999,
    "discount": "-15%",
    "badge": null,
    "image": "/images/homeR.png"
  },
  {
    "id": 7,
    "title": "Смеситель Faris G-120 для раковины",
    "article": "XJ89YHGO",
    "price": 1789,
    "oldPrice": null,
    "discount": null,
    "badge": "хит",
    "image": "/images/homeR.png"
  },
  {
    "id": 8,
    "title": "Триммерная леска «Спираль-100»",
    "article": "XJ89YHGO",
    "price": 260,
    "oldPrice": 312,
    "discount": "-10%",
    "badge": null,
    "image": "/images/homeR.png"
  }
];