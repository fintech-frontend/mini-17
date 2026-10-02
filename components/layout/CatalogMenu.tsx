"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { useGetCategoryTreeQuery } from "@/lib/api/catalogApi";
import { categoryHref, sortCategories } from "@/lib/catalogTree";

// Navbar'dagi "КАТАЛОГ" tugmasi va ochiladigan kategoriyalar menyusi
export default function CatalogMenu({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { data: tree = [] } = useGetCategoryTreeQuery(undefined, { skip: !open });
  const categories = sortCategories(tree);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];
  const children = sortCategories(active?.children ?? []);

  // Sahifa almashganda menyuni yopamiz
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Tashqariga bosilganda yoki Esc bosilganda yopish
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={compact ? "shrink-0" : "relative shrink-0"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-2 text-white rounded-xl font-semibold uppercase text-xs tracking-wider transition-colors ${
          open ? "bg-[#1d2b4f]" : "bg-[#005bff] hover:bg-[#004dc9]"
        } ${compact ? "px-3.5 sm:px-5 py-2.5" : "px-5 py-2.5"}`}
      >
        {open ? <X size={compact ? 16 : 18} /> : <Menu size={compact ? 16 : 18} />}
        <span>КАТАЛОГ</span>
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-3 bg-white shadow-[0_8px_32px_rgba(16,24,40,0.12)] rounded-md overflow-hidden ${
            compact ? "left-3 right-3 sm:left-6 sm:right-6" : "left-0 w-[min(860px,90vw)]"
          }`}
        >
          {categories.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">Загрузка...</p>
          ) : (
            <div className="flex max-h-[70vh]">
              {/* Asosiy kategoriyalar */}
              <ul className={`overflow-y-auto border-r border-gray-100 ${compact ? "w-1/2" : "w-72"}`}>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={categoryHref(cat.slug)}
                      onMouseEnter={() => setActiveId(cat.id)}
                      onFocus={() => setActiveId(cat.id)}
                      className={`flex items-center justify-between gap-2 px-4 py-3.5 text-[11px] font-semibold uppercase border-b border-gray-100 transition-colors ${
                        cat.id === active?.id
                          ? "bg-[#005bff] text-white"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronRight size={14} className="shrink-0 opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Tanlangan kategoriyaning subkategoriyalari */}
              <div className="flex-1 overflow-y-auto">
                {children.length > 0 ? (
                  <ul>
                    {children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={categoryHref(child.slug)}
                          className="flex items-center justify-between gap-2 px-4 py-3.5 text-[13px] text-gray-700 border-b border-gray-100 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                        >
                          <span>{child.name}</span>
                          <ChevronRight size={14} className="shrink-0 text-gray-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  active && (
                    <Link
                      href={categoryHref(active.slug)}
                      className="block px-4 py-3.5 text-[13px] text-blue-600 hover:underline"
                    >
                      Все товары в разделе «{active.name}» ({active.product_count})
                    </Link>
                  )
                )}
              </div>
            </div>
          )}

          <Link
            href="/catalog"
            className="block px-4 py-3 text-xs font-semibold text-blue-600 border-t border-gray-100 hover:bg-gray-50"
          >
            Весь каталог →
          </Link>
        </div>
      )}
    </div>
  );
}
