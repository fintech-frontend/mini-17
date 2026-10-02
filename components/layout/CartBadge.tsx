"use client";

import { useGetCartQuery } from "@/lib/api/cartApi";

// Savat ikonkasidagi mahsulotlar soni
export default function CartBadge() {
  const { data } = useGetCartQuery();
  const count = data?.totals.item_count ?? 0;
  if (!count) return null;

  return (
    <span className="absolute -top-1.5 right-0 translate-x-1/2 min-w-4.5 h-4.5 px-1 rounded-full bg-[#005bff] text-white text-[10px] font-semibold leading-4.5 text-center">
      {count > 99 ? "99+" : count}
    </span>
  );
}
