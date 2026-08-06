'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCheck } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import chiziq from '../../../public/chiziq.svg';
import { benefits, product, specifications } from "./productD";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";
interface PageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: PageProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isCompare, setIsCompare] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(product.images[0]);

  // Tablar uchun state ('characteristics' | 'about' | 'delivery')
  const [activeTab, setActiveTab] = useState<string>("characteristics");

  const handleAddToCart = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <main className="bg-[#fafafa] min-h-screen text-gray-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
          {product.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT: Rasmlar bo'limi */}
          <div className="md:col-span-2 lg:col-span-5 w-full">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
              <div className="flex sm:flex-col gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl border bg-white overflow-hidden transition-all flex items-center justify-center p-0 ${activeImage === img ? "border-blue-600 ring-2 ring-blue-600/20" : "border-gray-200 hover:border-blue-400"
                      }`}
                    type="button"
                  >
                    <Image
                      src={img}
                      alt=""
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>

              <div className="flex-1 min-h-[280px] sm:min-h-[400px] md:min-h-[450px] lg:h-[540px] rounded-2xl border border-gray-200 bg-white overflow-hidden flex items-center justify-center p-0">
                <Image
                  src={activeImage}
                  alt={product.title}
                  width={520}
                  height={520}
                  priority
                  className="object-cover w-full h-full transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* CENTER: Xususiyatlar va Afzalliklar */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="space-y-2.5 text-xs sm:text-sm">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-500 whitespace-nowrap">{spec.name}</span>
                    <div className="flex-1 border-b border-dotted border-gray-300 mx-2"></div>
                    <span className="font-medium text-gray-900 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>

              <Link
                href="#characteristics"
                onClick={() => setActiveTab("characteristics")}
                className="inline-block mt-4 text-blue-600 hover:underline text-xs sm:text-sm font-medium"
              >
                Больше характеристик
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-base sm:text-lg font-semibold mb-3">
                Наши преимущества
              </h2>

              <div className="space-y-3">
                {benefits.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Icon size={16} />
                      </div>
                      <p className="text-gray-700 text-xs leading-snug">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Narx va Savatcha paneli */}
          <aside className="md:col-span-2 lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm lg:sticky lg:top-6 p-4 sm:p-5 md:p-6 relative">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  Артикул: {product.article}
                </span>
                <div className="flex items-center gap-1.5 text-green-600 text-xs sm:text-sm font-medium">
                  <FaCheck size={12} />
                  <span>В наличии</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 md:mt-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  {product.price.toLocaleString()} ₽
                </h2>
                {product.oldPrice && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-base sm:text-lg line-through text-gray-400">
                      {product.oldPrice.toLocaleString()} ₽
                    </span>
                    <span className="bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded">
                      {product.discount}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 sm:mt-5 md:mt-6">
                <p className="font-medium text-sm mb-2.5">Количество</p>
                <div className="flex items-center justify-between border border-gray-200 rounded-xl h-11 sm:h-12 bg-gray-50/50">
                  <button
                    onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                    className="w-11 sm:w-12 h-full text-xl hover:bg-gray-100 rounded-l-xl flex items-center justify-center text-gray-600 transition"
                    type="button"
                  >
                    -
                  </button>
                  <span className="text-base font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-11 sm:w-12 h-full text-xl hover:bg-gray-100 rounded-r-xl flex items-center justify-center text-gray-600 transition"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 md:mt-6 space-y-2.5 sm:space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full h-11 sm:h-12 md:h-13 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm active:scale-[0.98]"
                  type="button"
                >
                  ДОБАВИТЬ В КОРЗИНУ
                </button>
                <button
                  className="w-full h-11 sm:h-12 md:h-13 rounded-xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50 text-blue-600 font-semibold text-sm transition"
                  type="button"
                >
                  Купить в 1 клик
                </button>
              </div>

              <div className="border-t border-gray-100 mt-4 sm:mt-5 pt-4 flex items-center justify-between text-xs sm:text-sm">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition group"
                  type="button"
                >
                  <FiHeart
                    size={16}
                    className={`transition-colors ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                  />
                  <span className={isFavorite ? "text-red-500 font-medium" : ""}>
                    {isFavorite ? "В избранном" : "В избранное"}
                  </span>
                </button>

                <button
                  onClick={() => setIsCompare(!isCompare)}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition group"
                  type="button"
                >
                  <Image
                    src={chiziq}
                    alt='chiziq'
                    className={`w-4 h-4 object-contain transition-all ${isCompare ? "brightness-50 contrast-200" : ""}`}
                  />
                  <span className={isCompare ? "text-blue-600 font-medium" : ""}>
                    {isCompare ? "В сравнении" : "Сравнить"}
                  </span>
                </button>
              </div>
            </div>
          </aside>

          {/* Toast Notification */}
          <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-2xl transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"}`}>
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
              <FaCheck size={14} />
            </div>
            <div>
              <p className="text-sm font-medium">Товар добавлен в корзину</p>
              <p className="text-xs text-gray-400">Количество: {quantity} шт.</p>
            </div>
          </div>
        </div>

        {/* Tab menyu (Sarlavha qismi) */}
        <div className="mt-8 sm:mt-10 lg:mt-12" id="characteristics">
          <ul className="flex items-center gap-5 sm:gap-8 text-sm sm:text-base md:text-lg mb-6 border-b border-gray-200 pb-3 overflow-x-auto whitespace-nowrap">
            <li>
              <button
                onClick={() => setActiveTab("characteristics")}
                className={`relative pb-1 font-medium transition-colors ${activeTab === "characteristics" ? "text-gray-900" : "text-gray-500 hover:text-gray-800"
                  }`}
                type="button"
              >
                Характеристики
                {activeTab === "characteristics" && (
                  <span className="absolute left-0 -bottom-3 w-full h-[3px] bg-amber-400 rounded-full" />
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("about")}
                className={`relative pb-1 font-medium transition-colors ${activeTab === "about" ? "text-gray-900" : "text-gray-500 hover:text-gray-800"
                  }`}
                type="button"
              >
                О товаре
                {activeTab === "about" && (
                  <span className="absolute left-0 -bottom-3 w-full h-[3px] bg-amber-400 rounded-full" />
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("delivery")}
                className={`relative pb-1 font-medium transition-colors ${activeTab === "delivery" ? "text-gray-900" : "text-gray-500 hover:text-gray-800"
                  }`}
                type="button"
              >
                Доставка и оплата
                {activeTab === "delivery" && (
                  <span className="absolute left-0 -bottom-3 w-full h-[3px] bg-amber-400 rounded-full" />
                )}
              </button>
            </li>
          </ul>
        </div>

        {/* 1. Характеристики (Xususiyatlar moduli) */}
        {activeTab === "characteristics" && (
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              Характеристики товара «{product.title}»
            </h2>
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <div className="bg-white w-full rounded-xl border border-gray-200 p-4 mt-5">
                <div className="space-y-2.5 text-xs sm:text-sm">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-gray-500 whitespace-nowrap">{spec.name}</span>
                      <div className="flex-1 border-b border-dotted border-gray-300 mx-2"></div>
                      <span className="font-medium text-gray-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white w-full rounded-xl border border-gray-200 p-4 mt-5">
                <div className="space-y-2.5 text-xs sm:text-sm">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-gray-500 whitespace-nowrap">{spec.name}</span>
                      <div className="flex-1 border-b border-dotted border-gray-300 mx-2"></div>
                      <span className="font-medium text-gray-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. О товаре (Mahsulot haqida ma'lumot moduli) */}
        {activeTab === "about" && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mt-5">
            <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-5">
              О товаре «{product.title}»
            </h2>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-stretch">
              {/* Rasm qismi — mobil/tabletda tepada, desktopda o'ngda */}
              <div className="w-full lg:w-[380px] flex-shrink-0 order-1 lg:order-2">
                <div className="relative h-56 sm:h-72 md:h-80 lg:h-full lg:min-h-[380px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Matn qismi */}
              <div className="flex-1 text-sm text-gray-700 leading-relaxed space-y-4 order-2 lg:order-1">
                <p>
                  Аккумуляторная дрель-шуруповерт <strong>{product.title}</strong> используется
                  при сборке мебели, выполнении ремонтных и отделочных работ в зданиях и на
                  улице. Двухскоростной редуктор упрощает ведение различных работ: первая
                  скорость предназначена для заворачивания шурупов, вторая — для сверления.
                  Литий-ионная технология увеличивает срок службы аппарата и позволяет
                  заряжать аккумулятор вне зависимости от степени его разрядки. Модель
                  работает с батареями серии G.
                </p>

                <p>
                  {product.title} — в нашем интернет-магазине можно приобрести с
                  дополнительной выгодой:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>оплата бонусами до 30% от стоимости товара для владельцев бонусных карт;</li>
                  <li>следите за регулярными акциями и распродажами при покупке онлайн!</li>
                </ul>

                <p>
                  Аккумуляторный шуруповерт {product.title} — отличный надежный инструмент
                  для профессионального и бытового использования. Аккумуляторы Li-ion, от
                  которых питается инструмент, обеспечивают полную автономную и длительную
                  работу на одной зарядке.
                </p>

                <p>
                  <strong>Особенности модели:</strong> шуруповерт оснащен мощным двигателем
                  с электронной регулировкой частоты вращения и прочным пылезащищенным
                  редуктором с металлическими шестернями; высокий крутящий момент (30 Нм) с
                  регулировкой величины 16 ступеней + D обеспечивает сверление с
                  максимальным диаметром в дереве до 36 мм, в стали — до 13 мм; для быстрой
                  установки насадки используется БЗП патрон; электроинструмент имеет функцию
                  реверса с удобной кнопкой переключения; двигатель шуруповерта снабжен
                  тормозом; девайс работает от 14,4 В аккумулятора типа Li-ion, с полной
                  зарядкой батареи 1,3 Ач в течение одного часа; электронная система защиты
                  отключает аккумулятор при перегрузке;
                </p>

                <p>
                  Оформить заказ довольно просто — положите товар в корзину или позвоните
                  по телефону <strong>8 800 444 00 65</strong> и наши консультанты Вам
                  помогут!
                </p>

                <p className="text-gray-500 text-xs">
                  Обратите внимание! Изображение товара, представленного на фото, может
                  незначительно отличаться от его фактического вида.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Доставка и оплата (Yetkazib berish va to'lov moduli) */}
        {activeTab === "delivery" && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mt-5 space-y-6 sm:space-y-8">

            {/* Доставка */}
            <div>
              <h2 className="text-base sm:text-lg font-bold mb-3">Доставка</h2>
              <div className="text-sm text-gray-700 leading-relaxed space-y-1 mb-3">
                <p>Мы всегда готовы доставить приобретенный Вами товар в удобное для Вас время.</p>
                <p>
                  <strong>Стоимость доставки</strong> товаров определяется исходя из{" "}
                  <strong>веса</strong>, <strong>габаритов</strong> и <strong>удаленности</strong>{" "}
                  до места назначения. Доставка осуществляется до подъезда дома, офиса.
                </p>
                <p>Наш интернет-магазин предлагает несколько вариантов получения товара:</p>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  Самовывоз с территории компании.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  Быстрая доставка по Карачаево-Черкесской республике.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  Доставка транспортной компанией.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  Почтой России.
                </li>
              </ul>
            </div>

            {/* Оплата */}
            <div>
              <h2 className="text-base sm:text-lg font-bold mb-3">Оплата</h2>
              <p className="text-sm text-gray-700 mb-2">Оплатить свои покупки вы можете:</p>

              <div className="text-sm text-gray-700 space-y-3">
                <div>
                  <p className="font-semibold">- При заказе доставки:</p>
                  <p className="font-semibold mt-1">1. Банковской картой с помощью платежной системы на сайте</p>
                  <ul className="mt-2 space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      МИР
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      VISA International
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      Mastercard Worldwide
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      JCB
                    </li>
                  </ul>
                </div>

                <p className="font-semibold">2. Наличными водителю при получение заказа</p>

                <div>
                  <p className="font-semibold">- При самовывозе:</p>
                  <ul className="mt-2 space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      Банковской картой с помощью платежной системы на сайте или на кассе при получении заказа.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      Наличными на кассе при получении заказа
                    </li>
                  </ul>
                </div>

                <p className="font-semibold">- Сервис «Покупай со сбером»</p>
              </div>
            </div>

          </div>
        )}
        <h2 className="text-xs sm:text-[15px] mt-8 sm:mt-10 text-gray-600 leading-relaxed">
          Производитель оставляет за собой право без уведомления продавца менять характеристики, внешний вид, комплектацию товара и место его производства. Указанная информация не является публичной офертой.
        </h2>

        {/* Похожие товары */}
        <div className="mt-10 sm:mt-14">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5">Похожие товары</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}