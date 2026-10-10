"use client";

import { createContext, useContext, useMemo, useState } from "react";

// Yuqori paneldagi sana oralig'i — dashboard va hisobotlar shundan foydalanadi
export type RangePreset = "7d" | "30d" | "90d" | "year" | "custom";

export interface DateRange {
  preset: RangePreset;
  from: Date;
  to: Date;
}

const DAY = 24 * 60 * 60 * 1000;

export function rangeFromPreset(preset: Exclude<RangePreset, "custom">): DateRange {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date(to);
  from.setHours(0, 0, 0, 0);
  if (preset === "year") from.setMonth(0, 1);
  else from.setTime(from.getTime() - ({ "7d": 6, "30d": 29, "90d": 89 }[preset]) * DAY);
  return { preset, from, to };
}

// Taqqoslash uchun oldingi teng davr
export function previousRange(range: DateRange) {
  const length = range.to.getTime() - range.from.getTime();
  return { from: new Date(range.from.getTime() - length - 1), to: new Date(range.from.getTime() - 1) };
}

const AdminContext = createContext<{ range: DateRange; setRange: (r: DateRange) => void }>({
  range: rangeFromPreset("30d"),
  setRange: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange>(() => rangeFromPreset("30d"));
  const value = useMemo(() => ({ range, setRange }), [range]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdminRange = () => useContext(AdminContext);
