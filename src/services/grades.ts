// src/services/grades.ts
import { api } from "./api";

export type Grade = {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
};

// CRUD
export async function getGrades() {
  const res = await api.get<Grade[]>("/grades");
  return res.data;
}

export async function createGrade(name: string) {
  const res = await api.post("/grades", { name });
  return res.data;
}

export async function updateGrade(id: number, name: string) {
  const res = await api.put(`/grades/${id}`, { name });
  return res.data;
}

export async function deleteGrade(id: number) {
  const res = await api.delete(`/grades/${id}`);
  return res.data;
}
