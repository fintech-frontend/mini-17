"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";

// Rasmdagi sharhlar ma'lumotlari (1:1)
const REVIEWS_DATA = [
  {
    id: 1,
    name: "Оксана Гончарова",
    date: "2.01.2022",
    text: "Просто НАИВЫСШИЙ балл магазин! Огромный ассортимент, демократичные цены, вежливая поддержка, персонал высочайшей квалификации от работников склада до руководства! Надежный, ответственный и порядочный партнер.",
  },
  {
    id: 2,
    name: "Шерифат Акбаров",
    date: "2.01.2022",
    text: "Брал не раз, рекомендую!",
  },
  {
    id: 3,
    name: "MimiClick",
    date: "16.09.2022",
    text: "Всегда под заказ беру здесь. Ассортимент большой. Удобно расположены. Есть доставка. Есть накопительные скидки по карте. Есть грузчики, которые всегда помогут все погрузить.",
  },
  {
    id: 4,
    name: "Василий",
    date: "16.06.2022",
    text: "Очень рад, что наткнулся на этот интернет-магазин строительных материалов! У них огромный выбор товаров, и цены приемлемые. Заказывал здесь материалы для ремонта здания, и доставка была быстрой и без каких-либо проблем. К тому же, клиентская поддержка отвечает оперативно на все вопросы. Обязательно буду советовать этот магазин друзьям и снова воспользуюсь его услугами.",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: 5,
    name: "Марина",
    date: "21.10.2022",
    text: "Большой выбор товаров, вежливый персонал, доступный ценовой сегмент на стройматериалы, удобное месторасположение, парковка.",
  },
  {
    id: 6,
    name: "Иван",
    date: "16.06.2022",
    text: "Как профессиональный строитель, я всегда ищу надежных поставщиков строительных материалов, и этот магазин – один из них. Здесь есть всё, что нужно для стройки: от кирпича и цемента до сантехники и электроинструментов. Качество товаров всегда на высоте, а цены конкурентоспособные. Доставка всегда приходит вовремя, что крайне важно при больших проектах. С удовольствием рекомендую этот магазин всем, кто занимается строительством.",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: 7,
    name: "Евгений",
    date: "14.06.2022",
    text: "Мой опыт работы с интернет-магазином строительных материалов был крайне успешным. Они предлагают не только широкий выбор стандартных стройматериалов, но и креативные решения для дизайна интерьера. Я нашел здесь уникальные отделочные материалы, которые сделали мои проекты уникальными. Оформление заказа простое, и доставка была очень быстрой. Этот магазин действительно помог мне воплотить свои дизайнерские идеи в жизнь.",
  },
  {
    id: 8,
    name: "Евгений",
    date: "14.06.2022",
    text: "Для меня, как начинающего строителя, важно иметь доступ к надежным поставкам строительных материалов. Этот интернет-магазин помог мне не только выбрать правильные материалы, но и дал советы по их применению. Цены очень доступные, и даже при ограниченном бюджете я смог найти все необходимое. Доставка была быстрой и без проблем. Спасибо этому магазину за поддержку и начинающим строителям!",
  },
];

export default function ReviewsPage() {
  const [activeSort, setActiveSort] = useState<"new" | "old">("new");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Forma ma'lumotlari
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    review: "",
    agree: false,
  });

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full bg-white min-h-screen py-8 px-4 md:px-12 font-sans text-slate-800">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Sarlavha */}
        <h1 className="text-3xl font-extrabold mb-6 text-slate-900">Отзывы</h1>

        {/* Asosiy Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Chap Tomon: Sharhlar va Forma (8 / 12 qism) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Sort/Filter Tablar */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveSort("new")}
                className={`px-3.5 py-1.5 text-[11px] font-medium rounded-sm border transition-all ${
                  activeSort === "new"
                    ? "bg-[#0066ff] text-white border-[#0066ff]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Сначала новые
              </button>
              <button
                onClick={() => setActiveSort("old")}
                className={`px-3.5 py-1.5 text-[11px] font-medium rounded-sm border transition-all ${
                  activeSort === "old"
                    ? "bg-[#0066ff] text-white border-[#0066ff]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Сначала старые
              </button>
            </div>

            {/* Sharhlar Ro'yxati */}
            <div className="space-y-6 border-b border-gray-100 pb-8">
              {REVIEWS_DATA.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <h3 className="text-xs font-bold text-slate-900 mb-0.5">{item.name}</h3>
                  <span className="text-[10px] text-gray-400 block mb-2">{item.date}</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed max-w-2xl font-normal">
                    {item.text}
                  </p>

                  {/* Agar rasm bo'lsa */}
                  {item.images && (
                    <div className="flex gap-2 mt-3">
                      {item.images.map((img, i) => (
                        <div key={i} className="w-16 h-16 rounded overflow-hidden border border-gray-200">
                          <img src={img} alt="review attachment" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* --- PAGINATSIYA (Rasmdagidek) --- */}
            <div className="flex items-center justify-center gap-1.5 pt-4 pb-12 text-xs">
              
              {/* ← Назад */}
              <button
                onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
                className="px-2.5 py-1.5 border border-gray-200 rounded text-[11px] text-gray-600 hover:bg-gray-50 flex items-center gap-1"
              >
                <span>←</span> Назад
              </button>

              {/* 1, 2, 3, 4, 5 */}
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageClick(num)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-[11px] font-medium ${
                    currentPage === num
                      ? "bg-[#0b1727] text-white font-bold"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {num}
                </button>
              ))}

              {/* ... */}
              <span className="px-1 text-gray-400 text-[11px]">...</span>

              {/* 231 */}
              <button
                onClick={() => handlePageClick(231)}
                className={`w-8 h-7 flex items-center justify-center rounded border border-gray-200 text-[11px] text-gray-700 hover:bg-gray-50 ${
                  currentPage === 231 ? "bg-[#0b1727] text-white font-bold" : ""
                }`}
              >
                231
              </button>

              {/* Далее → */}
              <button
                onClick={() => handlePageClick(currentPage + 1)}
                className="px-2.5 py-1.5 border border-gray-200 rounded text-[11px] text-gray-600 hover:bg-gray-50 flex items-center gap-1"
              >
                Далее <span>→</span>
              </button>

            </div>

            {/* --- FORMA: Оставить отзыв --- */}
            <div className="pt-2">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Оставить отзыв</h2>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4 max-w-2xl">
                
                {/* Ism va Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">
                      Ваше имя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Введите ваше имя"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-[11px] bg-[#f8f9fa] border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Введите ваш электронный адрес"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-[11px] bg-[#f8f9fa] border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Sharh matni */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Текст отзыва <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ваш отзыв"
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    className="w-full px-3 py-2 text-[11px] bg-[#f8f9fa] border border-gray-200 rounded focus:outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                </div>

                {/* Photo upload zone */}
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Прикрепить фото</label>
                  <div className="w-full h-20 border border-dashed border-gray-200 rounded bg-[#f8f9fa] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-colors">
                    <Upload className="text-gray-300 mb-1" size={16} />
                    <span className="text-[10px] text-gray-400">
                      Нажмите для загрузки или перетащите файл сюда
                    </span>
                  </div>
                </div>

                {/* Tugma va Rozilik Checkbox */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1976d2] hover:bg-blue-700 text-white font-medium text-[11px] rounded transition-colors shadow-sm"
                  >
                    ОТПРАВИТЬ
                  </button>

                  <label className="flex items-start gap-2 cursor-pointer max-w-xs">
                    <input
                      type="checkbox"
                      checked={formData.agree}
                      onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                      className="mt-0.5 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-[9px] text-gray-400 leading-tight">
                      Согласен на обработку персональных данных в соответствии с{" "}
                      <a href="#" className="underline">
                        политикой конфиденциальности
                      </a>
                    </span>
                  </label>
                </div>

              </form>
            </div>

          </div>

          {/* O'ng Tomon: Sidebar (4 / 12 qism) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Banner 1 */}
            <div className="bg-[#e2d5c3] rounded-md p-4 relative overflow-hidden h-36 flex flex-col justify-between">
              <div className="z-10 max-w-[130px]">
                <h4 className="text-xs font-extrabold text-slate-800 leading-tight mb-2">
                  Всё для отопления
                </h4>
                <span className="inline-block bg-[#0b1727] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                  до -50%
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80"
                alt="Отопление"
                className="absolute right-0 bottom-0 w-32 h-full object-cover mix-blend-multiply opacity-80"
              />
            </div>

            {/* Banner 2 */}
            <div className="bg-[#cbd5e1] rounded-md p-4 relative overflow-hidden h-36 flex flex-col justify-between">
              <div className="z-10 max-w-[140px]">
                <h4 className="text-xs font-extrabold text-slate-800 leading-tight mb-2">
                  Лакокрасочные материалы
                </h4>
                <span className="inline-block bg-[#0b1727] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                  до -30%
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80"
                alt="Лакокрасочные"
                className="absolute right-0 bottom-0 w-32 h-full object-cover mix-blend-multiply opacity-80"
              />
            </div>

            {/* Obuna Card */}
            <div className="bg-[#f8f9fa] rounded-md p-5 text-center border border-gray-100">
              <h4 className="text-xs font-bold text-slate-900 mb-1">Подпишитесь на рассылку</h4>
              <p className="text-[9px] text-gray-400 mb-3 leading-snug">
                Регулярные акции, скидки и предложения, а также новости компании.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-1.5 text-[11px] bg-white border border-gray-200 rounded focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#1976d2] hover:bg-blue-700 text-white font-bold text-[10px] rounded transition-colors"
                >
                  ПОДПИСАТЬСЯ
                </button>

                <label className="flex items-start gap-1.5 text-left pt-1 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 border-gray-300" />
                  <span className="text-[8px] text-gray-400 leading-tight">
                    Согласен на обработку персональных данных в соответствии с{" "}
                    <a href="#" className="underline">
                      политикой конфиденциальности
                    </a>
                  </span>
                </label>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}