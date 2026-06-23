import type { ParsedArrayItem } from "@/lib/content-manager/array-item-registry";

function parsePath(path: string): (string | number)[] {
  const parts: (string | number)[] = [];
  const re = /([^[\].]+)|\[(\d+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) {
    if (m[1] != null) parts.push(m[1]);
    else if (m[2] != null) parts.push(Number(m[2]));
  }
  return parts;
}

function getArrayAtPath(root: unknown, path: string): unknown[] {
  const parts = parsePath(path);
  let cur: unknown = root;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return [];
    cur = (cur as Record<string | number, unknown>)[p];
  }
  return Array.isArray(cur) ? cur : [];
}

function setArrayAtPath<T extends object>(root: T, path: string, arr: unknown[]): T {
  const parts = parsePath(path);
  if (parts.length === 0) return root;
  const clone = structuredClone(root) as Record<string | number, unknown>;
  let cur: Record<string | number, unknown> = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    if (next == null || typeof next !== "object") {
      cur[key] = typeof parts[i + 1] === "number" ? [] : {};
    }
    cur = cur[key] as Record<string | number, unknown>;
  }
  cur[parts[parts.length - 1]] = arr;
  return clone as T;
}

export type ArrayMutationOp = "insertBefore" | "insertAfter" | "remove";

export function mutateArrayItem<T extends object>(
  root: T,
  storagePath: string,
  index: number,
  op: ArrayMutationOp,
  defaultItem: unknown,
  minItems = 1,
): T {
  const arr = [...getArrayAtPath(root, storagePath)];
  if (op === "remove") {
    if (arr.length <= minItems) return root;
    arr.splice(index, 1);
    return setArrayAtPath(root, storagePath, arr);
  }
  const insertAt = op === "insertBefore" ? index : index + 1;
  const source = arr[index];
  const item =
    source !== undefined
      ? structuredClone(source)
      : typeof defaultItem === "function"
        ? (defaultItem as () => unknown)()
        : structuredClone(defaultItem);
  arr.splice(insertAt, 0, item);
  return setArrayAtPath(root, storagePath, arr);
}

export function getStoragePath(parsed: ParsedArrayItem): string {
  return parsed.def.storage.path;
}

export function readArrayAtPath(root: unknown, path: string): unknown[] {
  return getArrayAtPath(root, path);
}
