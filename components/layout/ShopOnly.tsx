"use client";

import { usePathname } from "next/navigation";

// Do'kon qismi (navbar, footer, cookie, qo'ng'iroq oynasi) admin panelda ko'rinmaydi
export default function ShopOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
