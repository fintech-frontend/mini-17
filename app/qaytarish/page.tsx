"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import InfoSidebar from "@/components/InfoSidebar";
import { styles } from "@/styles/index.styles";

const WARRANTY_FAQ = [
  {
    question: "Куда обращаться в случае поломки в течении гарантийного срока?",
    answer:
      "Обратитесь в ближайший склад или ТЦ «Стройоптторг» с товаром и документом, подтверждающим покупку. Товар будет направлен в авторизованный сервисный центр.",
  },
  {
    question: "Куда обращаться в случае поломки после гарантийного срока?",
    answer: "Проводится платная диагностика и ремонт товара.",
  },
  {
    question: "Есть ли гарантийный ремонт?",
    answer:
      "Да, гарантийный ремонт осуществляется в соответствии с условиями, указанными в гарантийном талоне на товар.",
  },
  {
    question: "Какой срок действия гарантии?",
    answer:
      "Срок гарантии зависит от вида товара и указывается производителем в гарантийном талоне или на упаковке.",
  },
];

export default function ReturnPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <section className={`${styles.container} px-4 sm:px-6 md:px-8 py-6 sm:py-8`}>
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
        <Link href="/" className="hover:text-[#005bff]">
          Стройоптторг
        </Link>
        <span>/</span>
        <span className="text-gray-600">Возврат</span>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-[33px] font-bold text-[#2C333D] mb-6">
        Возврат
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
        <article className="space-y-3 text-xs sm:text-[13px] text-gray-600 leading-relaxed">
          <p>
            Возврат или обмен товара надлежащего качества, возможен в течение 14
            дней с момента покупки в соответствии со ст.26.1 Закона «О защите
            прав потребителей», сохранивший товарный вид и потребительские
            свойства при наличии документов:
          </p>
          <ul className="space-y-2.5 my-3">
            {[
              "подтверждающих покупку и оплату товара;",
              "документа подтверждающего личность.",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            Для этого достаточно приехать в часы работы наших складов и ТЦ и
            оформить возврат.
          </p>
          <p>
            Возврат товара возможен без упаковки, но при условии сохранения всей
            комплектации и потребительских свойств товара.
          </p>
          <p>
            Возврат денежных средств за товар оплаченных банковской картой,
            осуществляется на ту же карту.
          </p>
          <p>
            При заказе товара с доставкой вы можете отказаться от заказа до его
            передачи. Если же машина с вашим заказом уже выехала на адрес, мы
            вернем вам стоимость товара за исключением расходов на доставку.
          </p>

          <p className="font-semibold text-gray-900 pt-2">
            Ограничения по возврату товара
          </p>
          <p>
            Мы не принимаем на возврат товары, имеющие индивидуально-определенные
            свойства, если указанный товар может быть использован исключительно
            потребителем, который купил его.
          </p>
          <p>
            Например, товары под заказ, колерованная краска, строительные и
            отделочные материалы отпускаемые на метраж, уцененный товар, а так же
            все виды заказного материала.
          </p>

          {/* Kafolat bo'yicha savollar */}
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 pt-4">
            Обращение по гарантии
          </h2>
          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {WARRANTY_FAQ.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.question} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 text-left group"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                      {item.question}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-[#f0f7ff] text-[#0088ff] flex items-center justify-center shrink-0">
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 pr-10 text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </article>

        {/* O'ng panel: bannerlar va rassilka */}
        <InfoSidebar />
      </div>
    </section>
  );
}
