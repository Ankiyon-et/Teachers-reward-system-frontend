// src/services/teacherRatings.ts
import { api } from "./api";

export type TeacherRating = {
  id: number;
  parent_name: string | null;
  teacher_id: number;
  value: number; // 1–5
  comment: string | null;
  created_at: string;
  updated_at: string;
};

export async function getTeacherRatings() {
  const res = await api.get<TeacherRating[]>("/teacher/ratings");
  return res.data;
}
