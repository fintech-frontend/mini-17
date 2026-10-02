import type { ApiArticle, ApiArticleDetail, ArticleType } from "@/types/api";
import { formatDate, NO_IMAGE } from "@/lib/api/mappers";

// Blog rubrikalari (API dagi `type` maydoni)
export const RUBRICS: { type: ArticleType; label: string }[] = [
  { type: "news", label: "Новости" },
  { type: "article", label: "Статьи" },
  { type: "blog", label: "Советы" },
];

export const rubricLabel = (type: ArticleType) =>
  RUBRICS.find((r) => r.type === type)?.label ?? "Новости";

export interface BlogPost {
  id: number;
  slug: string;
  type: ArticleType;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  date: string;
}

// API maqolasini UI ko'rinishiga o'tkazish
export const mapBlogPost = (a: ApiArticle | ApiArticleDetail): BlogPost => {
  const body = "body" in a ? a.body : "";
  const plain = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return {
    id: a.id,
    slug: a.slug,
    type: a.type,
    title: a.title,
    excerpt: plain.length > 140 ? `${plain.slice(0, 140)}…` : plain,
    body,
    image: a.image || NO_IMAGE,
    date: formatDate(a.published_at),
  };
};

// API da maqola bo'lmasa ko'rsatiladigan zaxira postlar
export const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "kak-vybrat-elektrodrel",
    type: "article",
    title: "Как выбрать электродрель: руководство для покупателя",
    excerpt:
      "Разбираемся, на что смотреть при покупке дрели: тип питания, мощность и полезные функции.",
    body: `Перед покупкой дрели стоит определиться, для каких задач она нужна. От этого зависит и тип инструмента, и его мощность.

## Сетевая или аккумуляторная

Сетевые модели стабильно держат мощность и подходят для долгой работы. Аккумуляторные удобнее там, где нет розетки, и при небольших задачах по дому.

## Мощность

Для дерева и гипсокартона хватит небольшой мощности. Для бетона и металла лучше выбрать модель помощнее или перфоратор.

## Полезные функции

- подсветка рабочей зоны;
- индикатор заряда аккумулятора;
- блокировка шпинделя для быстрой замены оснастки.

Если сомневаетесь — консультанты в наших магазинах помогут подобрать модель под ваш бюджет.`,
    image: "/images/news4.png",
    date: "3 октября 2023",
  },
  {
    id: 2,
    slug: "obnovlenie-kataloga-instrumentov",
    type: "news",
    title: "Масштабное обновление каталога инструментов",
    excerpt:
      "С радостью сообщаем вам о крупном пополнении нашего каталога инструментов.",
    body: `Мы расширили ассортимент электро- и ручного инструмента: в каталоге появились новые модели дрелей, шуруповертов, болгарок и измерительных приборов.

Все новинки уже доступны для заказа на сайте и в наших торговых центрах.`,
    image: "/images/news1.png",
    date: "1 октября 2023",
  },
  {
    id: 3,
    slug: "elektronnaya-karta-skidok",
    type: "news",
    title: "Электронная карта скидок",
    excerpt:
      "Покупать у нас стало ещё удобнее: запускаем электронную дисконтную карту.",
    body: `Электронная карта работает так же, как пластиковая: скидка начисляется автоматически при каждой покупке.

Оформить карту можно у кассира в любом нашем магазине.`,
    image: "/images/news2.png",
    date: "21 ноября 2023",
  },
  {
    id: 4,
    slug: "pokupka-v-rassrochku",
    type: "news",
    title: "Покупайте сейчас — платите потом",
    excerpt:
      "Оформите рассрочку онлайн при покупке в интернет-магазине и получите товар сразу.",
    body: `При оформлении заказа выберите оплату в рассрочку и заполните короткую заявку. Решение приходит в течение нескольких минут.

Подробные условия уточняйте у наших менеджеров по телефону 8 800 444 00 65.`,
    image: "/images/news3.png",
    date: "21 ноября 2023",
  },
  {
    id: 5,
    slug: "kak-podgotovit-gazon-k-sezonu",
    type: "blog",
    title: "Как подготовить газон к сезону",
    excerpt:
      "Пока трава только просыпается — самое время подготовить садовую технику.",
    body: `Весной газону нужны три вещи: уборка, аэрация и первая стрижка.

## Что подготовить

- грабли или скарификатор для удаления старой травы;
- аэратор, чтобы корни получали воздух;
- газонокосилку с наточенным ножом.

Первую стрижку делайте, когда трава поднимется до 8–10 см, и срезайте не больше трети высоты.`,
    image: "/images/santexnika.jpg",
    date: "29 апреля 2026",
  },
  {
    id: 6,
    slug: "materialy-dlya-remonta-chek-list",
    type: "blog",
    title: "Чек-лист материалов для ремонта квартиры",
    excerpt:
      "Составили список, который поможет ничего не забыть при закупке материалов.",
    body: `Закупку удобно разделить на этапы: черновые работы, инженерные системы и чистовая отделка.

## Черновые работы

- штукатурка и шпаклевка;
- грунтовка;
- смеси для стяжки пола.

## Чистовая отделка

- краска или обои;
- напольное покрытие;
- плинтусы и пороги.

Берите материалы с запасом 10–15%: так вы избежите разницы в оттенках между партиями.`,
    image: "/images/sss.jpg",
    date: "15 сентября 2023",
  },
];

export const findFallbackPost = (slug: string) =>
  FALLBACK_POSTS.find((p) => p.slug === slug);
