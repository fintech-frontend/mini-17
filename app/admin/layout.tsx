import type { Metadata } from "next";
import { AdminRoot } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Админ-панель — СтройОптТорг",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminRoot>{children}</AdminRoot>;
}
