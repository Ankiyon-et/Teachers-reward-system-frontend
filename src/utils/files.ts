export function resolveStorageUrl(path?: string | null) {
  if (!path) return null;
  return `${import.meta.env.VITE_API_BASE_URL}/storage/${path}`;
}
