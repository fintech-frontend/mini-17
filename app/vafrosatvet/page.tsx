"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useGetFaqQuery } from "@/lib/api/contentApi";
import InfoSidebar from "@/components/InfoSidebar";

// Savol va javoblar tipi
interface FaqItem {
  question: string;
  answer: string;
}

// API bo'sh bo'lsa ko'rsatiladigan savol va javoblar
const FALLBACK_FAQ: FaqItem[] = [
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

  const { data: faqData, isLoading } = useGetFaqQuery();
  const FAQ_ITEMS: FaqItem[] = faqData?.length ? faqData : FALLBACK_FAQ;

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

          {isLoading && (
            <p className="text-sm text-gray-400">Загрузка...</p>
          )}

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
        <InfoSidebar className="lg:col-span-1" />
      </div>
    </div>
  );
}
