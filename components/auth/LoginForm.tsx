"use client";

import React, { useState } from "react";
import { useLoginMutation } from "@/lib/api/authApi";

export default function LoginForm() {
  const [login, { isLoading, error }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-[60vh] py-16 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4"
      >
        <h1 className="text-xl font-extrabold text-slate-800">
          Вход в личный кабинет
        </h1>

        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#005bff]"
        />
        <input
          type="password"
          required
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#005bff]"
        />

        {error && (
          <p className="text-xs text-red-500">Неверный email или пароль</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#005bff] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
