"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Har bir so'rov uchun alohida store (Next.js App Router tavsiyasi)
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
