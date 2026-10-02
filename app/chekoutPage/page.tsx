'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, MapPin } from 'lucide-react';

// Types va Data importi
export interface ProductType {
  id: number;
  article: string;
  title: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  badge?: string;
  category: string;
  image: string;
  images?: string[];
  specs?: { label: string; value: string }[];
}

export const productsData: ProductType[] = [
  {
    id: 1,
    article: "XJ89YHGO",
    title: 'Перфоратор универсальный Wander X645-46 GF 1450W',
    price: 12789,
    oldPrice: 15999,
    discount: '-15%',
    category: 'instruments',
    image: '/images/drels.png',
  },
  {
    id: 2,
    article: "XJ89YHGO",
    title: 'Смеситель Faris G-120 для раковины',
    price: 1789,
    discount: '-18%',
    category: 'santehnika',
    image: '/images/rokovina.png',
  },
  {
    id: 3,
    article: "XJ89YHGO",
    title: 'Триммерная леска «Спираль-100»',
    price: 260,
    oldPrice: 310,
    discount: '-10%',
    category: 'garden',
    image: '/images/ip.png',
  },
  {
    id: 4,
    article: "XJ89YHGO",
    title: 'Унитаз подвесной Aragio с двойным сливом',
    price: 12789,
    oldPrice: 15999,
    discount: '-10%',
    category: 'santehnika',
    image: '/images/unitaz.png',
  },
  {
    id: 5,
    article: "XJ89YHGO",
    title: 'Клей для напольных покрытий Porret',
    price: 12789,
    oldPrice: 15999,
    discount: '-10%',
    category: 'home',
    image: '/images/porret.png',
  }
];

export default function CheckoutPage() {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'store' | 'cdek'>('pickup');
  const [paymentType, setPaymentType] = useState<'card' | 'cash' | 'otp' | 'sber'>('card');
  const [agreed, setAgreed] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  // Narxni hisoblash va formatlash (so'm / rubl belgisi bilan)
  const totalPrice = productsData.reduce((acc, item) => acc + item.price, 0);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-slate-800 bg-gray-50/30">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        Оформление заказа
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chap ustun - Forma */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
          
          <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span>Уже есть аккаунт?</span>
            <button className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors">
              Войти
            </button>
          </div>

          {/* Доставка */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Доставка</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-500 pr-10">
                  <option>Городской округ Черкесский</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-blue-500 pr-10">
                  <option>Черкесск</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div
                onClick={() => setDeliveryType('pickup')}
                className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  deliveryType === 'pickup'
                    ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === 'pickup'}
                      onChange={() => setDeliveryType('pickup')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-sm text-gray-900">Самовывоз</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    К вашему приезду заказ будет скомплектован и готов к выдаче.
                  </p>
                </div>

                <div className="mt-4 p-2 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-1.5 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>г. Черкесск, ул.Октябрьская, д.301</span>
                </div>
              </div>

              <div
                onClick={() => setDeliveryType('store')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  deliveryType === 'store'
                    ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryType === 'store'}
                    onChange={() => setDeliveryType('store')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-sm text-gray-900">Доставка магазина</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Если же вам нужна будет доставка к определенному времени, то укажите это в поле для комментариев к заказу.
                </p>
              </div>

              <div
                onClick={() => setDeliveryType('cdek')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  deliveryType === 'cdek'
                    ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryType === 'cdek'}
                    onChange={() => setDeliveryType('cdek')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-sm text-gray-900">СДЭК</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Доставка через сервис СДЭК до ПВЗ или курьером до двери.
                </p>
              </div>
            </div>
          </section>

          {/* Оплата */}
          <section className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Оплата</h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentType === 'card'}
                  onChange={() => setPaymentType('card')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-800">Картой на сайте</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentType === 'cash'}
                  onChange={() => setPaymentType('cash')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-800">Оплата в кассе</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentType === 'otp'}
                  onChange={() => setPaymentType('otp')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-800">
                  Кредит от ОТП банка{' '}
                  <Link href="#" className="text-blue-600 underline underline-offset-2 ml-1">
                    Условия предоставления
                  </Link>
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentType === 'sber'}
                  onChange={() => setPaymentType('sber')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-800">
                  Покупай со Сбером (оформление покупки в кредит){' '}
                  <Link href="#" className="text-blue-600 underline underline-offset-2 ml-1">
                    Условия предоставления
                  </Link>
                </span>
              </label>
            </div>
          </section>

          {/* Промокод */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
            <span>Есть промокод? </span>
            <button
              onClick={() => setShowPromo(!showPromo)}
              className="text-blue-600 underline font-medium hover:text-blue-700"
            >
              Нажмите здесь, чтобы ввести его
            </button>

            {showPromo && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Введите промокод"
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 flex-1"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase hover:bg-blue-700 transition-colors">
                  Применить
                </button>
              </div>
            )}
          </div>

          {/* Ma'lumotlar formasi */}
          <form className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Как вас зовут"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Фамилия <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Введите вашу фамилию"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Название компании
              </label>
              <input
                type="text"
                placeholder="Введите название вашей компании"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Введите ваш email адрес"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">Создать аккаунт</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Комментарий к заказу:
              </label>
              <textarea
                rows={3}
                placeholder="Текстовое поле"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </form>

        </div>

        {/* O'ng ustun - Dynamic `productsData` chiqarish */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 sticky top-6">
          <h2 className="text-xl font-bold text-gray-900">Ваш заказ</h2>

          {/* Mahsulotlar ro'yxati (map orqali) */}
          <div className="space-y-4 divide-y divide-gray-100">
            {productsData.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex items-start gap-3">
                <div className="relative w-16 h-16 rounded-lg bg-gray-50 flex-shrink-0 border border-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">Артикул: {item.article}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">
                    {formatPrice(item.price)}
                  </span>
                  {item.oldPrice && (
                    <p className="text-[10px] text-gray-400 line-through">
                      {formatPrice(item.oldPrice)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic narx hisoblari */}
          <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
            <div className="flex justify-between items-center text-gray-600">
              <span>Сумма</span>
              <span className="border-b border-dotted border-gray-300 flex-1 mx-2"></span>
              <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <span>Доставка</span>
              <span className="border-b border-dotted border-gray-300 flex-1 mx-2"></span>
              <span className="font-semibold text-gray-900">0 ₽</span>
            </div>

            <div className="flex justify-between items-center pt-2 text-base font-bold text-gray-900">
              <span>Итого</span>
              <span className="border-b border-dotted border-gray-300 flex-1 mx-2"></span>
              <span className="text-blue-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Rozilik va buyurtma berish tugmasi */}
          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-[11px] text-gray-400 leading-tight">
                Согласен с обработкой персональных данных в соответствии с политикой конфиденциальности
              </span>
            </label>

            <button
              type="button"
              disabled={!agreed}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-colors shadow-sm"
            >
              ОФОРМИТЬ ЗАКАЗ
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}