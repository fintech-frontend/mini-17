import type {
  ArticleType,
  DeliveryType,
  LeadStatus,
  LeadType,
  OrderStatus,
  PaymentMethod,
  StockStatus,
} from "./types";

// Badge ranglari (brief bo'yicha): yashil — to'langan/yetkazilgan, sariq — kutilmoqda,
// ko'k — jarayonda/yo'lda, qizil — bekor/xato/qaytarish, kulrang — qoralama
export type Tone = "green" | "yellow" | "blue" | "red" | "grey";

// Valyuta: do'kon sahifalari bilan bir xil (₽). UZS kerak bo'lsa — faqat shu yerni o'zgartiring.
export const CURRENCY = "₽";

export const money = (value: string | number | null | undefined) =>
  `${Number(value ?? 0).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ${CURRENCY}`;

export const dateTime = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const dateOnly = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("ru-RU") : "—";

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
  new: { label: "Новый", tone: "yellow" },
  awaiting_payment: { label: "Ожидает оплаты", tone: "yellow" },
  processing: { label: "В обработке", tone: "blue" },
  assembled: { label: "Собран", tone: "blue" },
  shipped: { label: "Отправлен", tone: "blue" },
  ready_for_pickup: { label: "Готов к выдаче", tone: "blue" },
  completed: { label: "Выполнен", tone: "green" },
  cancelled: { label: "Отменён", tone: "red" },
  refunded: { label: "Возврат", tone: "red" },
};

// Buyurtmalar sahifasidagi tablar (brief: Все, Новые, В обработке, Отправлены, Доставлены, Отменённые, Возвраты)
export const ORDER_TABS: { key: string; label: string; status?: OrderStatus }[] = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые", status: "new" },
  { key: "processing", label: "В обработке", status: "processing" },
  { key: "shipped", label: "Отправлены", status: "shipped" },
  { key: "completed", label: "Выполнены", status: "completed" },
  { key: "cancelled", label: "Отменённые", status: "cancelled" },
  { key: "refunded", label: "Возвраты", status: "refunded" },
];

export const PAYMENT_METHOD: Record<PaymentMethod, string> = {
  card: "Картой онлайн",
  on_delivery: "При получении",
  invoice: "Счёт (безнал)",
};

export const DELIVERY_TYPE: Record<DeliveryType, string> = {
  delivery: "Доставка",
  pickup: "Самовывоз",
};

export const STOCK_STATUS: Record<StockStatus, { label: string; tone: Tone }> = {
  in_stock: { label: "В наличии", tone: "green" },
  low_stock: { label: "Мало", tone: "yellow" },
  out_of_stock: { label: "Нет в наличии", tone: "red" },
  on_order: { label: "Под заказ", tone: "blue" },
};

export const LEAD_STATUS: Record<LeadStatus, { label: string; tone: Tone }> = {
  new: { label: "Новая", tone: "yellow" },
  in_progress: { label: "В работе", tone: "blue" },
  done: { label: "Обработана", tone: "green" },
  rejected: { label: "Отклонена", tone: "red" },
};

export const LEAD_TYPE: Record<LeadType, string> = {
  callback: "Обратный звонок",
  price_request: "Запрос цены",
  consultation: "Консультация",
  one_click: "Покупка в 1 клик",
};

export const ARTICLE_TYPE: Record<ArticleType, string> = {
  news: "Новости",
  article: "Статьи",
  blog: "Советы",
};
