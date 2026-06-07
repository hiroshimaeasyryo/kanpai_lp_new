/** content オブジェクトから dot/bracket パスで値を取得・更新 */

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

export function getFieldPath(content: unknown, path: string): string {
  const parts = parsePath(path);
  let cur: unknown = content;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return "";
    cur = (cur as Record<string | number, unknown>)[p];
  }
  return typeof cur === "string" ? cur : cur == null ? "" : String(cur);
}

export function setFieldPath<T extends object>(content: T, path: string, value: string): T {
  const parts = parsePath(path);
  if (parts.length === 0) return content;

  const clone = structuredClone(content);
  let cur: Record<string | number, unknown> = clone as Record<string | number, unknown>;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    if (next == null || typeof next !== "object") {
      cur[key] = typeof parts[i + 1] === "number" ? [] : {};
    }
    cur = cur[key] as Record<string | number, unknown>;
  }

  const last = parts[parts.length - 1];
  cur[last] = value;
  return clone;
}
