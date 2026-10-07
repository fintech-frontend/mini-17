"use client";

import { useEffect } from "react";
import { AlertTriangle, Inbox, Loader2, X } from "lucide-react";
import type { Tone } from "@/lib/admin/format";

// Brief ranglari
export const C = {
  primary: "#012F91",
  dark: "#003B73",
  red: "#EE0906",
  bg: "#F5F7FA",
};

const TONES: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  yellow: "bg-amber-50 text-amber-700 ring-amber-600/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  grey: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export function Badge({ tone = "grey", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${TONES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
  padded = true,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={`rounded-xl bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06),0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-gray-200/70 ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {action}
        </header>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
  icon?: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const variants = {
    primary: "bg-[#012F91] text-white hover:bg-[#00257a] focus-visible:outline-[#012F91]",
    secondary: "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    danger: "bg-[#EE0906] text-white hover:bg-[#c90805] focus-visible:outline-[#EE0906]",
    ghost: "text-gray-600 hover:bg-gray-100",
  };
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-sm" };
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200/70 ${className}`} />;
}

export function EmptyState({
  title = "Пока пусто",
  text,
  action,
}: {
  title?: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-gray-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#EE0906]">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-gray-900">Не удалось загрузить данные</p>
      <p className="mt-1 max-w-md text-sm text-gray-500">{text}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  width = "max-w-lg",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[90vh] w-full ${width} flex-col rounded-xl bg-white shadow-2xl`}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">{footer}</footer>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = "Удалить",
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  text: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      width="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{text}</p>
    </Modal>
  );
}

export function Pagination({
  page,
  pages,
  count,
  onChange,
}: {
  page: number;
  pages: number;
  count: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) {
    return <p className="px-5 py-3 text-xs text-gray-500">Всего: {count}</p>;
  }
  // Joriy sahifa atrofidagi raqamlar
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );
  return (
    <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
      <p className="text-xs text-gray-500">Всего: {count}</p>
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Назад
        </Button>
        {nums.map((n, i) => (
          <span key={n} className="flex items-center">
            {i > 0 && nums[i - 1] !== n - 1 && <span className="px-1 text-xs text-gray-400">…</span>}
            <button
              type="button"
              onClick={() => onChange(n)}
              aria-current={n === page ? "page" : undefined}
              className={`h-8 min-w-8 rounded-lg px-2 text-xs font-medium tabular-nums ${
                n === page ? "bg-[#012F91] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {n}
            </button>
          </span>
        ))}
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Далее
        </Button>
      </div>
    </div>
  );
}

// ---------- Forma elementlari ----------
const fieldBase =
  "block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#012F91] disabled:bg-gray-50 disabled:text-gray-500";

export function Field({
  label,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-[#EE0906]"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-gray-500">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldBase} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldBase} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldBase} pr-8 ${props.className ?? ""}`} />;
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-[#012F91]" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}
