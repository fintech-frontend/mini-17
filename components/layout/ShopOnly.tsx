"use client";

import { usePathname } from "next/navigation";

// Do'kon qismlari (header, footer, cookie banner) /admin sahifalarida ko'rinmaydi
export default function ShopOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
