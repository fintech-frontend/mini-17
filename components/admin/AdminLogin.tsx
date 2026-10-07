"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/lib/api/authApi";
import { Button, Field, Input } from "./ui";

export default function AdminLogin({ next }: { next: string }) {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form).unwrap();
      router.replace(next);
    } catch {
      /* xato quyida ko'rsatiladi */
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Chap: brend paneli */}
      <div className="relative hidden overflow-hidden bg-[#003B73] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-base font-black text-[#EE0906]">
            С
          </span>
          <span className="text-lg font-bold text-white">СтройОптТорг</span>
        </div>
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight text-white">
            Управление магазином строительных материалов
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            Товары, заказы, клиенты, склад и контент сайта — в одной панели.
          </p>
        </div>
        <p className="text-xs text-white/40">© СтройОптТорг</p>
        {/* Dekorativ halqalar */}
        <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-white/5" />
        <span aria-hidden className="pointer-events-none absolute -bottom-32 right-20 h-96 w-96 rounded-full border-[48px] border-[#012F91]/60" />
      </div>

      {/* O'ng: forma */}
      <div className="flex items-center justify-center bg-[#F5F7FA] px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200"
        >
          <h1 className="text-xl font-bold text-gray-900">Вход в админ-панель</h1>
          <p className="mt-1 mb-6 text-sm text-gray-500">Только для сотрудников магазина</p>

          <div className="space-y-4">
            <Field label="Email" required>
              <Input
                type="email"
                autoComplete="username"
                required
                autoFocus
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@stroyopttorg.ru"
              />
            </Field>
            <Field label="Пароль" required>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              Неверный email или пароль
            </p>
          )}

          <Button type="submit" loading={isLoading} className="mt-6 h-10 w-full">
            Войти
          </Button>

          <Link href="/" className="mt-4 block text-center text-xs text-gray-500 hover:text-[#012F91]">
            ← Вернуться на сайт
          </Link>
        </form>
      </div>
    </div>
  );
}
