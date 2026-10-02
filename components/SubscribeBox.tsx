"use client";

import { useState } from "react";
import toast from "react-hot-toast";

// "Подпишитесь на рассылку" bloki (backend'da obuna endpointi hali yo'q)
export default function SubscribeBox() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Введите корректный email");
      return;
    }
    if (!agreed) {
      toast.error("Подтвердите согласие с обработкой персональных данных");
      return;
    }
    toast("Подписка на рассылку скоро будет доступна");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-md p-5 text-center">
      <h3 className="text-[15px] font-semibold text-gray-900">Подпишитесь на рассылку</h3>
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        Регулярные скидки и спецпредложения, а так же новости компании.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full mt-4 bg-white border border-gray-200 rounded-md px-4 py-3 text-sm outline-none focus:border-blue-500 placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="w-full mt-3 bg-[#1f6fd8] hover:bg-[#1a5fbc] text-white text-xs font-semibold uppercase tracking-wide py-3.5 rounded-md transition-colors"
      >
        Подписаться
      </button>

      <label className="flex items-start gap-2.5 mt-4 text-left text-[11px] text-gray-500 leading-snug cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 accent-blue-600"
        />
        Согласен с обработкой персональных данных в соответствии с политикой конфиденциальности
      </label>
    </form>
  );
}
