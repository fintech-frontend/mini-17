import { redirect } from "next/navigation";

// "Новости" endi blog ichida: /yengiliklar -> /blog?rubric=news
export default function NewsPage() {
  redirect("/blog?rubric=news");
}
