const API_BASE = "https://sms.henokfikadu.com";

export function storageUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  return `${API_BASE}/storage/${path}`;
}
