"use client";

import React, { useState } from "react";
import { Plus, Minus, Check } from "lucide-react";

// Savol va javoblar tipi
interface FaqItem {
  question: string;
  answer: string;
}

// Savol va javoblar ro'yxati
const FAQ_ITEMS: FaqItem[] = [
  {
    question:
      "Могу ли я сделать возврат материалов, не использованных в процессе строительства?",
    answer:
      "Да, вы можете вернуть неиспользованные материалы в течение 14 дней при сохранении товарного вида, упаковки и кассового чека.",
  },
  {
    question: "Входит ли в стоимость доставки разгрузка машины?",
    answer:
      "Разгрузка машины оплачивается отдельно. Вы можете добавить услугу разгрузки при оформлении заказа.",
  },
  {
    question:
      "Продаются ли у вас в магазине товары под заказ, которые можно купить только по предоплате?",
    answer:
      "Да, некоторые категории эксклюзивных товаров или большого объема поставляются по частичной или полной предоплате.",
  },
  {
    question: "Какая минимальная сумма заказа?",
    answer:
      "Минимальная сумма заказа для оформления доставки составляет 1 000 рублей. Для самовывоза ограничений нет.",
  },
  {
    question: "Есть ли у вас бесплатная доставка?",
    answer:
      "Бесплатная доставка действует при покупке на сумму от 30 000 рублей в пределах городской черты.",
  },
  {
    question:
      "Есть ли возможность оформить рассрочку или кредит при покупке? Если есть, то какие условия?",
    answer:
      "Система кредитования и рассрочки действует в организации при обращении к кредитным специалистам, которые оформят вам договор по предложенным кредитным продуктам от банка, в который будет подана заявка.",
  },
  {
    question: "Возможно ли проверить инструмент или технику перед покупкой?",
    answer:
      "Да, в каждом нашем магазине или пункте выдачи есть специальная зона проверки электроинструмента.",
  },
  {
    question: "Какие дополнительные услуги есть у вас?",
    answer:
      "Мы предоставляем услуги колеровки краски, распила пиломатериалов, подъема на этаж va точного расчета материалов.",
  },
  {
    question: "Как часто у вас проходят акции?",
    answer:
      "Акции и специальные предложения обновляются каждые две недели. Следите за ними на нашем сайте.",
  },
];

export default function FaqPage() {
  // Ochiq turgan savol indeksi (rasmda 5-savol ochiq turgani uchun default: 5)
  const [openIndex, setOpenIndex] = useState<number | null>(5);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans p-4 sm:p-8 lg:p-12">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ==================== CHAP PANAL: SAVOL-JAVOBLAR (FAQ) ==================== */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
            Вопрос-ответ
          </h1>

          <div className="divide-y divide-gray-100">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="py-4">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between gap-4 text-left group"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                      {item.question}
                    </span>

                    {/* Plus/Minus aylana tugma */}
                    <div className="w-8 h-8 rounded-full bg-[#f0f7ff] text-[#0088ff] flex items-center justify-center shrink-0 transition-transform duration-200">
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>

                  {/* Javob matni */}
                  {isOpen && (
                    <div className="mt-3 pr-10">
                      <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed font-normal">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== O'NG PANAL: BANNERLAR VA RASSILKA ==================== */}
        <div className="lg:col-span-1 space-y-5">
          {/* Banner 1: Все для отопления */}
          <div className="relative rounded-2xl overflow-hidden h-44 shadow-sm group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
              alt="Все для отопления"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent p-5 flex flex-col justify-start items-start space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug max-w-[150px]">
                Все для отопления
              </h3>
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
                до -30%
              </span>
            </div>
          </div>

          {/* Banner 2: Лакокрасочные материалы */}
          <div className="relative rounded-2xl overflow-hidden h-44 shadow-sm group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80"
              alt="Лакокрасочные материалы"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent p-5 flex flex-col justify-start items-start space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug max-w-[160px]">
                Лакокрасочные материалы
              </h3>
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
                до -30%
              </span>
            </div>
          </div>

          {/* Obuna bo'lish (Подпишитесь на рассылку) Bloki */}
          <div className="bg-[#f8f9fa] rounded-2xl p-6 space-y-4 text-center">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                Подпишитесь на рассылку
              </h3>
              <p className="text-[11px] text-gray-500 leading-tight">
                Регулярные скидки и спецпредложения, а так же новости компании.
              </p>
            </div>

            {/* Email Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
            />

            {/* Podpisatsya Tugmasi */}
            <button
              type="button"
              className="w-full py-3 bg-[#1976d2] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-colors"
            >
              ПОДПИСАТЬСЯ
            </button>

            {/* Razreshenie Checkbox */}
            <label className="flex items-start gap-2.5 text-left cursor-pointer pt-1">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                  agreed
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {agreed && <Check size={12} strokeWidth={3} />}
              </div>
              <span className="text-[10px] text-gray-400 leading-tight select-none">
                Согласен с обработкой персональных данных в соответствии с
                политикой конфиденциальности
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
