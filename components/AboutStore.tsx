import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

const stats = [
  { value: "17 805,3 м²", label: "торговых и складских помещений" },
  { value: "50 000+", label: "наименований товара" },
  { value: "2 500+", label: "постоянных клиентов" },
  { value: "440", label: "опытных сотрудников" },
];

export default function AboutStore() {
  return (
    <section className="w-full rounded-2xl overflow-hidden bg-[#f6faff] my-8 sm:my-10 md:my-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Chap qism: matn */}
        <div className="px-5 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 order-2 lg:order-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            О нашем магазине
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5 sm:mb-6 max-w-xl">
            Цель и главная задача компании — создать сервис, который не
            ограничится продажей строительных и отделочных материалов, а
            будет решать задачи и трудности, с которыми сталкиваются люди во
            время ремонта.
          </p>

          {/* Statistika */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-5 sm:mb-6">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 sm:mb-7 max-w-xl">
            Уже второе десятилетие мы готовы воплотить в реальность Вашу
            мечту о красивом, комфортабельном доме, благоустроенном
            современном офисе, уютной теплой даче, помочь реализовать любые
            строительные и дизайнерские фантазии и с минимальными затратами
            времени и денежных средств.
          </p>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 w-fit bg-gray-900 hover:bg-gray-800 active:bg-black text-white text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-colors"
          >
            Подробнее о компании
            <FiChevronRight size={16} />
          </Link>
        </div>

        {/* O'ng qism: rasm */}
        <div className="relative w-full h-64  sm:h-80 md:h-96 lg:h-full lg:min-h-125 order-1 lg:order-2">
          <Image
            src="/images/homeRasm.png"
            alt="Строительные инструменты"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}