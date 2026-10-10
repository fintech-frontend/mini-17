"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Columns3 } from "lucide-react";
import { EmptyState, ErrorState, Skeleton } from "./ui";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  // Server tomonda saralash uchun "ordering" qiymati (masalan "price")
  sortKey?: string;
  align?: "left" | "right" | "center";
  className?: string;
  // false bo'lsa ustunni yashirib bo'lmaydi
  hideable?: boolean;
}

export interface Sort {
  key: string;
  dir: "asc" | "desc";
}

// "price" / "-price" ko'rinishidagi DRF ordering qiymati
export const toOrdering = (sort: Sort | null) => (sort ? `${sort.dir === "desc" ? "-" : ""}${sort.key}` : undefined);

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  empty,
  sort,
  onSort,
  selected,
  onSelect,
  onRowClick,
  page,
  pages,
  count,
  onPage,
  toolbar,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  empty?: React.ReactNode;
  sort?: Sort | null;
  onSort?: (sort: Sort | null) => void;
  selected?: (string | number)[];
  onSelect?: (ids: (string | number)[]) => void;
  onRowClick?: (row: T) => void;
  page?: number;
  pages?: number;
  count?: number;
  onPage?: (page: number) => void;
  toolbar?: React.ReactNode;
}) {
  const [hidden, setHidden] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenuOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const visible = columns.filter((c) => !hidden.includes(c.key));
  const ids = rows.map(rowKey);
  const allChecked = !!selected && ids.length > 0 && ids.every((id) => selected.includes(id));

  const toggleSort = (key: string) => {
    if (!onSort) return;
    if (sort?.key !== key) onSort({ key, dir: "asc" });
    else if (sort.dir === "asc") onSort({ key, dir: "desc" });
    else onSort(null);
  };

  const alignCls = (a?: string) => (a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left");

  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(16,24,40,0.06)] overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100">
        <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">{toolbar}</div>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="h-9 px-3 inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            aria-expanded={menuOpen}
          >
            <Columns3 size={16} />
            <span className="hidden sm:inline">Столбцы</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 z-30 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
              {columns
                .filter((c) => c.hideable !== false)
                .map((c) => (
                  <label key={c.key} className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!hidden.includes(c.key)}
                      onChange={() =>
                        setHidden((h) => (h.includes(c.key) ? h.filter((k) => k !== c.key) : [...h, c.key]))
                      }
                      className="accent-[#012F91]"
                    />
                    {c.header}
                  </label>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-auto max-h-[calc(100vh-260px)] min-h-40">
        <table className="w-full text-sm tabular-nums">
          <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              {onSelect && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Выбрать все"
                    checked={allChecked}
                    onChange={() => onSelect(allChecked ? [] : ids)}
                    className="accent-[#012F91]"
                  />
                </th>
              )}
              {visible.map((c) => (
                <th key={c.key} className={`px-4 py-3 font-semibold whitespace-nowrap ${alignCls(c.align)} ${c.className ?? ""}`}>
                  {c.sortKey && onSort ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.sortKey!)}
                      className="inline-flex items-center gap-1 uppercase hover:text-gray-900"
                    >
                      {c.header}
                      {sort?.key === c.sortKey ? (
                        sort.dir === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} className="opacity-40" />
                      )}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {onSelect && <td className="px-4 py-3.5" />}
                  {visible.map((c) => (
                    <td key={c.key} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-full max-w-40" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading &&
              !error &&
              rows.map((row) => {
                const id = rowKey(row);
                const isSelected = selected?.includes(id);
                return (
                  <tr
                    key={id}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={`${onRowClick ? "cursor-pointer" : ""} ${isSelected ? "bg-blue-50/50" : "hover:bg-gray-50"}`}
                  >
                    {onSelect && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label="Выбрать строку"
                          checked={!!isSelected}
                          onChange={() =>
                            onSelect(isSelected ? selected!.filter((s) => s !== id) : [...(selected ?? []), id])
                          }
                          className="accent-[#012F91]"
                        />
                      </td>
                    )}
                    {visible.map((c) => (
                      <td key={c.key} className={`px-4 py-3 text-gray-700 ${alignCls(c.align)} ${c.className ?? ""}`}>
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
        {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
        {!loading && !error && rows.length === 0 && (empty ?? <EmptyState />)}
      </div>

      {onPage && pages !== undefined && pages > 0 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>
            {count !== undefined && <>Всего: <span className="tabular-nums text-gray-800">{count.toLocaleString("ru-RU")}</span></>}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!page || page <= 1}
              onClick={() => onPage((page ?? 1) - 1)}
              aria-label="Предыдущая страница"
              className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 tabular-nums text-gray-800">
              {page} / {pages}
            </span>
            <button
              type="button"
              disabled={!page || page >= pages}
              onClick={() => onPage((page ?? 1) + 1)}
              aria-label="Следующая страница"
              className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// DRF javobidan sahifalar sonini hisoblash (pages bo'lmasa count / page_size)
export const pageCount = (data: { count: number; pages?: number } | undefined, pageSize: number) =>
  data ? data.pages ?? Math.max(1, Math.ceil(data.count / pageSize)) : 0;
