"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertTriangle, Inbox, Loader2, RefreshCw, X } from "lucide-react";
import type { Tone } from "@/lib/admin/labels";

/* Ranglar (topshiriq bo'yicha):
   primary #012F91, sidebar #003B73, accent #EE0906, fon #F5F7FA, kartochka #FFFFFF */

// ---------- Tugmalar ----------
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const BUTTON: Record<ButtonVariant, string> = {
  primary: "bg-[#012F91] hover:bg-[#00256f] text-white",
  secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-800",
  danger: "bg-[#EE0906] hover:bg-[#c90704] text-white",
  ghost: "text-gray-600 hover:bg-gray-100",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm"
      } ${BUTTON[variant]} ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}

// ---------- Badge (status) ----------
const TONE: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  yellow: "bg-amber-50 text-amber-800 ring-amber-600/25",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  grey: "bg-gray-100 text-gray-600 ring-gray-500/20",
};
const DOT: Record<Tone, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  grey: "bg-gray-400",
};

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${TONE[tone]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[tone]}`} aria-hidden />
      {children}
    </span>
  );
}

// ---------- Kartochka va sahifa sarlavhasi ----------
export function Card({
  title,
  actions,
  className = "",
  bodyClassName = "p-5",
  children,
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`bg-white rounded-xl shadow-[0_1px_3px_rgba(16,24,40,0.06),0_1px_2px_rgba(16,24,40,0.04)] ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
          {actions}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

// ---------- Forma maydonlari ----------
export const inputCls =
  "w-full h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#012F91] focus:ring-2 focus:ring-[#012F91]/10 placeholder:text-gray-400 disabled:bg-gray-50";

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[13px] font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-[#EE0906]"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-[#EE0906] mt-1">{error}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex w-fit items-center gap-2.5 cursor-pointer select-none text-sm text-gray-700">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-[#012F91]" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
      {label}
    </label>
  );
}

// ---------- Modal va drawer ----------
function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${width} bg-white rounded-xl shadow-2xl`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  useEscape(open, onClose);
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-[150] bg-gray-900/30 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[160] w-full ${width} bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{open && children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">{footer}</div>}
      </aside>
    </>
  );
}

// ---------- Tasdiqlash oynasi: const confirm = useConfirm(); if (await confirm({...})) ----------
type ConfirmOptions = { title: string; message: string; confirmText?: string; danger?: boolean };
const ConfirmContext = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(v: boolean) => void>(() => {});

  const confirm = useCallback(
    (o: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOptions(o);
      }),
    []
  );

  const close = (value: boolean) => {
    resolver.current(value);
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={!!options}
        onClose={() => close(false)}
        title={options?.title ?? ""}
        footer={
          <>
            <Button variant="secondary" onClick={() => close(false)}>
              Отмена
            </Button>
            <Button variant={options?.danger ? "danger" : "primary"} onClick={() => close(true)}>
              {options?.confirmText ?? "Подтвердить"}
            </Button>
          </>
        }
      >
        <div className="flex gap-3">
          {options?.danger && <AlertTriangle size={20} className="shrink-0 text-[#EE0906] mt-0.5" />}
          <p className="text-sm text-gray-600 leading-relaxed">{options?.message}</p>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);

// ---------- Holatlar ----------
export function EmptyState({
  title = "Пока ничего нет",
  text,
  action,
}: {
  title?: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-4">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
        <Inbox size={22} />
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {text && <p className="text-sm text-gray-500 mt-1 max-w-sm">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-4">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#EE0906] mb-3">
        <AlertTriangle size={22} />
      </div>
      <p className="text-sm font-semibold text-gray-900">Не удалось загрузить данные</p>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" icon={<RefreshCw size={14} />} onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-100 ${className}`} />;
}
