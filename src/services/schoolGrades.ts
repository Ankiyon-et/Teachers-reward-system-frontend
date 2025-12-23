// src/services/schoolGrades.ts
import { api } from "./api";

export type Grade = {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
};

export async function getAllGrades() {
  const res = await api.get<Grade[]>("/allgrades");
  return res.data;
}

export async function getSchoolGrades() {
  const res = await api.get<Grade[]>("/school/grades");
  return res.data;
}

export async function assignGrades(grade_ids: number[]) {
  const res = await api.post("/grades/assign", { grade_ids });
  return res.data;
}

export async function removeSchoolGrade(id: number) {
  const res = await api.delete(`/delete/grades/${id}`);
  return res.data;
}
