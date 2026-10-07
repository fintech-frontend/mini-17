"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowDown, ArrowUp, Columns3, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  apiErrorText,
  listMeta,
  listRows,
  useAdminCreateMutation,
  useAdminDeleteMutation,
  useAdminListQuery,
  useAdminUpdateMutation,
} from "@/lib/admin/adminApi";
import type { AdminResource } from "@/lib/admin/types";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Field,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Select,
  Skeleton,
  Textarea,
  Toggle,
} from "./ui";

export type Row = { id: number | string } & Record<string, unknown>;

export interface Column<T extends Row = Row> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean; // server tomonida ?ordering=key
  align?: "left" | "right" | "center";
  hiddenByDefault?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "toggle" | "date" | "datetime" | "image";
  options?: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
  wide?: boolean; // ikki ustunni egallaydi
  placeholder?: string;
}

export interface Filter {
  param: string;
  label: string;
  options: { value: string; label: string }[];
}

interface ResourcePageProps<T extends Row> {
  resource: AdminResource;
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  fields?: FormField[];
  filters?: Filter[];
  searchPlaceholder?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  createLabel?: string;
  defaultOrdering?: string;
  // Tahrirlash alohida sahifada bo'lsa (masalan, mahsulotlar)
  editHref?: (row: T) => string;
  createHref?: string;
  initialParams?: Record<string, string>;
  emptyText?: string;
  // Sarlavhadan keyin, jadvaldan oldin ko'rsatiladigan blok (masalan, status tablari)
  headerExtra?: React.ReactNode;
}

const PAGE_SIZE = 20;

// Forma qiymatlarini API ga mos ko'rinishga keltirish
function toPayload(fields: FormField[], values: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  fields.forEach((f) => {
    const v = values[f.name];
    if (f.type === "image") {
      if (v instanceof File) out[f.name] = v; // yangi fayl tanlangan bo'lsa yuboriladi
      return;
    }
    if (f.type === "number") out[f.name] = v === "" || v === undefined ? null : Number(v);
    else if (f.type === "datetime" || f.type === "date")
      out[f.name] = v ? new Date(String(v)).toISOString() : null;
    else if (f.type === "select") out[f.name] = v === "" ? null : v;
    else out[f.name] = v;
  });
  return out;
}

// API qiymatini forma maydoniga
function toFormValue(field: FormField, value: unknown) {
  if (value === null || value === undefined) return field.type === "toggle" ? false : "";
  if (field.type === "datetime") return String(value).slice(0, 16);
  if (field.type === "date") return String(value).slice(0, 10);
  if (field.type === "select" || field.type === "number") return String(value);
  return value;
}

export default function ResourcePage<T extends Row>({
  resource,
  title,
  subtitle,
  columns,
  fields = [],
  filters = [],
  searchPlaceholder = "Поиск…",
  canCreate = true,
  canEdit = true,
  canDelete = true,
  createLabel = "Добавить",
  defaultOrdering,
  editHref,
  createHref,
  initialParams = {},
  emptyText,
  headerExtra,
}: ResourcePageProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(initialParams.search ?? "");
  const [debounced, setDebounced] = useState(search);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(initialParams).filter(([k]) => k !== "search")),
  );
  const [ordering, setOrdering] = useState(defaultOrdering);
  const [selected, setSelected] = useState<Set<T["id"]>>(new Set());
  const [hidden, setHidden] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.hiddenByDefault).map((c) => c.key)),
  );
  const [columnsOpen, setColumnsOpen] = useState(false);

  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [deleting, setDeleting] = useState<T[] | null>(null);

  // Qidiruvni 350ms kechiktirib yuboramiz
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isFetching, error, refetch } = useAdminListQuery({
    resource,
    params: { page, page_size: PAGE_SIZE, search: debounced, ordering, ...filterValues },
  });
  const rows = listRows<T>(data);
  const { count, pages } = listMeta(data);

  const [create, { isLoading: creating }] = useAdminCreateMutation();
  const [update, { isLoading: updating }] = useAdminUpdateMutation();
  const [remove, { isLoading: removing }] = useAdminDeleteMutation();

  const visibleColumns = useMemo(() => columns.filter((c) => !hidden.has(c.key)), [columns, hidden]);
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const showActions = canEdit || canDelete;

  const openForm = (row: T | "new") => {
    const init: Record<string, unknown> = {};
    fields.forEach((f) => {
      init[f.name] = row === "new" ? (f.type === "toggle" ? true : "") : toFormValue(f, row[f.name]);
    });
    setValues(init);
    setEditing(row);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = toPayload(fields, values);
    try {
      if (editing === "new") {
        await create({ resource, data: payload }).unwrap();
        toast.success("Запись создана");
      } else if (editing) {
        await update({ resource, id: editing.id, data: payload }).unwrap();
        toast.success("Изменения сохранены");
      }
      setEditing(null);
    } catch (err) {
      toast.error(apiErrorText(err));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const results = await Promise.allSettled(
      deleting.map((r) => remove({ resource, id: r.id }).unwrap()),
    );
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed) toast.error(`Не удалось удалить: ${failed}`);
    else toast.success(deleting.length > 1 ? `Удалено: ${deleting.length}` : "Запись удалена");
    setSelected(new Set());
    setDeleting(null);
  };

  const toggleSort = (key: string) => {
    setOrdering((o) => (o === key ? `-${key}` : o === `-${key}` ? undefined : key));
    setPage(1);
  };

  const createButton =
    canCreate &&
    (createHref ? (
      <Link
        href={createHref}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#012F91] px-4 text-sm font-medium text-white hover:bg-[#00257a]"
      >
        <Plus className="h-4 w-4" />
        {createLabel}
      </Link>
    ) : fields.length ? (
      <Button icon={<Plus className="h-4 w-4" />} onClick={() => openForm("new")}>
        {createLabel}
      </Button>
    ) : null);

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} actions={createButton} />
      {headerExtra}

      <Card padded={false}>
        {/* Asboblar paneli: qidiruv, filtrlar, ustunlar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-3">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
              aria-label="Поиск"
            />
          </div>
          {filters.map((f) => (
            <Select
              key={f.param}
              aria-label={f.label}
              value={filterValues[f.param] ?? ""}
              onChange={(e) => {
                setFilterValues((v) => ({ ...v, [f.param]: e.target.value }));
                setPage(1);
              }}
              className="w-auto"
            >
              <option value="">{f.label}: все</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {selected.size > 0 && canDelete && (
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={() => setDeleting(rows.filter((r) => selected.has(r.id)))}
              >
                Удалить ({selected.size})
              </Button>
            )}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                icon={<Columns3 className="h-3.5 w-3.5" />}
                onClick={() => setColumnsOpen((v) => !v)}
                aria-expanded={columnsOpen}
              >
                Колонки
              </Button>
              {columnsOpen && (
                <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg bg-white p-2 shadow-lg ring-1 ring-gray-200">
                  {columns.map((c) => (
                    <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={!hidden.has(c.key)}
                        onChange={() =>
                          setHidden((h) => {
                            const n = new Set(h);
                            if (n.has(c.key)) n.delete(c.key);
                            else n.add(c.key);
                            return n;
                          })
                        }
                        className="accent-[#012F91]"
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Jadval */}
        {error && !isLoading ? (
          <ErrorState text={apiErrorText(error)} onRetry={refetch} />
        ) : (
          <div className={`max-h-[calc(100vh-280px)] overflow-auto ${isFetching && !isLoading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[720px] text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  {canDelete && (
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label="Выбрать все"
                        checked={allSelected}
                        onChange={() =>
                          setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))
                        }
                        className="accent-[#012F91]"
                      />
                    </th>
                  )}
                  {visibleColumns.map((c) => {
                    const dir = ordering === c.key ? "asc" : ordering === `-${c.key}` ? "desc" : null;
                    return (
                      <th
                        key={c.key}
                        className={`whitespace-nowrap px-4 py-3 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}
                        aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : undefined}
                      >
                        {c.sortable ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(c.key)}
                            className="inline-flex items-center gap-1 uppercase hover:text-gray-900"
                          >
                            {c.label}
                            {dir === "asc" && <ArrowUp className="h-3 w-3" />}
                            {dir === "desc" && <ArrowDown className="h-3 w-3" />}
                          </button>
                        ) : (
                          c.label
                        )}
                      </th>
                    );
                  })}
                  {showActions && <th className="w-24 px-4 py-3 text-right">Действия</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {canDelete && <td className="px-4 py-3.5" />}
                      {visibleColumns.map((c) => (
                        <td key={c.key} className="px-4 py-3.5">
                          <Skeleton className="h-4 w-full max-w-[160px]" />
                        </td>
                      ))}
                      {showActions && <td />}
                    </tr>
                  ))}

                {!isLoading &&
                  rows.map((row) => (
                    <tr key={String(row.id)} className={`hover:bg-gray-50/80 ${selected.has(row.id) ? "bg-blue-50/50" : ""}`}>
                      {canDelete && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            aria-label="Выбрать строку"
                            checked={selected.has(row.id)}
                            onChange={() =>
                              setSelected((s) => {
                                const n = new Set(s);
                                if (n.has(row.id)) n.delete(row.id);
                                else n.add(row.id);
                                return n;
                              })
                            }
                            className="accent-[#012F91]"
                          />
                        </td>
                      )}
                      {visibleColumns.map((c) => (
                        <td
                          key={c.key}
                          className={`px-4 py-3 text-gray-700 ${c.align === "right" ? "text-right tabular-nums" : c.align === "center" ? "text-center" : ""}`}
                        >
                          {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                        </td>
                      ))}
                      {showActions && (
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            {canEdit &&
                              (editHref ? (
                                <Link
                                  href={editHref(row)}
                                  aria-label="Редактировать"
                                  className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#012F91]"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              ) : (
                                fields.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => openForm(row)}
                                    aria-label="Редактировать"
                                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#012F91]"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                )
                              ))}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => setDeleting([row])}
                                aria-label="Удалить"
                                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-[#EE0906]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>

            {!isLoading && rows.length === 0 && (
              <EmptyState
                title={debounced || Object.values(filterValues).some(Boolean) ? "Ничего не найдено" : "Пока пусто"}
                text={
                  debounced || Object.values(filterValues).some(Boolean)
                    ? "Попробуйте изменить поиск или фильтры."
                    : emptyText
                }
              />
            )}
          </div>
        )}

        {!isLoading && !error && <Pagination page={page} pages={pages} count={count} onChange={setPage} />}
      </Card>

      {/* Yaratish / tahrirlash formasi */}
      <Modal
        open={editing !== null}
        title={editing === "new" ? createLabel : "Редактирование"}
        onClose={() => setEditing(null)}
        width="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Отмена
            </Button>
            <Button type="submit" form="resource-form" loading={creating || updating}>
              Сохранить
            </Button>
          </>
        }
      >
        <form id="resource-form" onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <FormControl
              key={f.name}
              field={f}
              value={values[f.name]}
              onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
              current={editing && editing !== "new" ? editing[f.name] : undefined}
            />
          ))}
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title={deleting && deleting.length > 1 ? `Удалить ${deleting.length} записей?` : "Удалить запись?"}
        text="Это действие нельзя отменить."
        loading={removing}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

export function FormControl({
  field: f,
  value,
  onChange,
  current,
}: {
  field: FormField;
  value: unknown;
  onChange: (v: unknown) => void;
  current?: unknown;
}) {
  const span = f.wide || f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : "";

  if (f.type === "toggle") {
    return (
      <div className={`flex items-end pb-2 ${span}`}>
        <Toggle checked={Boolean(value)} onChange={onChange} label={f.label} />
      </div>
    );
  }

  return (
    <Field label={f.label} required={f.required} hint={f.hint} className={span}>
      {f.type === "textarea" ? (
        <Textarea
          rows={5}
          required={f.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={f.placeholder}
        />
      ) : f.type === "select" ? (
        <Select required={f.required} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {!f.required && <option value="">—</option>}
          {f.required && value === "" && <option value="">Выберите…</option>}
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ) : f.type === "image" ? (
        <div className="flex items-center gap-3">
          {typeof current === "string" && current && !(value instanceof File) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt="" className="h-14 w-20 rounded-md object-cover ring-1 ring-gray-200" />
          )}
          <input
            type="file"
            accept="image/*"
            required={f.required && !current}
            onChange={(e) => onChange(e.target.files?.[0] ?? "")}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
          />
        </div>
      ) : (
        <Input
          type={f.type === "datetime" ? "datetime-local" : f.type}
          step={f.type === "number" ? "any" : undefined}
          required={f.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={f.placeholder}
        />
      )}
    </Field>
  );
}
