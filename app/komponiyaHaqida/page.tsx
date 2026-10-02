import Image from "next/image";
import Link from "next/link";
import NewsItems from "@/components/NewsItems";
import { features } from "@/lib/heroDta";
import { styles } from "@/styles/index.styles";

// "Почему именно мы" — ikonkalar bosh sahifadagi features'dan olinadi
const FEATURE_DESCRIPTIONS = [
  "Выбирайте любой способ оплаты для максимального комфорта при покупках у нас.",
  "Наш каталог насыщен разнообразием товаров, чтобы удовлетворить ваши потребности.",
  "Мы оперативно доставим ваш заказ, чтобы вы могли наслаждаться покупкой как можно скорее.",
  "Наша система скидок работает для вашей выгоды, чем больше купите — больше сэкономите.",
];

const HISTORY = [
  {
    year: "2003",
    title:
      "Компания ООО «Стройоптторг» была зарегистрирована в реестре и получила свидетельство о регистрации 1 октября 2003 года.",
    items: [
      ["общая площадь земельного участка составляла", "12 000 м²"],
      ["площадь складских помещений", "800 м²"],
      ["численность сотрудников", "10 человек"],
    ],
  },
  {
    year: "2008",
    title:
      "С годами компания динамично росла и развивалась и уже к 2008 г. мы достигли более высоких результатов:",
    items: [
      ["общая площадь базы составила", "50 000 м²"],
      ["площадь складских помещений", "5 200 м²"],
      ["численность коллектива возросла до", "300 человек"],
    ],
  },
  {
    year: "2018",
    title:
      "К своему 15-ти летнему юбилею компания расширила торговые площади до 17 805.3 м²",
    items: [
      ["Торговый центр №1 –", "5 540 м²"],
      ["Торговый центр№2 –", "3 981,2 м²"],
      ["Складские помещения –", "8 300,6 м²"],
    ],
  },
];

const TODAY = [
  { value: "17 805,3 м²", label: "торговых и складских помещений" },
  { value: "50 000+", label: "наименований товаров" },
  { value: "2 500+", label: "постоянных клиентов" },
  { value: "440", label: "опытных сотрудников" },
];

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero: matn + rasm */}
      <section className="relative overflow-hidden bg-white">
        <div className={`${styles.container} px-4 sm:px-6 md:px-8 py-6 sm:py-8`}>
          <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-[#005bff]">
              Стройоптторг
            </Link>
            <span>/</span>
            <span className="text-gray-600">О компании</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            <div className="space-y-3.5 text-xs sm:text-[13px] text-gray-600 leading-relaxed">
              <h1 className="text-2xl sm:text-3xl md:text-[33px] font-bold text-[#2C333D] mb-4">
                О компании
              </h1>
              <p className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                «Стройоптторг» - крупнейшая оптово-розничная компания по продаже
                строительных и отделочных материалов.
              </p>
              <p>
                Уже второе десятилетие мы готовы воплотить в реальность Вашу
                мечту о красивом, комфортабельном доме, благоустроенном
                современном офисе, уютной теплой даче, помочь реализовать любые
                строительные и дизайнерские фантазии и с минимальными затратами
                времени и денежных средств.
              </p>
              <p>
                Вы всегда можете прийти к нам, пройтись по нашим складским и
                торговым площадям, увидеть, как мы храним, принимаем и продаем
                товары. Пообщаться с продавцами-консультантами, получить
                консультацию по товарам у менеджеров.
              </p>
              <p>
                Вы также можете всегда обратиться к нам, спросить совета или
                вернуть не подошедший товар. Если же Вам что-то не
                понравилось, и Вы остались недовольны нашим сервисом – не стоит
                молчать, сразу сообщите нам об этом. Только так мы сможем понять, что
                делаем что-то не так. И только так мы сможем стать еще лучше!
              </p>
              <p>Все товары, представленные на сайте, гарантированно есть в наличии.</p>
              <p>
                Помимо материалов, мы предлагаем своим клиентам самый большой
                набор услуг, которые позволяют значительно упростить процесс
                строительства и ремонта и сделать его легким и комфортным.
              </p>
            </div>

            <div className="relative w-full h-64 sm:h-80 lg:h-[460px]">
              <Image
                src="/images/homeRasm.png"
                alt="Строительные инструменты"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain lg:object-right"
              />
            </div>
          </div>
        </div>
      </section>

      <div className={`${styles.container} px-4 sm:px-6 md:px-8`}>
        {/* Почему именно мы */}
        <section className="py-8 sm:py-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Почему именно мы
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.text} className="flex gap-3">
                  <Icon className="text-blue-600 shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2">
                      {f.text}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {FEATURE_DESCRIPTIONS[i]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Kompaniya tarixi */}
        <section className="py-6 sm:py-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-8">
            История ООО “Стройоптторг”
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
            {HISTORY.map((h) => (
              <div
                key={h.year}
                className="relative bg-white rounded-xl border border-gray-100 shadow-[0_2px_16px_rgba(16,24,40,0.08)] p-5 pt-7"
              >
                <span className="absolute -top-3.5 left-5 bg-white px-1 text-xl sm:text-2xl font-bold text-[#1f6fd8]">
                  {h.year}
                </span>
                <p className="text-sm font-semibold text-gray-900 leading-snug mb-4">
                  {h.title}
                </p>
                <ul className="space-y-2.5">
                  {h.items.map(([label, value]) => (
                    <li key={label} className="flex gap-2 text-xs text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>
                        {label} <b className="text-gray-900">{value}</b>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Bugun */}
            <div className="relative overflow-hidden bg-white rounded-xl border-2 border-[#1f6fd8] p-5">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -bottom-16 w-56 h-56 rounded-full border-[28px] border-blue-50"
              />
              <h3 className="relative text-xl sm:text-2xl font-bold text-[#1f6fd8] text-center mb-5">
                Сегодня
              </h3>
              <div className="relative grid grid-cols-2 gap-5">
                {TODAY.map((t) => (
                  <div key={t.label}>
                    <p className="text-xl sm:text-2xl font-bold text-[#1f6fd8]">
                      {t.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">– {t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Последние новости */}
        <NewsItems />
      </div>
    </div>
  );
}
