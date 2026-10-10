"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallbackModal } from "@/components/CallbackModal";

const MENU_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/komponiyaHaqida", label: "О компании" },
  { href: "/tolov", label: "Оплата" },
  { href: "/yetkazibBerish", label: "Доставка" },
  { href: "/qaytarish", label: "Возврат" },
  { href: "/fikrlar", label: "Отзывы" },
  { href: "/vafrosatvet", label: "Вопрос-ответ" },
  { href: "/blog?rubric=news", label: "Новости" },
  { href: "/blog", label: "Блог" },
  { href: "/aloqa", label: "Контакты" },
];

// Telefon / planshet uchun chap tomondan ochiladigan menyu
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const openCallback = useCallbackModal((s) => s.open);

  // Sahifa almashganda menyuni yopamiz
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Ochiq paytda sahifa skrollini bloklash va Esc bilan yopish
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="lg:hidden flex items-center gap-1.5 text-gray-800 hover:text-[#005bff] font-medium text-xs"
      >
        <Menu size={18} />
        <span>Меню</span>
      </button>

      {/* Qora fon */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-[110] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Chap panel */}
      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        inert={!open}
        className={`lg:hidden fixed inset-y-0 left-0 z-[120] w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-5 pt-5">
          <Link href="/" onClick={() => setOpen(false)}>
            <img src="/logo 1.png" alt="Стройоптторг" className="h-10 w-auto object-contain" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            className="-mr-1 p-1 text-gray-500 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-1">
            {MENU_LINKS.map((link) => {
              // Query'li havolalar (Новости) faqat pathname bo'yicha belgilanmaydi
              const active =
                link.href === "/" ? pathname === "/" : !link.href.includes("?") && pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block py-2.5 text-lg transition-colors ${
                      active ? "text-[#005bff] font-medium" : "text-gray-900 hover:text-[#005bff]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-5 pb-6 pt-4 space-y-3">
          <p className="text-center text-xs text-gray-500">Ежедневно, с 8:00 до 18:00</p>
          <a
            href="tel:500200684"
            className="block w-full text-center py-3.5 rounded-full border-2 border-gray-200 text-[#005bff] font-bold text-base hover:border-[#005bff] transition-colors"
          >
            500200684
          </a>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openCallback();
            }}
            className="w-full py-3.5 rounded-full bg-[#005bff] hover:bg-[#004dc9] text-white font-bold text-base transition-colors"
          >
            Заказать звонок
          </button>
        </div>
      </aside>
    </>
  );
}
