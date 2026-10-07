import AdminLogin from "@/components/admin/AdminLogin";

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  // Faqat ichki admin manziliga qaytaramiz (ochiq redirect bo'lmasin)
  const target = typeof next === "string" && next.startsWith("/admin") ? next : "/admin";
  return <AdminLogin next={target} />;
}
