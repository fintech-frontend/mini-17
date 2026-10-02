"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useCreateLeadMutation } from "@/lib/api/contentApi";
import { useCallbackModal } from "@/components/CallbackModal";
import { styles } from "@/styles/index.styles";

const ADDRESS =
  "369012, Карачаево-Черкесская Республика, г. Черкесск, ул. Октябрьская, дом 301";
const MAP_SRC = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(
  "Черкесск, ул. Октябрьская, 301",
)}&z=15`;

const DEPARTMENTS = [
  { title: "Генеральный директор:", phone: "8 (8782) 28-42-67 (приемная)" },
  { title: "Отдел снабжения:", phone: "8 (8782) 28-42-67" },
  { title: "Отдел сбыта:", phone: "8 (8782) 28-45-81" },
  { title: "Юридический отдел:", phone: "8 (8782) 28-42-69" },
  { title: "Бухгалтерия:", phone: "8 (8782) 28-42-71" },
  { title: "Отдел доставки:", phone: "8 (8782) 28-45-83" },
  { title: "Кредитный отдел:", phone: "8 (8782) 28-45-82" },
  { title: "Отдел кадров:", phone: "8 (8782) 28-42-73" },
];

const REGIONS = [
  "Москва",
  "Ставрополь",
  "Краснодар",
  "Грозный",
  "Ростов-на-Дону",
  "Самара",
];

const REGION_PHONE = "+7 (800) 444-00-65";
const EMAIL = "info@stroyoptorg.ru";

// Telefon raqamini +7 (___) ___-__-__ formatida yozish
const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  let formatted = "+7";
  if (digits.length > 0) formatted += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) formatted += ") ";
  if (digits.length > 3) formatted += digits.slice(3, 6);
  if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;
  return formatted;
};

export default function ContactsPage() {
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const openCallback = useCallbackModal((s) => s.open);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || form.phone.replace(/\D/g, "").length < 11) {
      toast.error("Укажите имя и номер телефона");
      return;
    }
    if (!agreed) {
      toast.error("Подтвердите согласие с обработкой персональных данных");
      return;
    }

    try {
      // POST /leads/
      await createLead({
        type: "consultation",
        name: form.name.trim(),
        phone: form.phone,
        consent: agreed,
      }).unwrap();
    } catch {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }

    toast.success("Спасибо! Мы скоро свяжемся с вами.");
    setForm({ name: "", phone: "", message: "" });
    setAgreed(false);
  };

  return (
    <div className="w-full">
      <section className={`${styles.container} px-4 sm:px-6 md:px-8 py-6 sm:py-8`}>
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-[#005bff]">
            Стройоптторг
          </Link>
          <span>/</span>
          <span className="text-gray-600">Контакты</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[33px] font-bold text-[#2C333D] mb-6">
          Контакты
        </h1>

        {/* Xarita + manzil kartochkasi */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100">
          <iframe
            src={MAP_SRC}
            title="Карта: Стройоптторг"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[320px] sm:h-[400px] lg:h-[460px] border-0 block"
          />

          <div className="lg:absolute lg:top-6 lg:right-6 lg:w-[300px] bg-white lg:rounded-xl p-5 sm:p-6 lg:shadow-[0_2px_16px_rgba(16,24,40,0.12)] space-y-4 text-xs sm:text-[13px]">
            <InfoItem icon={<MapPin size={16} />} title="Адрес:">
              {ADDRESS}
            </InfoItem>
            <InfoItem icon={<Phone size={16} />} title="Телефон:">
              <a href="tel:88782284272" className="font-semibold text-gray-900 hover:text-[#005bff]">
                8 (8782) 28-42-72
              </a>
            </InfoItem>
            <InfoItem icon={<Mail size={16} />} title="Email адрес:">
              <a href={`mailto:${EMAIL}`} className="text-[#005bff] underline">
                {EMAIL}
              </a>
            </InfoItem>
            <InfoItem icon={<Clock size={16} />} title="Время работы:">
              Ежедневно, с 8:00 до 18:00
              <br />
              Без перерыва и выходных
            </InfoItem>

            <button
              type="button"
              onClick={openCallback}
              className="w-full py-3.5 bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold uppercase tracking-wide rounded-lg transition-colors"
            >
              Заказать звонок
            </button>
          </div>
        </div>

        {/* Bo'limlar telefonlari + rekvizitlar */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-3 sm:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {DEPARTMENTS.map((d) => (
              <div
                key={d.title}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-[0_2px_12px_rgba(16,24,40,0.05)]"
              >
                <p className="text-[11px] text-gray-500 mb-1.5">{d.title}</p>
                <p className="text-xs sm:text-[13px] font-semibold text-gray-900">
                  {d.phone}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#f3f6fb] rounded-xl p-4 text-[11px] text-gray-600 leading-relaxed">
            <p className="font-semibold text-gray-900 mb-1.5">Реквизиты:</p>
            ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «СТРОЙОПТТОРГ», ИНН
            0901051797, КПП 090101001, ОГРН 1020900507660. 369012,
            Карачаево-Черкесская Республика, город Черкесск, Октябрьская улица,
            301. Р/с 40702810360310000019 в Ставропольском отделении №5230 ПАО
            Сбербанк, БИК 040702615
          </div>
        </div>

        {/* Hududlar */}
        <div className="mt-8 sm:mt-10">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-4">
            Работаем по регионам:
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-5">
            {REGIONS.map((city, i) => (
              <div
                key={city}
                className={`pr-3 text-xs ${i % 6 !== 0 ? "lg:border-l lg:border-gray-100 lg:pl-4" : ""}`}
              >
                <p className="text-gray-500 mb-1">{city}</p>
                <a
                  href={`tel:${REGION_PHONE.replace(/\D/g, "")}`}
                  className="block font-semibold text-gray-900 hover:text-[#005bff] mb-0.5 whitespace-nowrap"
                >
                  {REGION_PHONE}
                </a>
                <a href={`mailto:${EMAIL}`} className="text-[#005bff] underline text-[11px]">
                  {EMAIL}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Savol yuborish formasi */}
      <section className="bg-[#f5f7fa] py-10 sm:py-14 mt-6">
        <div className="max-w-[560px] mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C333D] text-center mb-6 sm:mb-8">
            У вас есть вопросы? С радостью ответим на них!
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ваше имя">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Введите ваше имя"
                  maxLength={150}
                  className={inputClass}
                />
              </Field>
              <Field label="Номер телефона">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                  placeholder="+7 (___) ___-__-__"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Текст сообщения" required={false}>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Введите ваш вопрос"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-[160px] py-3.5 bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold uppercase tracking-wide rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? "Отправка..." : "Отправить"}
              </button>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <span
                  onClick={() => setAgreed(!agreed)}
                  className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    agreed ? "bg-[#1f6fd8] border-[#1f6fd8] text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {agreed && <Check size={12} strokeWidth={3} />}
                </span>
                <span className="text-[11px] text-gray-500 leading-tight">
                  Согласен с обработкой персональных данных в соответствии с{" "}
                  <Link href="/privecyPolicyPage" className="text-[#1f6fd8] underline">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-3 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1f6fd8] transition-colors placeholder:text-gray-400";

function InfoItem({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-[#1f6fd8] mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="font-semibold text-gray-900 mb-1">{title}</p>
        <div className="text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  required = true,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
