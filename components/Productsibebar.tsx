"use client";

import { useState } from "react";
import { BadgePercent, CreditCard, LayoutList, Package } from "lucide-react";
import type { ProductSpec } from "@/types/product";

const MAIN_SPECS_COUNT = 7;

const perks = [
  { icon: CreditCard, text: "Оплата любым удобным способом" },
  { icon: LayoutList, text: "Большой выбор товаров в каталоге" },
  { icon: Package, text: "Осуществляем быструю доставку" },
  { icon: BadgePercent, text: "Делаем скидки на крупные покупки" },
];

export default function ProductSidebar({ specs }: { specs: ProductSpec[] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleSpecs = expanded ? specs : specs.slice(0, MAIN_SPECS_COUNT);
  const hasMore = specs.length > MAIN_SPECS_COUNT;

  return (
    <div className="space-y-5">
      {specs.length > 0 && (
        <div>
          <dl className="space-y-3.5 text-[13px]">
            {visibleSpecs.map((spec) => (
              <div key={spec.label} className="flex items-baseline gap-2">
                <dt className="text-gray-700 shrink-0 max-w-[55%]">{spec.label}</dt>
                <span className="flex-1 border-b border-dotted border-gray-300 translate-y-[-3px]" />
                <dd className="text-gray-500 text-right">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-4 text-[13px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {expanded ? "Скрыть характеристики" : "Больше характеристик"}
            </button>
          )}
        </div>
      )}

      <div className="border border-gray-200 rounded-md px-4 py-1">
        {perks.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 py-3 text-[13px] text-gray-700">
            <Icon size={18} strokeWidth={1.5} className="shrink-0 text-gray-500" />
            <span className="leading-snug">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
