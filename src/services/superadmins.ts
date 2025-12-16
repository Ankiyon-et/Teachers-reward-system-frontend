import { api } from "./api";

export type SuperAdmin = {
  id?: number;
  name?: string;
  email?: string;
  role_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type CreateSuperAdminPayload = {
  name: string;
  email: string;
  password: string;
};

export type UpdateSuperAdminPayload = {
  name: string;
  email: string;
};

// API calls
export async function getSuperAdmins() {
  const res = await api.get<SuperAdmin[]>("/super-admins");
  return res.data;
}

export async function createSuperAdmin(payload: CreateSuperAdminPayload) {
  const res = await api.post("/users/superadmin", payload);
  return res.data;
}

export async function updateSuperAdmin(id: number | string, payload: UpdateSuperAdminPayload) {
  const res = await api.put(`/super-admins/${id}`, payload);
  return res.data;
}

export async function deleteSuperAdmin(id: number | string) {
  const res = await api.delete(`/super-admins/${id}`);
  return res.data;
}
