// src/services/teachers.ts
import { api } from "./api";

export type Teacher = {
  id?: number;
  name?: string;
  email?: string;
  subject?: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateTeacherPayload = {
  name: string;
  email: string;
  password: string;
  subject?: string;
};

export type UpdateTeacherPayload = {
  name?: string;
  email?: string;
  subject?: string;
};

// GET /list/teachers
export async function getTeachers() {
  const res = await api.get<Teacher[]>("/list/teachers");
  return res.data;
}

// POST /create/teachers
export async function createTeacher(payload: CreateTeacherPayload) {
  const res = await api.post("/create/teachers", payload);
  return res.data;
}

// PUT /teachers/{id}  (adjust if your backend uses POST)
export async function updateTeacher(id: number, payload: UpdateTeacherPayload) {
  const res = await api.put(`/teachers/${id}`, payload);
  return res.data;
}

// DELETE /delete/teachers/{id}
export async function deleteTeacher(id: number) {
  const res = await api.delete(`/delete/teachers/${id}`);
  return res.data;
}
