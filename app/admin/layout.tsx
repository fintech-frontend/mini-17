import type { Metadata } from "next";
import AdminGuard from "@/components/admin/AdminGuard";

export const metadata: Metadata = {
  title: "Админ-панель — СтройОптТорг",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminGuard>{children}</AdminGuard>;
}
