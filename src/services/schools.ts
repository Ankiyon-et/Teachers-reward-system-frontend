// src/services/schools.ts
import { api } from "./api";

export type School = {
  id?: number;
  name?: string;
  logo?: string | null;
  description?: string | null;
  address?: string | null;
  contact_email?: string | null;
  created_at?: string;
  updated_at?: string;
  admins?: any[]; // keep loose shape for now
};

export type CreateSchoolPayload = {
  school_name: string;
  logo?: string | null; // data:image/... base64
  description?: string;
  address?: string;
  contact_email?: string;
  admin_name: string;
  admin_email: string;
  admin_password: string;
  admin_title?: string;
};

export type UpdateSchoolPayload = {
  school_name?: string;
  address?: string;
  description?: string;
  contact_email?: string;
  logo?: string | null;
};

export async function getSchools() {
  const res = await api.get<School[]>("/schools");
  return res.data;
}

export async function getSchool(id: number | string) {
  const res = await api.get<School>(`/schools/${id}`);
  return res.data;
}

export async function createSchool(payload: CreateSchoolPayload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const res = await api.post("/schools", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}


export async function updateSchool(id: number | string, payload: UpdateSchoolPayload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const res = await api.post(`/schools/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}


export async function deleteSchool(id: number | string) {
  const res = await api.delete(`/schools/${id}`);
  return res.data;
}
