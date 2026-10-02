"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Куда обращаться в случае поломки в течении гарантийного срока? qqichi doi veuve wv weur urwuru3v  u32yy3yy3 v y3  y32 v 3y2 iivyv  ozbekistonlik man sanchi nima qivossan chu misan nia qima  qiiandsn ogzinga berib qoyaman tushundingmi ",
    answer:
      "Обратитесь в ближайший склад или ТЦ Стройопттрг с товаром и документом, подтверждающим покупку.",
  },
  {
    question: "Куда обращаться в случае поломки в течении гарантийного срока?",
    answer: "Проводится платная диагностика и ремонт товара",
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

function FaqAccordionItem({ item, defaultOpen = false }: { item: FaqItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-200 last:border-b">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[15px] font-semibold text-gray-900"
      >
        <span>{item.question}</span>
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-50 text-lg leading-none text-blue-600">
          {open ? "–" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-1 pb-5 text-sm text-gray-500">{item.answer}</div>
      )}
    </div>
  );
}

export default function VozvratPage() {
  return (
    <div className="mx-auto max-w-295 px-6 py-6 pb-16">
      {/* Breadcrumbs */}
      <div className="mb-5 text-[13px] text-gray-500">
        <a href="#" className="hover:text-gray-700">
          Стройопттрг
        </a>{" "}
        / <span className="text-gray-900">Возврат</span>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div>
          <h1 className="mb-6 text-4xl font-extrabold text-gray-900">Возврат</h1>

          <p className="mb-4 text-[15px] text-gray-700">
            Возврат или обмен товара надлежащего качества, возможен в течение 14 дней с
            момента покупки в соответствии со ст.26.1 Закона «О защите прав потребителей»,
            сохранивший товарный вид и потребительские свойства при наличии документов:
          </p>

          <ul className="mb-5 list-disc space-y-1.5 pl-5 marker:text-blue-600">
            <li className="text-[15px] text-gray-700">
              подтверждающих покупку и оплату товара;
            </li>
            <li className="text-[15px] text-gray-700">
              документа подтверждающего личность.
            </li>
          </ul>

          <p className="mb-4 text-[15px] text-gray-700">
            Для этого достаточно приехать в часы работы наших складов и ТЦ и оформить
            возврат.
          </p>

          <p className="mb-4 text-[15px] text-gray-700">
            Возврат товара возможен без упаковки, но при условии сохранения всей
            комплектации и потребительских свойств товара.
          </p>

          <p className="mb-4 text-[15px] text-gray-700">
            Возврат денежных средств за товар оплаченных банковской картой,
            осуществляется на ту же карту.
          </p>

          <p className="mb-4 text-[15px] text-gray-700">
            При заказе товара с доставкой вы можете отказаться от заказа до его передачи.
            Если же машина с вашим заказом уже выехала на адрес, мы вернём вам стоимость
            товара за исключением расходов на доставку.
          </p>

          <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">
            Ограничения по возврату товара
          </h2>

          <p className="mb-4 text-[15px] text-gray-700">
            Мы не принимаем на возврат товары, имеющие индивидуально-определенные
            свойства, если указанный товар может быть использован исключительно
            потребителем, который купил его.
          </p>

          <p className="mb-4 text-[15px] text-gray-700">
            Например, товары под заказ, колерованная краска, строительные и отделочные
            материала отпускаемые на метраж, уцененный товар, а так же все виды заказного
            материала.
          </p>

          <h2 className="mb-4 mt-8 text-xl font-bold text-gray-900">
            Обращение по гарантии
          </h2>

          <div>
            {faqItems.map((item, i) => (
              <FaqAccordionItem key={i} item={item} defaultOpen={i > 0} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          <div className="relative flex h-45 items-end overflow-hidden rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 p-5">
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="mb-2 text-lg font-bold leading-snug text-white">
                Все для отопления
              </h3>
              <span className="inline-block rounded bg-gray-900 px-2.5 py-1 text-xs font-bold text-white">
                до -30%
              </span>
            </div>
          </div>

          <div className="relative flex h-45 items-end overflow-hidden rounded-xl bg-gradient-to-br from-[#cdc6b8] to-[#a9a396] p-5">
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
            <div className="relative z-10">
              <h3 className="mb-2 text-lg font-bold leading-snug text-gray-900">
                Лакокрасочные материалы
              </h3>
              <span className="inline-block rounded bg-gray-900 px-2.5 py-1 text-xs font-bold text-white">
                до -30%
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-gray-100 p-5">
            <h4 className="mb-2 text-base font-semibold text-gray-900">
              Подпишитесь на рассылку
            </h4>
            <p className="mb-3.5 text-[13px] text-gray-500">
              Регулярные скидки и спецпредложения, а так же новости компании.
            </p>
            <input
              type="email"
              placeholder="Email"
              className="mb-3 w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            <button
              type="button"
              className="w-full rounded-md bg-blue-600 py-3 text-[13px] font-bold tracking-wide text-white hover:bg-blue-700"
            >
              ПОДПИСАТЬСЯ
            </button>
            <label className="mt-3 flex items-start gap-2 text-[11.5px] text-gray-500">
              <input type="checkbox" className="mt-0.5" />
              <span>
                Согласен с обработкой персональных данных в соответствии с политикой
                конфиденциальности
              </span>
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}