"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import {
  useAdminCreateMutation,
  useAdminDeleteMutation,
  useAdminList,
  useAdminUpdateMutation,
} from "@/lib/admin/adminApi";
import { apiError, mediaUrl } from "@/lib/admin/labels";
import { slugify } from "@/lib/admin/slugify";
import DataTable, { pageCount, toOrdering, type Column, type Sort } from "./DataTable";
import { Button, Drawer, EmptyState, Field, PageHeader, Toggle, inputCls, useConfirm } from "./ui";

// Oddiy bo'limlar (brendlar, aksiyalar, FAQ ...) uchun konfiguratsiyali CRUD sahifa

export type FieldType = "text" | "textarea" | "number" | "select" | "toggle" | "date" | "datetime" | "image" | "slug";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  // slug qaysi maydondan avtomatik yasaladi
  from?: string;
  // forma ichida ikki ustunli joylashuv uchun
  half?: boolean;
}

export interface FilterConfig {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

type Row = { id: number } & Record<string, unknown>;

// Backend qiymatini forma qiymatiga
function toFormValue(field: FieldConfig, value: unknown): unknown {
  if (field.type === "toggle") return !!value;
  if (value === null || value === undefined) return "";
  if (field.type === "datetime" && typeof value === "string") return value.slice(0, 16);
  if (field.type === "date" && typeof value === "string") return value.slice(0, 10);
  return value;
}

export default function ResourcePage<T extends Row>({
  title,
  description,
  resource,
  columns,
  fields,
  defaults,
  filters = [],
  searchPlaceholder = "Поиск",
  defaultSort = { key: "id", dir: "desc" },
  itemName,
  noun = "запись",
  canCreate = true,
  pageSize = 20,
}: {
  title: string;
  description?: string;
  resource: string;
  columns: Column<T>[];
  fields: FieldConfig[];
  defaults: Record<string, unknown>;
  filters?: FilterConfig[];
  searchPlaceholder?: string;
  defaultSort?: Sort | null;
  itemName: (row: T) => string;
  noun?: string;
  canCreate?: boolean;
  pageSize?: number;
}) {
  const confirm = useConfirm();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<Sort | null>(defaultSort);
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(false);

  const list = useAdminList<T>(resource, {
    page,
    page_size: pageSize,
    search: search.trim(),
    ordering: toOrdering(sort),
    ...filterValues,
  });
  const [create, { isLoading: creating }] = useAdminCreateMutation();
  const [update, { isLoading: updating }] = useAdminUpdateMutation();
  const [remove] = useAdminDeleteMutation();

  const openEditor = (row: T | "new") => {
    setEditing(row);
    setErrors({});
    setFiles({});
    setSlugTouched(row !== "new");
    setForm(
      row === "new"
        ? { ...defaults }
        : Object.fromEntries(fields.map((f) => [f.name, toFormValue(f, row[f.name])]))
    );
  };

  const setValue = (name: string, value: unknown) =>
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Nom o'zgarsa slug ham avtomatik yangilanadi (qo'lda tahrirlanmagan bo'lsa)
      for (const sf of fields.filter((x) => x.type === "slug" && x.from === name))
        if (!slugTouched) next[sf.name] = slugify(String(value ?? ""));
      return next;
    });

  const save = async () => {
    const missing = Object.fromEntries(
      fields
        .filter((f) => f.required && f.type !== "toggle")
        .filter((f) =>
          f.type === "image" ? editing === "new" && !files[f.name] : String(form[f.name] ?? "").trim() === ""
        )
        .map((f) => [f.name, "Обязательное поле"])
    );
    setErrors(missing);
    if (Object.keys(missing).length) return;

    // Bo'sh qiymatlar: ixtiyoriy sana/raqam/select -> null
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type === "image") continue;
      let v = form[f.name];
      if (f.type === "datetime" && v) v = new Date(String(v)).toISOString();
      if (v === "" && !f.required && f.type !== "text" && f.type !== "textarea") v = null;
      payload[f.name] = v;
    }

    const hasFiles = Object.values(files).some(Boolean);
    let body: Record<string, unknown> | FormData = payload;
    if (hasFiles) {
      const fd = new FormData();
      for (const [k, v] of Object.entries(payload)) if (v !== null && v !== undefined) fd.append(k, String(v));
      for (const [k, file] of Object.entries(files)) if (file) fd.append(k, file);
      body = fd;
    }

    try {
      if (editing === "new") await create({ resource, body }).unwrap();
      else if (editing) await update({ resource, id: editing.id, body }).unwrap();
      toast.success(editing === "new" ? "Создано" : "Сохранено");
      setEditing(null);
    } catch (e) {
      const data = (e as { data?: Record<string, unknown> }).data;
      if (data && typeof data === "object")
        setErrors(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(Array.isArray(v) ? v[0] : v)])));
      toast.error(apiError(e));
    }
  };

  const del = async (row: T) => {
    const ok = await confirm({
      title: `Удалить ${noun}?`,
      message: `«${itemName(row)}» будет удалено без возможности восстановления.`,
      confirmText: "Удалить",
      danger: true,
    });
    if (!ok) return;
    try {
      await remove({ resource, id: row.id }).unwrap();
      toast.success("Удалено");
    } catch (e) {
      toast.error(apiError(e, "Не удалось удалить"));
    }
  };

  const allColumns: Column<T>[] = [
    ...columns,
    {
      key: "_actions",
      header: "",
      hideable: false,
      align: "right",
      render: (row) => (
        <span className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => openEditor(row)}
            aria-label={`Редактировать «${itemName(row)}»`}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-[#012F91]"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => del(row)}
            aria-label={`Удалить «${itemName(row)}»`}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-[#EE0906]"
          >
            <Trash2 size={15} />
          </button>
        </span>
      ),
    },
  ];

  const filtered = !!search || Object.values(filterValues).some(Boolean);

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          canCreate && (
            <Button icon={<Plus size={16} />} onClick={() => openEditor("new")}>
              Добавить
            </Button>
          )
        }
      />

      <DataTable
        columns={allColumns}
        rows={list.data?.results ?? []}
        rowKey={(r) => r.id}
        loading={list.isLoading}
        error={list.error ? apiError(list.error, "Ошибка загрузки") : undefined}
        onRetry={list.refetch}
        sort={sort}
        onSort={(s) => {
          setSort(s);
          setPage(1);
        }}
        onRowClick={(row) => openEditor(row)}
        page={page}
        pages={pageCount(list.data, pageSize)}
        count={list.data?.count}
        onPage={setPage}
        empty={
          <EmptyState
            title={filtered ? "Ничего не найдено" : "Пока пусто"}
            text={filtered ? "Измените условия поиска." : undefined}
            action={
              !filtered && canCreate ? (
                <Button icon={<Plus size={16} />} onClick={() => openEditor("new")}>
                  Добавить
                </Button>
              ) : undefined
            }
          />
        }
        toolbar={
          <>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                aria-label="Поиск"
                className={`${inputCls} h-9 pl-9`}
              />
            </div>
            {filters.map((f) => (
              <select
                key={f.name}
                value={filterValues[f.name] ?? ""}
                onChange={(e) => {
                  setFilterValues((v) => ({ ...v, [f.name]: e.target.value }));
                  setPage(1);
                }}
                aria-label={f.label}
                className={`${inputCls} h-9 w-auto!`}
              >
                <option value="">{f.label}</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ))}
          </>
        }
      />

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Новая запись" : editing ? itemName(editing) : ""}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Отмена
            </Button>
            <Button loading={creating || updating} onClick={save}>
              {editing === "new" ? "Создать" : "Сохранить"}
            </Button>
          </>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="grid grid-cols-2 gap-5"
        >
          {fields.map((f) => {
            const value = form[f.name];
            const common = { id: `f-${f.name}`, placeholder: f.placeholder };
            let control: React.ReactNode;
            switch (f.type) {
              case "textarea":
                control = (
                  <textarea
                    {...common}
                    rows={8}
                    value={String(value ?? "")}
                    onChange={(e) => setValue(f.name, e.target.value)}
                    className={`${inputCls} h-auto py-2.5 leading-relaxed`}
                  />
                );
                break;
              case "select":
                control = (
                  <select value={String(value ?? "")} onChange={(e) => setValue(f.name, e.target.value)} className={inputCls}>
                    {!f.required && <option value="">—</option>}
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                );
                break;
              case "toggle":
                control = <Toggle checked={!!value} onChange={(v) => setValue(f.name, v)} label={f.hint ?? "Включено"} />;
                break;
              case "image": {
                const file = files[f.name];
                const current = editing && editing !== "new" ? (editing[f.name] as string | null) : null;
                const preview = file ? URL.createObjectURL(file) : current ? mediaUrl(current) : null;
                control = (
                  <div className="flex items-center gap-4">
                    <span className="relative w-24 h-24 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                      {preview && <Image src={preview} alt="" fill sizes="96px" className="object-contain p-1" unoptimized={!!file} />}
                    </span>
                    <label className="inline-flex items-center gap-2 h-9 px-3 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload size={15} />
                      {preview ? "Заменить" : "Загрузить"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setFiles((x) => ({ ...x, [f.name]: e.target.files?.[0] ?? null }))}
                      />
                    </label>
                  </div>
                );
                break;
              }
              default:
                control = (
                  <input
                    {...common}
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "datetime" ? "datetime-local" : "text"}
                    step={f.type === "number" ? "any" : undefined}
                    value={String(value ?? "")}
                    onChange={(e) => {
                      if (f.type === "slug") setSlugTouched(true);
                      setValue(f.name, f.type === "slug" ? slugify(e.target.value) || e.target.value.toLowerCase() : e.target.value);
                    }}
                    className={`${inputCls} ${f.type === "slug" ? "font-mono" : ""} ${f.type === "number" ? "tabular-nums" : ""}`}
                  />
                );
            }
            return (
              <Field
                key={f.name}
                label={f.label}
                required={f.required}
                hint={f.type === "toggle" ? undefined : f.hint}
                error={errors[f.name]}
                className={f.half ? "col-span-2 sm:col-span-1" : "col-span-2"}
              >
                {control}
              </Field>
            );
          })}
          <button type="submit" hidden />
        </form>
      </Drawer>
    </>
  );
}
