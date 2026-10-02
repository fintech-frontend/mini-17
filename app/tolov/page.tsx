"use client";

import Image from "next/image";
import Link from "next/link";
import SubscribeBox from "@/components/SubscribeBox";
import { useGetPromotionsQuery } from "@/lib/api/promoApi";
import { mapPromotion } from "@/lib/api/mappers";
import { promos as staticPromos } from "@/lib/heroDta";

const CARDS = ["МИР", "VISA International", "Mastercard Worldwide", "JCB"];

const SBER_REQUIREMENTS = [
  "Гражданство: Российская Федерация",
  "Возраст на момент предоставления кредита: не менее 21 года.",
  "Возраст на момент возврата кредита по договору: не более 70 лет.",
  "Использование сервиса Банка: держатель дебетовой банковской карты, выпущенной Банком, заключивший с Банком Договор банковского обслуживания, а также подключившийся к услуге «Мобильный банк» и системе Сбербанк Онлайн.",
  "Регистрация: наличие постоянной (временной) регистрации по месту жительства/пребывания на территории Российской Федерации.",
];

const SBER_BENEFITS = [
  "Без первоначального взноса.",
  "Срок действия кредита: от 3 до 36 месяцев.",
  "Сумма кредита от 3000 до 300 000 руб.",
];

const SBER_STEPS = [
  "Выберите на сайте товар, нажмите «Добавить в корзину», далее перейдите на страницу «Корзина», щелкнув по ее значку в полосе верхнего меню.",
  "На странице «Корзина» нажмите кнопку «Оформить заказ».",
  "В блоке «Оплата» выберите способ оплаты «Покупай со Сбером» (оформление покупки в кредит).",
  "Заполните все обязательные поля, отмеченные знаком «*».",
  "Когда откроется Сбербанк Онлайн, авторизуйтесь и заполните заявку. Рассмотрение заявки займет не более 2-х минут.",
  "Если кредит одобрен, деньги за покупку автоматически будут перечислены на счет ООО «Стройоптторг».",
  "Далее Вы выбираете комфортный способ и время доставки или самовывоза.",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 my-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-1.75 w-1.5 h-1.5 shrink-0 rounded-full bg-red-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-8 mb-3">{children}</h2>;
}

export default function PaymentPage() {
  // GET /promotions/ — o'ng tarafdagi bannerlar (bo'sh bo'lsa statik)
  const { data } = useGetPromotionsQuery();
  const sidePromos = data?.length
    ? data.slice(0, 2).map(mapPromotion)
    : staticPromos.filter((p) => p.id === 4 || p.id === 2).reverse();

  return (
    <div className="w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Навигация" className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Стройоптторг
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-400">Способы оплаты</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#2C333D] mb-6">
        Способы оплаты
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-12 items-start">
        {/* Asosiy matn */}
        <article className="text-[13px] sm:text-sm text-gray-700 leading-relaxed min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">При заказе доставки</h2>
          <p>
            Банковской картой с помощью платежной системы на сайте. При оформлении заказа в разделе
            Оплата мы переадресуем Вас на платежную страницу системы, где необходимо будет указать
            реквизиты вашей банковской карты (номер, дата окончания действия карты, имя владельца).
            После ввода всех необходимых данных нажмите кнопку «Оплатить».
          </p>
          <p className="mt-3">
            Для выбора оплаты товара с помощью банковской карты на соответствующей странице
            необходимо нажать кнопку Оплата заказа банковской картой. Оплата происходит через ПАО
            СБЕРБАНК с использованием банковских карт следующих платёжных систем:
          </p>
          <BulletList items={CARDS} />
          <p>
            <strong className="text-gray-900">Наличными</strong> водителю при получении заказа.
          </p>
          <p className="mt-3">
            Наш менеджер позвонит вам и договорится об удобном для вас времени получения заказа.
            Скомплектованный заказ будет ждать вас на складе.
          </p>
          <p className="mt-3">
            Стоимость доставки определяется в зависимости от габаритов и удаленности до места
            назначения и дополнительно включается в заказ.
          </p>

          <SectionTitle>При самовывозе</SectionTitle>
          <BulletList
            items={[
              "Банковской картой с помощью платежной системы на сайте или на кассе при получении заказа.",
              "Наличными на кассе при получении заказа.",
              "При получении заказа просим Вас внимательно осмотреть товар, проверить его на предмет наличия внешних дефектов и комплектацию.",
            ]}
          />

          <SectionTitle>Сервис «Покупай со Сбером»</SectionTitle>
          <h3 className="font-semibold text-gray-900 mt-4">Основные требования:</h3>
          <BulletList items={SBER_REQUIREMENTS} />
          <h3 className="font-semibold text-gray-900 mt-5">Преимущества Сервиса:</h3>
          <BulletList items={SBER_BENEFITS} />
          <h3 className="font-semibold text-gray-900 mt-5">Необходимые действия:</h3>
          <BulletList items={SBER_STEPS} />
          <p className="mt-4">
            Ознакомиться подробнее с условиями кредитования можно по ссылке —{" "}
            <a
              href="https://pokupay.ru/credit_terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-700"
            >
              https://pokupay.ru/credit_terms
            </a>
          </p>

          <SectionTitle>Возврат товара</SectionTitle>
          <p>
            Срок возврата товара надлежащего качества составляет 30 дней с момента получения
            товара. Возврат переведённых средств, производится на ваш банковский счёт в течение
            5-30 рабочих дней (срок зависит от банка, который выдал вашу банковскую карту).
          </p>

          <SectionTitle>Описание процесса передачи данных</SectionTitle>
          <p>
            Для оплаты (ввода реквизитов Вашей карты) Вы будете перенаправлены на платёжный шлюз
            ПАО СБЕРБАНК. Соединение с платёжным шлюзом и передача информации осуществляется в
            защищённом режиме с использованием протокола шифрования SSL. В случае если Ваш банк
            поддерживает технологию безопасного проведения интернет-платежей Verified By Visa,
            MasterCard SecureCode, MIR Accept, J-Secure для проведения платежа также может
            потребоваться ввод специального пароля.
          </p>
          <p className="mt-3">
            Настоящий сайт поддерживает 256-битное шифрование. Конфиденциальность сообщаемой
            персональной информации обеспечивается ПАО СБЕРБАНК. Введённая информация не будет
            предоставлена третьим лицам за исключением случаев, предусмотренных законодательством
            РФ. Проведение платежей по банковским картам осуществляется в строгом соответствии с
            требованиями платёжных систем МИР, Visa Int., MasterCard Europe Sprl, JCB.
          </p>
        </article>

        {/* O'ng tomon: aksiyalar va obuna */}
        <aside className="space-y-4 lg:sticky lg:top-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {sidePromos.map((promo) => (
              <Link
                key={promo.id}
                href={`/aksiya/${promo.slug ?? promo.id}`}
                className="relative block h-44 sm:h-52 rounded-md overflow-hidden group"
              >
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-lg font-semibold text-gray-900 leading-tight drop-shadow-sm">
                    {promo.title}
                  </p>
                  <span className="inline-block mt-2 bg-gray-900 text-white text-[11px] font-semibold px-2 py-1 rounded">
                    {promo.discount}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <SubscribeBox />
        </aside>
      </div>
    </div>
  );
}
