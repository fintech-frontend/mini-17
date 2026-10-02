"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { create } from "zustand";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useCreateLeadMutation } from "@/lib/api/contentApi";

// Modalni istalgan joydan ochish uchun: useCallbackModal((s) => s.open)
export const useCallbackModal = create<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
}>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

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

const inputClass =
  "w-full px-4 py-3.5 text-sm rounded-md border border-gray-200 bg-white focus:outline-none focus:border-[#1f6fd8] transition-colors placeholder:text-gray-400";

export default function CallbackModal() {
  const { isOpen, close } = useCallbackModal();
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Ochiq paytda sahifa skrollini bloklash va Esc bilan yopish
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const handleClose = () => {
    setName("");
    setPhone("");
    setAgreed(false);
    close();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || phone.replace(/\D/g, "").length < 11) {
      toast.error("Пожалуйста, заполните все поля корректно");
      return;
    }
    if (!agreed) {
      toast.error("Подтвердите согласие с обработкой персональных данных");
      return;
    }

    try {
      // POST /leads/
      await createLead({
        type: "callback",
        name: name.trim(),
        phone,
        consent: agreed,
      }).unwrap();
    } catch {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }

    toast.success("Спасибо! Мы перезвоним вам в ближайшее время.");
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
      onClick={handleClose}
    >
      {/* Yopish tugmasi (ekranning o'ng yuqori burchagida) */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Закрыть"
        className="absolute top-4 right-4 sm:top-10 sm:right-10 text-white/90 hover:text-white transition-colors"
      >
        <IoClose size={44} />
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="callback-title"
        className="w-full max-w-[475px] bg-white rounded-md shadow-2xl px-5 py-7 sm:px-8 sm:py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="callback-title"
          className="text-xl sm:text-[26px] font-bold text-gray-900 text-center mb-6"
        >
          Заказать обратный звонок
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-xs text-gray-800 mb-2">
              Ваше имя <span className="text-red-500">*</span>:
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться?"
              maxLength={150}
              autoFocus
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-xs text-gray-800 mb-2">
              Номер телефона <span className="text-red-500">*</span>:
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="+7 (___) ___-__-__"
              className={inputClass}
            />
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-gray-300 accent-[#1f6fd8] shrink-0"
            />
            <span className="text-[11px] text-gray-600 leading-snug">
              Согласен с обработкой персональных данных в соответствии с{" "}
              <Link
                href="/privecyPolicyPage"
                onClick={handleClose}
                className="text-[#1f6fd8] underline"
              >
                политикой конфиденциальности
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#1f6fd8] hover:bg-[#1a5fbc] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wide rounded-md transition-colors"
          >
            {isLoading ? "Отправка..." : "Перезвоните мне"}
          </button>
        </form>
      </div>
    </div>
  );
}
