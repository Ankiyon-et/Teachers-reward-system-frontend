// src/utils/files.ts
export function resolveStorageUrl(path?: string | null) {
  if (!path) return undefined;

  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage")) return path;

  return `/storage/${path}`;
}
