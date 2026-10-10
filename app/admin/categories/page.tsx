"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronRight, FolderPlus, GripVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  useAdminCreateMutation,
  useAdminDeleteMutation,
  useAdminList,
  useAdminUpdateMutation,
} from "@/lib/admin/adminApi";
import type { AdminCategory } from "@/lib/admin/types";
import { apiError } from "@/lib/admin/labels";
import { slugify } from "@/lib/admin/slugify";
import {
  Badge,
  Button,
  Card,
  Drawer,
  EmptyState,
  ErrorState,
  Field,
  PageHeader,
  Skeleton,
  Toggle,
  inputCls,
  useConfirm,
} from "@/components/admin/ui";

interface Node extends AdminCategory {
  children: Node[];
}

function buildTree(list: AdminCategory[]) {
  const map = new Map<number, Node>(list.map((c) => [c.id, { ...c, children: [] }]));
  const roots: Node[] = [];
  for (const node of map.values()) {
    const parent = node.parent ? map.get(node.parent) : undefined;
    (parent ? parent.children : roots).push(node);
  }
  const sortRec = (nodes: Node[]) => {
    nodes.sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "ru"));
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return { roots, map };
}

// Kategoriyani o'zining ichiga ko'chirib bo'lmaydi
function isDescendant(map: Map<number, Node>, ancestorId: number, id: number | null): boolean {
  let cur = id ? map.get(id) : undefined;
  while (cur) {
    if (cur.id === ancestorId) return true;
    cur = cur.parent ? map.get(cur.parent) : undefined;
  }
  return false;
}

interface FormState {
  name: string;
  slug: string;
  parent: string;
  sort: string;
  is_active: boolean;
}

export default function CategoriesPage() {
  const confirm = useConfirm();
  const list = useAdminList<AdminCategory>("categories", { page_size: 1000 });
  const [create, { isLoading: creating }] = useAdminCreateMutation();
  const [update, { isLoading: updating }] = useAdminUpdateMutation();
  const [remove] = useAdminDeleteMutation();

  const [collapsed, setCollapsed] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminCategory | "new" | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", slug: "", parent: "", sort: "0", is_active: true });
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragId, setDragId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | "root" | null>(null);

  const all = useMemo(() => list.data?.results ?? [], [list.data]);
  const { roots, map } = useMemo(() => buildTree(all), [all]);
  const q = search.trim().toLowerCase();

  // Qidiruvda mos keladigan kategoriyalar va ularning ota-onalari ko'rinadi
  const visibleIds = useMemo(() => {
    if (!q) return null;
    const ids = new Set<number>();
    for (const c of all)
      if (c.name.toLowerCase().includes(q) || c.slug.includes(q)) {
        let cur: AdminCategory | undefined = c;
        while (cur) {
          ids.add(cur.id);
          cur = cur.parent ? map.get(cur.parent) : undefined;
        }
      }
    return ids;
  }, [q, all, map]);

  const open = (row: AdminCategory | "new", parent?: number) => {
    setEditing(row);
    setErrors({});
    setSlugTouched(row !== "new");
    setForm(
      row === "new"
        ? { name: "", slug: "", parent: parent ? String(parent) : "", sort: "0", is_active: true }
        : { name: row.name, slug: row.slug, parent: row.parent ? String(row.parent) : "", sort: String(row.sort), is_active: row.is_active }
    );
  };

  const save = async () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Укажите название";
    if (!form.slug.trim()) e.slug = "Укажите slug";
    setErrors(e);
    if (Object.keys(e).length) return;
    const body = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      parent: form.parent ? Number(form.parent) : null,
      sort: Number(form.sort || 0),
      is_active: form.is_active,
    };
    try {
      if (editing === "new") await create({ resource: "categories", body }).unwrap();
      else if (editing) await update({ resource: "categories", id: editing.id, body }).unwrap();
      toast.success(editing === "new" ? "Категория создана" : "Сохранено");
      setEditing(null);
    } catch (err) {
      const data = (err as { data?: Record<string, unknown> }).data;
      if (data && typeof data === "object")
        setErrors(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(Array.isArray(v) ? v[0] : v)])));
      toast.error(apiError(err));
    }
  };

  const del = async (c: Node) => {
    const ok = await confirm({
      title: "Удалить категорию?",
      message: c.children.length
        ? `«${c.name}» содержит подкатегории (${c.children.length}). Сначала перенесите или удалите их.`
        : `«${c.name}» будет удалена. Товары этой категории останутся без категории или удаление будет отклонено сервером.`,
      confirmText: "Удалить",
      danger: true,
    });
    if (!ok) return;
    try {
      await remove({ resource: "categories", id: c.id }).unwrap();
      toast.success("Категория удалена");
    } catch (err) {
      toast.error(apiError(err, "Не удалось удалить категорию"));
    }
  };

  // Sudrab tashlash: boshqa kategoriya ustiga — ichiga, "korenga" — yuqori darajaga
  const move = async (id: number, parent: number | null) => {
    const c = map.get(id);
    if (!c || c.parent === parent) return;
    if (parent !== null && (parent === id || isDescendant(map, id, parent))) {
      toast.error("Нельзя переместить категорию внутрь самой себя");
      return;
    }
    try {
      await update({ resource: "categories", id, body: { parent } }).unwrap();
      toast.success(parent ? `«${c.name}» перемещена в «${map.get(parent)?.name}»` : `«${c.name}» перемещена на верхний уровень`);
    } catch (err) {
      toast.error(apiError(err, "Не удалось переместить"));
    }
  };

  const renderNode = (node: Node, depth: number): React.ReactNode => {
    if (visibleIds && !visibleIds.has(node.id)) return null;
    const isCollapsed = collapsed.includes(node.id) && !visibleIds;
    return (
      <li key={node.id}>
        <div
          draggable
          onDragStart={(e) => {
            setDragId(node.id);
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragEnd={() => {
            setDragId(null);
            setDropTarget(null);
          }}
          onDragOver={(e) => {
            if (dragId === null || dragId === node.id) return;
            e.preventDefault();
            setDropTarget(node.id);
          }}
          onDragLeave={() => setDropTarget((t) => (t === node.id ? null : t))}
          onDrop={(e) => {
            e.preventDefault();
            if (dragId !== null) move(dragId, node.id);
            setDropTarget(null);
          }}
          className={`group flex items-center gap-2 h-12 pr-3 border-b border-gray-100 transition-colors ${
            dropTarget === node.id ? "bg-blue-50 ring-2 ring-inset ring-[#012F91]" : "hover:bg-gray-50"
          } ${dragId === node.id ? "opacity-40" : ""}`}
          style={{ paddingLeft: 12 + depth * 24 }}
        >
          <GripVertical size={15} className="text-gray-300 cursor-grab shrink-0" aria-hidden />
          {node.children.length ? (
            <button
              type="button"
              onClick={() =>
                setCollapsed((c) => (c.includes(node.id) ? c.filter((x) => x !== node.id) : [...c, node.id]))
              }
              aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
              className="w-6 h-6 inline-flex items-center justify-center rounded text-gray-500 hover:bg-gray-200"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
          ) : (
            <span className="w-6" />
          )}
          <button type="button" onClick={() => open(node)} className="flex-1 min-w-0 text-left">
            <span className="text-sm font-medium text-gray-900">{node.name}</span>
            <span className="ml-2 text-xs font-mono text-gray-400">/{node.slug}</span>
          </button>
          {node.children.length > 0 && <span className="text-xs text-gray-400 tabular-nums">{node.children.length} подкат.</span>}
          {!node.is_active && <Badge tone="grey">Скрыта</Badge>}
          <span className="flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => open("new", node.id)}
              aria-label={`Добавить подкатегорию в «${node.name}»`}
              title="Добавить подкатегорию"
              className="w-8 h-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-[#012F91]"
            >
              <FolderPlus size={15} />
            </button>
            <button
              type="button"
              onClick={() => open(node)}
              aria-label={`Редактировать «${node.name}»`}
              className="w-8 h-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-[#012F91]"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => del(node)}
              aria-label={`Удалить «${node.name}»`}
              className="w-8 h-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-[#EE0906]"
            >
              <Trash2 size={15} />
            </button>
          </span>
        </div>
        {!isCollapsed && node.children.length > 0 && <ul>{node.children.map((c) => renderNode(c, depth + 1))}</ul>}
      </li>
    );
  };

  // Ota kategoriya tanlovi: o'zi va ichki kategoriyalari chiqmaydi
  const parentOptions = useMemo(() => {
    const out: { id: number; label: string }[] = [];
    const walk = (nodes: Node[], depth: number) =>
      nodes.forEach((n) => {
        if (editing && editing !== "new" && (n.id === editing.id || isDescendant(map, editing.id, n.id))) return;
        out.push({ id: n.id, label: `${"— ".repeat(depth)}${n.name}` });
        walk(n.children, depth + 1);
      });
    walk(roots, 0);
    return out;
  }, [roots, map, editing]);

  return (
    <>
      <PageHeader
        title="Категории"
        description="Структура каталога. Перетащите категорию на другую, чтобы сделать её подкатегорией."
        actions={
          <Button icon={<Plus size={16} />} onClick={() => open("new")}>
            Добавить категорию
          </Button>
        }
      />

      <Card bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск категории"
              aria-label="Поиск категории"
              className={`${inputCls} h-9 pl-9`}
            />
          </div>
          <span className="text-sm text-gray-500 tabular-nums">Всего: {all.length}</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setCollapsed([])}>
              Развернуть все
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCollapsed(all.filter((c) => all.some((x) => x.parent === c.id)).map((c) => c.id))}>
              Свернуть все
            </Button>
          </div>
        </div>

        {dragId !== null && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDropTarget("root");
            }}
            onDragLeave={() => setDropTarget(null)}
            onDrop={(e) => {
              e.preventDefault();
              move(dragId, null);
              setDropTarget(null);
            }}
            className={`mx-4 my-3 rounded-lg border-2 border-dashed py-3 text-center text-sm ${
              dropTarget === "root" ? "border-[#012F91] bg-blue-50 text-[#012F91]" : "border-gray-200 text-gray-500"
            }`}
          >
            Перетащите сюда, чтобы сделать категорией верхнего уровня
          </div>
        )}

        {list.isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>
        ) : list.error ? (
          <ErrorState message={apiError(list.error, "Ошибка загрузки")} onRetry={list.refetch} />
        ) : roots.length === 0 ? (
          <EmptyState
            title="Категорий пока нет"
            action={
              <Button icon={<Plus size={16} />} onClick={() => open("new")}>
                Добавить категорию
              </Button>
            }
          />
        ) : visibleIds && visibleIds.size === 0 ? (
          <EmptyState title="Ничего не найдено" />
        ) : (
          <ul>{roots.map((n) => renderNode(n, 0))}</ul>
        )}
      </Card>

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Новая категория" : editing ? editing.name : ""}
        width="max-w-md"
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
          className="space-y-5"
        >
          <Field label="Название" required error={errors.name}>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) }))
              }
              placeholder="Лакокрасочные материалы"
              className={inputCls}
            />
          </Field>
          <Field label="Slug" required error={errors.slug} hint="Используется в адресе: /catalog/slug">
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugify(e.target.value) || e.target.value.toLowerCase() }));
              }}
              className={`${inputCls} font-mono`}
            />
          </Field>
          <Field label="Родительская категория" error={errors.parent}>
            <select value={form.parent} onChange={(e) => setForm((f) => ({ ...f, parent: e.target.value }))} className={inputCls}>
              <option value="">— Верхний уровень —</option>
              {parentOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Сортировка" error={errors.sort} hint="Меньше — выше в списке">
            <input
              type="number"
              value={form.sort}
              onChange={(e) => setForm((f) => ({ ...f, sort: e.target.value }))}
              className={`${inputCls} tabular-nums`}
            />
          </Field>
          <Toggle checked={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} label="Показывать на сайте" />
          <button type="submit" hidden />
        </form>
      </Drawer>
    </>
  );
}
