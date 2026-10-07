"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAdminListQuery } from "@/lib/admin/adminApi";
import { useLogoutMutation } from "@/lib/api/authApi";
import { tokenStorage } from "@/lib/api/tokenStorage";
import { useMounted } from "@/lib/useMounted";
import AdminShell from "./AdminShell";
import { Button } from "./ui";

// Admin bo'limini faqat xodimlar (is_staff) ko'radi.
// Tekshiruv: /admin/orders ga so'rov — 401 bo'lsa login, 403 bo'lsa "ruxsat yo'q".
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const isLogin = pathname === "/admin/login";
  const hasToken = mounted && !!tokenStorage.getAccess();

  const { error, isSuccess } = useAdminListQuery(
    { resource: "orders", params: { page_size: 1 } },
    { skip: isLogin || !hasToken },
  );
  const status = (error as { status?: number } | undefined)?.status;
  const [logout] = useLogoutMutation();

  const mustLogin = mounted && !isLogin && (!hasToken || status === 401);
  useEffect(() => {
    if (mustLogin) router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [mustLogin, pathname, router]);

  if (isLogin) return <>{children}</>;

  if (status === 403) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] p-6">
        <div className="max-w-sm rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
          <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-[#EE0906]" />
          <h1 className="text-lg font-bold text-gray-900">Нет доступа</h1>
          <p className="mt-2 text-sm text-gray-500">
            У этой учётной записи нет прав сотрудника. Войдите под другим аккаунтом.
          </p>
          <Button
            className="mt-5 w-full"
            onClick={async () => {
              await logout().unwrap().catch(() => undefined);
              router.replace("/admin/login");
            }}
          >
            Войти под другим аккаунтом
          </Button>
        </div>
      </div>
    );
  }

  if (!isSuccess && !(error && status !== 401)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA]">
        <Loader2 className="h-6 w-6 animate-spin text-[#012F91]" />
      </div>
    );
  }

  // Boshqa xatolar (server ishlamayapti va h.k.) — panel ochiladi, sahifalar o'z xatosini ko'rsatadi
  return <AdminShell>{children}</AdminShell>;
}
