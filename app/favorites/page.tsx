"use client";

import { useRouter } from "next/navigation";
import CabinetShell, { type CabinetTab } from "@/components/cabinet/CabinetShell";
import FavoritesContent from "@/components/cabinet/FavoritesContent";
import { useLogoutMutation } from "@/lib/api/authApi";

// /favorites — kabinet bilan bir xil ko'rinishda ("Избранные товары" tanlangan)
export default function FavoritesPage() {
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const handleSelect = async (id: CabinetTab) => {
    if (id === "favorites") return;
    if (id === "logout") {
      await logout().unwrap().catch(() => undefined);
      router.push("/kantak");
      return;
    }
    // Boshqa bo'limlar kabinetda: /kantak?tab=...
    router.push(id === "account" ? "/kantak" : `/kantak?tab=${id}`);
  };

  return (
    <CabinetShell active="favorites" onSelect={handleSelect}>
      <FavoritesContent />
    </CabinetShell>
  );
}
