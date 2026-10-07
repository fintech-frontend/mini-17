"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, EyeOff, MailCheck, UserPlus } from "lucide-react";

// stroiopttorg.ru/my-account uslubidagi umumiy auth bloklari

export function AuthPage({
  crumb,
  title,
  children,
}: {
  crumb: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12 sm:pb-16">
      <nav aria-label="Навигация" className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Стройоптторг
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-400">{crumb}</span>
      </nav>
      <h1 className="text-[28px] sm:text-4xl md:text-[44px] font-bold text-gray-900 mb-8 sm:mb-12">{title}</h1>
      {children}
    </div>
  );
}

// Ikki ustunli kartochka: chapda forma, o'ngda izoh bloki
export function AuthCard({ form, aside }: { form: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-md grid grid-cols-1 lg:grid-cols-2">
      <div className="p-5 sm:p-8 lg:p-10">{form}</div>
      <div className="p-5 sm:p-8 lg:p-10 border-t lg:border-t-0 border-gray-200">
        <div className="lg:border-l lg:border-gray-200 lg:pl-10 h-full lg:py-4">{aside}</div>
      </div>
    </div>
  );
}

export function AuthAside({
  title,
  children,
  href,
  button,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
  button: string;
}) {
  return (
    <div className="max-w-md">
      <div className="flex items-center gap-4 mb-5">
        <UserPlus size={34} strokeWidth={1.25} className="text-[#e52e2e] shrink-0" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-3 text-[13px] sm:text-sm text-gray-700 leading-relaxed">{children}</div>
      <Link
        href={href}
        className="inline-flex items-center gap-3 mt-6 bg-[#121826] hover:bg-black text-white text-xs font-semibold uppercase tracking-wide px-5 py-4 rounded-md transition-colors"
      >
        {button}
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}

export const inputClass = (hasError?: boolean) =>
  `w-full h-12 px-4 text-sm bg-white border rounded-md outline-none transition-colors placeholder:text-gray-400 ${
    hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#1f6fd8]"
  }`;

export function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] text-gray-800 mb-2">
        {label}
        {required && <span className="text-[#e52e2e]"> *</span>}:
      </span>
      {children}
      {error && <span className="block text-xs text-red-500 mt-1.5">{error}</span>}
    </label>
  );
}

export function PasswordInput({
  value,
  onChange,
  error,
  autoComplete,
  placeholder = "Введите пароль",
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  autoComplete: string;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputClass(error)} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function CodeInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <Field label="Код из письма" required error={error}>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="••••••"
        className={`${inputClass(!!error)} text-center text-xl tracking-[0.5em] font-semibold`}
      />
    </Field>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-xs text-gray-600 leading-snug cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`w-5 h-5 shrink-0 rounded border accent-[#1f6fd8] ${error ? "outline outline-1 outline-red-400" : ""}`}
      />
      <span>{children}</span>
    </label>
  );
}

export function PrimaryButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-13 bg-[#1f6fd8] hover:bg-[#1a5fbc] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wide rounded-md transition-colors"
    >
      {loading ? "Подождите..." : children}
    </button>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return <p className="text-[13px] text-red-600 bg-red-50 rounded-md px-4 py-3">{message}</p>;
}

export function FormNotice({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex gap-2.5 text-[13px] text-emerald-800 bg-emerald-50 rounded-md px-4 py-3">
      <MailCheck size={18} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
