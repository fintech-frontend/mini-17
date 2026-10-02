import type { ApiCategoryTree } from "@/types/api";

// Daraxtdan slug bo'yicha kategoriyani va unga olib boruvchi yo'lni (breadcrumb) topish
export function findCategoryPath(
  tree: ApiCategoryTree[],
  slug: string,
  path: ApiCategoryTree[] = []
): ApiCategoryTree[] | null {
  for (const node of tree) {
    const current = [...path, node];
    if (node.slug === slug) return current;
    const found = findCategoryPath(node.children ?? [], slug, current);
    if (found) return found;
  }
  return null;
}

export const sortCategories = (list: ApiCategoryTree[]) =>
  [...list].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "ru"));

export const categoryHref = (slug: string) => `/catalog/${slug}`;
